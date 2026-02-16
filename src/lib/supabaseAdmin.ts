import { createClient } from '@supabase/supabase-js';

// FORCED for debugging: Eliminate env var issues completely
const supabaseUrl = "https://qhubxraakdceeemtqyip.supabase.co";
// FALLBACK: Use provided key if env var is missing to ensure Vercel deployment works immediately
// FORCED for debugging: The env var in Vercel might be invalid/stale, so we force the known working key.
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodWJ4cmFha2RjZWVlbXRxeWlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5MTAyMSwiZXhwIjoyMDg0NjY3MDIxfQ.mQzik5wypUdLhv-Da5f-xYaW6R0P4GX7QPs4EZZ4jjQ";

// Create a supabase client with the SERVICE_ROLE key
// This client bypasses Row Level Security and should ONLY be used in server-side API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
