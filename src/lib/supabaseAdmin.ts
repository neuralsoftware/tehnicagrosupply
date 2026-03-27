import { createClient } from '@supabase/supabase-js';

/**
 * Marketing / catalog (Tehnicagro): același proiect ca `NEXT_PUBLIC_SUPABASE_URL`.
 * Pentru lead-uri și CRM folosește `getSupabaseCrmAdmin()` (`CRM_SUPABASE_*`).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';

// Client cu SERVICE_ROLE — bypass RLS; doar server. NU folosi pentru tabelul CRM `clients`.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
