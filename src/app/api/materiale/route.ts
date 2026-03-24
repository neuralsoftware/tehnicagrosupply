import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getProducts, saveBrochure, Brochure, DynamicProduct } from '@/lib/products-store';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, DocumentProps } from '@react-pdf/renderer';
import { FUNDING_PROGRAMS } from '@/data/funding-programs';
import React from 'react';

function isAuthenticated(request: Request): boolean {
    const auth = (request.headers.get('x-admin-auth') || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    return auth !== '' && auth === serverPass;
}

const COLORS = {
    green: { primary: '#16a34a', light: '#dcfce7', dark: '#14532d', muted: '#86efac' },
    dark: { primary: '#18181b', light: '#27272a', dark: '#09090b', muted: '#71717a' },
};

// PDF Styles
const makeStyles = (theme: 'green' | 'dark') => {
    const c = COLORS[theme];
    return StyleSheet.create({
        page: { backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff', padding: 0, fontFamily: 'Helvetica' },
        coverPage: { backgroundColor: c.primary, flex: 1, padding: 50, justifyContent: 'flex-end' },
        coverTitle: { fontSize: 42, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: -1, lineHeight: 1.1, marginBottom: 12 },
        coverSubtitle: { fontSize: 14, color: theme === 'dark' ? c.muted : '#bbf7d0', marginBottom: 40 },
        coverLogo: { fontSize: 11, color: '#ffffff', opacity: 0.7, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
        coverDivider: { height: 3, backgroundColor: '#ffffff', width: 60, marginBottom: 24, opacity: 0.3 },
        contentPage: { padding: 50, flex: 1, backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff' },
        sectionLabel: { fontSize: 9, color: c.primary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Helvetica-Bold' },
        productTitle: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: theme === 'dark' ? '#ffffff' : '#18181b', letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.2 },
        description: { fontSize: 10, color: theme === 'dark' ? '#a1a1aa' : '#52525b', lineHeight: 1.7, marginBottom: 16 },
        specRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: theme === 'dark' ? '#27272a' : '#f4f4f5', paddingBottom: 8 },
        specLabel: { fontSize: 8, color: theme === 'dark' ? '#71717a' : '#a1a1aa', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, width: 120 },
        specValue: { fontSize: 9, color: theme === 'dark' ? '#e4e4e7' : '#27272a', flex: 1, fontFamily: 'Helvetica-Bold' },
        badge: { backgroundColor: c.light, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 16 },
        badgeText: { fontSize: 8, color: c.primary, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
        fundingBox: { backgroundColor: theme === 'dark' ? '#052e16' : '#f0fdf4', padding: 14, borderRadius: 4, marginTop: 16, borderLeftWidth: 3, borderLeftColor: c.primary },
        fundingTitle: { fontSize: 8, color: c.primary, fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
        fundingItem: { fontSize: 9, color: theme === 'dark' ? '#86efac' : '#166534', marginBottom: 3 },
        productImage: { width: '100%', height: 220, objectFit: 'cover', marginBottom: 20, borderRadius: 4 },
        contactPage: { backgroundColor: c.primary, flex: 1, padding: 50, justifyContent: 'center', alignItems: 'center' },
        contactTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#ffffff', textAlign: 'center', marginBottom: 12 },
        contactText: { fontSize: 12, color: '#bbf7d0', textAlign: 'center', marginBottom: 6 },
        contactCta: { marginTop: 30, paddingHorizontal: 30, paddingVertical: 14, backgroundColor: '#ffffff', borderRadius: 4 },
        contactCtaText: { fontSize: 12, color: c.primary, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
        row: { flexDirection: 'row', gap: 16 },
        pageNumber: { position: 'absolute', bottom: 20, right: 40, fontSize: 8, color: theme === 'dark' ? '#3f3f46' : '#d4d4d8' },
    });
};

function buildPDF(config: Record<string, string>, products: DynamicProduct[]): React.ReactElement<DocumentProps> {
    const theme = (config.theme === 'dark' ? 'dark' : 'green') as 'green' | 'dark';
    const styles = makeStyles(theme);
    const c = COLORS[theme];

    return React.createElement(Document, { title: config.title },
        // Cover Page
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.coverPage },
                React.createElement(Text, { style: styles.coverLogo }, 'TehnicAgro Supply'),
                React.createElement(View, { style: styles.coverDivider }),
                React.createElement(Text, { style: styles.coverTitle }, config.title || 'Soluții Agricole'),
                React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'Utilaje agricole de înaltă performanță'),
                React.createElement(Text, { style: { fontSize: 9, color: '#ffffff', opacity: 0.5, marginTop: 20 } }, `tehnicagrosupply.ro  ·  ${config.phone || '+40 723 380 022'}  ·  ${new Date().getFullYear()}`),
            )
        ),
        // Intro Page
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: { ...styles.contentPage, justifyContent: 'center' } },
                React.createElement(Text, { style: { ...styles.sectionLabel, marginBottom: 20 } }, 'Despre TehnicAgro Supply'),
                React.createElement(Text, { style: styles.productTitle }, config.introTitle || 'Partenerul tău de încredere în agricultură'),
                React.createElement(Text, { style: { ...styles.description, fontSize: 12 } }, config.introText || 'TehnicAgro Supply este distribuitorul exclusiv de utilaje agricole premium în România, specializat în soluții conforme cu normele GAEC, eco-schemele APIA și programele AFIR. Oferim consultanță completă pentru accesarea finanțărilor europene.'),
                React.createElement(View, { style: { marginTop: 30, flexDirection: 'row', gap: 20 } },
                    ...[
                        { num: '10+', label: 'Ani Experiență' },
                        { num: '500+', label: 'Clienți Activi' },
                        { num: '98%', label: 'Satisfacție Clienți' },
                    ].map(stat => React.createElement(View, { key: stat.label, style: { flex: 1, backgroundColor: COLORS[theme].light, padding: 16, borderRadius: 4 } },
                        React.createElement(Text, { style: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: c.primary } }, stat.num),
                        React.createElement(Text, { style: { fontSize: 8, color: c.primary, letterSpacing: 1 } }, stat.label),
                    ))
                )
            ),
            React.createElement(Text, { style: styles.pageNumber }, '2')
        ),
        // Product Pages
        ...products.map((product, idx) => {
            const categoryPrograms = (FUNDING_PROGRAMS[product.category] || []).filter((p: any) => p.status === 'active').slice(0, 3);
            return React.createElement(Page, { size: 'A4', style: styles.page, key: product.slug },
                React.createElement(View, { style: styles.contentPage },
                    product.badge && React.createElement(View, { style: styles.badge },
                        React.createElement(Text, { style: styles.badgeText }, product.badge)
                    ),
                    React.createElement(Text, { style: styles.sectionLabel }, product.brand),
                    React.createElement(Text, { style: styles.productTitle }, product.name),
                    // Image placeholder if has valid imageSrc
                    product.imageSrc && product.imageSrc.startsWith('/') && React.createElement(View, { style: { height: 180, backgroundColor: theme === 'dark' ? '#27272a' : '#f4f4f5', borderRadius: 4, marginBottom: 16, justifyContent: 'center', alignItems: 'center' } },
                        React.createElement(Text, { style: { color: theme === 'dark' ? '#52525b' : '#d4d4d8', fontSize: 9 } }, product.imageSrc)
                    ),
                    React.createElement(Text, { style: styles.description }, product.longDescription || product.description),
                    // Specs
                    React.createElement(View, { style: { marginBottom: 16 } },
                        React.createElement(Text, { style: { ...styles.sectionLabel, marginBottom: 10 } }, 'Specificații Tehnice'),
                        ...(product.specs || []).slice(0, 5).map((spec: string, i: number) =>
                            React.createElement(View, { key: i, style: styles.specRow },
                                React.createElement(Text, { style: styles.specValue }, `• ${spec}`)
                            )
                        )
                    ),
                    // Funding
                    categoryPrograms.length > 0 && React.createElement(View, { style: styles.fundingBox },
                        React.createElement(Text, { style: styles.fundingTitle }, '📋 Programe Finanțare Eligibile'),
                        ...categoryPrograms.map((p: any) =>
                            React.createElement(Text, { key: p.code, style: styles.fundingItem }, `${p.code} — ${p.title} (max ${p.maxGrant})`)
                        )
                    )
                ),
                React.createElement(Text, { style: styles.pageNumber }, String(idx + 3))
            );
        }),
        // Contact Page
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.contactPage },
                React.createElement(Text, { style: styles.contactTitle }, 'Solicită o ofertă personalizată'),
                React.createElement(Text, { style: styles.contactText }, config.phone || '+40 723 380 022'),
                React.createElement(Text, { style: styles.contactText }, config.email || 'office@tehnicagrosupply.ro'),
                React.createElement(Text, { style: styles.contactText }, 'tehnicagrosupply.ro'),
                React.createElement(View, { style: styles.contactCta },
                    React.createElement(Text, { style: styles.contactCtaText }, 'CONTACTAȚI-NE ASTĂZI')
                )
            )
        )
    );
}

export async function POST(request: Request) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const { config, productSlugs } = body;

        // Fetch selected products
        const allProducts = await getProducts();
        const selectedProducts = productSlugs
            .map((slug: string) => allProducts.find(p => p.slug === slug))
            .filter(Boolean);

        if (selectedProducts.length === 0) {
            return NextResponse.json({ error: 'Niciun produs selectat valid' }, { status: 400 });
        }

        // Generate PDF
        const pdfElement = buildPDF(config, selectedProducts as DynamicProduct[]);
        const pdfBuffer = await renderToBuffer(pdfElement);

        // Upload to Vercel Blob
        const id = `brochure-${Date.now()}`;
        const fileName = `materiale/${id}.pdf`;
        const blob = await put(fileName, pdfBuffer, {
            access: 'public',
            contentType: 'application/pdf',
            addRandomSuffix: false,
        });

        // Save metadata
        const brochure: Brochure = {
            id,
            title: config.title || 'Broșură TehnicAgro',
            subtitle: config.subtitle,
            publicUrl: blob.url,
            createdAt: new Date().toISOString(),
            productSlugs,
            config,
        };
        await saveBrochure(brochure);

        return NextResponse.json({
            success: true,
            brochure: {
                ...brochure,
                downloadUrl: blob.url,
            }
        });
    } catch (error) {
        console.error('Brochure generation error:', error);
        return NextResponse.json({ error: 'Failed to generate brochure' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { getBrochures } = await import('@/lib/products-store');
        const brochures = await getBrochures();
        return NextResponse.json({ brochures });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch brochures' }, { status: 500 });
    }
}
