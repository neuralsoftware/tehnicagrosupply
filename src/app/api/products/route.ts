import { NextResponse } from 'next/server';
import { getProducts, saveProduct, DynamicProduct } from '@/lib/products-store';

function isAuthenticated(request: Request): boolean {
    const auth = request.headers.get('x-admin-auth');
    return auth === process.env.ADMIN_PASSWORD;
}

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminAuth, ...product } = body;

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
        await saveProduct(product as DynamicProduct);
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
    }
}
