import { NextResponse } from 'next/server';
import { getSupabaseCrmAdmin } from '@/lib/supabaseCrmAdmin';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const crm = getSupabaseCrmAdmin();
        if (!crm) {
            return NextResponse.json(
                { error: 'CRM neconfigurat', details: 'CRM_SUPABASE_URL / CRM_SUPABASE_SERVICE_ROLE_KEY lipsă.' },
                { status: 503 }
            );
        }

        const { id } = await params;
        const updates = await request.json();

        // Convert frontend camelCase fields to database snake_case columns
        const dbUpdates: Record<string, unknown> = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.notes) dbUpdates.notes = updates.notes;
        if (updates.urgency) dbUpdates.urgency = updates.urgency;

        const { data, error } = await crm
            .from('clients')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
        }

        return NextResponse.json({ success: true, lead: data });
    } catch (error) {
        console.error('Patch error:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const crm = getSupabaseCrmAdmin();
        if (!crm) {
            return NextResponse.json(
                { error: 'CRM neconfigurat', details: 'CRM_SUPABASE_URL / CRM_SUPABASE_SERVICE_ROLE_KEY lipsă.' },
                { status: 503 }
            );
        }

        const { id } = await params;

        const { error } = await crm.from('clients').delete().eq('id', id);

        if (error) {
            console.error('Supabase delete error:', error);
            return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
