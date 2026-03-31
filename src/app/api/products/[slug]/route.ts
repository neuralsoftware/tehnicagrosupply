import { NextResponse } from 'next/server';
import { saveProduct, deleteProduct, getProducts, DynamicProduct } from '@/lib/products-store';

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const body = await request.json();
        const { adminAuth, siteCatalogOnly, ...updates } = body;
        const { slug } = await params;

        // AUTH VERIFICATION
        const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
        const bodyAuth = (adminAuth || '').trim();
        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
        
        const isAuthed = (headerAuth !== '' && headerAuth === serverPass) || 
                         (bodyAuth !== '' && bodyAuth === serverPass);

        if (!isAuthed) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await saveProduct({ ...updates, slug } as DynamicProduct, {
            siteCatalogOnly: Boolean(siteCatalogOnly),
        });
        const products = await getProducts();
        return NextResponse.json({ success: true, products });
    } catch {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const body = await request.json();
        const { adminAuth } = body;
        const { slug } = await params;

        // AUTH VERIFICATION
        const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
        const bodyAuth = (adminAuth || '').trim();
        const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
        
        const isAuthed = (headerAuth !== '' && headerAuth === serverPass) || 
                         (bodyAuth !== '' && bodyAuth === serverPass);

        if (!isAuthed) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await deleteProduct(slug);
        const products = await getProducts();
        return NextResponse.json({ success: true, products });
    } catch {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
