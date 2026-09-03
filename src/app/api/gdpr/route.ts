import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuth } from '@/lib/admin-auth';
import { getSupabaseCrmAdmin } from '@/lib/supabaseCrmAdmin';

/**
 * Panoul GDPR din administrare: câte dovezi de consimțământ avem, ce date se apropie de
 * termenul de ștergere și care contracte cu furnizorii sunt semnate.
 *
 * Totul e în spatele autentificării de admin — datele din registru nu ies public.
 */

export const dynamic = 'force-dynamic';

type RetentionRow = { stare: string; sterge_dupa: string | null };
type ConsentRow = { purpose: string; granted: boolean };

function crmOr503() {
    const crm = getSupabaseCrmAdmin();
    if (!crm) {
        return {
            crm: null,
            response: NextResponse.json(
                { error: 'CRM_SUPABASE_URL sau CRM_SUPABASE_SERVICE_ROLE_KEY lipsă în environment.' },
                { status: 503 }
            ),
        };
    }
    return { crm, response: null };
}

export async function GET(request: Request) {
    if (!isAdminAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { crm, response } = crmOr503();
    if (!crm) return response;

    const [consentsRes, retentionRes, statusRes] = await Promise.all([
        crm.from('gdpr_consents').select('purpose, granted'),
        crm.from('gdpr_retention_watch').select('stare, sterge_dupa'),
        crm.from('gdpr_processor_status').select('*'),
    ]);

    if (consentsRes.error) console.error('[api/gdpr] consents:', consentsRes.error.message);
    if (retentionRes.error) console.error('[api/gdpr] retention:', retentionRes.error.message);
    if (statusRes.error) console.error('[api/gdpr] processor status:', statusRes.error.message);

    const consents = (consentsRes.data ?? []) as ConsentRow[];
    const retention = (retentionRes.data ?? []) as RetentionRow[];

    const marketing = consents.filter((c) => c.purpose === 'marketing');
    const expirate = retention.filter((r) => r.stare === 'EXPIRAT');
    const curand = retention.filter((r) => r.stare === 'EXPIRA_CURAND');

    const termeneViitoare = retention
        .map((r) => r.sterge_dupa)
        .filter((d): d is string => typeof d === 'string')
        .sort();

    return NextResponse.json({
        consents: {
            total: consents.length,
            marketingAcceptat: marketing.filter((c) => c.granted).length,
            marketingRefuzat: marketing.filter((c) => !c.granted).length,
        },
        retentie: {
            total: retention.length,
            expirate: expirate.length,
            expiraCurand: curand.length,
            inTermen: retention.length - expirate.length - curand.length,
            celMaiApropiatTermen: termeneViitoare[0] ?? null,
        },
        furnizori: statusRes.data ?? [],
    });
}

const statusSchema = z.object({
    processorKey: z.string().min(1).max(100),
    accepted: z.boolean(),
    note: z.string().max(500).optional().default(''),
});

export async function POST(request: Request) {
    if (!isAdminAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { crm, response } = crmOr503();
    if (!crm) return response;

    let body: z.infer<typeof statusSchema>;
    try {
        body = statusSchema.parse(await request.json());
    } catch {
        return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error } = await crm.from('gdpr_processor_status').upsert(
        {
            processor_key: body.processorKey,
            accepted: body.accepted,
            accepted_at: body.accepted ? now : null,
            note: body.note || null,
            updated_at: now,
        },
        { onConflict: 'processor_key' }
    );

    if (error) {
        console.error('[api/gdpr] upsert status:', error.message);
        return NextResponse.json({ error: 'Nu s-a putut salva starea.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
