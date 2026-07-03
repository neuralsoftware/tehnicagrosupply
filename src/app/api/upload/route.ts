import { NextResponse } from 'next/server';
import { isAdminAuth } from '@/lib/admin-auth';
import { uploadToSupabase } from '@/lib/supabase';

/** Ruta e folosită doar de ImageOptimizer (admin) — acceptă exclusiv imagini. */
const ALLOWED_IMAGE_TYPES = new Set(['image/webp', 'image/jpeg', 'image/png', 'image/avif', 'image/gif']);
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(request: Request) {
    try {
        if (!isAdminAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const filename = formData.get('filename') as string || `upload-${Date.now()}.webp`;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            return NextResponse.json({ error: 'Doar imagini (webp, jpeg, png, avif, gif)' }, { status: 400 });
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            return NextResponse.json({ error: 'Fișier prea mare (max 15 MB)' }, { status: 400 });
        }

        const safeBase = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `products/${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeBase}`;
        const arrayBuffer = await file.arrayBuffer();
        const url = await uploadToSupabase(
            Buffer.from(arrayBuffer),
            storagePath,
            file.type || 'image/webp'
        );

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
