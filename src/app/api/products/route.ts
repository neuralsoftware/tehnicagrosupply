import { NextResponse } from 'next/server';
import { getProducts, saveProduct, DynamicProduct } from '@/lib/products-store';

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
        const body = await request.json();
        const { adminAuth, siteCatalogOnly, ...product } = body;

        // AUTH VERIFICATION
        const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
        const bodyAuth = (adminAuth || '').trim();
        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
        
        const isAuthed = (headerAuth !== '' && headerAuth === serverPass) || 
                         (bodyAuth !== '' && bodyAuth === serverPass);

        if (!isAuthed) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!product.slug || !product.name || !product.category) {
            return NextResponse.json({ error: 'Slug, name, and category are required' }, { status: 400 });
        }
        await saveProduct(product as DynamicProduct, { siteCatalogOnly: Boolean(siteCatalogOnly) });
        return NextResponse.json({ success: true, product });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Eroare la salvare';
        console.error('[api/products POST]', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
