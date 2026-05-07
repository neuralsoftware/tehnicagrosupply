import { type NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');

function isTrustedPdfUrl(url: string): boolean {
    if (!SUPABASE_URL) return false;
    try {
        const parsed = new URL(url);
        const base = new URL(SUPABASE_URL);
        return parsed.hostname === base.hostname && parsed.pathname.includes('/storage/v1/object/public/');
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const rawUrl = request.nextUrl.searchParams.get('url') ?? '';

    if (!rawUrl || !isTrustedPdfUrl(rawUrl)) {
        return new NextResponse('URL invalid', { status: 400 });
    }

    let upstream: Response;
    try {
        upstream = await fetch(rawUrl, { cache: 'no-store' });
    } catch {
        return new NextResponse('Eroare la descărcarea PDF-ului', { status: 502 });
    }

    if (!upstream.ok) {
        return new NextResponse('PDF negăsit', { status: 404 });
    }

    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
            'Cache-Control': 'public, max-age=3600',
            'X-Frame-Options': 'SAMEORIGIN',
        },
    });
}
