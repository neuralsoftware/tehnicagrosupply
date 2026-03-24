import { NextResponse } from 'next/server';
import { FUNDING_PROGRAMS, FundingProgram } from '@/data/funding-programs';
import { put, list } from '@vercel/blob';

const PROGRAMS_BLOB_KEY = 'catalog/funding-programs.json';

function isAuthenticated(request: Request): boolean {
    const auth = request.headers.get('x-admin-auth');
    return auth === process.env.ADMIN_PASSWORD;
}

async function getOverrides(): Promise<Record<string, Partial<FundingProgram>>> {
    try {
        const { blobs } = await list({ prefix: PROGRAMS_BLOB_KEY });
        const blob = blobs.find(b => b.pathname === PROGRAMS_BLOB_KEY);
        if (!blob) return {};
        const res = await fetch(blob.url);
        if (!res.ok) return {};
        return await res.json();
    } catch {
        return {};
    }
}

export async function GET() {
    try {
        const overrides = await getOverrides();
        // Merge base programs with admin overrides (status, lastVerified, notes)
        const merged: Record<string, FundingProgram[]> = {};
        for (const [category, programs] of Object.entries(FUNDING_PROGRAMS)) {
            merged[category] = programs.map(p => ({
                ...p,
                ...(overrides[p.code] || {}),
            }));
        }
        return NextResponse.json({ programs: merged });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { code, updates } = await request.json();
        const current = await getOverrides();
        current[code] = { ...current[code], ...updates };
        await put(PROGRAMS_BLOB_KEY, JSON.stringify(current), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
    }
}
