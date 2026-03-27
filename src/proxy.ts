import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_DOMAIN = 'tehnicagrosupply.ro';

export function proxy(request: NextRequest) {
    const hostname = request.headers.get('host') || '';

    if (hostname.includes('vercel.app') || hostname.includes('vercel-dns.com')) {
        const url = new URL(request.url);
        url.hostname = CANONICAL_DOMAIN;
        url.protocol = 'https';
        url.port = '';
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
