import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import {
    getProducts,
    getCategories,
    saveBrochure,
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
    PDF_BRANDS_INTRO,
    PDF_DOCUMENTATION_NOTE,
    PDF_BRAND_CARDS,
    getCategoryPdfCopy,
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
    cover: { flex: 1, backgroundColor: COLORS.primaryDark, padding: 0 },
    coverHero: { height: '46%', backgroundColor: COLORS.primaryDark, justifyContent: 'center', alignItems: 'center', paddingHorizontal: MARGIN },
    coverBrandBlock: { alignItems: 'center' },
    coverBrandName: { fontSize: 26, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
    coverBrandTag: { fontSize: 10, color: '#bbf7d0', marginTop: 8, letterSpacing: 0.8, textTransform: 'uppercase' as const },
    coverEdition: { fontSize: 8, color: '#86efac', marginTop: 14, letterSpacing: 1.5, textTransform: 'uppercase' as const },
    coverRule: { width: 160, height: 2, backgroundColor: '#86efac', marginTop: 18, opacity: 0.95 },
    coverContent: { padding: MARGIN, flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    coverTitle: { fontSize: 30, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, textAlign: 'center', maxWidth: '100%' },
    coverSubtitle: { fontSize: 12, color: '#d1fae5', letterSpacing: 1.4, marginBottom: 14, textTransform: 'uppercase', textAlign: 'center', paddingHorizontal: 20, fontFamily: 'Roboto', fontWeight: 500 },
    coverSlogan: { fontSize: 10, color: COLORS.white, opacity: 0.88, lineHeight: 1.6, paddingHorizontal: 40, textAlign: 'center' },
    coverFooter: { position: 'absolute', bottom: 36, left: MARGIN, right: MARGIN, textAlign: 'center' },
    coverFooterLink: { fontSize: 9, color: COLORS.white, opacity: 0.65, letterSpacing: 0.5 },
    header: { position: 'absolute', top: 28, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#dcfce7', paddingBottom: 10, minHeight: 46 },
    headerWordmark: { justifyContent: 'center' },
    headerBrandName: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 0.5 },
    headerBrandTag: { fontSize: 7, color: COLORS.brandGrey, marginTop: 2, letterSpacing: 0.3 },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Roboto', fontWeight: 'bold', flex: 1, flexShrink: 1, marginLeft: 14, textAlign: 'right', maxWidth: 280 },
    footer: { position: 'absolute', bottom: 28, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, minHeight: 38 },
    footerPage: { fontSize: 8, color: COLORS.textMuted, letterSpacing: 1 },
    footerContact: { fontSize: 8, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold' },
    sectionTitle: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 22, letterSpacing: -0.3 },
    subsectionTitle: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, marginBottom: 10, marginTop: 6 },
    categoryIntroAccent: { height: 3, backgroundColor: COLORS.primary, marginBottom: 14, width: '100%' },
    mainText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 15, textAlign: 'justify' },
    bulletText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 8, marginLeft: 15 },
    introHighlight: { fontSize: 13, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 500, lineHeight: 1.5, marginBottom: 20 },
    categoryTitle: { fontSize: 20, color: COLORS.text, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: -0.2, marginBottom: 12 },
    productLayout: { paddingTop: HEADER_BLOCK + 10, paddingRight: MARGIN, paddingBottom: FOOTER_BLOCK + 28, paddingLeft: MARGIN },
    badgeRow: { marginBottom: 8 },
    badge: { alignSelf: 'flex-start', backgroundColor: COLORS.primaryDark, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 4 },
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
        marginTop: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f8fafc',
    },
    specLineDetailCompact: { fontSize: 7.5, color: COLORS.textMuted, lineHeight: 1.32, marginBottom: 2 },
    advantageBulletUnderlined: {
        fontSize: 10,
        color: COLORS.text,
        lineHeight: 1.45,
        marginBottom: 9,
        marginLeft: 10,
        textDecoration: 'underline',
        textDecorationColor: COLORS.primary,
        fontFamily: 'Roboto',
        fontWeight: 500,
    },
    productGalleryStrip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    productGalleryThumbCell: {
        width: '23%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 4,
        backgroundColor: COLORS.white,
        marginBottom: 6,
    },
    contactFooterBand: {
        marginTop: 28,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        alignItems: 'center' as const,
    },
    contactLogoImg: { width: 130, height: 40, objectFit: 'contain' as const, marginBottom: 12 },
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
        marginTop: 36,
        paddingTop: 22,
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
    catalogDesc: { fontSize: 10, color: COLORS.textMuted, lineHeight: 1.45, marginBottom: 6, textAlign: 'left' },
    pdfDisclaimer: {
        fontSize: 7.5,
        color: COLORS.textSubtle,
        fontStyle: 'italic',
        lineHeight: 1.4,
        marginBottom: 10,
        marginTop: 2,
    },
    catalogSpecsWrap: { marginTop: 6 },
    productMetaStrip: { fontSize: 8.5, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 8, lineHeight: 1.35 },
    specDetailBlock: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
    specDetailGroup: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 4, marginTop: 6 },
    specDetailLine: { fontSize: 7.5, color: COLORS.textMuted, lineHeight: 1.35, marginBottom: 2 },
    badgeText: { fontSize: 8, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
    brandLabel: { fontSize: 8.5, color: COLORS.secondary, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 5 },
    modelTitle: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 10, letterSpacing: -0.4, maxWidth: '100%' },
    blockTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 4, marginTop: 10 },
    specItem: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
    specDot: { width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 2.5, marginRight: 10 },
    specText: { fontSize: 8.5, color: COLORS.textMuted, flex: 1, lineHeight: 1.35 },
    fundingBox: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: COLORS.accent, marginTop: 10 },
    fundingTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: '#065f46', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    fundingText: { fontSize: 10, color: '#065f46', lineHeight: 1.4 },
    verdictBox: { backgroundColor: '#fffbeb', padding: 12, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: '#f59e0b', marginTop: 10 },
    verdictTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    verdictText: { fontSize: 9, color: '#92400e', lineHeight: 1.45, fontStyle: 'italic' },
    placeholderBox: { width: '100%', backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 20, padding: 20 },
    placeholderText: { fontSize: 9, color: '#64748b', textAlign: 'center' },
    contactPage: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: MARGIN,
        paddingTop: HEADER_BLOCK + 8,
        paddingBottom: FOOTER_BLOCK + 12,
        justifyContent: 'flex-start' as const,
        flexDirection: 'column' as const,
    },
    contactTitle: {
        fontSize: 22,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.3,
        paddingHorizontal: 12,
    },
    contactSubtitle: { fontSize: 9, color: COLORS.brandGrey, textAlign: 'center', marginBottom: 28, letterSpacing: 0.8 },
    contactWordmark: { alignSelf: 'center', alignItems: 'center', marginBottom: 12 },
    contactBrandName: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 0.3 },
    contactBrandTag: { fontSize: 9, color: COLORS.brandGrey, marginTop: 4 },
    contactBlock: { alignSelf: 'center', maxWidth: 440, width: '100%' },
    contactRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    contactLabel: { fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', width: 72, letterSpacing: 0.6, marginRight: 12 },
    contactValue: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, flex: 1, lineHeight: 1.35 },
    contactValueNoWrap: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, flex: 1 },
});

// Helpers
const ProductImage = ({
    url,
    fallback,
    catalog,
    compact,
    galleryThumb,
    stripThumb,
}: {
    url?: string;
    fallback?: string;
    catalog?: boolean;
    compact?: boolean;
    galleryThumb?: boolean;
    /** Miniaturi bandă sub fișa produsului */
    stripThumb?: boolean;
}) => {
    if (!url) {
        const h = stripThumb ? 56 : galleryThumb ? 80 : compact ? 72 : catalog ? 200 : 220;
        return React.createElement(View, { style: { ...styles.placeholderBox, height: h, marginVertical: catalog || galleryThumb || stripThumb ? 0 : 14 } },
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
            : catalog
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
    parts.push(
        React.createElement(Text, { key: 'utt', style: { ...styles.blockTitle, marginTop: 2, marginBottom: 6 } }, 'Specificații tehnice')
    );
    if (Array.isArray(product.specs) && product.specs.length > 0) {
        product.specs.forEach((spec, i) => {
            parts.push(
                React.createElement(View, { key: `sp-${i}`, style: styles.specItem },
                    React.createElement(View, { style: styles.specDot }),
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
            React.createElement(Text, { key: 'ph', style: { ...styles.specText, fontStyle: 'italic' } }, 'Date tehnice complete la cerere.')
        );
    }
    return React.createElement(View, { style: styles.unifiedSpecsBox }, ...parts);
}

function pdfCatalogLogoUrl(): string {
    const absolute = resolvePublicUrl('/logos/tehnicagro-supply-logo-catalog.png');
    return `https://wsrv.nl/?url=${encodeURIComponent(absolute.replace(/^https?:\/\//, ''))}&output=png&w=320`;
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
        // PAGINA 1: COPERTĂ PREMIUM
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.cover },
                React.createElement(View, { style: styles.coverHero },
                    React.createElement(View, { style: styles.coverBrandBlock },
                        React.createElement(Text, { style: styles.coverBrandName }, 'TehnicAgro Supply'),
                        React.createElement(Text, { style: styles.coverBrandTag }, 'Utilaje agricole · selecție tehnică · România'),
                        React.createElement(View, { style: styles.coverRule }),
                        React.createElement(Text, { style: styles.coverEdition }, 'Document comercial · 2026')
                    )
                ),
                React.createElement(View, { style: styles.coverContent },
                    React.createElement(Text, { style: styles.coverTitle }, 'CATALOG SELECȚIE'),
                    React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'Mecanizare agricolă — sinteză TehnicAgro Supply'),
                    React.createElement(Text, { style: styles.coverSlogan }, 'Conținut exclusiv TehnicAgro Supply: informații sintetizate și adaptate din documentația tehnică a echipamentelor comercializate. Acest document nu reprezintă site-uri oficiale ale producătorilor. Pentru oferte și disponibilitate, folosiți datele din ultima pagină.'),
                ),
                React.createElement(View, { style: styles.coverFooter },
                    React.createElement(Text, { style: styles.coverFooterLink }, `TEHNICAGRO SUPPLY · ${PUBLIC_WEB}`)
                )
            )
        ),

        // PAGINA 2: PROFIL COMPANIE
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PROFIL COMPANIE'),
            React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 48, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(Text, { style: styles.sectionTitle }, PDF_COMPANY.title),
                React.createElement(Text, { style: styles.introHighlight }, PDF_COMPANY.lead),
                React.createElement(Text, { style: styles.mainText }, PDF_COMPANY.p2),
                React.createElement(Text, { style: styles.mainText }, PDF_COMPANY.p3),
                React.createElement(Text, { style: styles.subsectionTitle }, 'Ce puteți aștepta de la noi'),
                ...PDF_COMPANY.bullets.map((b) =>
                    React.createElement(Text, { key: b, style: styles.bulletText }, `• ${b}`)
                ),
                React.createElement(Text, { style: styles.mainText }, PDF_COMPANY.closing)
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),

        // PAGINA 3–4: PRODUCĂTORI (două foi; nota „documentare” este pe ultima pagină)
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PRODUCĂTORI · I'),
            React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 40, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(Text, { style: styles.sectionTitle }, PDF_BRANDS_INTRO.title),
                React.createElement(Text, { style: styles.mainText }, PDF_BRANDS_INTRO.lead),
                ...PDF_BRAND_CARDS.slice(0, 2).map((card, ci) =>
                    React.createElement(View, { key: `brand-${ci}`, style: styles.brandPageCard },
                        React.createElement(Text, { style: styles.brandPageName }, card.name),
                        React.createElement(Text, { style: styles.brandPageTag }, card.tagline),
                        ...card.paragraphs.map((para, pi) =>
                            React.createElement(Text, { key: `bp-${ci}-${pi}`, style: styles.mainText }, para)
                        )
                    )
                )
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PRODUCĂTORI · II'),
            React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 40, paddingHorizontal: MARGIN, flex: 1 } },
                ...PDF_BRAND_CARDS.slice(2).map((card, ci) =>
                    React.createElement(View, { key: `brand-b-${ci}`, style: styles.brandPageCard },
                        React.createElement(Text, { style: styles.brandPageName }, card.name),
                        React.createElement(Text, { style: styles.brandPageTag }, card.tagline),
                        ...card.paragraphs.map((para, pi) =>
                            React.createElement(Text, { key: `bp2-${ci}-${pi}`, style: styles.mainText }, para)
                        )
                    )
                )
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),

        // GENERARE DINAMICĂ: CATEGORII + PRODUSE
        ...categories.flatMap(catName => {
            const catProducts = byCategory[catName];
            
            const catRecord = categoriesFromDb.find((c) => c.slug === catName);
            const copy = getCategoryPdfCopy(catName);
            const displayCat = categoryDisplayName(catName, categoriesFromDb);
            const introParagraphs = [
                ...(catRecord?.description?.trim() ? [catRecord.description.trim()] : []),
                ...copy.paragraphs,
            ];

            const subsectionBlocks = copy.subsections || [];

            const introPageMain = React.createElement(Page, { size: 'A4', style: styles.page, key: `intro-${catName}` },
                renderPageHeader(displayCat.toUpperCase()),
                React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 40, paddingHorizontal: MARGIN, flex: 1 } },
                    React.createElement(View, { style: styles.categoryIntroAccent }),
                    React.createElement(Text, { style: styles.categoryTitle }, displayCat),
                    ...introParagraphs.map((p, i) =>
                        React.createElement(Text, { key: `cp${i}`, style: styles.mainText }, p)
                    ),
                    ...(copy.advantageBullets && copy.advantageBullets.length > 0
                        ? [
                              React.createElement(Text, { key: 'adv-title', style: styles.subsectionTitle }, copy.advantagesSectionTitle || 'Avantaje tehnice'),
                              ...copy.advantageBullets.map((b, i) =>
                                  React.createElement(
                                      Text,
                                      { key: `adv-${i}`, style: styles.advantageBulletUnderlined },
                                      `• ${b}`
                                  )
                              ),
                          ]
                        : []),
                    React.createElement(Text, { style: styles.subsectionTitle }, 'Aspecte utile în această secțiune'),
                    ...copy.bullets.map((b, i) =>
                        React.createElement(Text, { key: `cb${i}`, style: styles.bulletText }, `• ${b}`)
                    )
                ),
                renderPageFooter(currentPage += 1, config.phone)
            );

            const introPagePrograms =
                subsectionBlocks.length > 0
                    ? React.createElement(Page, { size: 'A4', style: styles.page, key: `intro-prog-${catName}` },
                          renderPageHeader(`${displayCat.toUpperCase()} · CADRU`),
                          React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 40, paddingHorizontal: MARGIN, flex: 1 } },
                              React.createElement(Text, { style: styles.categoryTitle }, `${displayCat} — context programe`),
                              React.createElement(Text, { style: styles.mainText },
                                  'Rezumat informativ despre cadrul european și național care poate fi relevant pentru această categorie de utilaje și pentru practicile asociate. Nu înlocuiește ghidurile APIA / AFIR și nu constituie consultanță pentru depunerea cererii; verificați sursele oficiale pentru campania în curs.'
                              ),
                              ...subsectionBlocks.flatMap((sub, si) => [
                                  React.createElement(Text, { key: `sst-${si}`, style: styles.subsectionTitle }, sub.title),
                                  ...sub.paragraphs.map((p, pi) =>
                                      React.createElement(Text, { key: `ssp-${si}-${pi}`, style: styles.mainText }, p)
                                  ),
                                  ...(sub.bullets || []).map((b, bi) =>
                                      React.createElement(Text, { key: `ssb-${si}-${bi}`, style: styles.bulletText }, `• ${b}`)
                                  ),
                              ])
                          ),
                          renderPageFooter(currentPage += 1, config.phone)
                      )
                    : null;

            // 2. Produse: o singură fișă — specificații unificate, verdict și finanțare la final; bandă opțională de imagini fără titlu
            const productPages = catProducts.map((product, idx) => {
                const progList = (product?.category && (FUNDING_PROGRAMS as any)[product.category]) || [];
                const activePrograms = Array.isArray(progList) ? progList.filter((p: any) => p.status === 'active').slice(0, 1) : [];

                const descText = product?.longDescription || product?.description || 'Descriere în curs de actualizare.';
                const secTitle = categoryDisplayName(catName, categoriesFromDb);
                const extraGallery = (
                    Array.isArray(product.gallery)
                        ? product.gallery.filter((u) => u && u !== product.imageSrc).slice(0, 4)
                        : []
                ) as string[];
                const pSlug = product?.slug || `p-${catName}-${idx}`;

                return React.createElement(Page, { size: 'A4', style: styles.page, key: `p-${pSlug}` },
                    renderPageHeader(secTitle.toUpperCase()),
                    React.createElement(View, { style: styles.productLayout },
                        product?.badge &&
                            React.createElement(View, { style: styles.badgeRow },
                                React.createElement(View, { style: styles.badge },
                                    React.createElement(Text, { style: styles.badgeText }, product.badge)
                                )
                            ),
                        React.createElement(View, { style: styles.catalogRow },
                            React.createElement(View, { style: styles.catalogImageCol },
                                React.createElement(View, { style: styles.productMainImageBox },
                                    React.createElement(ProductImage, { url: product?.imageSrc, fallback: product?.name, catalog: true })
                                )
                            ),
                            React.createElement(View, { style: styles.catalogTextCol },
                                React.createElement(Text, { style: styles.brandLabel }, product?.brand || 'TEHNICAGRO'),
                                React.createElement(Text, { style: styles.modelTitle }, product?.name || 'Utilaj Agricol'),
                                React.createElement(Text, { style: styles.catalogDesc }, descText),
                                React.createElement(
                                    Text,
                                    { style: styles.pdfDisclaimer },
                                    'Informații sintetizate și prezentate de TehnicAgro Supply. Parametrii tehnici pot fi detaliați în oferta comercială.'
                                ),
                                renderUnifiedTechnicalSpecs(product),
                                ...renderProductMetaOnly(product),
                                product?.expertVerdict &&
                                    React.createElement(View, { style: styles.verdictBox },
                                        React.createElement(Text, { style: styles.verdictTitle }, 'Verdictul expertului tehnic'),
                                        React.createElement(Text, { style: styles.verdictText }, product.expertVerdict)
                                    ),
                                activePrograms.length > 0 &&
                                    React.createElement(View, { style: styles.fundingBox },
                                        React.createElement(Text, { style: styles.fundingTitle }, 'Finanțare — informare generală'),
                                        React.createElement(Text, { style: styles.fundingText }, `${activePrograms[0].title || ''} (${activePrograms[0].maxGrant || 'condiții în ghidul oficial'}). Text orientativ; eligibilitatea se stabilește doar după reglementările în vigoare și dosarul dumneavoastră — nu întocmim noi dosarul.`)
                                    )
                            )
                        ),
                        extraGallery.length > 0 &&
                            React.createElement(
                                View,
                                { style: styles.productGalleryStrip },
                                ...extraGallery.map((u, gi) =>
                                    React.createElement(
                                        View,
                                        { key: `gst-${pSlug}-${gi}`, style: styles.productGalleryThumbCell },
                                        React.createElement(ProductImage, { url: u, fallback: product?.name, stripThumb: true })
                                    )
                                )
                            )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                );
            });

            return [introPageMain, ...(introPagePrograms ? [introPagePrograms] : []), ...productPages];
        }),

        // PAGINA FINALĂ: CONTACT (fără „buton” — PDF tipărit, nu interfață web)
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('CONTACT'),
            React.createElement(View, { style: styles.contactPage },
                React.createElement(View, { style: styles.contactWordmark },
                    React.createElement(Text, { style: styles.contactBrandName }, 'TehnicAgro Supply'),
                    React.createElement(Text, { style: styles.contactBrandTag }, 'Selecție tehnică · materiale comerciale')
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
                    React.createElement(Image, { src: pdfCatalogLogoUrl(), style: styles.contactLogoImg }),
                    React.createElement(Text, { style: styles.contactDocNote }, PDF_DOCUMENTATION_NOTE)
                )
            ),
            renderPageFooter(currentPage += 1, config.phone)
        )
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
        const doc = buildPDF(config || {}, selected, categories);
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
