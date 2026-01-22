import { NextResponse } from 'next/server';
import { LeadsService } from '@/lib/leads';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const updates = await request.json();

        const lead = await LeadsService.updateLead(id, updates);

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}
