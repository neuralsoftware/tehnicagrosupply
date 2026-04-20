import { timingSafeEqual } from 'crypto';

/**
 * Verifică autentificarea admin prin header `x-admin-auth`.
 * Folosește `timingSafeEqual` pentru a preveni timing attacks.
 *
 * @example
 * // In route.ts:
 * import { isAdminAuth } from '@/lib/admin-auth';
 * if (!isAdminAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 */
export function isAdminAuth(request: Request): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();

    if (!headerAuth || !serverPass) return false;

    try {
        const a = Buffer.from(headerAuth, 'utf8');
        const b = Buffer.from(serverPass, 'utf8');
        if (a.length !== b.length) {
            // Execută dummy pentru a menține timing constant
            timingSafeEqual(b, b);
            return false;
        }
        return timingSafeEqual(a, b);
    } catch {
        return false;
    }
}
