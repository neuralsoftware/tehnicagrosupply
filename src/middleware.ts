import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_DOMAIN = 'tehnicagrosupply.ro';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';

    // Redirect old vercel.app domain to new custom domain
    if (hostname.includes('vercel.app') || hostname.includes('vercel-dns.com')) {
        const url = new URL(request.url);
        url.hostname = CANONICAL_DOMAIN;
        url.protocol = 'https';
        url.port = '';
        return NextResponse.redirect(url, 301); // 301 = permanent redirect (SEO)
    }

    return NextResponse.next();
}

export const config = {
    // Run on all routes except static files and API routes
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
