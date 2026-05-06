import { NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/supabase';
import { deletePromotion, getPromotions, savePromotion, type PromotionKind } from '@/lib/promotions-store';

function isAdminAuthenticated(request: Request): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    return Boolean(headerAuth && serverPass && headerAuth === serverPass);
}

function field(formData: FormData, key: string): string | undefined {
    const value = formData.get(key);
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

export async function GET(request: Request) {
    try {
        const includeDrafts = isAdminAuthenticated(request);
        const promotions = await getPromotions({ includeDrafts });
        return NextResponse.json(
            { promotions },
            { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
        );
    } catch {
        return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!isAdminAuthenticated(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const kind = (field(formData, 'kind') || 'template') as PromotionKind;
        let pdfUrl = field(formData, 'pdfUrl');
        const file = formData.get('pdf');

        if (file instanceof File && file.size > 0) {
            const safeBase = (file.name || 'promotie.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
            const storagePath = `promotii/${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeBase}`;
            const arrayBuffer = await file.arrayBuffer();
            pdfUrl = await uploadToSupabase(
                Buffer.from(arrayBuffer),
                storagePath,
                file.type || 'application/pdf'
            );
        }

        const promotion = await savePromotion({
            id: field(formData, 'id'),
            slug: field(formData, 'slug'),
            title: field(formData, 'title'),
            kind,
            status: field(formData, 'status') === 'draft' ? 'draft' : 'active',
            subtitle: field(formData, 'subtitle'),
            description: field(formData, 'description'),
            badge: field(formData, 'badge'),
            productSlug: field(formData, 'productSlug'),
            productName: field(formData, 'productName'),
            imageUrl: field(formData, 'imageUrl'),
            pdfUrl,
            priceLabel: field(formData, 'priceLabel'),
            priceValue: field(formData, 'priceValue'),
            validUntil: field(formData, 'validUntil'),
            ctaLabel: field(formData, 'ctaLabel'),
        });

        return NextResponse.json({ success: true, promotion });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Eroare la salvare promoție';
        console.error('POST /api/promotions:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!isAdminAuthenticated(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id') || '';
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        await deletePromotion(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
    }
}

