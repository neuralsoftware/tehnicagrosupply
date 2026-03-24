import { NextResponse } from 'next/server';
import { getProducts, saveProduct, deleteProduct } from '@/lib/products-store';

function isAuthenticated(request: Request): boolean {
    const auth = request.headers.get('x-admin-auth');
    return auth === process.env.ADMIN_PASSWORD;
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { slug } = await params;
        const updates = await request.json();
        await saveProduct({ ...updates, slug });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { slug } = await params;
        await deleteProduct(slug);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
