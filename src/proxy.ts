import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Redirect vercel.app → domeniu canonical tehnicagrosupply.ro
// ─────────────────────────────────────────────────────────────────────────────
const CANONICAL_DOMAIN = 'tehnicagrosupply.ro';

function redirectToCanonical(request: NextRequest): NextResponse | null {
    // Doar în producție: preview-urile (*.vercel.app) trebuie să rămână accesibile
    // pentru teste (ex: PageSpeed Insights), altfel ar redirecționa spre site-ul live.
    if (process.env.VERCEL_ENV !== 'production') return null;
    const hostname = request.headers.get('host') || '';
    if (hostname.includes('vercel.app') || hostname.includes('vercel-dns.com')) {
        const url = new URL(request.url);
        url.hostname = CANONICAL_DOMAIN;
        url.protocol = 'https';
        url.port = '';
        return NextResponse.redirect(url, 301);
    }
    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiter in-memory (per instanță Edge serverless)
// ─────────────────────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
    ip: string,
    limit: number,
    windowMs: number = 60_000
): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return false;
    }

    entry.count++;
    return entry.count > limit;
}

setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60_000);

// ─────────────────────────────────────────────────────────────────────────────
// Security Headers
// ─────────────────────────────────────────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), payment=()'
    );
    return response;
}

// ─────────────────────────────────────────────────────────────────────────────
// Proxy / Middleware principal
// ─────────────────────────────────────────────────────────────────────────────
export function proxy(request: NextRequest) {
    // 1. Redirect vercel.app → canonical
    const canonicalRedirect = redirectToCanonical(request);
    if (canonicalRedirect) return canonicalRedirect;

    const { pathname } = request.nextUrl;

    // 2. Rate limiting pe rute API
    if (pathname.startsWith('/api/')) {
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const adminEndpoints = ['/api/admin-auth'];
        const sensitiveEndpoints = ['/api/leads', '/api/send-offer', '/api/send-report'];

        let limit = 60;
        if (adminEndpoints.some((ep) => pathname.startsWith(ep))) {
            limit = 5;
        } else if (sensitiveEndpoints.some((ep) => pathname.startsWith(ep))) {
            limit = 10;
        }

        if (isRateLimited(ip, limit)) {
            return addSecurityHeaders(
                NextResponse.json(
                    { error: 'Prea multe cereri. Încearcă din nou mai târziu.' },
                    { status: 429 }
                )
            );
        }
    }

    // 3. Security headers pe toate răspunsurile
    return addSecurityHeaders(NextResponse.next());
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)',],
};
