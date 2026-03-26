import { NextResponse } from 'next/server';
import { getCategories, saveCategory, deleteCategory, getProducts, Category } from '@/lib/products-store';

function isAuthenticated(request: Request): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    return headerAuth !== '' && headerAuth === serverPass;
}

export async function GET() {
    try {
        const categories = await getCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const category: Category = await request.json();
        if (!category.slug || !category.name) {
            return NextResponse.json({ error: 'Slug and name are required' }, { status: 400 });
        }
        await saveCategory(category);
        return NextResponse.json({ success: true, category });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
    }
}
