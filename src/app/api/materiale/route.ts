import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getProducts, saveBrochure, Brochure, DynamicProduct } from '@/lib/products-store';
import { renderToBuffer, Document, Page, Text, View, StyleSheet, DocumentProps } from '@react-pdf/renderer';
import { FUNDING_PROGRAMS } from '@/data/funding-programs';
import React from 'react';

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
const MARGIN = 50; // ~1.8cm
const LINE_HEIGHT = 1.6;

// PDF Styles (Professional Refinement)
const styles = StyleSheet.create({
    page: { backgroundColor: COLORS.white, padding: 0, fontFamily: 'Helvetica' },

    // Page 1: Cover
    cover: { flex: 1, backgroundColor: COLORS.primary, relative: true, padding: 0 },
    coverHero: { height: '60%', backgroundColor: '#022c22', justifyContent: 'center', alignItems: 'center' },
    coverContent: { padding: 50, flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    coverTitle: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: COLORS.white, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
    coverSubtitle: { fontSize: 16, color: '#a7f3d0', letterSpacing: 1, marginBottom: 8, fontWeight: 'medium' },
    coverSlogan: { fontSize: 11, color: COLORS.white, opacity: 0.8, fontStyle: 'italic' },
    coverFooter: { position: 'absolute', bottom: 40, right: 50, textAlign: 'right' },
    coverFooterLink: { fontSize: 9, color: COLORS.white, opacity: 0.6, letterSpacing: 1 },

    // Content Pages (Headers/Footers)
    header: { position: 'absolute', top: 30, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: COLORS.border, paddingBottom: 10, alignItems: 'center' },
    headerLogo: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.primary, letterSpacing: 2, textTransform: 'uppercase' },
    headerTitle: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
    footer: { position: 'absolute', bottom: 30, left: MARGIN, right: MARGIN, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingTop: 10 },
    footerPage: { fontSize: 8, color: COLORS.textMuted },
    footerWeb: { fontSize: 8, color: COLORS.primary, fontFamily: 'Helvetica-Bold' },

    // Page 2: About
    sectionTitle: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: COLORS.text, marginBottom: 20, letterSpacing: -0.5 },
    mainText: { fontSize: 11, color: COLORS.textMuted, lineHeight: LINE_HEIGHT, marginBottom: 40 },
    statsGrid: { flexDirection: 'row', gap: 20 },
    statBox: { flex: 1, backgroundColor: COLORS.bgLight, padding: 25, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    statNum: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: COLORS.primary, marginBottom: 4 },
    statLabel: { fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' },

    // Product Detail Pages
    productLayout: { padding: `${MARGIN + 40}pt ${MARGIN}pt 80pt ${MARGIN}pt`, flex: 1 },
    badge: { position: 'absolute', top: MARGIN + 10, left: -10, backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 2 },
    badgeText: { fontSize: 8, color: COLORS.white, fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' },
    brandLabel: { fontSize: 10, color: COLORS.primary, fontFamily: 'Helvetica-Bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 },
    modelTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: COLORS.text, marginBottom: 20, letterSpacing: -1 },

    // Spec & Funding Blocks
    blockTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 4 },
    specItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
    specDot: { width: 4, height: 4, backgroundColor: COLORS.primary, borderRadius: 2, marginRight: 8 },
    specText: { fontSize: 10, color: COLORS.textMuted, flex: 1 },

    fundingBox: { backgroundColor: '#f0fdf4', padding: 15, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: COLORS.accent, marginTop: 20 },
    fundingTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#065f46', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
    fundingText: { fontSize: 9, color: '#065f46', fontFamily: 'Helvetica-Bold' },

    // Image Placeholder
    placeholderBox: { width: '100%', backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginVertical: 20, padding: 20 },
    placeholderText: { fontSize: 8, color: '#64748b', textAlign: 'center', fontStyle: 'italic', maxWidth: '80%' },

    // Page 6: Contact
    contactPage: { flex: 1, backgroundColor: COLORS.white, padding: MARGIN, justifyContent: 'center' },
    contactTitle: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: COLORS.primary, textAlign: 'center', marginBottom: 40, letterSpacing: -1 },
    contactRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'center', gap: 12 },
    contactIcon: { width: 24, height: 24, backgroundColor: COLORS.bgLight, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    contactLabel: { fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', width: 60 },
    contactValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: COLORS.text },
    ctaButton: { marginTop: 50, padding: 20, backgroundColor: COLORS.primary, borderRadius: 4, alignItems: 'center' },
    ctaText: { color: COLORS.white, fontSize: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 2, textTransform: 'uppercase' },
});

// Helper component for Image Placeholder
const ImagePlaceholder = ({ description, height = 200 }: { description: string; height?: number }) => (
    React.createElement(View, { style: { ...styles.placeholderBox, height } },
        React.createElement(Text, { style: styles.placeholderText }, `[IMAGINE_PLACEHOLDER: ${description}]`)
    )
);

// Header & Footer Reusable
const PageLayout = ({ pageNumber, title }: { pageNumber: number; title: string }) => (
    React.createElement(React.Fragment, null,
        React.createElement(View, { style: styles.header, fixed: true },
            React.createElement(Text, { style: styles.headerLogo }, 'TEHNICAGRO SUPPLY'),
            React.createElement(Text, { style: styles.headerTitle }, title)
        ),
        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerPage }, `Pagina ${pageNumber}`),
            React.createElement(Text, { style: styles.footerWeb }, 'tehnicagrosupply.ro')
        )
    )
);

function buildPDF(config: Record<string, string>, products: DynamicProduct[]): React.ReactElement<DocumentProps> {
    const productsToDisplay = products.slice(0, 3); // Map to P3, P4, P5

    return React.createElement(Document, { title: config.title || 'Broșură TehnicAgro Supply' },
        // PAGINA 1: COPERTĂ
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.cover },
                React.createElement(View, { style: styles.coverHero },
                    React.createElement(ImagePlaceholder, { description: 'Imagine reprezentativă tractor/semănătoare No-Till la lucru pe câmp', height: 400 })
                ),
                React.createElement(View, { style: styles.coverContent },
                    React.createElement(Text, { style: styles.coverTitle }, 'TEHNICAGRO SUPPLY'),
                    React.createElement(Text, { style: styles.coverSubtitle }, config.subtitle || 'Echipamente pentru Ferma Viitorului'),
                    React.createElement(Text, { style: styles.coverSlogan }, 'Un mix de tehnologii pentru diversitate și performanță'),
                ),
                React.createElement(View, { style: styles.coverFooter },
                    React.createElement(Text, { style: styles.coverFooterLink }, `tehnicagrosupply.ro  |  ${config.phone || '+40 723 380 022'}  |  Ediția 2026`)
                )
            )
        ),

        // PAGINA 2: DESPRE NOI
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(PageLayout, { pageNumber: 2, title: 'DESPRE NOI' }),
            React.createElement(View, { style: { padding: `100pt ${MARGIN}pt`, flex: 1 } },
                React.createElement(Text, { style: { ...styles.headerLogo, marginBottom: 10 } }, 'PARTENERUL TĂU'),
                React.createElement(Text, { style: styles.sectionTitle }, 'Modernizare prin TehnicAgro Supply'),
                React.createElement(Text, { style: styles.mainText }, config.introText || 'Ferma modernă necesită versatilitate. Vă propunem un pachet mixt de utilaje care acoperă diversele nevoi ale exploatației dumneavoastră, asigurând o mecanizare eficientă și conformitate deplină cu standardele europene de mediu.'),

                React.createElement(View, { style: styles.statsGrid },
                    ...[
                        { num: '10+', label: 'Ani Experiență' },
                        { num: '500+', label: 'Clienți Activi' },
                        { num: '98%', label: 'Satisfacție Clienți' },
                    ].map(stat => React.createElement(View, { key: stat.label, style: styles.statBox },
                        React.createElement(Text, { style: styles.statNum }, stat.num),
                        React.createElement(Text, { style: styles.statLabel }, stat.label),
                    ))
                )
            )
        ),

        // PAGINA 3-5: PRODUSE
        ...productsToDisplay.map((product, idx) => {
            const pageNum = idx + 3;
            // Get category programs
            const categoryPrograms = (FUNDING_PROGRAMS[product.category] || []).filter((p: any) => p.status === 'active').slice(0, 1);

            return React.createElement(Page, { size: 'A4', style: styles.page, key: product.slug },
                React.createElement(PageLayout, { pageNumber: pageNum, title: 'PRODUSE' }),
                React.createElement(View, { style: styles.productLayout },
                    // Badge
                    product.badge && React.createElement(View, { style: styles.badge },
                        React.createElement(Text, { style: styles.badgeText }, product.badge)
                    ),

                    React.createElement(Text, { style: styles.brandLabel }, product.brand),
                    React.createElement(Text, { style: styles.modelTitle }, product.name),

                    React.createElement(ImagePlaceholder, { description: `Imagine detaliată ${product.name} ${product.brand}`, height: idx === 0 ? 240 : 200 }),

                    React.createElement(Text, { style: { ...styles.mainText, marginBottom: 25 } }, product.longDescription || product.description),

                    // Specs
                    React.createElement(View, { style: { flex: 1 } },
                        React.createElement(Text, { style: styles.blockTitle }, 'SPECIFICAȚII TEHNICE'),
                        ...(product.specs || []).slice(0, 5).map((spec: string, i: number) =>
                            React.createElement(View, { key: i, style: styles.specItem },
                                React.createElement(View, { style: styles.specDot }),
                                React.createElement(Text, { style: styles.specText }, spec)
                            )
                        )
                    ),

                    // Funding
                    categoryPrograms.length > 0 && React.createElement(View, { style: styles.fundingBox },
                        React.createElement(Text, { style: styles.fundingTitle }, 'PROGRAME FINANȚARE ELIGIBILE'),
                        React.createElement(Text, { style: styles.fundingText }, `${categoryPrograms[0].title} (${categoryPrograms[0].code}) — max ${categoryPrograms[0].maxGrant}`)
                    )
                )
            );
        }),

        // PAGINA 6: CONTACT (SPATE)
        React.createElement(Page, { size: 'A4', style: styles.page },
            React.createElement(View, { style: styles.contactPage },
                React.createElement(Text, { style: styles.contactTitle }, 'Solicită o ofertă personalizată'),

                React.createElement(ImagePlaceholder, { description: 'Imagine de fundal subtilă fermă modernă', height: 180 }),

                React.createElement(View, { style: { alignSelf: 'center', marginTop: 30 } },
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(View, { style: styles.contactIcon }, React.createElement(Text, { style: { fontSize: 10 } }, '☎')),
                        React.createElement(Text, { style: styles.contactLabel }, 'Telefon:'),
                        React.createElement(Text, { style: styles.contactValue }, config.phone || '+40 723 380 022')
                    ),
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(View, { style: styles.contactIcon }, React.createElement(Text, { style: { fontSize: 10 } }, '✉')),
                        React.createElement(Text, { style: styles.contactLabel }, 'Email:'),
                        React.createElement(Text, { style: styles.contactValue }, config.email || 'office@tehnicagrosupply.ro')
                    ),
                    React.createElement(View, { style: styles.contactRow },
                        React.createElement(View, { style: styles.contactIcon }, React.createElement(Text, { style: { fontSize: 10 } }, '🌐')),
                        React.createElement(Text, { style: styles.contactLabel }, 'Web:'),
                        React.createElement(Text, { style: styles.contactValue }, 'tehnicagrosupply.ro')
                    ),
                ),

                React.createElement(View, { style: styles.ctaButton },
                    React.createElement(Text, { style: styles.ctaText }, 'CONTACTAȚI-NE ASTĂZI')
                ),

                React.createElement(View, { style: { position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center' } },
                    React.createElement(Text, { style: { fontSize: 8, color: COLORS.textMuted } }, '© 2026 TehnicAgro Supply. Toate drepturile rezervate.')
                )
            )
        )
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { config, productSlugs, adminAuth } = body;

        // AUTH VERIFICATION (Double check: Header and Body)
        const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
        const bodyAuth = (adminAuth || '').trim();
        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();

        const isAuthed = (headerAuth !== '' && headerAuth === serverPass) ||
            (bodyAuth !== '' && bodyAuth === serverPass);

        if (!isAuthed) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
