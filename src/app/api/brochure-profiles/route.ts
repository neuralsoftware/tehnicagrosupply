import { NextResponse } from 'next/server';
import { getBrochureProfilesMap, saveBrochureProfile } from '@/lib/products-store';

export const dynamic = 'force-dynamic';

function adminOk(request: Request, adminAuthBody?: string): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const bodyAuth = (adminAuthBody || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    return (
        (headerAuth !== '' && headerAuth === serverPass) || (bodyAuth !== '' && bodyAuth === serverPass)
    );
}

export async function GET(request: Request) {
    if (!adminOk(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const profiles = await getBrochureProfilesMap();
        return NextResponse.json(
            { profiles },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                },
            }
        );
    } catch {
        return NextResponse.json({ error: 'Failed to load brochure profiles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminAuth, slug, ...patch } = body as {
            adminAuth?: string;
            slug?: string;
            [k: string]: unknown;
        };

        if (!adminOk(request, adminAuth)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const s = String(slug || '').trim();
        if (!s) {
            return NextResponse.json({ error: 'Lipsește slug-ul produsului' }, { status: 400 });
        }

        const cleanPatch: Record<string, unknown> = { ...patch };
        delete cleanPatch.slug;
        delete cleanPatch.adminAuth;

        await saveBrochureProfile(s, cleanPatch as Parameters<typeof saveBrochureProfile>[1]);
        const profiles = await getBrochureProfilesMap();
        return NextResponse.json({ success: true, profile: profiles[s] });
    } catch {
        return NextResponse.json({ error: 'Failed to save brochure profile' }, { status: 500 });
    }
}
