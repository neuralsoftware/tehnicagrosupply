import { NextResponse } from 'next/server';
import { simpleRateLimit } from '@/lib/leads';

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
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Parolă incorectă' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
