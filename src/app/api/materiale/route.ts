import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getProducts, saveBrochure, getBrochures, Brochure, DynamicProduct } from '@/lib/products-store';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, DocumentProps, Image, Font } from '@react-pdf/renderer';
import { FUNDING_PROGRAMS } from '@/data/funding-programs';
import React from 'react';

// REGISTER ROMANIAN FONT (ROBOTO)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf', fontWeight: 'medium' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf', fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf', fontStyle: 'italic', fontWeight: 'medium' }
  ]
});

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// PROFESSIONAL DTP COLOR PALETTE
const COLORS = {
    primary: '#064e3b', // Verde Închis (Deep Emerald)
    secondary: '#166534', // Verde Corporate
    accent: '#10b981', // Verde Accent
    text: '#18181b', // Zinc 900
    textMuted: '#52525b', // Zinc 600
    bgLight: '#f8fafc', // Slate 50
    white: '#ffffff',
    border: '#e4e4e7', // Zinc 200
};

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
    header: { position: 'absolute', top: 30, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 15, alignItems: 'center' },
    headerLogo: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.primary, letterSpacing: 2, textTransform: 'uppercase' },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 2 },
    footer: { position: 'absolute', bottom: 30, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
    footerPage: { fontSize: 8, color: COLORS.textMuted, letterSpacing: 1 },
    footerWeb: { fontSize: 8, color: COLORS.primary, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1 },
    sectionTitle: { fontSize: 24, fontFamily: 'Roboto', fontWeight: 'bold', color: COLORS.text, marginBottom: 25, letterSpacing: -0.5 },
    mainText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 15, textAlign: 'justify' },
    bulletText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 8, marginLeft: 15 },
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
    // We use wsrv.nl proxy to instantly transcode the blob image to a PDF-safe .jpg!
    const safeJpgUrl = `https://wsrv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}&output=jpg&w=800`;
    
    return React.createElement(Image, { 
        src: safeJpgUrl,
        style: { width: '100%', height: 260, objectFit: 'contain', marginVertical: 20 } 
    });
};

const renderPageHeader = (title: string) => (
    React.createElement(View, { style: styles.header, fixed: true },
        React.createElement(Text, { style: styles.headerLogo }, 'TEHNICAGRO SUPPLY'),
        React.createElement(Text, { style: styles.headerTitle }, title || '')
    )
);

const renderPageFooter = (pageNumber: number) => (
    React.createElement(View, { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerPage }, `Pagina ${pageNumber}`),
        React.createElement(Text, { style: styles.footerWeb }, 'tehnicagrosupply.ro')
    )
);

function buildPDF(config: any, products: DynamicProduct[]): React.ReactElement<DocumentProps> {
    const productsToDisplay = products || [];

    return React.createElement(Document, { title: config.title || 'Broșură TehnicAgro Supply' },
        // PAGINA 1: COPERTĂ
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.cover },
                React.createElement(View, { style: styles.coverHero }),
                React.createElement(View, { style: styles.coverContent },
                    React.createElement(Text, { style: styles.coverTitle }, 'TEHNICAGRO SUPPLY'),
                    React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'Echipamente Agricole Premium'),
                    React.createElement(Text, { style: styles.coverSlogan }, 'Inovăm procesele fermei tale. Livrăm performanța care îți garantează o prezență solidă pe piața agricolă europeană.'),
                ),
                React.createElement(View, { style: styles.coverFooter },
                    React.createElement(Text, { style: styles.coverFooterLink }, `tehnicagrosupply.ro | ${config.phone || '+40 723 380 022'}`)
                )
            )
        ),

        // PAGINA 2: DESPRE NOI (CATALOGUE INTRO)
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('PROFILUL COMPANIEI'),
            React.createElement(View, { style: { paddingVertical: 80, paddingHorizontal: MARGIN, flex: 1 } },
                React.createElement(Text, { style: styles.sectionTitle }, config.introTitle || 'Parteneriatul pentru Excelență în Agricultură'),
                
                // User text or rich default text
                config.introText 
                ? React.createElement(Text, { style: styles.mainText }, config.introText)
                : React.createElement(React.Fragment, null, 
                    React.createElement(Text, { style: styles.mainText }, 'TEHNICAGRO SUPPLY s-a format cu viziunea clară de a aduce pe piața agricolă din România cele mai robuste și inovatoare tehnologii disponibile. Nu suntem doar furnizori de utilaje, ci parteneri strategici dedicați creșterii sustenabile a fermei dumneavoastră.'),
                    React.createElement(Text, { style: styles.mainText }, 'Fiecare echipament pe care îl livrăm trece printr-un proces riguros de selecție asigurat de inginerii noștri. Ne concentrăm pe utilaje care demonstrează o eficiență sporită, un consum redus și un cost excelent pe ciclul de viață.'),
                    React.createElement(Text, { style: styles.mainText }, 'Abordarea noastră este completă și acoperă toate necesitățile fermei:'),
                    React.createElement(Text, { style: styles.bulletText }, '• Echipamente pretabile tuturor proceselor (pregătire sol, semănat, îngrijirea culturilor și recoltare).'),
                    React.createElement(Text, { style: styles.bulletText }, '• Consultanță directă în câmp pentru a identifica setarea optimă a fiecărui utilaj.'),
                    React.createElement(Text, { style: styles.bulletText }, '• Dosare de finanțare – asistență deplină pentru programele APIA și fondurile AFIR.'),
                    React.createElement(Text, { style: styles.mainText }, '\nÎn paginile următoare, vă prezentăm o selecție personalizată de mașini agricole, configurată special pentru cerințele tehnologice și bugetare ale exploatației dumneavoastră.')
                )
            ),
            renderPageFooter(2)
        ),

        // PAGINI PRODUSE
        ...productsToDisplay.map((product, idx) => {
            const pageNum = idx + 3;
            // Robust Funding Check
            const cat = product?.category || '';
            const progList = (cat && (FUNDING_PROGRAMS as any)[cat]) || [];
            const activePrograms = Array.isArray(progList) ? progList.filter(p => p.status === 'active').slice(0, 1) : [];

            return React.createElement(Page, { size: 'A4', style: styles.page, key: product?.slug || `p-${idx}` },
                renderPageHeader('PRODUSE'),
                React.createElement(View, { style: styles.productLayout },
                    product?.badge && React.createElement(View, { style: styles.badge },
                        React.createElement(Text, { style: styles.badgeText }, product.badge)
                    ),
                    React.createElement(Text, { style: styles.brandLabel }, product?.brand || 'TEHNICAGRO'),
                    React.createElement(Text, { style: styles.modelTitle }, product?.name || 'Utilaj Agricol'),
                    React.createElement(ProductImage, { url: product?.imageSrc, fallback: `${product?.name || ''} ${product?.brand || ''}`.trim() }),
                    React.createElement(Text, { style: styles.mainText }, product?.longDescription || product?.description || 'Descriere în curs de actualizare.'),
                    React.createElement(View, { style: { flex: 1 } },
                        React.createElement(Text, { style: styles.blockTitle }, 'SPECIFICAȚII TEHNICE'),
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
                        React.createElement(Text, { style: styles.fundingText }, `${activePrograms[0].title || ''} — ${activePrograms[0].maxGrant || ''}`)
                    )
                ),
                renderPageFooter(pageNum)
            );
        }),

        // PAGINA FINALĂ: CONTACT
        React.createElement(Page, { size: 'A4', style: styles.page },
            renderPageHeader('CONTACT'),
            React.createElement(View, { style: styles.contactPage },
                React.createElement(Text, { style: styles.contactTitle }, 'Suntem Aici Pentru Tine'),
                React.createElement(View, { style: { alignSelf: 'center', marginTop: 20 } },
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(Text, { style: styles.contactLabel }, 'Telefon:'),
                        React.createElement(Text, { style: styles.contactValue }, config.phone || '+40 723 380 022')
                    ),
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(Text, { style: styles.contactLabel }, 'E-mail:'),
                        React.createElement(Text, { style: styles.contactValue }, config.email || 'office@tehnicagrosupply.ro')
                    ),
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(Text, { style: styles.contactLabel }, 'Web:'),
                        React.createElement(Text, { style: styles.contactValue }, 'www.tehnicagrosupply.ro')
                    )
                ),
                React.createElement(View, { style: styles.ctaButton },
                    React.createElement(Text, { style: styles.ctaText }, 'CERE OFERTA PERSONALIZATĂ')
                )
            ),
            renderPageFooter(productsToDisplay.length + 3)
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
