import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Aliniază valori .env copiate din JSON (ex. cheie între [ ] sau " ").
 */
function normalizeCrmEnvValue(v: string | undefined): string {
    if (v === undefined) return '';
    let s = v.trim();
    if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
    ) {
        s = s.slice(1, -1).trim();
    }
    s = s.replace(/^\s*\[\s*["']?/, '').replace(/["']?\s*\]\s*$/, '');
    return s.trim();
}

/**
 * Client Supabase DOAR pentru proiectul CRM (lead-uri, formulare).
 * NU folosi pentru catalog / produse / Storage marketing — acolo e `supabase` / `supabaseAdmin` (marketing).
 *
 * Env: CRM_SUPABASE_URL, CRM_SUPABASE_SERVICE_ROLE_KEY (ambele din proiectul Tehnicagri CRM).
 */
function buildCrmAdminClient(): SupabaseClient | null {
    const url = normalizeCrmEnvValue(process.env.CRM_SUPABASE_URL).replace(/\/+$/, '');
    const serviceKey = normalizeCrmEnvValue(process.env.CRM_SUPABASE_SERVICE_ROLE_KEY);
    if (!url || !serviceKey) {
        return null;
    }
    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

let cached: SupabaseClient | null | undefined;

export function getSupabaseCrmAdmin(): SupabaseClient | null {
    if (cached === undefined) {
        cached = buildCrmAdminClient();
    }
    return cached;
}

/** Pentru verificări fără a forța crearea clientului. */
export function isCrmSupabaseConfigured(): boolean {
    return Boolean(
        normalizeCrmEnvValue(process.env.CRM_SUPABASE_URL) &&
            normalizeCrmEnvValue(process.env.CRM_SUPABASE_SERVICE_ROLE_KEY)
    );
}
