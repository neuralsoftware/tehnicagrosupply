import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { simpleRateLimit } from '@/lib/leads';
import { z } from 'zod';
import { getSupabaseCrmAdmin } from '@/lib/supabaseCrmAdmin';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

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
    cif: z.string().max(32, 'CUI/CIF prea lung').optional().default(''),
    attribution: z.record(z.string(), z.string().optional()).optional().default({}),
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

/**
 * Aplicația CRM (board / meniul Sarcini) poate să nu listeze rânduri al căror titlu sau descriere
 * conțin emoji; în DB sarcinile tale „vechi” sunt ASCII-only.
 */
function crmSafePlainText(text: string): string {
    return text
        .replace(/\p{Extended_Pictographic}/gu, '')
        .replace(/\uFE0F/g, '')
        .replace(/[\u200D\u200C]/g, '')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * În CRM, sarcinile din meniul „Sarcini” sunt filtrate după client; clienții fără `representative`
 * nu apar în același flux cu cei creați manual (care au reprezentant setat).
 * Suprascrie cu `CRM_DEFAULT_CLIENT_REPRESENTATIVE` (nume complet ca în `users.full_name`).
 */
async function resolveDefaultClientRepresentative(crm: SupabaseClient): Promise<string | null> {
    const fromEnv = process.env.CRM_DEFAULT_CLIENT_REPRESENTATIVE?.trim();
    if (fromEnv) return fromEnv;

    const { data, error } = await crm
        .from('users')
        .select('full_name')
        .eq('is_active', true)
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (error || !data?.full_name?.trim()) {
        console.warn(
            '[leads] CRM: lipsește representative implicit (setează CRM_DEFAULT_CLIENT_REPRESENTATIVE sau users active).'
        );
        return null;
    }
    return data.full_name.trim();
}

/** Tabel sarcini/mesaje în proiectul CRM (mesajul site → task). Supabase: public.<nume>. */
const CRM_TASKS_TABLE = process.env.CRM_TASKS_TABLE?.trim() || 'client_tasks';

/** Dată scadentă în ora României (Europe/Bucharest) — fără suffix Z, ca sarcinile create din CRM. */
function crmTaskDueDateIso(daysFromNow: number): string {
    const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    // 'sv' locale returnează YYYY-MM-DD HH:MM:SS în timezone-ul cerut
    return date.toLocaleString('sv', { timeZone: 'Europe/Bucharest' }).replace(' ', 'T');
}

/** Inserare în `client_tasks` — coloane obligatorii din API acolo unde DB nu are default. */
type ClientTaskInsert = {
    client_id: string | number;
    title: string;
    description: string;
    due_date: string;
    status: string;
    resolution: string;
    /** CRM: coloană integer (0 = deschis, 1 = închis), nu boolean. */
    is_completed: number;
};

/** Rând nou în `leads` — flux „Lead nou” / bannere în CRM (schema din CRM_DATABASE_MAP.md). */
type CrmLeadInsert = {
    id: string;
    name: string;
    phone: string;
    email: string;
    county: string;
    hectares: number;
    crops: string[];
    fuel_savings: number;
    subsidy_income: number;
    total_benefit: number;
    status: string;
    source: string;
    created_at: string;
    notes?: string;
};

function formatAttributionLines(attribution: Record<string, string | undefined>): string[] {
    const labels: Record<string, string> = {
        currentUrl: 'URL curent',
        pagePath: 'Pagină',
        pageTitle: 'Titlu pagină',
        referrer: 'Referrer',
        gclid: 'Google Click ID',
        gbraid: 'GBRAID',
        wbraid: 'WBRAID',
        utm_source: 'UTM source',
        utm_medium: 'UTM medium',
        utm_campaign: 'UTM campaign',
        utm_term: 'UTM term',
        utm_content: 'UTM content',
    };
    return Object.entries(attribution)
        .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
        .map(([key, value]) => `${labels[key] ?? key}: ${String(value).trim()}`);
}

function toClientIntegerId(id: string | number): number {
    if (typeof id === 'number' && Number.isFinite(id)) return Math.trunc(id);
    const n = parseInt(String(id), 10);
    return Number.isFinite(n) ? n : 0;
}

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
            cif: validatedData.cif?.trim() || '',
            subsidyIncome: validatedData.subsidyIncome || 0,
            fuelSavings: validatedData.fuelSavings || 0,
            totalBenefit: validatedData.totalBenefit || 0,
            notes: validatedData.message || '',
            source: validatedData.source || 'Website Form',
        };
        const attributionLines = formatAttributionLines(validatedData.attribution);

        const messageBody = [
            `Sursă: ${leadData.source}`,
            `Produs interesat: ${validatedData.productName || '-'}`,
            `CUI/CIF: ${leadData.cif || '-'}`,
            `Mesaj: ${leadData.notes || '-'}`,
            `Hectare: ${leadData.hectares ?? 0}`,
            `Culturi: ${(leadData.crops || []).join(', ') || '-'}`,
            `Urgență: ${leadData.urgency || '-'}`,
            `Subvenție estimată (RON): ${leadData.subsidyIncome ?? 0}`,
            `Economie combustibil estimată (RON): ${leadData.fuelSavings ?? 0}`,
            `Beneficiu total estimat (RON): ${leadData.totalBenefit ?? 0}`,
            ...(attributionLines.length > 0 ? ['', 'Atribuire campanie:', ...attributionLines] : []),
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

        const defaultRepresentative = await resolveDefaultClientRepresentative(crm);

        const clientPayload: Record<string, unknown> = {
            name: leadData.name,
            phone: leadData.phone || '',
            email: leadData.email || '',
            county: leadData.county || '',
            // CRM-ul verifică source === 'website' (lowercase exact) ca să afișeze
            // bannerul "Lead nou" și să reîmprospăteze lista de clienți în timp real.
            // Sursa originală (ROI Calculator / Website Form) se păstrează în tabelul leads și în sarcină.
            source: 'website',
        };
        if (leadData.cif) {
            clientPayload.cif = leadData.cif;
        }
        if (defaultRepresentative) {
            clientPayload.representative = defaultRepresentative;
        }

        const phoneStr = String(clientPayload.phone ?? '');
        const emailStr = String(clientPayload.email ?? '');

        let insertedRow: Record<string, unknown>;
        const insertRes = await crm.from('clients').insert([clientPayload]).select().single();

        if (insertRes.error) {
            if (insertRes.error.code === '23505') {
                const phone = phoneStr.replace(/^\+/, '');
                let existingId: string | number | undefined;

                if (phone) {
                    const byPhone = await crm.from('clients').select('id').eq('phone', phoneStr).maybeSingle();
                    if (!byPhone.error && byPhone.data?.id != null) {
                        existingId = byPhone.data.id as string | number;
                    }
                }
                if (existingId === undefined && emailStr) {
                    const byEmail = await crm.from('clients').select('id').eq('email', emailStr).maybeSingle();
                    if (!byEmail.error && byEmail.data?.id != null) {
                        existingId = byEmail.data.id as string | number;
                    }
                }

                if (existingId === undefined) {
                    return NextResponse.json(jsonFromPostgrestError(insertRes.error), { status: 500 });
                }
                insertedRow = { id: existingId };

                const { data: existingClient } = await crm
                    .from('clients')
                    .select('representative,cif')
                    .eq('id', existingId)
                    .maybeSingle();
                const rep = existingClient?.representative;
                const patch: Record<string, string> = {};
                if (defaultRepresentative && (rep == null || String(rep).trim() === '')) {
                    patch.representative = defaultRepresentative;
                }
                if (leadData.cif && (!existingClient?.cif || String(existingClient.cif).trim() === '')) {
                    patch.cif = leadData.cif;
                }
                if (Object.keys(patch).length > 0) {
                    const patchRes = await crm.from('clients').update(patch).eq('id', existingId);
                    if (patchRes.error) {
                        console.error('CRM clients update from website lead:', patchRes.error);
                    }
                }
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

        const leadNotes =
            crmSafePlainText(messageBody || leadData.notes || '').slice(0, 4000) ||
            'Lead trimis de pe tehnicagrosupply.ro';

        const crmLeadPayload: CrmLeadInsert = {
            id: randomUUID(),
            name: leadData.name,
            phone: leadData.phone || '',
            email: leadData.email || '',
            county: leadData.county || '',
            hectares: leadData.hectares ?? 0,
            crops: Array.isArray(leadData.crops) ? [...leadData.crops] : [],
            fuel_savings: leadData.fuelSavings ?? 0,
            subsidy_income: leadData.subsidyIncome ?? 0,
            total_benefit: leadData.totalBenefit ?? 0,
            /** Contor / banner „lead nou” în CRM folosesc de obicei `Nou`, nu `Lead` (pipeline client rămâne separat). */
            status: 'Nou',
            source: leadData.source?.trim() || 'Website Form',
            created_at: new Date().toISOString(),
            notes: leadNotes,
        };

        const leadTableRes = await crm.from('leads').insert([crmLeadPayload]).select().single();
        if (leadTableRes.error) {
            console.error('CRM leads insert:', leadTableRes.error);
            return NextResponse.json(jsonFromPostgrestError(leadTableRes.error), { status: 500 });
        }

        const clientIntId = toClientIntegerId(clientId);
        if (clientIntId > 0) {
            const logAction = process.env.CRM_NEW_LEAD_LOG_ACTION?.trim() || 'new_lead_website';
            const logRes = await crm
                .from('logs')
                .insert([{ action: logAction, client_id: clientIntId, timestamp: Date.now() }]);
            if (logRes.error) {
                console.error('CRM logs insert (notificări):', logRes.error);
            }
        }

        if (messageBody.trim().length > 0) {
            const taskDescription = crmSafePlainText(messageBody);
            const taskPayload: ClientTaskInsert = {
                client_id: clientId,
                title: 'LEAD NOU: Cerere ofertă website',
                description: taskDescription.length > 0 ? taskDescription : messageBody,
                due_date: crmTaskDueDateIso(3),
                /**
                 * Coloana 1 în Kanban („De facut”). `InProgress` muta sarcina în „În progres” / „În lucru”
                 * și în unele ecrane bloca acțiunile de editare de pe fișa clientului.
                 */
                status: 'De facut',
                resolution: '',
                is_completed: 0,
            };
            const taskRes = await crm.from(CRM_TASKS_TABLE).insert([taskPayload]).select().single();
            if (taskRes.error) {
                console.error(`CRM ${CRM_TASKS_TABLE} insert:`, taskRes.error);
                return NextResponse.json(jsonFromPostgrestError(taskRes.error), { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            /** Rând `clients` — același contract ca înainte (ex. ROI: PATCH `/api/leads/[id]` pe id client). */
            lead: insertedRow,
            /** Rând `leads` — notificări / banner în CRM. */
            crmLead: leadTableRes.data,
        });
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
