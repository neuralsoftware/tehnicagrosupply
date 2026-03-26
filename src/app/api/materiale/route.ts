import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/supabase';
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
    ProductFeatureBlock,
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
/** Spațiu rezervat deasupra benzii footer (conținut nu intră sub bandă) */
const FOOTER_BLOCK = 52;
/** Bandă solidă subsol — pag. și contact, ca în broșurile tip PA 5000 */
const FOOTER_BAND_HEIGHT = 36;
/** Accent secțiuni „curate” pagina 2 produs */
const PDF_SECTION_ACCENT = '#064e3b';
/** Copertă spate / contact — full-bleed */
const BACK_COVER_SOLID = '#064e3b';

/** Bordură 1 pt pe toate laturile — fără `borderWidth` shorthand (react-pdf: 0 e tratat ca falsy → „Invalid border width: undefined”). */
const PDF_BORDER_GREY_1 = {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopStyle: 'solid' as const,
    borderRightStyle: 'solid' as const,
    borderBottomStyle: 'solid' as const,
    borderLeftStyle: 'solid' as const,
    borderTopColor: COLORS.border,
    borderRightColor: COLORS.border,
    borderBottomColor: COLORS.border,
    borderLeftColor: COLORS.border,
};

const PDF_BORDER_MINT_1 = {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopStyle: 'solid' as const,
    borderRightStyle: 'solid' as const,
    borderBottomStyle: 'solid' as const,
    borderLeftStyle: 'solid' as const,
    borderTopColor: '#d1fae5',
    borderRightColor: '#d1fae5',
    borderBottomColor: '#d1fae5',
    borderLeftColor: '#d1fae5',
};

const PDF_PLACEHOLDER_BORDER = {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopStyle: 'dashed' as const,
    borderRightStyle: 'dashed' as const,
    borderBottomStyle: 'dashed' as const,
    borderLeftStyle: 'dashed' as const,
    borderTopColor: '#cbd5e1',
    borderRightColor: '#cbd5e1',
    borderBottomColor: '#cbd5e1',
    borderLeftColor: '#cbd5e1',
};

// PDF Styles
const styles = StyleSheet.create({
    page: { backgroundColor: COLORS.white, padding: 0, fontFamily: 'Roboto', flexDirection: 'column' as const },
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
    header: { position: 'absolute', top: 28, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: '#dcfce7', paddingBottom: 10, minHeight: 46 },
    headerWordmark: { justifyContent: 'center' },
    headerBrandName: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 0.5 },
    headerBrandTag: { fontSize: 7, color: COLORS.brandGrey, marginTop: 2, letterSpacing: 0.3 },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Roboto', fontWeight: 'bold', flex: 1, flexShrink: 1, marginLeft: 14, textAlign: 'right', maxWidth: 280 },
    footerBand: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: FOOTER_BAND_HEIGHT,
        backgroundColor: COLORS.primaryDark,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: MARGIN,
    },
    footerBandPage: { fontSize: 8, color: COLORS.white, letterSpacing: 0.8, fontFamily: 'Roboto', fontWeight: 'bold' },
    footerBandContact: { fontSize: 8, color: '#e2e8f0', fontFamily: 'Roboto', fontWeight: 'normal' },
    sectionTitle: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 22, letterSpacing: -0.3 },
    subsectionTitle: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.brochureAccent, marginBottom: 10, marginTop: 6 },
    categoryIntroAccent: { height: 3, backgroundColor: COLORS.brochureAccent, marginBottom: 14, width: '100%' },
    mainText: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.45, marginBottom: 10, textAlign: 'justify' },
    bulletText: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.45, marginBottom: 5, marginLeft: 15 },
    /** Pagina „Profil companie”: ritm uniform — același corp, aceleași spațieri */
    companyPageInner: {
        paddingTop: HEADER_BLOCK + 8,
        paddingBottom: FOOTER_BLOCK + 12,
        paddingHorizontal: MARGIN,
        flex: 1,
    },
    companyHeaderBlock: { marginBottom: 10, alignItems: 'flex-start' as const, width: '100%' },
    companyEyebrow: {
        fontSize: 8,
        color: COLORS.brochureAccent,
        letterSpacing: 1.4,
        textTransform: 'uppercase' as const,
        marginBottom: 6,
    },
    companyDocTitle: {
        fontSize: 13,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primaryDark,
        textAlign: 'left' as const,
        textTransform: 'uppercase' as const,
        lineHeight: 1.3,
    },
    companyLead: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 500,
        color: COLORS.primaryDark,
        lineHeight: 1.45,
        marginBottom: 8,
        textAlign: 'justify' as const,
    },
    companyBody: {
        fontSize: 10,
        color: COLORS.textMuted,
        lineHeight: 1.45,
        marginBottom: 8,
        textAlign: 'justify' as const,
    },
    companyCommitmentParagraph: {
        fontSize: 10,
        color: COLORS.textMuted,
        lineHeight: 1.45,
        marginBottom: 6,
        textAlign: 'justify' as const,
    },
    companyCommitmentLabel: {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primaryDark,
    },
    companyBulletText: {
        fontSize: 10,
        color: COLORS.textMuted,
        lineHeight: 1.45,
    },
    companyListChevron: {
        fontSize: 10,
        color: COLORS.brochureAccent,
        marginRight: 6,
        lineHeight: 1.45,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    categoryTitle: { fontSize: 20, color: COLORS.primaryDark, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: -0.2, marginBottom: 12 },
    productLayout: { paddingTop: HEADER_BLOCK + 10, paddingRight: MARGIN, paddingBottom: FOOTER_BLOCK + 28, paddingLeft: MARGIN },
    /** Pagina 1 produs — layout tip PA 5000: zonă text sus, imagine full-bleed jos */
    productOverviewShell: {
        flex: 1,
        flexDirection: 'column' as const,
        minHeight: 0,
    },
    productOverviewTop: {
        flex: 1,
        minHeight: 0,
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
        paddingTop: HEADER_BLOCK + 6,
        paddingBottom: 10,
    },
    productOverviewHeroRow: {
        flexDirection: 'row' as const,
        flexWrap: 'nowrap' as const,
        alignItems: 'flex-start' as const,
        width: '100%',
    },
    /** Stânga 60% titlu / dreapta 40% principiu — mai mult spațiu pentru cuvinte lungi */
    productOverviewTitleCol: { width: '60%', minWidth: 0, paddingRight: 8 },
    /** Producător · categorie — deasupra titlului gigantic */
    productOverviewEyebrow: {
        fontSize: 14,
        letterSpacing: 2,
        color: '#52525b',
        textTransform: 'uppercase' as const,
        marginBottom: 4,
        fontFamily: 'Roboto',
        fontWeight: 500,
    },
    productOverviewGiant: {
        fontSize: 55,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.brochureAccent,
        lineHeight: 0.85,
        letterSpacing: -1.2,
        textTransform: 'uppercase' as const,
    },
    productOverviewPrincipleCol: { width: '40%', minWidth: 0, paddingLeft: 20 },
    productOverviewPrincipleTitle: {
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.text,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    productOverviewPrincipleRow: { flexDirection: 'row' as const, alignItems: 'flex-start' as const },
    productOverviewPrincipleChevron: {
        fontSize: 11,
        color: COLORS.brochureAccent,
        marginRight: 6,
        lineHeight: 1.4,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    productOverviewPrincipleBody: {
        flex: 1,
        fontSize: 9,
        color: COLORS.textMuted,
        lineHeight: 1.42,
        textAlign: 'justify' as const,
    },
    /** Imagine produs pag. 1: margini fizice stânga/dreapta/jos; banda footer se suprapune pe ultimele px */
    productOverviewImageAbsolute: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 456,
    },
    productPageRelativeWrap: {
        flex: 1,
        position: 'relative' as const,
        minHeight: 0,
    },
    productDetailPage: {
        paddingTop: HEADER_BLOCK + 8,
        paddingRight: MARGIN,
        paddingBottom: FOOTER_BLOCK + 10,
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
    catalogRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    catalogImageCol: {
        ...PDF_BORDER_GREY_1,
        width: '36%',
        padding: 10,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: COLORS.bgLight,
    },
    catalogTextCol: { flex: 1, minWidth: 0 },
    productMainImageBox: {
        ...PDF_BORDER_GREY_1,
        borderRadius: 6,
        padding: 6,
        backgroundColor: COLORS.white,
        marginBottom: 8,
    },
    galleryGridRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 4 },
    galleryCell: {
        ...PDF_BORDER_GREY_1,
        width: '48%',
        borderRadius: 6,
        padding: 4,
        backgroundColor: COLORS.white,
        minHeight: 86,
        justifyContent: 'center',
    },
    zigZagRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
    zigZagSpecsCol: { flex: 1, minWidth: 0, paddingRight: 12 },
    zigZagSpecsBox: {
        ...PDF_BORDER_GREY_1,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    zigZagGalleryCol: {
        ...PDF_BORDER_GREY_1,
        width: '36%',
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
        ...PDF_BORDER_GREY_1,
        marginBottom: 10,
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
        ...PDF_BORDER_GREY_1,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
        marginTop: 4,
    },
    unifiedSpecsBox: {
        marginTop: 6,
        paddingTop: 4,
        paddingBottom: 6,
        paddingHorizontal: 0,
    },
    narrativeSpecsBox: {
        ...PDF_BORDER_GREY_1,
        marginTop: 4,
        marginBottom: 2,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
    },
    specLineDetailCompact: { fontSize: 8.5, color: COLORS.textMuted, lineHeight: 1.3, marginBottom: 2 },
    productGalleryStackBox: {
        ...PDF_BORDER_GREY_1,
        borderRadius: 6,
        padding: 6,
        backgroundColor: COLORS.white,
        marginTop: 8,
    },
    /** Coloană moodboard — lipit de stânga, fără colțuri rotunjite */
    productMoodboardStack: { width: '42%', marginRight: 12, alignSelf: 'flex-start' as const },
    productMoodboardCell: {
        width: '100%',
        height: 180,
        marginBottom: 15,
        padding: 0,
        overflow: 'hidden' as const,
    },
    productSupplementStack: { width: '42%', marginRight: 12 },
    productSupplementImageBox: {
        ...PDF_BORDER_GREY_1,
        borderRadius: 6,
        padding: 4,
        backgroundColor: COLORS.white,
        marginBottom: 8,
        minHeight: 160,
    },
    productSupplementEmpty: {
        ...PDF_BORDER_GREY_1,
        minHeight: 154,
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
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 4,
        borderTopStyle: 'solid',
        borderRightStyle: 'solid',
        borderBottomStyle: 'solid',
        borderLeftStyle: 'solid',
        borderTopColor: COLORS.border,
        borderRightColor: COLORS.border,
        borderBottomColor: COLORS.border,
        borderLeftColor: COLORS.primary,
        borderRadius: 8,
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
        ...PDF_BORDER_GREY_1,
        marginTop: 8,
        padding: 12,
        backgroundColor: COLORS.bgLight,
        borderRadius: 6,
    },
    brandSourceText: { fontSize: 9, color: COLORS.textMuted, lineHeight: 1.45, textAlign: 'justify' as const },
    contactClosing: {
        marginTop: 20,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopStyle: 'solid',
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
        fontSize: 9,
        color: COLORS.textMuted,
        lineHeight: 1.35,
        marginBottom: 5,
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
    productMetaStrip: { fontSize: 8, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 4, lineHeight: 1.3 },
    specDetailBlock: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: COLORS.border },
    specDetailGroup: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 2, marginTop: 4 },
    specDetailLine: { fontSize: 8.5, color: COLORS.textMuted, lineHeight: 1.3, marginBottom: 2 },
    badgeText: { fontSize: 8, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
    brandLabel: { fontSize: 8.5, color: COLORS.secondary, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 5 },
    modelTitle: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 10, letterSpacing: -0.4, maxWidth: '100%' },
    productHeroRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, width: '100%' },
    productHeroLeft: { width: '46%', paddingRight: 12 },
    productHeroRight: { flex: 1, minWidth: 0 },
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
        fontSize: 9,
        color: COLORS.textMuted,
        lineHeight: 1.35,
        marginTop: 2,
    },
    productImageColumn: { width: '52%', alignSelf: 'flex-start' as const },
    blockTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: COLORS.border, paddingBottom: 4, marginTop: 10 },
    specItem: { flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' },
    specChevron: { fontSize: 10, color: COLORS.brochureAccent, marginRight: 6, lineHeight: 1.35, fontFamily: 'Roboto', fontWeight: 'bold' },
    specText: { fontSize: 9, color: COLORS.textMuted, flex: 1, lineHeight: 1.35 },
    verdictFundingRow: { flexDirection: 'row', alignItems: 'stretch', marginTop: 8, width: '100%' },
    verdictOrFundingHalf: { flex: 1, minWidth: 0, marginHorizontal: 3 },
    fundingBox: { backgroundColor: '#f0fdf4', padding: 8, borderRadius: 6, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: COLORS.accent, marginTop: 0 },
    fundingTitle: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.brochureAccent, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.8 },
    fundingText: { fontSize: 8.5, color: '#065f46', lineHeight: 1.3 },
    verdictBox: { backgroundColor: '#fffbeb', padding: 8, borderRadius: 6, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: '#f59e0b', marginTop: 0 },
    verdictTitle: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.brochureAccent, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.8 },
    verdictText: { fontSize: 8, color: '#92400e', lineHeight: 1.3, fontStyle: 'italic' },
    deepDiveFeatureTitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primaryDark,
        marginBottom: 10,
        letterSpacing: -0.2,
    },
    deepDiveFeatureBody: {
        fontSize: 10,
        color: COLORS.textMuted,
        lineHeight: 1.45,
        textAlign: 'justify' as const,
    },
    deepDiveZigzagPageInner: {
        flex: 1,
        paddingTop: HEADER_BLOCK + 8,
        paddingBottom: FOOTER_BLOCK + 14,
        paddingLeft: MARGIN,
        paddingRight: MARGIN,
    },
    placeholderBox: { ...PDF_PLACEHOLDER_BORDER, width: '100%', backgroundColor: '#f1f5f9', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 20, padding: 20 },
    placeholderText: { fontSize: 9, color: '#64748b', textAlign: 'center' },
    /** Copertă spate — fundal uniform, tot textul alb */
    contactBackOuter: {
        flex: 1,
        flexDirection: 'column' as const,
        justifyContent: 'space-between' as const,
        paddingTop: 52,
        paddingBottom: FOOTER_BAND_HEIGHT + 28,
        paddingHorizontal: MARGIN,
    },
    contactBackTop: { alignItems: 'center' as const },
    contactBackLogo: {
        fontSize: 26,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center' as const,
        letterSpacing: 1,
    },
    contactBackTagline: {
        fontSize: 9,
        color: '#c7f0dc',
        textAlign: 'center' as const,
        marginTop: 10,
        letterSpacing: 1.4,
        textTransform: 'uppercase' as const,
    },
    contactBackMiddle: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingVertical: 20,
    },
    contactBackHeadline: {
        fontSize: 30,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center' as const,
        lineHeight: 1.2,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.6,
        paddingHorizontal: 12,
    },
    contactBackBottom: { alignItems: 'center' as const, paddingBottom: 4 },
    contactBackLine: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 500,
        color: COLORS.white,
        textAlign: 'center' as const,
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    contactBackLineMuted: {
        fontSize: 10,
        color: '#d1fae5',
        textAlign: 'center' as const,
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    contactBackNote: {
        fontSize: 7,
        color: '#a7c4b8',
        textAlign: 'center' as const,
        lineHeight: 1.45,
        marginTop: 14,
        paddingHorizontal: 24,
    },
    contactPage: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: MARGIN,
        paddingTop: HEADER_BLOCK + 8,
        paddingBottom: FOOTER_BLOCK + 16,
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
    contactRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center', paddingVertical: 3, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f4f6f8' },
    contactLabel: { fontSize: 8.5, color: COLORS.textSubtle, textTransform: 'uppercase', width: 68, letterSpacing: 0.5, marginRight: 10 },
    contactValue: { fontSize: 10.5, fontFamily: 'Roboto', fontWeight: '500', color: COLORS.text, flex: 1, lineHeight: 1.35 },
    contactValueNoWrap: { fontSize: 10.5, fontFamily: 'Roboto', fontWeight: '500', color: COLORS.text, flex: 1 },
    contextGrid: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
    contextLeftCol: { width: '54%', paddingRight: 14 },
    contextRightCol: { flex: 1, minWidth: 0 },
    compactBrandCard: {
        ...PDF_BORDER_GREY_1,
        marginBottom: 10,
        padding: 10,
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
        ...PDF_BORDER_MINT_1,
        marginBottom: 10,
        padding: 10,
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

function renderChevronBullet(
    key: string,
    textStyle: Record<string, unknown>,
    text: string,
    rowMarginBottom = 4,
    chevronStyle?: typeof styles.specChevron
) {
    return React.createElement(
        View,
        { key, style: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: rowMarginBottom } },
        React.createElement(Text, { style: chevronStyle || styles.specChevron }, '›'),
        React.createElement(Text, { style: textStyle as never }, text)
    );
}

type SectionTitleVariant = 'pill' | 'leftRule';

function renderAccentSectionTitle(
    key: string,
    title: string,
    spacing?: { marginTop?: number; marginBottom?: number },
    variant: SectionTitleVariant = 'pill'
) {
    if (variant === 'leftRule') {
        return React.createElement(
            View,
            {
                key,
                style: {
                    marginBottom: spacing?.marginBottom ?? 6,
                    marginTop: spacing?.marginTop ?? 2,
                    borderLeftWidth: 2,
                    borderLeftStyle: 'solid',
                    borderLeftColor: PDF_SECTION_ACCENT,
                    paddingLeft: 8,
                },
            },
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
    return React.createElement(
        View,
        {
            key,
            style: {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing?.marginBottom ?? 6,
                marginTop: spacing?.marginTop ?? 2,
            },
        },
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

function renderCompanyCommitment(key: string, label: string, body: string) {
    return React.createElement(
        Text,
        { key, style: styles.companyCommitmentParagraph },
        React.createElement(Text, { style: styles.companyCommitmentLabel }, `${label}: `),
        body
    );
}

// Helpers
const ProductImage = ({
    url,
    fallback,
    catalog,
    hero,
    detail,
    immersive,
    moodboard,
    deepDiveFeature,
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
    immersive?: boolean;
    moodboard?: boolean;
    deepDiveFeature?: boolean;
    catalogStack?: boolean;
    compact?: boolean;
    galleryThumb?: boolean;
    stripThumb?: boolean;
}) => {
    if (!url) {
        const h = stripThumb
            ? 56
            : galleryThumb
              ? 80
              : compact
                ? 72
                : immersive
                  ? 456
                  : deepDiveFeature
                    ? 250
                    : moodboard
                      ? 180
                      : hero
                        ? 410
                        : detail
                          ? 160
                          : catalog || catalogStack
                            ? 200
                            : 220;
        return React.createElement(View, { style: { ...styles.placeholderBox, height: h, marginVertical: catalog || hero || detail || immersive || moodboard || deepDiveFeature || catalogStack || galleryThumb || stripThumb ? 0 : 14 } },
            React.createElement(Text, { style: styles.placeholderText }, `[FĂRĂ IMAGINE: ${fallback || 'Echipament'}]`)
        );
    }
    const absolute = resolvePublicUrl(url);
    const wSrv = hero || immersive ? 1400 : deepDiveFeature || moodboard ? 1200 : 800;
    const safeJpgUrl = `https://wsrv.nl/?url=${encodeURIComponent(absolute.replace(/^https?:\/\//, ''))}&output=jpg&w=${wSrv}`;
    const imgStyle = stripThumb
        ? { width: '100%', height: 56, objectFit: 'contain' as const }
        : galleryThumb
          ? { width: '100%', height: 80, objectFit: 'contain' as const }
          : compact
            ? { width: '100%', height: 72, objectFit: 'contain' as const, marginTop: 4 }
            : immersive
              ? { width: '100%', height: '100%', objectFit: 'cover' as const }
              : deepDiveFeature
                ? { width: '100%', height: 250, objectFit: 'cover' as const }
                : moodboard
                  ? { width: '100%', height: 180, objectFit: 'cover' as const }
                  : hero
                    ? { width: '100%', height: 410, objectFit: 'contain' as const }
                    : detail
                      ? { width: '100%', height: 160, objectFit: 'contain' as const }
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
    const blocks = detailedSpecBlocks(product, 12);
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
    parts.push(renderAccentSectionTitle('utt', 'Specificații tehnice', undefined, 'leftRule'));
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
export function loadCatalogLogoDataUri(): string | undefined {
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

/** Una sau două linii de titlu foarte mare (ex. MULTISEM / ADS), fără duplicarea mărcii în stânga */
function getProductHeroGiantLines(product: DynamicProduct): string[] {
    if (product.slug === 'multisem-ads') {
        return ['MULTISEM', 'ADS'];
    }
    const brand = (product.brand || '').trim();
    let rest = (product.name || 'UTILAJ').trim();
    if (brand && rest.toLowerCase().startsWith(`${brand.toLowerCase()} `)) {
        rest = rest.slice(brand.length).trim();
    }
    const parts = rest.split(/\s+/).filter(Boolean);
    if (parts.length >= 3) {
        const mid = Math.ceil(parts.length / 2);
        return [parts.slice(0, mid).join(' ').toUpperCase(), parts.slice(mid).join(' ').toUpperCase()];
    }
    if (parts.length === 2) {
        return [parts[0].toUpperCase(), parts[1].toUpperCase()];
    }
    return [rest.toUpperCase()];
}

function getProfessionalProductLead(product: DynamicProduct): string {
    if (product.slug === 'multisem-ads') {
        return 'Avers-Agro Multisem ADS este o semănătoare proiectată pentru lucrări conservative, cu utilizare posibilă în semănat direct, mini-till sau convențional, în funcție de configurația echipată. Ansamblul de brăzdare cu dublu disc, presiunea ridicată pe brăzdar și suspensia paralelogram urmăresc pătrunderea constantă în rest vegetal și menținerea unei adâncimi de semănat stabile.';
    }
    return product.longDescription || product.description || 'Prezentare tehnică în curs de actualizare.';
}

function getProfessionalIntroBullets(product: DynamicProduct): string[] {
    if (product.slug === 'multisem-ads') {
        return [
            'Configurația se alege în funcție de lățimea de lucru, numărul de rânduri, puterea tractorului și nivelul de rest vegetal din câmp.',
            'Stabilitatea la adâncime, copierea terenului și contactul sămânță-sol sunt criteriile principale urmărite în exploatare.',
            'Parametrii de lucru, echiparea și eligibilitatea pentru scheme de sprijin se confirmă separat, pe modelul ofertat.',
        ];
    }
    return [
        'Configurația finală se stabilește în raport cu lățimea de lucru, puterea tractorului și condițiile de exploatare.',
        'Datele tehnice complete, opționalele și cerințele de utilizare se validează pe modelul ofertat.',
    ];
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

const renderPageFooter = (pageNumber: number, phone?: string, opts?: { bandBackgroundColor?: string }) => (
    React.createElement(
        View,
        {
            style: {
                ...styles.footerBand,
                ...(opts?.bandBackgroundColor ? { backgroundColor: opts.bandBackgroundColor } : {}),
            },
            fixed: true,
        },
        React.createElement(Text, { style: styles.footerBandPage }, `Pag. ${pageNumber}`),
        React.createElement(Text, { style: styles.footerBandContact, wrap: false }, formatPhoneForPdf(phone || DEFAULT_PHONE))
    )
);

/** Copertă broșură: panou verde stânga + zonă albă dreapta (aceeași schemă ca la catalogul multi-produs). */
function renderStandardBrochureCoverPage(opts: {
    coverTitle: string;
    subtitle?: string;
    slogan?: string;
    /** Linie sub marcă pe panoul stânga (implicit: catalog multi-produs). Pentru prezentare un singur produs, text pentru client. */
    leftEditionLine?: string;
    /** Subtitlu dreapta dacă lipsesc subtitle + slogan explicite */
    defaultSubtitle?: string;
    defaultSlogan?: string;
}): React.ReactElement {
    const leftLine = opts.leftEditionLine?.trim() || 'Document comercial · selecție';
    const sub =
        (opts.subtitle && String(opts.subtitle).trim()) ||
        (opts.defaultSubtitle?.trim() || 'Mecanizare agricolă · România');
    const slo =
        opts.slogan?.trim() ||
        opts.defaultSlogan?.trim() ||
        'Selecție tehnică pe baza documentației producătorilor incluși. Parametrii se validează la ofertare.';
    return React.createElement(
        Page,
        { size: 'A4', style: styles.page, key: 'brochure-standard-cover' },
        React.createElement(
            View,
            { style: { flex: 1, flexDirection: 'column' } },
            React.createElement(
                View,
                { style: { flex: 1, flexDirection: 'row', minHeight: 0 } },
                React.createElement(
                    View,
                    { style: { ...styles.coverLeftPanel, justifyContent: 'space-between' } },
                    React.createElement(
                        View,
                        { style: styles.coverBrandBlock },
                        React.createElement(Text, { style: styles.coverBrandName }, 'TehnicAgro Supply'),
                        React.createElement(
                            Text,
                            { style: styles.coverBrandTag },
                            'Utilaje agricole · selecție tehnică · România'
                        ),
                        React.createElement(View, { style: styles.coverRule }),
                        React.createElement(Text, { style: styles.coverEdition }, leftLine)
                    ),
                    React.createElement(Text, { style: styles.coverWebHint }, PUBLIC_WEB)
                ),
                React.createElement(
                    View,
                    { style: styles.coverRightPanel },
                    React.createElement(Text, { style: styles.coverTitle }, opts.coverTitle),
                    React.createElement(Text, { style: styles.coverSubtitle }, sub),
                    React.createElement(Text, { style: styles.coverSlogan }, slo)
                )
            ),
            React.createElement(
                View,
                { style: styles.coverFooterBar },
                React.createElement(
                    Text,
                    { style: styles.coverFooterBarText },
                    'Mecanizare responsabilă · selecție tehnică pentru ferme din România'
                )
            )
        )
    );
}

function renderDeepDiveZigzagBlock(
    product: DynamicProduct,
    block: ProductFeatureBlock,
    globalIdx: number,
    pSlug: string
): React.ReactElement {
    const fallback = block.title || product.name || 'Secțiune';
    const imageCol = React.createElement(
        View,
        { style: { width: '50%', paddingLeft: 0, paddingRight: 0 } },
        React.createElement(
            View,
            { style: { width: '100%', minHeight: 250 } },
            React.createElement(ProductImage, { url: block.image?.trim(), fallback, deepDiveFeature: true })
        )
    );
    const textCol = React.createElement(
        View,
        { style: { width: '50%', padding: 30, justifyContent: 'flex-start' as const } },
        React.createElement(Text, { style: styles.deepDiveFeatureTitle }, (block.title || '—').trim() || '—'),
        React.createElement(Text, { style: styles.deepDiveFeatureBody }, (block.description || '').trim())
    );
    const rowStyle = { flexDirection: 'row' as const, width: '100%', marginBottom: 28, alignItems: 'stretch' as const };
    if (globalIdx % 2 === 0) {
        return React.createElement(View, { key: `zz-${pSlug}-${globalIdx}`, style: rowStyle }, imageCol, textCol);
    }
    return React.createElement(View, { key: `zz-${pSlug}-${globalIdx}`, style: rowStyle }, textCol, imageCol);
}

/** Prezentare PDF un singur produs: copertă verde/albă (fără jargon intern); hero; zig-zag; copertă spate. */
export function buildSingleProductDeepDivePDF(
    config: { phone?: string; email?: string; title?: string; subtitle?: string; logoDataUri?: string },
    product: DynamicProduct,
    categoriesFromDb: Category[]
): React.ReactElement<DocumentProps> {
    let currentPage = 1;
    const pSlug = product.slug || 'product';
    const catName = product.category || '';
    const secTitle = categoryDisplayName(catName, categoriesFromDb);
    const brandLine = (product?.brand || '').trim();
    const coverTitle = (product.name || 'Utilaj').trim();
    const clientSubtitle =
        (config.subtitle && String(config.subtitle).trim()) ||
        [brandLine, secTitle].filter(Boolean).join(' · ');
    const coverPage = renderStandardBrochureCoverPage({
        coverTitle,
        subtitle: clientSubtitle,
        leftEditionLine: 'Performanță de excepție · recomandare tehnică',
        slogan:
            'Un utilaj ales pentru rezultate concrete în câmp — fiabilitate, precizie și eficiență pentru ferma dumneavoastră.',
    });
    const descText = getProfessionalProductLead(product);
    const giantLines = getProductHeroGiantLines(product);
    const overviewEyebrowText = (() => {
        const b = (product?.brand || '').trim();
        const c = (secTitle || '').trim();
        if (b && c) return `${b} • ${c}`;
        return b || c;
    })();

    const blocks = (product.featureBlocks || []).filter((b) => {
        if (!b) return false;
        const img = String(b.image || '').trim();
        const t = String(b.title || '').trim();
        const d = String(b.description || '').trim();
        return Boolean(img || t || d);
    });

    const overviewPage = React.createElement(
        Page,
        { size: 'A4', style: styles.page, key: `sd-overview-${pSlug}` },
        renderPageHeader(secTitle.toUpperCase()),
        React.createElement(
            View,
            { style: styles.productPageRelativeWrap },
            React.createElement(
                View,
                { style: styles.productOverviewShell },
                React.createElement(
                    View,
                    { style: styles.productOverviewTop },
                    product?.badge &&
                        React.createElement(
                            View,
                            { style: styles.badgeRow },
                            React.createElement(
                                View,
                                { style: styles.badge },
                                React.createElement(Text, { style: styles.badgeText }, product.badge)
                            )
                        ),
                    React.createElement(
                        View,
                        { style: styles.productOverviewHeroRow },
                        React.createElement(
                            View,
                            { style: styles.productOverviewTitleCol },
                            ...(overviewEyebrowText
                                ? [
                                      React.createElement(
                                          Text,
                                          { key: `sd-eyebrow-${pSlug}`, style: styles.productOverviewEyebrow },
                                          overviewEyebrowText
                                      ),
                                  ]
                                : []),
                            ...giantLines.map((line, li) =>
                                React.createElement(Text, { key: `sd-g-${pSlug}-${li}`, style: styles.productOverviewGiant }, line)
                            )
                        ),
                        React.createElement(
                            View,
                            { style: styles.productOverviewPrincipleCol },
                            React.createElement(Text, { style: styles.productOverviewPrincipleTitle }, 'PRINCIPIU'),
                            React.createElement(
                                View,
                                { style: styles.productOverviewPrincipleRow },
                                React.createElement(Text, { style: styles.productOverviewPrincipleChevron }, '›'),
                                React.createElement(Text, { style: styles.productOverviewPrincipleBody }, descText)
                            )
                        )
                    )
                )
            ),
            React.createElement(
                View,
                { style: styles.productOverviewImageAbsolute },
                React.createElement(ProductImage, { url: product?.imageSrc, fallback: product?.name, immersive: true })
            )
        ),
        renderPageFooter((currentPage += 1), config.phone)
    );

    const zigzagPages: React.ReactElement[] = [];
    for (let i = 0; i < blocks.length; i += 2) {
        const pair = [blocks[i], blocks[i + 1]].filter(Boolean) as ProductFeatureBlock[];
        zigzagPages.push(
            React.createElement(
                Page,
                { size: 'A4', style: styles.page, key: `sd-zz-${pSlug}-${i}` },
                renderPageHeader(secTitle.toUpperCase()),
                React.createElement(
                    View,
                    { style: styles.deepDiveZigzagPageInner },
                    ...pair.map((block, localJ) => renderDeepDiveZigzagBlock(product, block, i + localJ, pSlug))
                ),
                renderPageFooter((currentPage += 1), config.phone)
            )
        );
    }

    const contactPage = React.createElement(
        Page,
        { size: 'A4', style: { ...styles.page, backgroundColor: BACK_COVER_SOLID }, key: `sd-contact-${pSlug}` },
        React.createElement(
            View,
            { style: styles.contactBackOuter },
            React.createElement(
                View,
                { style: styles.contactBackTop },
                React.createElement(Text, { style: styles.contactBackLogo }, 'TehnicAgro Supply'),
                React.createElement(Text, { style: styles.contactBackTagline }, 'Selecție tehnică · mecanizare agricolă · România')
            ),
            React.createElement(
                View,
                { style: styles.contactBackMiddle },
                React.createElement(Text, { style: styles.contactBackHeadline }, 'PREGĂTIȚI PENTRU CAMPANIA URMĂTOARE.')
            ),
            React.createElement(
                View,
                { style: styles.contactBackBottom },
                React.createElement(Text, { style: styles.contactBackLine }, formatPhoneForPdf(config.phone || DEFAULT_PHONE)),
                React.createElement(Text, { style: styles.contactBackLine }, (config.email && String(config.email).trim()) || DEFAULT_EMAIL),
                React.createElement(Text, { style: styles.contactBackLineMuted }, PUBLIC_WEB),
                React.createElement(Text, { style: styles.contactBackNote }, PDF_DOCUMENTATION_NOTE)
            )
        ),
        renderPageFooter((currentPage += 1), config.phone, { bandBackgroundColor: BACK_COVER_SOLID })
    );

    const docTitle = `${coverTitle} · TehnicAgro Supply`;
    return React.createElement(Document, { title: docTitle }, coverPage, overviewPage, ...zigzagPages, contactPage);
}

function buildPDF(config: any, products: DynamicProduct[], categoriesFromDb: Category[]): React.ReactElement<DocumentProps> {
    const productsToDisplay = products || [];
    const logoSrc = pdfCatalogLogoSrc(config);
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
                            'Selecție tehnică pe baza documentației producătorilor incluși. Parametrii se validează la ofertare.'
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

        // PAGINA 2: PROFIL COMPANIE (tipografie uniformă, aliniere stânga, spațieri fixe)
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PROFIL COMPANIE'),
            React.createElement(View, { style: styles.companyPageInner },
                React.createElement(View, { style: styles.companyHeaderBlock },
                    React.createElement(Text, { style: styles.companyEyebrow }, 'TehnicAgro Supply'),
                    React.createElement(Text, { style: styles.companyDocTitle }, PDF_COMPANY.title)
                ),
                React.createElement(Text, { style: styles.companyLead }, PDF_COMPANY.lead),
                renderAccentSectionTitle('commitment', PDF_COMPANY.commitmentTitle, { marginTop: 6, marginBottom: 5 }),
                ...PDF_COMPANY.commitments.map((c, i) => renderCompanyCommitment(`cmp-c-${i}`, c.label, c.text)),
                React.createElement(Text, { style: { ...styles.companyBody, marginTop: 4 } }, PDF_COMPANY.visionParagraph),
                renderAccentSectionTitle('ferma', PDF_COMPANY.finalSectionTitle, { marginTop: 8, marginBottom: 5 }),
                ...PDF_COMPANY.bullets.map((b, i) =>
                    renderChevronBullet(`cmp-b-${i}`, styles.companyBulletText as Record<string, unknown>, b, 3, styles.companyListChevron)
                )
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),

        // GENERARE DINAMICĂ: DOAR PRODUSELE (fără pagini separate de categorie/program ca să evităm broșuri prea lungi)
        ...categories.flatMap(catName => {
            const catProducts = byCategory[catName];

            // 2. Produse: paginare controlată, simetrică
            const productPages = catProducts.flatMap((product, idx) => {
                const progList = (product?.category && (FUNDING_PROGRAMS as any)[product.category]) || [];
                const activePrograms = Array.isArray(progList) ? progList.filter((p: any) => p.status === 'active').slice(0, 1) : [];

                const descText = getProfessionalProductLead(product);
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

                const introBullets = getProfessionalIntroBullets(product);
                const giantLines = getProductHeroGiantLines(product);
                const overviewEyebrowText = (() => {
                    const b = (product?.brand || '').trim();
                    const c = (secTitle || '').trim();
                    if (b && c) return `${b} • ${c}`;
                    return b || c;
                })();

                // ═══ PAGINA 1 PRODUS: stil PA 5000 — text sus (stânga titlu masiv + dreapta Principiu), imagine full-bleed jos ═══
                const overviewPage = React.createElement(Page, { size: 'A4', style: styles.page, key: `p-overview-${pSlug}` },
                    renderPageHeader(secTitle.toUpperCase()),
                    React.createElement(
                        View,
                        { style: styles.productPageRelativeWrap },
                        React.createElement(
                            View,
                            { style: styles.productOverviewShell },
                            React.createElement(
                                View,
                                { style: styles.productOverviewTop },
                                product?.badge &&
                                    React.createElement(View, { style: styles.badgeRow },
                                        React.createElement(View, { style: styles.badge },
                                            React.createElement(Text, { style: styles.badgeText }, product.badge)
                                        )
                                    ),
                                React.createElement(
                                    View,
                                    { style: styles.productOverviewHeroRow },
                                    React.createElement(
                                        View,
                                        { style: styles.productOverviewTitleCol },
                                        ...(overviewEyebrowText
                                            ? [
                                                  React.createElement(
                                                      Text,
                                                      { key: `eyebrow-${pSlug}`, style: styles.productOverviewEyebrow },
                                                      overviewEyebrowText
                                                  ),
                                              ]
                                            : []),
                                        ...giantLines.map((line, li) =>
                                            React.createElement(Text, { key: `g-${pSlug}-${li}`, style: styles.productOverviewGiant }, line)
                                        )
                                    ),
                                    React.createElement(
                                        View,
                                        { style: styles.productOverviewPrincipleCol },
                                        React.createElement(Text, { style: styles.productOverviewPrincipleTitle }, 'PRINCIPIU'),
                                        React.createElement(
                                            View,
                                            { style: styles.productOverviewPrincipleRow },
                                            React.createElement(Text, { style: styles.productOverviewPrincipleChevron }, '›'),
                                            React.createElement(Text, { style: styles.productOverviewPrincipleBody }, descText)
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            View,
                            { style: styles.productOverviewImageAbsolute },
                            React.createElement(ProductImage, { url: product?.imageSrc, fallback: product?.name, immersive: true })
                        )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                );

                // ═══ PAGINA 2 PRODUS: DETALII ═══
                // Grid: stânga imagini, dreapta prezentare + specs; jos verdict + finanțare
                const detailGallery = (
                    extraGallery.length >= 2
                        ? extraGallery.slice(0, 2)
                        : extraGallery.length === 1
                          ? [extraGallery[0], product?.imageSrc].filter(Boolean)
                          : [product?.imageSrc, product?.imageSrc].filter(Boolean)
                ) as string[];
                const detailPage = React.createElement(Page, { size: 'A4', style: styles.page, key: `p-detail-${pSlug}` },
                    renderPageHeader(secTitle.toUpperCase()),
                    React.createElement(View, { style: styles.productDetailPage },
                        React.createElement(View, { style: { ...styles.productDetailGrid, flex: 1 } },
                            React.createElement(
                                View,
                                { style: styles.productMoodboardStack },
                                ...detailGallery.map((u, gi) =>
                                    React.createElement(
                                        View,
                                        { key: `detail-${pSlug}-${gi}`, style: styles.productMoodboardCell },
                                        React.createElement(ProductImage, { url: u, fallback: product?.name, moodboard: true })
                                    )
                                ),
                            ),
                            React.createElement(View, { style: styles.productRightCol },
                                renderAccentSectionTitle(`desc-${pSlug}`, 'Prezentare tehnică', undefined, 'leftRule'),
                                React.createElement(Text, { style: styles.productSheetBody }, descText),
                                ...introBullets.slice(0, 2).map((line, bi) =>
                                    renderChevronBullet(`intro-${pSlug}-${bi}`, styles.productIntroBullets as Record<string, unknown>, line)
                                ),
                                renderUnifiedTechnicalSpecs(product),
                                ...renderProductMetaOnly(product)
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

        // PAGINA FINALĂ: copertă spate full-bleed (fără antet alb tip document)
        ...((): React.ReactElement[] => {
            return [
                React.createElement(
                    Page,
                    { size: 'A4', style: { ...styles.page, backgroundColor: BACK_COVER_SOLID }, key: 'contact-final' },
                    React.createElement(
                        View,
                        { style: styles.contactBackOuter },
                        React.createElement(
                            View,
                            { style: styles.contactBackTop },
                            React.createElement(Text, { style: styles.contactBackLogo }, 'TehnicAgro Supply'),
                            React.createElement(Text, { style: styles.contactBackTagline }, 'Selecție tehnică · mecanizare agricolă · România')
                        ),
                        React.createElement(
                            View,
                            { style: styles.contactBackMiddle },
                            React.createElement(Text, { style: styles.contactBackHeadline }, 'PREGĂTIȚI PENTRU CAMPANIA URMĂTOARE.')
                        ),
                        React.createElement(
                            View,
                            { style: styles.contactBackBottom },
                            React.createElement(Text, { style: styles.contactBackLine }, formatPhoneForPdf(config.phone || DEFAULT_PHONE)),
                            React.createElement(Text, { style: styles.contactBackLine }, (config.email && String(config.email).trim()) || DEFAULT_EMAIL),
                            React.createElement(Text, { style: styles.contactBackLineMuted }, PUBLIC_WEB),
                            React.createElement(Text, { style: styles.contactBackNote }, PDF_DOCUMENTATION_NOTE)
                        )
                    ),
                    renderPageFooter(currentPage += 1, config.phone, { bandBackgroundColor: BACK_COVER_SOLID })
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

        const uniqueSuffix = Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
        const id = `brochure-${uniqueSuffix}`;
        const publicUrl = await uploadToSupabase(buffer, `materiale/${id}.pdf`, 'application/pdf');

        const data: Brochure = {
            id,
            title: config?.title || 'Broșură TehnicAgro',
            subtitle: config?.subtitle,
            publicUrl,
            createdAt: new Date().toISOString(),
            productSlugs: selected.map((p: DynamicProduct) => p.slug),
            config: config || {},
        };
        await saveBrochure(data);

        return NextResponse.json({ success: true, brochure: { ...data, downloadUrl: publicUrl } });
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
        return NextResponse.json(
            { brochures: list },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                },
            }
        );
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
