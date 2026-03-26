import { NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const auth = request.headers.get('x-admin-auth');
        if (auth !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const filename = formData.get('filename') as string || `upload-${Date.now()}.webp`;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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
