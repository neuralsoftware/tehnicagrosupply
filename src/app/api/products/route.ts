import { NextResponse } from 'next/server';
import { getProducts, saveProduct, DynamicProduct } from '@/lib/products-store';
import { timingSafeEqual } from 'crypto';

/** Comparație timing-safe pentru a preveni timing attacks pe ADMIN_PASSWORD */
function isAdminAuthenticated(request: Request): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    if (!headerAuth || !serverPass) return false;
    try {
        const a = Buffer.from(headerAuth, 'utf8');
        const b = Buffer.from(serverPass, 'utf8');
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(
            { products },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                },
            }
        );
    } catch {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // AUTH: numai header, niciodată body (body apare în logs Vercel)
        if (!isAdminAuthenticated(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        // adminAuth nu mai este acceptat în body — ignorăm dacă e trimis
        const { siteCatalogOnly, ...product } = body;

        if (!product.slug || !product.name || !product.category) {
            return NextResponse.json({ error: 'Slug, name, and category are required' }, { status: 400 });
        }
        await saveProduct(product as DynamicProduct, { siteCatalogOnly: Boolean(siteCatalogOnly) });
        const products = await getProducts();
        return NextResponse.json({ success: true, product, products });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Eroare la salvare';
        console.error('[api/products POST]', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

