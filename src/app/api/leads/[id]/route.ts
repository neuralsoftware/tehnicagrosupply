import { NextResponse } from 'next/server';
import { getSupabaseCrmAdmin } from '@/lib/supabaseCrmAdmin';
import { isAdminAuth } from '@/lib/admin-auth';

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

        // Convert frontend camelCase fields to database snake_case columns.
        // Atenție: `clients` NU are coloană `urgency` (vezi CRM_DATABASE_MAP.md).
        const dbUpdates: Record<string, unknown> = {};
        let createUrgentCallTask = false;
        if (isAdminAuth(request)) {
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.notes) dbUpdates.notes = updates.notes;
        } else if (updates.callRequested === true) {
            // Singura acțiune publică: butonul „Solicită reapelare” din calculatorul ROI,
            // imediat după trimiterea formularului. Textele sunt fixate pe server.
            dbUpdates.notes = 'SOLICITARE REAPELARE RAPIDĂ (Urgent) — clientul așteaptă telefon';
            createUrgentCallTask = true;
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (Object.keys(dbUpdates).length === 0) {
            return NextResponse.json({ error: 'Nimic de actualizat' }, { status: 400 });
        }

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

        // Reapelarea apare și ca sarcină urgentă în CRM (Kanban „De facut”, scadență azi+1),
        // altfel solicitarea rămâne doar în notes și poate fi ratată.
        if (createUrgentCallTask) {
            const clientIntId = parseInt(String(id), 10);
            if (Number.isFinite(clientIntId) && clientIntId > 0) {
                const due = new Date(Date.now() + 24 * 60 * 60 * 1000)
                    .toLocaleString('sv', { timeZone: 'Europe/Bucharest' })
                    .replace(' ', 'T');
                const taskRes = await crm.from('client_tasks').insert([{
                    client_id: clientIntId,
                    title: 'URGENT: Clientul solicită reapelare rapidă',
                    description: 'Clientul a apăsat „Solicită reapelare” imediat după trimiterea formularului ROI. Suna-l cât mai repede.',
                    due_date: due,
                    status: 'De facut',
                    resolution: '',
                    is_completed: 0,
                }]);
                if (taskRes.error) {
                    console.error('CRM client_tasks insert (reapelare):', taskRes.error);
                }
            }
        }

        return NextResponse.json({ success: true, lead: data });
    } catch (error) {
        console.error('Patch error:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!isAdminAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
