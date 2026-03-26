import { NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/supabase';
import { renderToBuffer } from '@react-pdf/renderer';
import {
    getProducts,
    getCategories,
    getBrochureProfilesMap,
    mergeProductForPdf,
    normalizeLegacyProductSlug,
    saveBrochure,
    Brochure,
    DynamicProduct,
} from '@/lib/products-store';
import { buildSingleProductDeepDivePDF, loadCatalogLogoDataUri } from '@/app/api/materiale/route';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const bodyInput = await request.json();
        const { productSlug, adminAuth, config: rawConfig } = bodyInput as {
            productSlug?: string;
            adminAuth?: string;
            config?: { title?: string; subtitle?: string; phone?: string; email?: string };
        };

        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
        const authOk =
            (adminAuth || '').trim() === serverPass || (request.headers.get('x-admin-auth') || '').trim() === serverPass;
        if (!authOk) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const slug = normalizeLegacyProductSlug(String(productSlug || '').trim());
        if (!slug) return NextResponse.json({ error: 'Lipsește productSlug' }, { status: 400 });

        const all = await getProducts();
        const categories = await getCategories();
        const brochureProfiles = await getBrochureProfilesMap();
        const raw = all.find((p: DynamicProduct) => p.slug === slug);
        if (!raw) return NextResponse.json({ error: 'Produs negăsit' }, { status: 404 });

        const product = mergeProductForPdf(raw, brochureProfiles);

        const cfg = {
            ...(rawConfig || {}),
            logoDataUri: loadCatalogLogoDataUri(),
        };

        const doc = buildSingleProductDeepDivePDF(cfg, product, categories);
        const buffer = await renderToBuffer(doc);

        const uniqueSuffix = Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
        const id = `brochure-deep-${uniqueSuffix}`;
        const publicUrl = await uploadToSupabase(buffer, `materiale/${id}.pdf`, 'application/pdf');

        const brochureTitle = `Prezentare: ${product.name}`;

        const data: Brochure = {
            id,
            title: brochureTitle,
            subtitle: cfg.subtitle,
            publicUrl,
            createdAt: new Date().toISOString(),
            productSlugs: [product.slug],
            config: {
                ...cfg,
                brochureKind: 'single-deep-dive',
            },
        };
        await saveBrochure(data);

        return NextResponse.json({ success: true, brochure: { ...data, downloadUrl: publicUrl } });
    } catch (err: unknown) {
        const e = err as { message?: string; stack?: string };
        console.error('POST /api/materiale/single:', e?.stack || e);
        return NextResponse.json(
            {
                error: 'Nu s-a putut genera PDF-ul de prezentare',
                details: e?.message,
                stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined,
            },
            { status: 500 }
        );
    }
}
