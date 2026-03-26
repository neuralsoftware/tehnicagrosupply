import { NextResponse } from 'next/server';
import { saveCategory, deleteCategory, getProducts, getCategories, Category } from '@/lib/products-store';

function isAuthenticated(request: Request): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    return headerAuth !== '' && headerAuth === serverPass;
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { slug } = await params;
        const updates: Category = await request.json();
        await saveCategory({ ...updates, slug });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { slug } = await params;
        // Safety check: don't delete if category has products
        const products = await getProducts();
        const hasProducts = products.some(p => p.category === slug);
        if (hasProducts) {
            return NextResponse.json(
                { error: 'Nu poți șterge o categorie care conține produse. Mută produsele mai întâi.' },
                { status: 409 }
            );
        }
        await deleteCategory(slug);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
