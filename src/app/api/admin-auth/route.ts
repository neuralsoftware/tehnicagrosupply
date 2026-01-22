import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD || 'tehnicagro2026';

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Parolă incorectă' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
