import { NextResponse } from 'next/server';
import { simpleRateLimit } from '@/lib/leads';
import { z } from 'zod';
import { getSupabaseCrmAdmin } from '@/lib/supabaseCrmAdmin';
import type { PostgrestError } from '@supabase/supabase-js';

const leadSchema = z.object({
    name: z.string().min(2, 'Nume prea scurt').max(100, 'Nume prea lung'),
    /** Opțional în formularul ROI; dacă e completat, minim 8 caractere numerice */
    phone: z.preprocess(
        (v) => (v === undefined || v === null ? '' : String(v)),
        z
            .string()
            .transform((val) => val.replace(/[^\d+]/g, ''))
            .refine((val) => val.length === 0 || val.replace(/^\+/, '').length >= 8, {
                message: 'Telefon invalid (minim 8 cifre dacă îl completezi)',
            })
    ),
    email: z.string().email('Email invalid').optional().or(z.literal('')),
    county: z.string().max(100).optional().default(''),
    hectares: z.number().min(0, 'Suprafață invalidă').max(10000, 'Max 10000 ha').optional().default(0),
    crops: z.array(z.string()).max(10, 'Max 10 culturi').optional().default([]),
    urgency: z.string().max(100).optional().default(''),
    subsidyIncome: z.number().optional(),
    fuelSavings: z.number().optional(),
    totalBenefit: z.number().optional(),
    message: z.string().max(10000, 'Mesaj prea lung').optional().default(''),
    source: z.string().optional().default('Website Form'),
    productName: z.string().max(200).optional(),
});

/** Răspuns JSON cu câmpurile erorii PostgREST/Postgres așa cum vin de la Supabase (`error` = alias la message pentru formulare). */
function jsonFromPostgrestError(err: PostgrestError) {
    return {
        error: err.message,
        message: err.message,
        details: err.details,
        code: err.code,
        hint: err.hint,
    };
}

function isPostgrestError(x: unknown): x is PostgrestError {
    return (
        x !== null &&
        typeof x === 'object' &&
        'message' in x &&
        'code' in x &&
        typeof (x as PostgrestError).message === 'string'
    );
}

/** Tabel sarcini/mesaje în proiectul CRM (mesajul site → task). Supabase: public.<nume>. */
const CRM_TASKS_TABLE = process.env.CRM_TASKS_TABLE?.trim() || 'client_tasks';

/** Inserare în `client_tasks` — coloane obligatorii din API acolo unde DB nu are default. */
type ClientTaskInsert = {
    client_id: string | number;
    title: string;
    description: string;
    due_date: string;
    status: string;
};

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const allowed = simpleRateLimit(ip, 50, 900000);

        if (!allowed) {
            return NextResponse.json(
                { error: 'Prea multe cereri. Te rugăm să încerci din nou în 15 minute.' },
                { status: 429 }
            );
        }

        const data = await request.json();
        const validatedData = leadSchema.parse(data);

        const leadData = {
            ...validatedData,
            email: validatedData.email || '',
            subsidyIncome: validatedData.subsidyIncome || 0,
            fuelSavings: validatedData.fuelSavings || 0,
            totalBenefit: validatedData.totalBenefit || 0,
            notes: validatedData.message || '',
            source: validatedData.source || 'Website Form',
        };

        const messageBody = [
            `Sursă: ${leadData.source}`,
            `Produs interesat: ${validatedData.productName || '-'}`,
            `Mesaj: ${leadData.notes || '-'}`,
            `Hectare: ${leadData.hectares ?? 0}`,
            `Culturi: ${(leadData.crops || []).join(', ') || '-'}`,
            `Urgență: ${leadData.urgency || '-'}`,
            `Subvenție estimată (RON): ${leadData.subsidyIncome ?? 0}`,
            `Economie combustibil estimată (RON): ${leadData.fuelSavings ?? 0}`,
            `Beneficiu total estimat (RON): ${leadData.totalBenefit ?? 0}`,
        ].join('\n');

        const crm = getSupabaseCrmAdmin();
        if (!crm) {
            const missing =
                'CRM_SUPABASE_URL sau CRM_SUPABASE_SERVICE_ROLE_KEY lipsă în environment.';
            return NextResponse.json(
                {
                    error: missing,
                    message: missing,
                    details: null,
                    code: 'CRM_ENV_MISSING',
                    hint: 'Configurează variabilele pentru proiectul CRM pe server (Vercel / .env.local).',
                },
                { status: 503 }
            );
        }

        const clientPayload = {
            name: leadData.name,
            phone: leadData.phone || '',
            email: leadData.email || '',
            county: leadData.county || '',
        };

        let insertedRow: Record<string, unknown>;
        const insertRes = await crm.from('clients').insert([clientPayload]).select().single();

        if (insertRes.error) {
            if (insertRes.error.code === '23505') {
                const phone = (clientPayload.phone || '').replace(/^\+/, '');
                let existingId: string | number | undefined;

                if (phone) {
                    const byPhone = await crm.from('clients').select('id').eq('phone', clientPayload.phone).maybeSingle();
                    if (!byPhone.error && byPhone.data?.id != null) {
                        existingId = byPhone.data.id as string | number;
                    }
                }
                if (existingId === undefined && clientPayload.email) {
                    const byEmail = await crm.from('clients').select('id').eq('email', clientPayload.email).maybeSingle();
                    if (!byEmail.error && byEmail.data?.id != null) {
                        existingId = byEmail.data.id as string | number;
                    }
                }

                if (existingId === undefined) {
                    return NextResponse.json(jsonFromPostgrestError(insertRes.error), { status: 500 });
                }
                insertedRow = { id: existingId };
            } else {
                console.error('CRM clients insert:', insertRes.error);
                return NextResponse.json(jsonFromPostgrestError(insertRes.error), { status: 500 });
            }
        } else {
            insertedRow = insertRes.data as Record<string, unknown>;
        }

        const rawId = insertedRow.id;
        if (
            rawId == null ||
            (typeof rawId !== 'string' && typeof rawId !== 'number')
        ) {
            const msg = 'Insert client fără id în răspuns.';
            return NextResponse.json(
                {
                    error: msg,
                    message: msg,
                    details: JSON.stringify(insertedRow),
                    code: null,
                    hint: null,
                },
                { status: 500 }
            );
        }
        const clientId: string | number = rawId;

        if (messageBody.trim().length > 0) {
            const productLabel = validatedData.productName?.trim() || 'General';
            const taskPayload: ClientTaskInsert = {
                client_id: clientId,
                title: `Lead nou website: ${productLabel}`,
                description: messageBody,
                due_date: new Date().toISOString(),
                status: 'Nou',
            };
            const taskRes = await crm.from(CRM_TASKS_TABLE).insert([taskPayload]).select().single();
            if (taskRes.error) {
                console.error(`CRM ${CRM_TASKS_TABLE} insert:`, taskRes.error);
                return NextResponse.json(jsonFromPostgrestError(taskRes.error), { status: 500 });
            }
        }

        return NextResponse.json({ success: true, lead: insertedRow });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Date invalide', details: error.issues },
                { status: 400 }
            );
        }
        console.error('Lead processing error:', error);
        if (isPostgrestError(error)) {
            return NextResponse.json(jsonFromPostgrestError(error), { status: 500 });
        }
        const err = error as Error & { details?: string; code?: string; hint?: string };
        const msg = err?.message ?? String(error);
        return NextResponse.json(
            {
                error: msg,
                message: msg,
                details: err?.details ?? null,
                code: err?.code ?? null,
                hint: err?.hint ?? null,
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const crm = getSupabaseCrmAdmin();
        if (!crm) {
            const missing =
                'CRM_SUPABASE_URL sau CRM_SUPABASE_SERVICE_ROLE_KEY lipsă în environment.';
            return NextResponse.json(
                {
                    error: missing,
                    message: missing,
                    details: null,
                    code: 'CRM_ENV_MISSING',
                    hint: null,
                },
                { status: 503 }
            );
        }

        const { data, error } = await crm
            .from('clients')
            .select('*')
            .eq('status', 'Lead')
            .order('id', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return NextResponse.json(jsonFromPostgrestError(error), { status: 500 });
        }

        const leads = data.map((row) => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email,
            county: row.county,
            status: row.status,
            notes: row.notes,
        }));

        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Admin leads fetch error:', error);
        if (isPostgrestError(error)) {
            return NextResponse.json(jsonFromPostgrestError(error), { status: 500 });
        }
        const err = error as Error & { details?: string; code?: string; hint?: string };
        const msg = err?.message ?? String(error);
        return NextResponse.json(
            {
                error: msg,
                message: msg,
                details: err?.details ?? null,
                code: err?.code ?? null,
                hint: err?.hint ?? null,
            },
            { status: 500 }
        );
    }
}
