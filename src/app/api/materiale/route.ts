import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getProducts, getCategories, saveBrochure, getBrochures, Brochure, DynamicProduct, Category } from '@/lib/products-store';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, DocumentProps, Image, Font } from '@react-pdf/renderer';
import { FUNDING_PROGRAMS } from '@/data/funding-programs';
import { CATEGORIES as CATEGORY_LABELS } from '@/data/products';
import { PDF_COMPANY, PDF_BRANDS_INTRO, getCategoryPdfCopy } from '@/data/pdf-materiale-copy';
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
    primary: '#2D5A27',
    primaryDark: '#1f3f1c',
    secondary: '#3d6b38',
    accent: '#4a8f43',
    brandGrey: '#9EA1A2',
    text: '#18181b',
    textMuted: '#52525b',
    bgLight: '#f8fafc',
    white: '#ffffff',
    border: '#e4e4e7',
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
    cover: { flex: 1, backgroundColor: COLORS.primary, padding: 0 },
    coverHero: { height: '46%', backgroundColor: COLORS.primaryDark, justifyContent: 'center', alignItems: 'center', paddingHorizontal: MARGIN },
    coverBrandBlock: { alignItems: 'center' },
    coverBrandName: { fontSize: 26, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
    coverBrandTag: { fontSize: 11, color: '#c8e6c9', marginTop: 8, letterSpacing: 0.5 },
    coverRule: { width: 120, height: 2, backgroundColor: '#c8e6c9', marginTop: 16, opacity: 0.7 },
    coverContent: { padding: MARGIN, flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    coverTitle: { fontSize: 30, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14, textAlign: 'center', maxWidth: '100%' },
    coverSubtitle: { fontSize: 13, color: '#a7f3d0', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase', textAlign: 'center', paddingHorizontal: 16 },
    coverSlogan: { fontSize: 11, color: COLORS.white, opacity: 0.85, lineHeight: 1.55, paddingHorizontal: 36, textAlign: 'center' },
    coverFooter: { position: 'absolute', bottom: 36, left: MARGIN, right: MARGIN, textAlign: 'center' },
    coverFooterLink: { fontSize: 9, color: COLORS.white, opacity: 0.65, letterSpacing: 0.5 },
    header: { position: 'absolute', top: 28, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 8, minHeight: 44 },
    headerWordmark: { justifyContent: 'center' },
    headerBrandName: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 0.5 },
    headerBrandTag: { fontSize: 7, color: COLORS.brandGrey, marginTop: 2, letterSpacing: 0.3 },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Roboto', fontWeight: 'bold', flex: 1, flexShrink: 1, marginLeft: 14, textAlign: 'right', maxWidth: 280 },
    footer: { position: 'absolute', bottom: 28, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, minHeight: 36 },
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
    badge: { alignSelf: 'flex-start', backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 2 },
    catalogRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
    catalogImageCol: { width: '40%', padding: 8, marginRight: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, backgroundColor: '#fafafa' },
    catalogTextCol: { width: '54%', flexGrow: 1 },
    catalogDesc: { fontSize: 9, color: COLORS.textMuted, lineHeight: 1.45, marginBottom: 10, textAlign: 'left' },
    catalogSpecsWrap: { marginTop: 4 },
    productMetaStrip: { fontSize: 8.5, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 8, lineHeight: 1.35 },
    specDetailBlock: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
    specDetailGroup: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 4, marginTop: 6 },
    specDetailLine: { fontSize: 7.5, color: COLORS.textMuted, lineHeight: 1.35, marginBottom: 2 },
    badgeText: { fontSize: 8, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
    brandLabel: { fontSize: 9, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
    modelTitle: { fontSize: 17, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 8, letterSpacing: -0.3, maxWidth: '100%' },
    blockTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 4, marginTop: 10 },
    specItem: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
    specDot: { width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 2.5, marginRight: 10 },
    specText: { fontSize: 8.5, color: COLORS.textMuted, flex: 1, lineHeight: 1.35 },
    fundingBox: { backgroundColor: '#f0fdf4', padding: 14, borderRadius: 4, borderLeftWidth: 4, borderLeftColor: COLORS.accent, marginTop: 12 },
    fundingTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: '#065f46', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    fundingText: { fontSize: 10, color: '#065f46', lineHeight: 1.4 },
    verdictBox: { backgroundColor: '#fffbeb', padding: 14, borderRadius: 4, borderLeftWidth: 4, borderLeftColor: '#f59e0b', marginTop: 12 },
    verdictTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    verdictText: { fontSize: 9, color: '#92400e', lineHeight: 1.45, fontStyle: 'italic' },
    placeholderBox: { width: '100%', backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 20, padding: 20 },
    placeholderText: { fontSize: 9, color: '#64748b', textAlign: 'center' },
    contactPage: { flex: 1, backgroundColor: COLORS.white, padding: MARGIN, paddingTop: HEADER_BLOCK + 4, paddingBottom: FOOTER_BLOCK + 8, justifyContent: 'center' },
    contactTitle: { fontSize: 26, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 28, letterSpacing: -0.5, paddingHorizontal: 12 },
    contactWordmark: { alignSelf: 'center', alignItems: 'center', marginBottom: 20 },
    contactBrandName: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 0.3 },
    contactBrandTag: { fontSize: 9, color: COLORS.brandGrey, marginTop: 4 },
    contactRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'center' },
    contactLabel: { fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', width: 76, letterSpacing: 0.5, marginRight: 14 },
    contactValue: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, flex: 1, lineHeight: 1.35 },
    contactValueNoWrap: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, flex: 1 },
    ctaButton: { marginTop: 60, paddingVertical: 20, paddingHorizontal: 40, backgroundColor: COLORS.primary, borderRadius: 6, alignItems: 'center', alignSelf: 'center' },
    ctaText: { color: COLORS.white, fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' },
});

// Helpers
const ProductImage = ({ url, fallback, catalog }: { url?: string; fallback?: string; catalog?: boolean }) => {
    if (!url) {
        const h = catalog ? 200 : 220;
        return React.createElement(View, { style: { ...styles.placeholderBox, height: h, marginVertical: catalog ? 0 : 14 } },
            React.createElement(Text, { style: styles.placeholderText }, `[FĂRĂ IMAGINE: ${fallback || 'Echipament'}]`)
        );
    }
    const absolute = resolvePublicUrl(url);
    const safeJpgUrl = `https://wsrv.nl/?url=${encodeURIComponent(absolute.replace(/^https?:\/\//, ''))}&output=jpg&w=800`;
    const imgStyle = catalog
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

function detailedSpecBlocks(product: DynamicProduct, maxLines: number): { group: string; lines: string[] }[] {
    const ds = product.detailedSpecs;
    if (!ds || typeof ds !== 'object') return [];
    const blocks: { group: string; lines: string[] }[] = [];
    let count = 0;
    for (const [group, kv] of Object.entries(ds as Record<string, Record<string, string>>)) {
        if (count >= maxLines) break;
        if (!kv || typeof kv !== 'object') continue;
        const lines: string[] = [];
        for (const [k, v] of Object.entries(kv)) {
            if (count >= maxLines) break;
            if (v == null || String(v).trim() === '') continue;
            lines.push(`${k}: ${String(v).trim()}`);
            count += 1;
        }
        if (lines.length > 0) blocks.push({ group, lines });
    }
    return blocks;
}

function renderProductExtraBlocks(product: DynamicProduct): React.ReactElement[] {
    const out: React.ReactElement[] = [];
    const parts: string[] = [];
    if (product.priceRange) parts.push(`Indicativ: ${product.priceRange}`);
    if (product.eligibility) parts.push(`Eligibilitate (informare): ${product.eligibility}`);
    if (parts.length > 0) {
        out.push(React.createElement(Text, { key: 'meta', style: styles.productMetaStrip, wrap: false }, parts.join(' · ')));
    }
    const dsBlocks = detailedSpecBlocks(product, 18);
    if (dsBlocks.length === 0) return out;
    const inner: React.ReactElement[] = [];
    inner.push(React.createElement(Text, { key: 'dt', style: styles.blockTitle }, 'Date extinse (producător)'));
    for (const block of dsBlocks) {
        inner.push(React.createElement(Text, { key: `G${block.group}`, style: styles.specDetailGroup }, block.group));
        for (let i = 0; i < block.lines.length; i++) {
            inner.push(React.createElement(Text, { key: `${block.group}L${i}`, style: styles.specDetailLine }, block.lines[i]));
        }
    }
    out.push(React.createElement(View, { key: 'det', style: styles.specDetailBlock, wrap: false }, ...inner));
    return out;
}

const renderPageHeader = (title: string) => (
    React.createElement(View, { style: styles.header, fixed: true },
        React.createElement(View, { style: styles.headerWordmark },
            React.createElement(Text, { style: styles.headerBrandName }, 'TehnicAgro Supply'),
            React.createElement(Text, { style: styles.headerBrandTag }, 'Utilaje agricole')
        ),
        React.createElement(Text, { style: styles.headerTitle }, title || '')
    )
);

const renderPageFooter = (pageNumber: number, phone?: string) => (
    React.createElement(View, { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerPage }, `Catalog TehnicAgro Supply · Pag. ${pageNumber}`),
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

    return React.createElement(Document, { title: config.title || 'Catalog TehnicAgro Supply v3.1 Pro' },
        // PAGINA 1: COPERTĂ PREMIUM
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.cover },
                React.createElement(View, { style: styles.coverHero },
                    React.createElement(View, { style: styles.coverBrandBlock },
                        React.createElement(Text, { style: styles.coverBrandName }, 'TehnicAgro Supply'),
                        React.createElement(Text, { style: styles.coverBrandTag }, 'Utilaje agricole · date tehnice · România'),
                        React.createElement(View, { style: styles.coverRule })
                    )
                ),
                React.createElement(View, { style: styles.coverContent },
                    React.createElement(Text, { style: styles.coverTitle }, 'CATALOG ECHIPAMENTE'),
                    React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'Mecanizare agricolă — selecție și documentație'),
                    React.createElement(Text, { style: styles.coverSlogan }, 'Acest document prezintă echipamente selectate din portofoliu, cu specificații preluate din catalogul nostru și de la producători. Pentru oferte și disponibilitate, folosiți datele de contact din ultima pagină.'),
                ),
                React.createElement(View, { style: styles.coverFooter },
                    React.createElement(Text, { style: styles.coverFooterLink }, `EDIȚIE CATALOG PRO · ${PUBLIC_WEB}`)
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

        // PAGINA 3: PRODUCĂTORI
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PRODUCĂTORI'),
            React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 48, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(Text, { style: styles.sectionTitle }, PDF_BRANDS_INTRO.title),
                React.createElement(Text, { style: styles.mainText }, PDF_BRANDS_INTRO.lead),
                React.createElement(View, { style: { marginBottom: 22 } },
                    React.createElement(Text, { style: { ...styles.brandLabel, color: COLORS.primary } }, 'Fliegl Agrartechnik'),
                    React.createElement(Text, { style: styles.mainText }, 'Producător cunoscut pentru remorci și soluții de transport în agricultură; ofertă variată pentru încărcare, transport și descărcare recoltă, în funcție de model și țară de destinație.')
                ),
                React.createElement(View, { style: { marginBottom: 22 } },
                    React.createElement(Text, { style: { ...styles.brandLabel, color: COLORS.primary } }, 'Avers-Agro'),
                    React.createElement(Text, { style: styles.mainText }, 'Echipamente pentru pregătirea solului și lucrări conservative (inclusiv no-till / strip-till, după tipul utilajului). Parametrii efectivi depind de model și de condițiile de lucru.')
                ),
                React.createElement(View, { style: { marginBottom: 22 } },
                    React.createElement(Text, { style: { ...styles.brandLabel, color: COLORS.primary } }, 'K-Factor Engineering'),
                    React.createElement(Text, { style: styles.mainText }, 'Sisteme pentru fertilizare și distribuție controlată; compatibilitatea cu tractorul și tipul de îngrășământ se verifică pe fișa tehnică a fiecărui ansamblu.')
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

            const introPage = React.createElement(Page, { size: 'A4', style: styles.page, key: `intro-${catName}` },
                renderPageHeader(displayCat.toUpperCase()),
                React.createElement(View, { style: { paddingTop: HEADER_BLOCK + 8, paddingBottom: 40, paddingHorizontal: MARGIN, flex: 1 } },
                    React.createElement(View, { style: styles.categoryIntroAccent }),
                    React.createElement(Text, { style: styles.categoryTitle }, displayCat),
                    ...introParagraphs.map((p, i) =>
                        React.createElement(Text, { key: `cp${i}`, style: styles.mainText }, p)
                    ),
                    React.createElement(Text, { style: styles.subsectionTitle }, 'Aspecte utile în această secțiune'),
                    ...copy.bullets.map((b, i) =>
                        React.createElement(Text, { key: `cb${i}`, style: styles.bulletText }, `• ${b}`)
                    )
                ),
                renderPageFooter(currentPage += 1, config.phone)
            );

            // 2. Produsele din acea categorie
            const productPages = catProducts.map((product, idx) => {
                const progList = (product?.category && (FUNDING_PROGRAMS as any)[product.category]) || [];
                const activePrograms = Array.isArray(progList) ? progList.filter((p: any) => p.status === 'active').slice(0, 1) : [];

                const descText = product?.longDescription || product?.description || 'Descriere în curs de actualizare.';
                const secTitle = categoryDisplayName(catName, categoriesFromDb);
                return React.createElement(Page, { size: 'A4', style: styles.page, key: product?.slug || `p-${catName}-${idx}` },
                    renderPageHeader(secTitle.toUpperCase()),
                    React.createElement(View, { style: styles.productLayout },
                        product?.badge && React.createElement(View, { style: styles.badgeRow },
                            React.createElement(View, { style: styles.badge },
                                React.createElement(Text, { style: styles.badgeText }, product.badge)
                            )
                        ),
                        React.createElement(View, { style: styles.catalogRow },
                            React.createElement(View, { style: styles.catalogImageCol },
                                React.createElement(ProductImage, { url: product?.imageSrc, fallback: product?.name, catalog: true })
                            ),
                            React.createElement(View, { style: styles.catalogTextCol },
                                React.createElement(Text, { style: styles.brandLabel }, product?.brand || 'TEHNICAGRO'),
                                React.createElement(Text, { style: styles.modelTitle }, product?.name || 'Utilaj Agricol'),
                                React.createElement(Text, { style: styles.catalogDesc }, descText),
                                React.createElement(View, { style: styles.catalogSpecsWrap },
                                    React.createElement(Text, { style: styles.blockTitle }, 'Specificații tehnice'),
                                    Array.isArray(product?.specs) && product.specs.length > 0
                                        ? product.specs.slice(0, 8).map((spec, i) =>
                                            React.createElement(View, { key: i, style: styles.specItem },
                                                React.createElement(View, { style: styles.specDot }),
                                                React.createElement(Text, { style: styles.specText }, spec || '')
                                            ))
                                        : React.createElement(Text, { style: { ...styles.specText, fontStyle: 'italic' } }, 'Contactați-ne pentru tabelul complet de specificații.')
                                ),
                                ...renderProductExtraBlocks(product)
                            )
                        ),

                        product?.expertVerdict && React.createElement(View, { style: styles.verdictBox, wrap: false, minPresenceAhead: 100 },
                            React.createElement(Text, { style: styles.verdictTitle }, 'Verdictul expertului tehnic'),
                            React.createElement(Text, { style: styles.verdictText }, product.expertVerdict)
                        ),

                        activePrograms.length > 0 && React.createElement(View, { style: styles.fundingBox, wrap: false, minPresenceAhead: 100 },
                            React.createElement(Text, { style: styles.fundingTitle }, 'Finanțare — informare generală'),
                            React.createElement(Text, { style: styles.fundingText }, `${activePrograms[0].title || ''} (${activePrograms[0].maxGrant || 'condiții în ghidul oficial'}). Text orientativ; eligibilitatea se stabilește doar după reglementările în vigoare și dosarul dumneavoastră — nu întocmim noi dosarul.`)
                        )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                );
            });

            return [introPage, ...productPages];
        }),

        // PAGINA FINALĂ: CONTACT
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('CONTACT'),
            React.createElement(View, { style: styles.contactPage },
                React.createElement(View, { style: styles.contactWordmark },
                    React.createElement(Text, { style: styles.contactBrandName }, 'TehnicAgro Supply'),
                    React.createElement(Text, { style: styles.contactBrandTag }, 'Utilaje agricole')
                ),
                React.createElement(Text, { style: styles.contactTitle }, 'Contact și oferte'),
                React.createElement(View, { style: { alignSelf: 'center', marginTop: 16, maxWidth: 420 } },
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
                React.createElement(View, { style: styles.ctaButton },
                    React.createElement(Text, { style: styles.ctaText }, 'SOLICITĂ OFERTĂ PERSONALIZATĂ')
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

        const [all, categories] = await Promise.all([getProducts(), getCategories()]);
        const selected = (productSlugs || []).map((s: string) => all.find(p => p.slug === s)).filter(Boolean) as DynamicProduct[];
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
            productSlugs: selected.map(p => p.slug), 
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
