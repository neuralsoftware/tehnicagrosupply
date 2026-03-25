import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import {
    getProducts,
    getCategories,
    saveBrochure,
    deleteBrochure,
    getBrochures,
    Brochure,
    DynamicProduct,
    Category,
    ProductBrochureProfile,
    getBrochureProfilesMap,
    mergeProductForPdf,
    normalizeLegacyProductSlug,
} from '@/lib/products-store';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, DocumentProps, Image, Font } from '@react-pdf/renderer';
import { FUNDING_PROGRAMS } from '@/data/funding-programs';
import { CATEGORIES as CATEGORY_LABELS } from '@/data/products';
import {
    PDF_COMPANY,
    PDF_DOCUMENTATION_NOTE,
    PDF_BRAND_CARDS,
} from '@/data/pdf-materiale-copy';
import React from 'react';

// Roboto din public/fonts — fișiere locale (nu CDN), ca PDF-ul să nu depindă de rețea la fonturi pe Vercel
const fontsDir = path.join(process.cwd(), 'public', 'fonts');
Font.register({
  family: 'Roboto',
  fonts: [
    { src: path.join(fontsDir, 'Roboto-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(fontsDir, 'Roboto-Medium.ttf'), fontWeight: 500 },
    { src: path.join(fontsDir, 'Roboto-Bold.ttf'), fontWeight: 'bold' },
    { src: path.join(fontsDir, 'Roboto-Italic.ttf'), fontStyle: 'italic', fontWeight: 'normal' },
    { src: path.join(fontsDir, 'Roboto-MediumItalic.ttf'), fontStyle: 'italic', fontWeight: 500 },
  ],
});
// Fără cratimă la sfârșit de rând (titluri/cuvinte întregi pe rândul următor)
Font.registerHyphenationCallback((word) => [word]);

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/** Canonical site origin for PDF image fetches (static paths, wsrv.nl). Matches metadataBase in layout.tsx. */
const SITE_ORIGIN = (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}` : '') ||
    'https://tehnicagrosupply.ro'
);

/** Turn relative paths (/products/...) or bare paths into absolute URLs so react-pdf and wsrv.nl can fetch them. */
function resolvePublicUrl(href: string): string {
    const t = href.trim();
    if (!t) return t;
    if (/^https?:\/\//i.test(t)) return t;
    const path = t.startsWith('/') ? t : `/${t}`;
    return `${SITE_ORIGIN}${path}`;
}

// Paletă aliniată la logo-ul Tehnicagro Supply (verde + gri)
const COLORS = {
    primary: '#1B4332',
    primaryDark: '#0f2922',
    secondary: '#2d6a4f',
    accent: '#40916c',
    brandGrey: '#64748b',
    text: '#0f172a',
    textMuted: '#475569',
    textSubtle: '#94a3b8',
    bgLight: '#f8fafc',
    white: '#ffffff',
    border: '#e2e8f0',
    gold: '#8a6d2e',
    /** Accent pentru titluri tip „catalog producător” (echivalent stil portocaliu din broșurile de referință) */
    brochureAccent: '#2d6a4f',
};

/** Contact real (ca pe site); PDF nu folosește adrese sau mail inventate */
const DEFAULT_PHONE = '+40 723 380 022';
const DEFAULT_EMAIL = 'tehnicagro.supply@gmail.com';
const PUBLIC_WEB = 'tehnicagrosupply.ro';

// DTP Layout Constants — spațiu pentru header/footer fixe, fără suprapuneri
const MARGIN = 48;
const HEADER_BLOCK = 72;
const FOOTER_BLOCK = 64;
const LINE_HEIGHT = 1.6;

// PDF Styles
const styles = StyleSheet.create({
    page: { backgroundColor: COLORS.white, padding: 0, fontFamily: 'Roboto' },
    /** Copertă tip broșură: zonă color stânga + zonă albă dreapta */
    cover: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.white, padding: 0 },
    coverLeftPanel: {
        width: '42%',
        backgroundColor: COLORS.primaryDark,
        paddingTop: MARGIN + 8,
        paddingBottom: MARGIN,
        paddingHorizontal: 22,
        justifyContent: 'flex-start' as const,
    },
    coverRightPanel: {
        flex: 1,
        paddingTop: MARGIN + 12,
        paddingBottom: MARGIN,
        paddingHorizontal: MARGIN,
        justifyContent: 'center' as const,
    },
    coverBrandBlock: { alignItems: 'flex-start' as const },
    coverBrandName: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, letterSpacing: 1.2 },
    coverBrandTag: { fontSize: 9, color: '#bbf7d0', marginTop: 10, letterSpacing: 1, textTransform: 'uppercase' as const, lineHeight: 1.35 },
    coverEdition: { fontSize: 8, color: '#86efac', marginTop: 20, letterSpacing: 1.2, textTransform: 'uppercase' as const },
    coverRule: { width: 100, height: 2, backgroundColor: '#86efac', marginTop: 16, opacity: 0.95 },
    coverWebHint: { fontSize: 8, color: COLORS.white, opacity: 0.75, letterSpacing: 0.4 },
    coverTitle: {
        fontSize: 26,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primaryDark,
        letterSpacing: 1.2,
        textTransform: 'uppercase' as const,
        marginBottom: 12,
        textAlign: 'left' as const,
        maxWidth: '100%',
    },
    coverSubtitle: {
        fontSize: 10,
        color: COLORS.brochureAccent,
        letterSpacing: 1.5,
        marginBottom: 14,
        textTransform: 'uppercase' as const,
        textAlign: 'left' as const,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        lineHeight: 1.4,
    },
    coverSlogan: {
        fontSize: 9.5,
        color: COLORS.textMuted,
        lineHeight: 1.55,
        textAlign: 'left' as const,
        marginBottom: 8,
    },
    coverFooterBar: {
        backgroundColor: '#0f172a',
        paddingVertical: 12,
        paddingHorizontal: MARGIN,
        alignItems: 'center' as const,
        width: '100%',
    },
    coverFooterBarText: {
        fontSize: 8,
        color: COLORS.white,
        letterSpacing: 1.6,
        textTransform: 'uppercase' as const,
        textAlign: 'center' as const,
    },
    header: { position: 'absolute', top: 28, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#dcfce7', paddingBottom: 10, minHeight: 46 },
    headerWordmark: { justifyContent: 'center' },
    headerBrandName: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 0.5 },
    headerBrandTag: { fontSize: 7, color: COLORS.brandGrey, marginTop: 2, letterSpacing: 0.3 },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Roboto', fontWeight: 'bold', flex: 1, flexShrink: 1, marginLeft: 14, textAlign: 'right', maxWidth: 280 },
    footer: { position: 'absolute', bottom: 22, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e8eef3', paddingTop: 8, minHeight: 32 },
    footerPage: { fontSize: 7.5, color: COLORS.textSubtle, letterSpacing: 0.6 },
    footerContact: { fontSize: 7.5, color: COLORS.textMuted, fontFamily: 'Roboto', fontWeight: 'normal' },
    sectionTitle: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 22, letterSpacing: -0.3 },
    subsectionTitle: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.brochureAccent, marginBottom: 10, marginTop: 6 },
    categoryIntroAccent: { height: 3, backgroundColor: COLORS.brochureAccent, marginBottom: 14, width: '100%' },
    mainText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 15, textAlign: 'justify' },
    bulletText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 8, marginLeft: 15 },
    introHighlight: { fontSize: 13, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 500, lineHeight: 1.5, marginBottom: 20 },
    categoryTitle: { fontSize: 20, color: COLORS.primaryDark, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: -0.2, marginBottom: 12 },
    productLayout: { paddingTop: HEADER_BLOCK + 10, paddingRight: MARGIN, paddingBottom: FOOTER_BLOCK + 28, paddingLeft: MARGIN },
    productOverviewPage: {
        paddingTop: HEADER_BLOCK + 10,
        paddingRight: MARGIN,
        paddingBottom: FOOTER_BLOCK + 18,
        paddingLeft: MARGIN,
        flex: 1,
    },
    productDetailPage: {
        paddingTop: HEADER_BLOCK + 10,
        paddingRight: MARGIN,
        paddingBottom: FOOTER_BLOCK + 18,
        paddingLeft: MARGIN,
        flex: 1,
    },
    badgeRow: { marginBottom: 8 },
    badge: { alignSelf: 'flex-start', backgroundColor: COLORS.primaryDark, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 4 },
    productOverviewGrid: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 16 },
    productDetailGrid: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
    productMainCol: { width: '42%', marginRight: 16 },
    productRightCol: { flex: 1, minWidth: 0 },
    productHeroTopRow: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 18 },
    productHeroTitleCol: { width: '44%', paddingRight: 18 },
    productHeroTextCol: { flex: 1, minWidth: 0 },
    productHeroImageStage: { width: '100%', marginTop: 6 },
    productOverviewImageFrame: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 10,
        backgroundColor: COLORS.white,
    },
    catalogRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    catalogImageCol: {
        width: '36%',
        padding: 10,
        marginRight: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.bgLight,
    },
    catalogTextCol: { flex: 1, minWidth: 0 },
    productMainImageBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 6,
        backgroundColor: COLORS.white,
        marginBottom: 8,
    },
    galleryGridRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 4 },
    galleryCell: {
        width: '48%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 4,
        backgroundColor: COLORS.white,
        minHeight: 86,
        justifyContent: 'center',
    },
    zigZagRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
    zigZagSpecsCol: { flex: 1, minWidth: 0, paddingRight: 12 },
    zigZagSpecsBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    zigZagGalleryCol: {
        width: '36%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        backgroundColor: COLORS.bgLight,
    },
    zigZagGalleryTitle: {
        fontSize: 8,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primary,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.8,
        marginBottom: 10,
    },
    zigZagGalleryThumb: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 4,
        backgroundColor: COLORS.white,
    },
    productContLayout: {
        paddingTop: HEADER_BLOCK + 8,
        paddingBottom: FOOTER_BLOCK + 20,
        paddingHorizontal: MARGIN,
        flex: 1,
    },
    productContHead: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
        letterSpacing: 0.2,
    },
    specFullWidthBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
        marginTop: 4,
    },
    unifiedSpecsBox: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    narrativeSpecsBox: {
        marginTop: 4,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    specLineDetailCompact: { fontSize: 9.5, color: COLORS.textMuted, lineHeight: 1.45, marginBottom: 3 },
    productGalleryStackBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 6,
        backgroundColor: COLORS.white,
        marginTop: 8,
    },
    productSupplementStack: { width: '42%', marginRight: 16 },
    productSupplementImageBox: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 6,
        backgroundColor: COLORS.white,
        marginBottom: 12,
        minHeight: 232,
    },
    productSupplementEmpty: {
        minHeight: 154,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.bgLight,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    contactFooterBand: {
        paddingTop: 20,
        paddingBottom: 8,
        alignItems: 'center' as const,
        width: '100%',
    },
    contactGreenBar: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center' as const,
        width: '100%',
        marginTop: 8,
    },
    contactGreenBarMain: {
        fontSize: 7.5,
        color: COLORS.white,
        letterSpacing: 0.4,
        textAlign: 'center' as const,
        lineHeight: 1.45,
    },
    contactGreenBarPage: {
        fontSize: 8,
        color: '#d1fae5',
        marginTop: 6,
        letterSpacing: 1.2,
        textTransform: 'uppercase' as const,
    },
    contactLogoImg: { width: 160, height: 48, objectFit: 'contain' as const, marginBottom: 10 },
    contactDocNote: {
        fontSize: 7.5,
        color: COLORS.textSubtle,
        lineHeight: 1.45,
        textAlign: 'center' as const,
        maxWidth: 420,
    },
    brandPageCard: {
        marginBottom: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        backgroundColor: '#fafafa',
    },
    brandPageName: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 1.2,
        textTransform: 'uppercase' as const,
        marginBottom: 4,
    },
    brandPageTag: { fontSize: 9, color: COLORS.textMuted, fontFamily: 'Roboto', fontWeight: 500, marginBottom: 8 },
    brandSourceBox: {
        marginTop: 8,
        padding: 12,
        backgroundColor: COLORS.bgLight,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    brandSourceText: { fontSize: 9, color: COLORS.textMuted, lineHeight: 1.45, textAlign: 'justify' as const },
    contactClosing: {
        marginTop: 20,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        maxWidth: 440,
        alignSelf: 'center' as const,
    },
    contactClosingTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    contactClosingText: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.5, textAlign: 'center' as const },
    /** Corp comun: dreapta pozei + specificații (aceeași optică) */
    productSheetBody: {
        fontSize: 9.5,
        color: COLORS.textMuted,
        lineHeight: 1.45,
        marginBottom: 8,
        textAlign: 'justify' as const,
    },
    productSheetDisclaimer: {
        fontSize: 9.5,
        color: COLORS.textSubtle,
        fontStyle: 'italic',
        lineHeight: 1.45,
        marginBottom: 0,
        textAlign: 'justify' as const,
    },
    catalogSpecsWrap: { marginTop: 6 },
    productMetaStrip: { fontSize: 8.5, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 8, lineHeight: 1.35 },
    specDetailBlock: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
    specDetailGroup: { fontSize: 9.5, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 4, marginTop: 6 },
    specDetailLine: { fontSize: 9.5, color: COLORS.textMuted, lineHeight: 1.45, marginBottom: 3 },
    badgeText: { fontSize: 8, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
    brandLabel: { fontSize: 8.5, color: COLORS.secondary, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 5 },
    modelTitle: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 10, letterSpacing: -0.4, maxWidth: '100%' },
    productHeroRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, width: '100%' },
    productHeroLeft: { width: '46%', paddingRight: 12 },
    productHeroRight: { flex: 1, minWidth: 0 },
    productCategoryKicker: {
        fontSize: 8,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 1.8,
        textTransform: 'uppercase' as const,
        marginBottom: 8,
        lineHeight: 1.3,
    },
    productModelHero: {
        fontSize: 28,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.brochureAccent,
        letterSpacing: -0.3,
        lineHeight: 1.08,
        maxWidth: '100%',
    },
    productIntroBox: {
        marginTop: 6,
    },
    productPrincipleTitle: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primaryDark,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    productIntroBullets: {
        fontSize: 9.5,
        color: COLORS.textMuted,
        lineHeight: 1.5,
        marginTop: 4,
    },
    productImageColumn: { width: '52%', alignSelf: 'flex-start' as const },
    blockTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 4, marginTop: 10 },
    specItem: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
    specChevron: { fontSize: 11, color: COLORS.brochureAccent, marginRight: 8, lineHeight: 1.45, fontFamily: 'Roboto', fontWeight: 'bold' },
    specText: { fontSize: 9.5, color: COLORS.textMuted, flex: 1, lineHeight: 1.45 },
    verdictFundingRow: { flexDirection: 'row', alignItems: 'stretch', marginTop: 12, width: '100%' },
    verdictOrFundingHalf: { flex: 1, minWidth: 0, marginHorizontal: 4 },
    fundingBox: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: COLORS.accent, marginTop: 0 },
    fundingTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.brochureAccent, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    fundingText: { fontSize: 10, color: '#065f46', lineHeight: 1.4 },
    verdictBox: { backgroundColor: '#fffbeb', padding: 12, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: '#f59e0b', marginTop: 0 },
    verdictTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.brochureAccent, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    verdictText: { fontSize: 9, color: '#92400e', lineHeight: 1.45, fontStyle: 'italic' },
    placeholderBox: { width: '100%', backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 20, padding: 20 },
    placeholderText: { fontSize: 9, color: '#64748b', textAlign: 'center' },
    contactPage: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: MARGIN,
        paddingTop: HEADER_BLOCK + 8,
        paddingBottom: FOOTER_BLOCK + 52,
        justifyContent: 'space-between' as const,
        flexDirection: 'column' as const,
    },
    contactTitle: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.brochureAccent,
        textAlign: 'center',
        marginBottom: 6,
        letterSpacing: 1.4,
        textTransform: 'uppercase' as const,
        paddingHorizontal: 12,
    },
    contactSubtitle: { fontSize: 8.5, color: COLORS.textSubtle, textAlign: 'center', marginBottom: 16, letterSpacing: 0.5 },
    contactWordmark: { alignSelf: 'center', alignItems: 'center', marginBottom: 8 },
    contactBrandName: { fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primaryDark, letterSpacing: 0.5 },
    contactBrandTag: { fontSize: 8, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.6 },
    contactBlock: { alignSelf: 'center', maxWidth: 440, width: '100%' },
    contactRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#f4f6f8' },
    contactLabel: { fontSize: 8.5, color: COLORS.textSubtle, textTransform: 'uppercase', width: 68, letterSpacing: 0.5, marginRight: 10 },
    contactValue: { fontSize: 10.5, fontFamily: 'Roboto', fontWeight: '500', color: COLORS.text, flex: 1, lineHeight: 1.35 },
    contactValueNoWrap: { fontSize: 10.5, fontFamily: 'Roboto', fontWeight: '500', color: COLORS.text, flex: 1 },
    contextGrid: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
    contextLeftCol: { width: '54%', paddingRight: 14 },
    contextRightCol: { flex: 1, minWidth: 0 },
    compactBrandCard: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.white,
    },
    compactBrandTitle: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primaryDark,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.1,
        marginBottom: 4,
    },
    compactBrandTag: { fontSize: 8.5, color: COLORS.brochureAccent, marginBottom: 4, fontFamily: 'Roboto', fontWeight: 'bold' },
    compactBrandText: { fontSize: 8.5, color: COLORS.textMuted, lineHeight: 1.4, textAlign: 'justify' as const },
    programCard: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#d1fae5',
        borderRadius: 8,
        backgroundColor: '#f0fdf4',
    },
    programCardTitle: {
        fontSize: 9,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.brochureAccent,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.9,
        marginBottom: 4,
    },
    programCardText: { fontSize: 8.5, color: '#166534', lineHeight: 1.4, textAlign: 'justify' as const },
});

function renderChevronBullet(key: string, textStyle: Record<string, unknown>, text: string) {
    return React.createElement(
        View,
        { key, style: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7 } },
        React.createElement(Text, { style: styles.specChevron }, '›'),
        React.createElement(Text, { style: textStyle as never }, text)
    );
}

function renderAccentSectionTitle(key: string, title: string) {
    return React.createElement(
        View,
        { key, style: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 2 } },
        React.createElement(View, { style: { width: 3, height: 13, backgroundColor: COLORS.brochureAccent, marginRight: 10 } }),
        React.createElement(Text, {
            style: {
                fontSize: 10,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                color: COLORS.brochureAccent,
                letterSpacing: 1.3,
                textTransform: 'uppercase' as const,
            },
        }, title)
    );
}

// Helpers
const ProductImage = ({
    url,
    fallback,
    catalog,
    hero,
    detail,
    /** Aceeași înălțime ca imaginea principală catalog (coloană stângă) */
    catalogStack,
    compact,
    galleryThumb,
    stripThumb,
}: {
    url?: string;
    fallback?: string;
    catalog?: boolean;
    hero?: boolean;
    detail?: boolean;
    catalogStack?: boolean;
    compact?: boolean;
    galleryThumb?: boolean;
    stripThumb?: boolean;
}) => {
    if (!url) {
        const h = stripThumb ? 56 : galleryThumb ? 80 : compact ? 72 : hero ? 372 : detail ? 220 : catalog || catalogStack ? 200 : 220;
        return React.createElement(View, { style: { ...styles.placeholderBox, height: h, marginVertical: catalog || hero || detail || catalogStack || galleryThumb || stripThumb ? 0 : 14 } },
            React.createElement(Text, { style: styles.placeholderText }, `[FĂRĂ IMAGINE: ${fallback || 'Echipament'}]`)
        );
    }
    const absolute = resolvePublicUrl(url);
    const safeJpgUrl = `https://wsrv.nl/?url=${encodeURIComponent(absolute.replace(/^https?:\/\//, ''))}&output=jpg&w=800`;
    const imgStyle = stripThumb
        ? { width: '100%', height: 56, objectFit: 'contain' as const }
        : galleryThumb
          ? { width: '100%', height: 80, objectFit: 'contain' as const }
          : compact
            ? { width: '100%', height: 72, objectFit: 'contain' as const, marginTop: 4 }
            : hero
              ? { width: '100%', height: 372, objectFit: 'cover' as const }
              : detail
                ? { width: '100%', height: 220, objectFit: 'cover' as const }
            : catalog || catalogStack
              ? { width: '100%', height: 200, objectFit: 'contain' as const }
              : { width: '100%', height: 220, objectFit: 'contain' as const, marginVertical: 14 };
    return React.createElement(Image, { src: safeJpgUrl, style: imgStyle });
};

/** Spații neîntrerupte ca numărul de telefon să nu se rupă pe verticală în PDF */
function formatPhoneForPdf(phone: string): string {
    return String(phone || '').trim().replace(/\s+/g, '\u00A0');
}

function categoryDisplayName(slug: string, categoriesFromDb: Category[]): string {
    const c = categoriesFromDb.find((x) => x.slug === slug);
    return c?.name || CATEGORY_LABELS[slug] || slug;
}

/** Titluri din JSON (ex. Performanta_si_Dimensiuni) → text lizibil în PDF */
function humanizeSpecGroupKey(group: string): string {
    return String(group).replace(/_/g, ' ').trim();
}

/** Suportă string, obiecte imbricate și array-uri de rânduri (ex. variante ADS 3/4/6) — evită [object Object] */
function formatSpecValueForPdf(val: unknown): string {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return String(val).trim();
    }
    if (Array.isArray(val)) {
        return val
            .map((item) => formatSpecValueForPdf(item))
            .filter(Boolean)
            .join(' · ');
    }
    if (typeof val === 'object') {
        return Object.entries(val as Record<string, unknown>)
            .filter(([, v]) => v != null && String(v).trim() !== '')
            .map(([k, v]) => `${k}: ${formatSpecValueForPdf(v)}`)
            .join(' · ');
    }
    return '';
}

function detailedSpecBlocks(product: DynamicProduct, maxLines: number): { group: string; lines: string[] }[] {
    const ds = product.detailedSpecs;
    if (!ds || typeof ds !== 'object') return [];
    const blocks: { group: string; lines: string[] }[] = [];
    let count = 0;

    for (const [group, raw] of Object.entries(ds as Record<string, unknown>)) {
        if (count >= maxLines) break;
        if (raw == null) continue;
        const lines: string[] = [];

        if (Array.isArray(raw)) {
            for (let i = 0; i < raw.length && count < maxLines; i++) {
                const item = raw[i];
                const line = formatSpecValueForPdf(item);
                if (!line) continue;
                lines.push(line);
                count += 1;
            }
        } else if (typeof raw === 'object') {
            for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
                if (count >= maxLines) break;
                const formatted = formatSpecValueForPdf(v);
                if (!formatted) continue;
                lines.push(`${k}: ${formatted}`);
                count += 1;
            }
        }

        if (lines.length > 0) {
            blocks.push({ group: humanizeSpecGroupKey(group), lines });
        }
    }
    return blocks;
}

type SpecPdfLine = { kind: 'group'; text: string } | { kind: 'line'; text: string };

/** Toate liniile pentru specificații extinse (paginare explicită — evită suprapunere cu antet fix) */
function flattenDetailedSpecLines(product: DynamicProduct): SpecPdfLine[] {
    const blocks = detailedSpecBlocks(product, 4000);
    const out: SpecPdfLine[] = [];
    for (const b of blocks) {
        out.push({ kind: 'group', text: b.group });
        for (const line of b.lines) {
            out.push({ kind: 'line', text: line });
        }
    }
    return out;
}

/** Indicativ preț / eligibilitate — rămâne pe pagina principală produs */
function renderProductMetaOnly(product: DynamicProduct): React.ReactElement[] {
    const parts: string[] = [];
    if (product.priceRange) parts.push(`Indicativ: ${product.priceRange}`);
    if (product.eligibility) parts.push(`Eligibilitate (informare): ${product.eligibility}`);
    if (parts.length === 0) return [];
    return [React.createElement(Text, { key: 'meta', style: styles.productMetaStrip }, parts.join(' · '))];
}

/** O singură casetă: specificații din catalog + detalii din JSON, fără denumire „extinse” separată */
function renderUnifiedTechnicalSpecs(product: DynamicProduct): React.ReactElement {
    const parts: React.ReactElement[] = [];
    parts.push(renderAccentSectionTitle('utt', 'Specificații tehnice'));
    if (Array.isArray(product.specs) && product.specs.length > 0) {
        product.specs.forEach((spec, i) => {
            parts.push(
                React.createElement(View, { key: `sp-${i}`, style: styles.specItem },
                    React.createElement(Text, { style: styles.specChevron }, '›'),
                    React.createElement(Text, { style: styles.specText }, spec || '')
                )
            );
        });
    }
    const detLines = flattenDetailedSpecLines(product);
    if (detLines.length > 0) {
        if (product.specs?.length) {
            parts.push(React.createElement(View, { key: 'sp-div', style: { height: 8 } }));
        }
        detLines.forEach((sl, i) => {
            parts.push(
                sl.kind === 'group'
                    ? React.createElement(Text, { key: `dg-${i}`, style: styles.specDetailGroup }, sl.text)
                    : React.createElement(Text, { key: `dl-${i}`, style: styles.specLineDetailCompact }, sl.text)
            );
        });
    }
    if (parts.length === 1) {
        parts.push(
            React.createElement(Text, { key: 'ph', style: { ...styles.productSheetBody, fontStyle: 'italic' } }, 'Date tehnice complete la cerere.')
        );
    }
    return React.createElement(View, { style: styles.unifiedSpecsBox }, ...parts);
}

function pdfCatalogLogoUrl(): string {
    const absolute = resolvePublicUrl('/logos/tehnicagro-supply-logo-catalog.png');
    return `https://wsrv.nl/?url=${encodeURIComponent(absolute.replace(/^https?:\/\//, ''))}&output=png&w=320`;
}

/** Logo încorporat ca data-URI — evită eșecul încărcării în react-pdf pe server */
function loadCatalogLogoDataUri(): string | undefined {
    try {
        const fp = path.join(process.cwd(), 'public', 'logos', 'tehnicagro-supply-logo-catalog.png');
        if (!fs.existsSync(fp)) return undefined;
        return `data:image/png;base64,${fs.readFileSync(fp).toString('base64')}`;
    } catch {
        return undefined;
    }
}

function pdfCatalogLogoSrc(config: { logoDataUri?: string }): string {
    if (config.logoDataUri && config.logoDataUri.startsWith('data:')) return config.logoDataUri;
    return pdfCatalogLogoUrl();
}

/** Doar cartonașele producătorilor care apar în produsele selectate pentru broșură */
function getBrandCardsForCatalog(products: DynamicProduct[]) {
    const brands = products.map((p) => (p.brand || '').trim()).filter(Boolean);
    if (brands.length === 0) return [];
    return PDF_BRAND_CARDS.filter((card) =>
        brands.some((b) => b.toLowerCase().includes(card.matchBrand.toLowerCase()))
    );
}

function getRelevantFundingPrograms(products: DynamicProduct[]) {
    const picked = new Map<string, any>();
    for (const p of products) {
        const list = ((FUNDING_PROGRAMS as any)[p.category] || []) as any[];
        for (const prog of list.filter((x) => x.status === 'active')) {
            const key = String(prog.code || prog.title || `${p.category}-${picked.size}`);
            if (!picked.has(key)) picked.set(key, prog);
        }
    }
    return Array.from(picked.values()).slice(0, 3);
}

const renderPageHeader = (title: string) => (
    React.createElement(View, { style: styles.header, fixed: true },
        React.createElement(View, { style: styles.headerWordmark },
            React.createElement(Text, { style: styles.headerBrandName }, 'TehnicAgro Supply'),
            React.createElement(Text, { style: styles.headerBrandTag }, 'Selecție tehnică · materiale comerciale')
        ),
        React.createElement(Text, { style: styles.headerTitle }, title || '')
    )
);

const renderPageFooter = (pageNumber: number, phone?: string) => (
    React.createElement(View, { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerPage }, `TehnicAgro Supply · document selecție · pag. ${pageNumber}`),
        React.createElement(Text, { style: styles.footerContact, wrap: false }, formatPhoneForPdf(phone || DEFAULT_PHONE))
    )
);

function buildPDF(config: any, products: DynamicProduct[], categoriesFromDb: Category[]): React.ReactElement<DocumentProps> {
    const productsToDisplay = products || [];
    const logoSrc = pdfCatalogLogoSrc(config);
    const brandCardsSelected = getBrandCardsForCatalog(productsToDisplay);
    const selectedPrograms = getRelevantFundingPrograms(productsToDisplay);
    let currentPage = 1;

    // Categorize products for transitions
    const byCategory: Record<string, DynamicProduct[]> = {};
    productsToDisplay.forEach(p => {
        const cat = p.category || 'Alte Utilaje';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(p);
    });

    const categories = Object.keys(byCategory);

    return React.createElement(Document, { title: config.title || 'TehnicAgro Supply — catalog selecție' },
        // PAGINA 1: COPERTĂ (structură tip broșură producător: bandă brand + zonă titlu)
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: { flex: 1, flexDirection: 'column' } },
                React.createElement(View, { style: { flex: 1, flexDirection: 'row', minHeight: 0 } },
                    React.createElement(
                        View,
                        { style: { ...styles.coverLeftPanel, justifyContent: 'space-between' } },
                        React.createElement(View, { style: styles.coverBrandBlock },
                            React.createElement(Text, { style: styles.coverBrandName }, 'TehnicAgro Supply'),
                            React.createElement(Text, { style: styles.coverBrandTag }, 'Utilaje agricole · selecție tehnică · România'),
                            React.createElement(View, { style: styles.coverRule }),
                            React.createElement(Text, { style: styles.coverEdition }, 'Document comercial · selecție')
                        ),
                        React.createElement(Text, { style: styles.coverWebHint }, PUBLIC_WEB)
                    ),
                    React.createElement(View, { style: styles.coverRightPanel },
                        React.createElement(Text, { style: styles.coverTitle }, 'Catalog selecție'),
                        React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'Mecanizare agricolă'),
                        React.createElement(Text, { style: styles.coverSlogan },
                            'Conținut redactat de TehnicAgro Supply pe baza documentației tehnice a echipamentelor incluse. Nu înlocuiește site-urile oficiale ale producătorilor. Parametrii concrete se validează la ofertare și pe marca tractorului dumneavoastră.'
                        )
                    )
                ),
                React.createElement(View, { style: styles.coverFooterBar },
                    React.createElement(Text, { style: styles.coverFooterBarText },
                        'Mecanizare responsabilă · selecție tehnică pentru ferme din România'
                    )
                )
            )
        ),

        // PAGINA 2: PROFIL COMPANIE
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PROFIL COMPANIE'),
            React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 48, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(View, { style: { alignItems: 'center', marginBottom: 16 } },
                    React.createElement(Text, { style: { fontSize: 9, color: COLORS.brochureAccent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 } }, 'TehnicAgro Supply'),
                    React.createElement(Text, { style: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primaryDark, textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.35, maxWidth: 440 } }, PDF_COMPANY.title)
                ),
                React.createElement(Text, { style: styles.introHighlight }, PDF_COMPANY.lead),
                React.createElement(Text, { style: styles.mainText }, PDF_COMPANY.p2),
                React.createElement(Text, { style: styles.mainText }, PDF_COMPANY.p3),
                renderAccentSectionTitle('expect', 'Ce puteți aștepta de la noi'),
                ...PDF_COMPANY.bullets.map((b, i) => renderChevronBullet(`cmp-b-${i}`, styles.mainText as Record<string, unknown>, b)),
                React.createElement(Text, { style: { ...styles.mainText, marginTop: 12 } }, PDF_COMPANY.closing)
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),

        // PAGINĂ CONTEXT COMPACTĂ: producători selectați + programe relevante
        ...((brandCardsSelected.length > 0 || selectedPrograms.length > 0)
            ? [
                  React.createElement(Page, { size: 'A4', style: styles.page, key: 'context-compact' },
                      renderPageHeader('PRODUCĂTORI ȘI PROGRAME'),
                      React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 40, paddingHorizontal: MARGIN, flex: 1 } },
                          renderAccentSectionTitle('ctx-title', 'Contextul acestei selecții'),
                          React.createElement(
                              Text,
                              { style: styles.mainText },
                              'Broșura include exclusiv producătorii și programele orientative relevante pentru utilajele selectate. Am redus intenționat această secțiune la o singură pagină pentru a păstra documentul scurt, clar și comercial.'
                          ),
                          React.createElement(View, { style: styles.contextGrid },
                              React.createElement(View, { style: styles.contextLeftCol },
                                  renderAccentSectionTitle('ctx-brands', 'Producători selectați'),
                                  ...brandCardsSelected.map((card, ci) =>
                                      React.createElement(View, { key: `ctx-brand-${ci}`, style: styles.compactBrandCard },
                                          React.createElement(Text, { style: styles.compactBrandTitle }, card.name),
                                          React.createElement(Text, { style: styles.compactBrandTag }, card.tagline),
                                          React.createElement(Text, { style: styles.compactBrandText }, card.paragraphs[0] || '')
                                      )
                                  )
                              ),
                              React.createElement(View, { style: styles.contextRightCol },
                                  renderAccentSectionTitle('ctx-prog', 'Programe compatibile'),
                                  ...(selectedPrograms.length > 0
                                      ? selectedPrograms.map((prog, pi) =>
                                            React.createElement(View, { key: `ctx-prog-${pi}`, style: styles.programCard },
                                                React.createElement(Text, { style: styles.programCardTitle }, prog.title || prog.code || 'Program'),
                                                React.createElement(
                                                    Text,
                                                    { style: styles.programCardText },
                                                    `${prog.maxGrant ? `${prog.maxGrant}. ` : ''}${prog.details || 'Eligibilitatea și cuantumul se verifică exclusiv în ghidurile oficiale și în dosarul fermei.'}`
                                                )
                                            )
                                        )
                                      : [
                                            React.createElement(
                                                Text,
                                                { key: 'ctx-prog-empty', style: styles.mainText },
                                                'Nu există în prezent un program activ preluat din administrare pentru această selecție.'
                                            ),
                                        ])
                              )
                          )
                      ),
                      renderPageFooter(currentPage += 1, config.phone)
                  ),
              ]
            : []),

        // GENERARE DINAMICĂ: DOAR PRODUSELE (fără pagini separate de categorie/program ca să evităm broșuri prea lungi)
        ...categories.flatMap(catName => {
            const catProducts = byCategory[catName];

            // 2. Produse: paginare controlată, simetrică
            const productPages = catProducts.flatMap((product, idx) => {
                const progList = (product?.category && (FUNDING_PROGRAMS as any)[product.category]) || [];
                const activePrograms = Array.isArray(progList) ? progList.filter((p: any) => p.status === 'active').slice(0, 1) : [];

                const descText = product?.longDescription || product?.description || 'Descriere în curs de actualizare.';
                const secTitle = categoryDisplayName(catName, categoriesFromDb);
                const extraGallery = (
                    Array.isArray(product.gallery)
                        ? product.gallery.filter((u) => u && u !== product.imageSrc).slice(0, 2)
                        : []
                ) as string[];
                const pSlug = product?.slug || `p-${catName}-${idx}`;

                const verdictEl =
                    product?.expertVerdict &&
                    React.createElement(View, { style: styles.verdictBox },
                        React.createElement(Text, { style: styles.verdictTitle }, 'Verdictul expertului tehnic'),
                        React.createElement(Text, { style: styles.verdictText }, product.expertVerdict)
                    );
                const fundingEl =
                    activePrograms.length > 0 &&
                    React.createElement(View, { style: styles.fundingBox },
                        React.createElement(Text, { style: styles.fundingTitle }, 'Finanțare — informare generală'),
                        React.createElement(
                            Text,
                            { style: styles.fundingText },
                            `${activePrograms[0].title || ''}${activePrograms[0].maxGrant ? ` (${activePrograms[0].maxGrant})` : ''}. Informație orientativă; eligibilitatea se confirmă exclusiv în ghidurile oficiale și în documentația fermei.`
                        )
                    );

                const kicker = [secTitle.toUpperCase(), product?.brand].filter(Boolean).join(' · ');
                const introBullets = [
                    'Destinată lucrărilor conservative, cu utilizare posibilă în semănat direct, mini-till sau convențional, în funcție de configurație.',
                    'Configurația optimă se stabilește după lățimea de lucru, numărul de rânduri, puterea tractorului și nivelul de rest vegetal.',
                    'Eligibilitatea pentru programele de sprijin se verifică separat, în ghidurile și condițiile oficiale ale campaniei în vigoare.',
                ];

                const overviewPage = React.createElement(Page, { size: 'A4', style: styles.page, key: `p-overview-${pSlug}` },
                    renderPageHeader(secTitle.toUpperCase()),
                    React.createElement(View, { style: styles.productOverviewPage },
                        product?.badge &&
                            React.createElement(View, { style: styles.badgeRow },
                                React.createElement(View, { style: styles.badge },
                                    React.createElement(Text, { style: styles.badgeText }, product.badge)
                                )
                            ),
                        React.createElement(View, { style: styles.productOverviewGrid },
                            React.createElement(View, { style: styles.productRightCol },
                                React.createElement(Text, { style: styles.productCategoryKicker }, kicker),
                                React.createElement(Text, { style: styles.productModelHero }, product?.name || 'Utilaj agricol'),
                                renderAccentSectionTitle(`princ-${pSlug}`, 'Prezentare tehnică'),
                                React.createElement(View, { style: styles.productIntroBox },
                                    React.createElement(Text, { style: styles.productSheetBody }, descText),
                                    ...introBullets.map((line, bi) =>
                                        renderChevronBullet(`intro-${pSlug}-${bi}`, styles.productIntroBullets as Record<string, unknown>, line)
                                    ),
                                    React.createElement(
                                        Text,
                                        { style: styles.productSheetDisclaimer },
                                        'Prezentare tehnică sintetică redactată pentru această broșură. Parametrii finali se validează pe configurația ofertată.'
                                    )
                                ),
                                ...renderProductMetaOnly(product)
                            )
                        ),
                        React.createElement(
                            View,
                            { style: styles.productOverviewImageFrame },
                            React.createElement(ProductImage, { url: product?.imageSrc, fallback: product?.name, hero: true })
                        )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                );

                const detailGallery = (
                    extraGallery.length >= 2
                        ? extraGallery.slice(0, 2)
                        : extraGallery.length === 1
                          ? [extraGallery[0], product?.imageSrc].filter(Boolean)
                          : [product?.imageSrc].filter(Boolean)
                ) as string[];
                const detailPage = React.createElement(Page, { size: 'A4', style: styles.page, key: `p-detail-${pSlug}` },
                    renderPageHeader(secTitle.toUpperCase()),
                    React.createElement(View, { style: styles.productDetailPage },
                        React.createElement(View, { style: styles.productDetailGrid },
                            React.createElement(View, { style: styles.productSupplementStack },
                                ...detailGallery.map((u, gi) =>
                                    React.createElement(
                                        View,
                                        { key: `detail-${pSlug}-${gi}`, style: styles.productSupplementImageBox },
                                        React.createElement(ProductImage, { url: u, fallback: product?.name, detail: true })
                                    )
                                ),
                            ),
                            React.createElement(View, { style: styles.productRightCol },
                                renderUnifiedTechnicalSpecs(product)
                            )
                        ),
                        (verdictEl || fundingEl) &&
                            React.createElement(
                                View,
                                { style: styles.verdictFundingRow },
                                verdictEl &&
                                    React.createElement(
                                        View,
                                        { style: fundingEl ? styles.verdictOrFundingHalf : { width: '100%', minWidth: 0 } },
                                        verdictEl
                                    ),
                                fundingEl &&
                                    React.createElement(
                                        View,
                                        { style: verdictEl ? styles.verdictOrFundingHalf : { width: '100%', minWidth: 0 } },
                                        fundingEl
                                    )
                            )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                );

                return [overviewPage, detailPage];
            });

            return productPages;
        }),

        // PAGINA FINALĂ: contact + bandă tip copertă (ierarhie vizuală ca în broșurile de referință)
        ...((): React.ReactElement[] => {
            const contactPg = currentPage + 1;
            return [
                React.createElement(
                    Page,
                    { size: 'A4', style: styles.page, key: 'contact-final' },
                    renderPageHeader('CONTACT'),
                    React.createElement(
                        View,
                        { style: styles.contactPage },
                        React.createElement(
                            View,
                            { style: { width: '100%' } },
                            React.createElement(
                                View,
                                { style: styles.contactWordmark },
                                React.createElement(Text, { style: styles.contactBrandName }, 'TehnicAgro Supply'),
                                React.createElement(Text, { style: styles.contactBrandTag }, 'Selecție tehnică pentru mecanizare agricolă')
                            ),
                            React.createElement(Text, { style: styles.contactTitle }, 'Date de contact'),
                            React.createElement(Text, { style: styles.contactSubtitle }, 'Oferte, disponibilitate, clarificări tehnice'),
                            React.createElement(View, { style: styles.contactBlock },
                                React.createElement(View, { style: styles.contactRow },
                                    React.createElement(Text, { style: styles.contactLabel }, 'Telefon'),
                                    React.createElement(Text, { style: styles.contactValueNoWrap, wrap: false }, formatPhoneForPdf(config.phone || DEFAULT_PHONE))
                                ),
                                React.createElement(View, { style: styles.contactRow },
                                    React.createElement(Text, { style: styles.contactLabel }, 'E-mail'),
                                    React.createElement(Text, { style: styles.contactValue }, (config.email && String(config.email).trim()) || DEFAULT_EMAIL)
                                ),
                                React.createElement(View, { style: styles.contactRow },
                                    React.createElement(Text, { style: styles.contactLabel }, 'Site'),
                                    React.createElement(Text, { style: styles.contactValue }, PUBLIC_WEB)
                                ),
                                React.createElement(View, { style: styles.contactRow },
                                    React.createElement(Text, { style: styles.contactLabel }, 'Țară'),
                                    React.createElement(Text, { style: styles.contactValue }, 'România')
                                )
                            ),
                            React.createElement(View, { style: styles.contactClosing },
                                React.createElement(Text, { style: styles.contactClosingTitle }, 'Oferte personalizate'),
                                React.createElement(Text, { style: styles.contactClosingText },
                                    'Pentru o ofertă adaptată exploatației dumneavoastră (configurație utilaj, opționale, termene), ne puteți contacta la telefon sau e-mailul de mai sus. Acest PDF este document static; nu include elemente apăsabile — discutăm oferta direct pe canalele reale de comunicare.'
                                )
                            ),
                            React.createElement(View, { style: styles.contactFooterBand },
                                React.createElement(Image, { src: logoSrc, style: styles.contactLogoImg }),
                                React.createElement(Text, { style: styles.contactDocNote }, PDF_DOCUMENTATION_NOTE)
                            )
                        ),
                        React.createElement(
                            View,
                            { style: styles.contactGreenBar },
                            React.createElement(
                                Text,
                                { style: styles.contactGreenBarMain },
                                `${formatPhoneForPdf(config.phone || DEFAULT_PHONE)} · ${(config.email && String(config.email).trim()) || DEFAULT_EMAIL} · ${PUBLIC_WEB} · România`
                            ),
                            React.createElement(Text, { style: styles.contactGreenBarPage }, `TehnicAgro Supply · document selecție · pag. ${contactPg}`)
                        )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                ),
            ];
        })()
    );
}

export async function POST(request: Request) {
    try {
        const bodyInput = await request.json();
        const { config, productSlugs, adminAuth } = bodyInput;

        // AUTH
        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
        const authOk = (adminAuth || '').trim() === serverPass || (request.headers.get('x-admin-auth') || '').trim() === serverPass;
        if (!authOk) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const all: DynamicProduct[] = await getProducts();
        const categories: Category[] = await getCategories();
        const brochureProfiles: Record<string, ProductBrochureProfile> = await getBrochureProfilesMap();
        const selected: DynamicProduct[] = (productSlugs || [])
            .map((s: string) => normalizeLegacyProductSlug(String(s).trim()))
            .map((slug: string) => all.find((p: DynamicProduct) => p.slug === slug))
            .filter((p: DynamicProduct | undefined): p is DynamicProduct => Boolean(p))
            .map((p: DynamicProduct) => mergeProductForPdf(p, brochureProfiles));
        if (selected.length === 0) return NextResponse.json({ error: 'Selectează produse valide' }, { status: 400 });

        // PDF Generation
        console.log(`[Materiale] Generating brochure with ${selected.length} products...`);
        const doc = buildPDF({ ...(config || {}), logoDataUri: loadCatalogLogoDataUri() }, selected, categories);
        const buffer = await renderToBuffer(doc);
        console.log(`[Materiale] PDF generated successfully. Buffer size: ${buffer.length}`);

        // Blob Upload
        const uniqueSuffix = Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
        const id = `brochure-${uniqueSuffix}`;
        const blob = await put(`materiale/${id}.pdf`, buffer, { 
            access: 'public', 
            contentType: 'application/pdf',
            addRandomSuffix: true,
            allowOverwrite: true
        });
        
        // Save Metadata
        const data: Brochure = { 
            id, 
            title: config?.title || 'Broșură TehnicAgro', 
            subtitle: config?.subtitle, 
            publicUrl: blob.url, 
            createdAt: new Date().toISOString(), 
            productSlugs: selected.map((p: DynamicProduct) => p.slug), 
            config: config || {} 
        };
        await saveBrochure(data);

        return NextResponse.json({ success: true, brochure: { ...data, downloadUrl: blob.url } });
    } catch (err: any) {
        console.error('CRITICAL API ERROR in /api/materiale:', err.stack || err);
        return NextResponse.json({ 
            error: 'Failed to generate brochure', 
            details: err?.message, 
            stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined 
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const list = await getBrochures();
        return NextResponse.json({ brochures: list });
    } catch (err: any) {
        console.error('GET error:', err.stack || err);
        return NextResponse.json({ error: 'Failed to fetch brochures' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
        const authOk = (request.headers.get('x-admin-auth') || '').trim() === serverPass;
        if (!authOk) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id')?.trim();
        if (!id) {
            return NextResponse.json({ error: 'Lipsește id-ul documentului' }, { status: 400 });
        }
        const list = await getBrochures();
        if (!list.some((b) => b.id === id)) {
            return NextResponse.json({ error: 'Document negăsit în istoric' }, { status: 404 });
        }
        await deleteBrochure(id);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error('DELETE /api/materiale:', err);
        return NextResponse.json({ error: 'Nu s-a putut șterge documentul' }, { status: 500 });
    }
}
