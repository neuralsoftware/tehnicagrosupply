import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase DOAR pentru proiectul CRM (lead-uri, formulare).
 * NU folosi pentru catalog / produse / Storage marketing — acolo e `supabase` / `supabaseAdmin` (marketing).
 *
 * Env: CRM_SUPABASE_URL, CRM_SUPABASE_SERVICE_ROLE_KEY (ambele din proiectul Tehnicagri CRM).
 */
function buildCrmAdminClient(): SupabaseClient | null {
    const url = process.env.CRM_SUPABASE_URL?.trim();
    const serviceKey = process.env.CRM_SUPABASE_SERVICE_ROLE_KEY?.trim();
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
    return Boolean(process.env.CRM_SUPABASE_URL?.trim() && process.env.CRM_SUPABASE_SERVICE_ROLE_KEY?.trim());
}
