import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiter simplu in-memory (per instanță Vercel serverless)
// ─────────────────────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
    ip: string,
    limit: number = 60,
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

// Curăță intrările expirate la fiecare minut
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60_000);

// ─────────────────────────────────────────────────────────────────────────────
// Security Headers adăugate pe toate răspunsurile
// ─────────────────────────────────────────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Frame-Options', 'DENY');
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
// Middleware principal
// ─────────────────────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rate limiting pe toate rutele API
    if (pathname.startsWith('/api/')) {
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Limite stricte pentru endpoint-uri sensibile
        const adminEndpoints = ['/api/admin-auth'];
        const sensitiveEndpoints = ['/api/leads', '/api/send-offer', '/api/send-report'];

        let limit = 60; // default: 60 req/min
        if (adminEndpoints.some((ep) => pathname.startsWith(ep))) {
            limit = 5; // max 5 încercări/min pe auth admin
        } else if (sensitiveEndpoints.some((ep) => pathname.startsWith(ep))) {
            limit = 10; // max 10 req/min pe leads/email
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

    const response = NextResponse.next();
    return addSecurityHeaders(response);
}

export const config = {
    matcher: [
        /*
         * Aplică middleware pe toate rutele EXCEPT:
         * - _next/static (fișiere statice)
         * - _next/image (optimizare imagini Next.js)
         * - favicon.ico
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
