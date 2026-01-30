import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const updates = await request.json();

        // Convert frontend camelCase fields to database snake_case columns
        const dbUpdates: any = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.notes) dbUpdates.notes = updates.notes;

        // Use supabaseAdmin to bypass RLS
        const { data, error } = await supabaseAdmin
            .from('leads')
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
        const { id } = await params;

        // Use supabaseAdmin to bypass RLS
        const { error } = await supabaseAdmin
            .from('leads')
            .delete()
            .eq('id', id);

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
