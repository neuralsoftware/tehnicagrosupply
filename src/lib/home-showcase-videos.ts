import { supabase, isPublicUrlReachable } from '@/lib/supabase';

const BUCKET = 'tehnicagro';

/**
 * Dacă `storagePath` există în bucket public, folosește URL-ul public; altfel fallback local (ex. /downloads/...).
 */
export async function resolveShowcaseVideoUrl(
    storagePath: string,
    localFallback: string
): Promise<string> {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const url = data?.publicUrl?.trim();
    if (!url) {
        return localFallback;
    }
    if (await isPublicUrlReachable(url)) {
        return url;
    }
    return localFallback;
}
