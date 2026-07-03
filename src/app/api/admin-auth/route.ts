import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { simpleRateLimit } from '@/lib/leads';

/** Comparație timing-safe; refuză accesul dacă ADMIN_PASSWORD lipsește de pe server. */
function passwordMatches(candidate: unknown): boolean {
    const input = typeof candidate === 'string' ? candidate.trim() : '';
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    if (!input || !serverPass) return false;
    const a = Buffer.from(input, 'utf8');
    const b = Buffer.from(serverPass, 'utf8');
    if (a.length !== b.length) {
        timingSafeEqual(b, b);
        return false;
    }
    return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
    try {
        // Strict rate limiting for admin auth (3 attempts per 10 minutes)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const allowed = simpleRateLimit(`admin-auth:${ip}`, 3, 600000); // 3 attempts per 10 min

        if (!allowed) {
            return NextResponse.json(
                { success: false, message: 'Prea multe încercări. Așteaptă 10 minute.' },
                { status: 429 }
            );
        }

        const { password } = await request.json();

        if (passwordMatches(password)) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Parolă incorectă' }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
