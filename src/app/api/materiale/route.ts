import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getProducts, saveBrochure, getBrochures, Brochure, DynamicProduct } from '@/lib/products-store';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, DocumentProps, Image, Font } from '@react-pdf/renderer';
import { FUNDING_PROGRAMS } from '@/data/funding-programs';
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

// PROFESSIONAL DTP COLOR PALETTE
const COLORS = {
    primary: '#064e3b', // Deep Emerald
    secondary: '#166534', 
    accent: '#10b981', 
    text: '#18181b', 
    textMuted: '#52525b', 
    bgLight: '#f8fafc', 
    white: '#ffffff',
    border: '#e4e4e7',
    gold: '#b45309',
};

// Same asset as layout.tsx icons — avoids broken v3 URL after graphic deploys
const LOGO_URL = resolvePublicUrl('/logos/tehnicagro_logo_v1_1769155922952.png');

// DTP Layout Constants
const MARGIN = 50; 
const LINE_HEIGHT = 1.6;

// PDF Styles
const styles = StyleSheet.create({
    page: { backgroundColor: COLORS.white, padding: 0, fontFamily: 'Roboto' },
    cover: { flex: 1, backgroundColor: COLORS.primary, padding: 0 },
    coverHero: { height: '50%', backgroundColor: '#022c22', justifyContent: 'center', alignItems: 'center' },
    coverContent: { padding: MARGIN, flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    coverTitle: { fontSize: 34, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.white, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 },
    coverSubtitle: { fontSize: 14, color: '#a7f3d0', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' },
    coverSlogan: { fontSize: 11, color: COLORS.white, opacity: 0.8, lineHeight: 1.5, paddingHorizontal: 40 },
    coverFooter: { position: 'absolute', bottom: 40, right: 50, textAlign: 'right' },
    coverFooterLink: { fontSize: 9, color: COLORS.white, opacity: 0.6, letterSpacing: 1 },
    header: { position: 'absolute', top: 30, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 10, alignItems: 'center' },
    headerLogo: { width: 80, objectFit: 'contain' },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'Roboto', fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, alignItems: 'center' },
    footerPage: { fontSize: 8, color: COLORS.textMuted, letterSpacing: 1 },
    footerContact: { fontSize: 8, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold' },
    sectionTitle: { fontSize: 24, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 25, letterSpacing: -0.5 },
    mainText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 15, textAlign: 'justify' },
    bulletText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 8, marginLeft: 15 },
    introHighlight: { fontSize: 13, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 500, lineHeight: 1.5, marginBottom: 20 },
    categoryHero: { backgroundColor: COLORS.primary, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 60 },
    categoryTitle: { fontSize: 40, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 20 },
    categoryDesc: { fontSize: 12, color: '#a7f3d0', textAlign: 'center', lineHeight: 1.6, paddingHorizontal: 40 },
    productLayout: { paddingTop: MARGIN + 40, paddingRight: MARGIN, paddingBottom: 80, paddingLeft: MARGIN, flex: 1 },
    badge: { position: 'absolute', top: MARGIN + 10, left: -10, backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 2 },
    badgeText: { fontSize: 8, color: COLORS.white, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
    brandLabel: { fontSize: 10, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
    modelTitle: { fontSize: 28, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 20, letterSpacing: -1 },
    blockTitle: { fontSize: 10, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 6, marginTop: 25 },
    specItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
    specDot: { width: 5, height: 5, backgroundColor: COLORS.primary, borderRadius: 2.5, marginRight: 10 },
    specText: { fontSize: 10, color: COLORS.textMuted, flex: 1, lineHeight: 1.4 },
    fundingBox: { backgroundColor: '#f0fdf4', padding: 20, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: COLORS.accent, marginTop: 25 },
    fundingTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: '#065f46', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    fundingText: { fontSize: 10, color: '#065f46', lineHeight: 1.4 },
    verdictBox: { backgroundColor: '#fffbeb', padding: 20, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: '#f59e0b', marginTop: 20 },
    verdictTitle: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', color: '#92400e', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    verdictText: { fontSize: 10, color: '#92400e', lineHeight: 1.5, fontStyle: 'italic' },
    placeholderBox: { width: '100%', backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 20, padding: 20 },
    placeholderText: { fontSize: 9, color: '#64748b', textAlign: 'center' },
    contactPage: { flex: 1, backgroundColor: COLORS.white, padding: MARGIN, justifyContent: 'center' },
    contactTitle: { fontSize: 36, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 40, letterSpacing: -1 },
    contactRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'center', gap: 15 },
    contactLabel: { fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', width: 70, letterSpacing: 1 },
    contactValue: { fontSize: 16, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text },
    ctaButton: { marginTop: 60, paddingVertical: 20, paddingHorizontal: 40, backgroundColor: COLORS.primary, borderRadius: 6, alignItems: 'center', alignSelf: 'center' },
    ctaText: { color: COLORS.white, fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' },
});

// Helpers
const ProductImage = ({ url, fallback }: { url?: string; fallback?: string }) => {
    if (!url) {
        return React.createElement(View, { style: { ...styles.placeholderBox, height: 260 } },
            React.createElement(Text, { style: styles.placeholderText }, `[FĂRĂ IMAGINE: ${fallback || 'Echipament'}]`)
        );
    }
    // react-pdf (v4.3+) does not support WebP. Vercel Blob returns .webp from Catalog.
    // We use wsrv.nl proxy to transcode to PDF-safe .jpg — requires absolute host (not /products/... alone).
    const absolute = resolvePublicUrl(url);
    const safeJpgUrl = `https://wsrv.nl/?url=${encodeURIComponent(absolute.replace(/^https?:\/\//, ''))}&output=jpg&w=800`;
    
    return React.createElement(Image, { 
        src: safeJpgUrl,
        style: { width: '100%', height: 260, objectFit: 'contain', marginVertical: 20 } 
    });
};

const renderPageHeader = (title: string) => (
    React.createElement(View, { style: styles.header, fixed: true },
        React.createElement(Image, { src: LOGO_URL, style: styles.headerLogo }),
        React.createElement(Text, { style: styles.headerTitle }, title || '')
    )
);

const renderPageFooter = (pageNumber: number, phone?: string) => (
    React.createElement(View, { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerPage }, `DOC: v3.1 Pro | Pagină ${pageNumber}`),
        React.createElement(Text, { style: styles.footerContact }, `Suport Tehnic: ${phone || '+40 723 380 022'}`)
    )
);

function buildPDF(config: any, products: DynamicProduct[]): React.ReactElement<DocumentProps> {
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
                React.createElement(View, { style: { ...styles.coverHero, backgroundColor: '#064e3b' } },
                    React.createElement(Image, { src: LOGO_URL, style: { width: 250, marginBottom: 40 } })
                ),
                React.createElement(View, { style: styles.coverContent },
                    React.createElement(Text, { style: styles.coverTitle }, 'CATALOG ECHIPAMENTE'),
                    React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'SOLUȚII AGRICOLE DE PRECIZIE 2026'),
                    React.createElement(Text, { style: styles.coverSlogan }, 'Investiția în tehnologie este singura garanție a profitabilității durabile. TehnicAgro Supply vă oferă acces la elita ingineriei europene.'),
                ),
                React.createElement(View, { style: styles.coverFooter },
                    React.createElement(Text, { style: styles.coverFooterLink }, `EDIȚIE CATALOG PRO | WWW.TEHNICAGRO.RO`)
                )
            )
        ),

        // PAGINA 2: PROFIL COMPANIE (Magazine Style)
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PROFILUL COMPANIEI'),
            React.createElement(View, { style: { paddingVertical: 60, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(Text, { style: styles.sectionTitle }, 'Partenerul de Încredere al Fermierului Român'),
                React.createElement(Text, { style: styles.introHighlight }, 'TehnicAgro Supply s-a născut dintr-o nevoie reală: aceea de a oferi fermierilor români nu doar utilaje, ci soluții integrate care să maximizeze randamentul la hectar.'),
                
                React.createElement(Text, { style: styles.mainText }, 'Într-o piață în continuă schimbare, succesul unei exploatații agricole depinde de rapiditatea intervenției și de fiabilitatea echipamentului. De aceea, la TehnicAgro, nu facem compromisuri. Selectăm fiecare brand din portofoliu pe baza unor criterii riguroase de anduranță și eficiență energetică.'),
                
                React.createElement(Text, { style: styles.mainText }, 'Ce ne diferențiază?'),
                React.createElement(Text, { style: styles.bulletText }, '• Consultanță Specializată: Inginerii noștri merg în câmp pentru a configura utilajul optim solului dumneavoastră.'),
                React.createElement(Text, { style: styles.bulletText }, '• Suport pentru Finanțare: Vă asistăm în întocmirea dosarelor pentru fonduri AFIR și programe APIA.'),
                React.createElement(Text, { style: styles.bulletText }, '• Service Rapid: Înțelegem că fiecare oră de staționar în plin sezon înseamnă pierderi. Echipa noastră este gata de intervenție 24/7.'),
                
                React.createElement(Text, { style: styles.mainText }, '\nVă invităm să descoperiți în paginile următoare rezultatul anilor noștri de cercetare și parteneriat cu liderii mondiali în agricultură.')
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),

        // PAGINA 3: PARTENERII NOȘTRI (Brands)
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('BRANDURI DE ELITĂ'),
            React.createElement(View, { style: { paddingVertical: 60, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(Text, { style: styles.sectionTitle }, 'Tehnologie Globală, Suport Local'),
                
                React.createElement(View, { style: { marginBottom: 30 } },
                    React.createElement(Text, { style: { ...styles.brandLabel, color: COLORS.gold } }, 'FLIEGL AGRARTECHNIK'),
                    React.createElement(Text, { style: styles.mainText }, 'Excelență germană în sisteme de transport și logistică agricolă. Inovația "Push-Off" a revoluționat modul în care se manipulează recolta, oferind o capacitate de descărcare cu 60% mai rapidă.')
                ),
                
                React.createElement(View, { style: { marginBottom: 30 } },
                    React.createElement(Text, { style: { ...styles.brandLabel, color: COLORS.gold } }, 'AVERS-AGRO'),
                    React.createElement(Text, { style: styles.mainText }, 'Lider în echipamente pentru pregătirea solului și tehnologii No-Till/Strip-Till. Utilajele lor sunt proiectate să lucreze în condiții extreme, minimizând evaporarea apei din sol.')
                ),

                React.createElement(View, { style: { marginBottom: 30 } },
                    React.createElement(Text, { style: { ...styles.brandLabel, color: COLORS.gold } }, 'K-FACTOR ENGINEERING'),
                    React.createElement(Text, { style: styles.mainText }, 'Specialiști în sisteme de booster și fertilizare de precizie. Tehnologia lor permite o distribuție uniformă a nutrienților, reducând risipa de îngrășăminte cu până la 15%.')
                )
            ),
            renderPageFooter(currentPage += 1, config.phone)
        ),

        // GENERARE DINAMICĂ: CATEGORII + PRODUSE
        ...categories.flatMap(catName => {
            const catProducts = byCategory[catName];
            
            // 1. Pagina de INTRO pentru Categorie
            const introPage = React.createElement(Page, { size: 'A4', style: styles.page, key: `intro-${catName}` },
                React.createElement(View, { style: styles.categoryHero },
                    React.createElement(Text, { style: styles.categoryTitle }, catName),
                    React.createElement(Text, { style: styles.categoryDesc }, `Sisteme profesionale de ${catName.toLowerCase()} adaptate pentru performanță maximă în orice tip de exploatație.`)
                ),
                renderPageFooter(currentPage += 1, config.phone)
            );

            // 2. Produsele din acea categorie
            const productPages = catProducts.map((product, idx) => {
                const progList = (product?.category && (FUNDING_PROGRAMS as any)[product.category]) || [];
                const activePrograms = Array.isArray(progList) ? progList.filter((p: any) => p.status === 'active').slice(0, 1) : [];

                return React.createElement(Page, { size: 'A4', style: styles.page, key: product?.slug || `p-${catName}-${idx}` },
                    renderPageHeader(catName.toUpperCase()),
                    React.createElement(View, { style: styles.productLayout },
                        product?.badge && React.createElement(View, { style: styles.badge },
                            React.createElement(Text, { style: styles.badgeText }, product.badge)
                        ),
                        React.createElement(Text, { style: styles.brandLabel }, product?.brand || 'TEHNICAGRO'),
                        React.createElement(Text, { style: styles.modelTitle }, product?.name || 'Utilaj Agricol'),
                        React.createElement(ProductImage, { url: product?.imageSrc, fallback: product?.name }),
                        React.createElement(Text, { style: styles.mainText }, product?.longDescription || product?.description || 'Descriere în curs de actualizare.'),
                        
                        React.createElement(View, { style: { flex: 1 } },
                            React.createElement(Text, { style: styles.blockTitle }, 'Specificații Tehnice'),
                            Array.isArray(product?.specs) && product.specs.length > 0 ? 
                                product.specs.slice(0, 8).map((spec, i) =>
                                    React.createElement(View, { key: i, style: styles.specItem },
                                        React.createElement(View, { style: styles.specDot }),
                                        React.createElement(Text, { style: styles.specText }, spec || '')
                                    )
                                ) : 
                                React.createElement(Text, { style: { ...styles.specText, fontStyle: 'italic' } }, 'Vă rugăm să contactați departamentul tehnic pentru tabelul complet de specificații.')
                        ),

                        product?.expertVerdict && React.createElement(View, { style: styles.verdictBox },
                            React.createElement(Text, { style: styles.verdictTitle }, 'Verdictul Expertului Tehnic'),
                            React.createElement(Text, { style: styles.verdictText }, product.expertVerdict)
                        ),

                        activePrograms.length > 0 && React.createElement(View, { style: styles.fundingBox },
                            React.createElement(Text, { style: styles.fundingTitle }, 'FINANȚARE ELIGIBILĂ'),
                            React.createElement(Text, { style: styles.fundingText }, `${activePrograms[0].title || ''} — Procent subvenționabil de până la 65% prin ${activePrograms[0].maxGrant || 'fonduri europene'}.`)
                        )
                    ),
                    renderPageFooter(currentPage += 1, config.phone)
                );
            });

            return [introPage, ...productPages];
        }),

        // PAGINA FINALĂ: CONTACT
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('REȚEAUA TEHNICAGRO'),
            React.createElement(View, { style: styles.contactPage },
                React.createElement(Image, { src: LOGO_URL, style: { width: 150, alignSelf: 'center', marginBottom: 40 } }),
                React.createElement(Text, { style: styles.contactTitle }, 'Soluții la un Telefon Distanță'),
                React.createElement(View, { style: { alignSelf: 'center', marginTop: 20 } },
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(Text, { style: styles.contactLabel }, 'Mobil:'),
                        React.createElement(Text, { style: styles.contactValue }, config.phone || '+40 723 380 022')
                    ),
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(Text, { style: styles.contactLabel }, 'E-mail:'),
                        React.createElement(Text, { style: styles.contactValue }, config.email || 'office@tehnicagrosupply.ro')
                    ),
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(Text, { style: styles.contactLabel }, 'Adresă:'),
                        React.createElement(Text, { style: styles.contactValue }, 'Centrul Logistic TehnicAgro, România')
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

        // Products
        const all = await getProducts();
        const selected = (productSlugs || []).map((s: string) => all.find(p => p.slug === s)).filter(Boolean) as DynamicProduct[];
        if (selected.length === 0) return NextResponse.json({ error: 'Selectează produse valide' }, { status: 400 });

        // PDF Generation
        console.log(`[Materiale] Generating brochure with ${selected.length} products...`);
        const doc = buildPDF(config || {}, selected);
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
