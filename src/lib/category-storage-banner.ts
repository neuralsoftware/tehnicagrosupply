import { supabase } from '@/lib/supabase';
import { normalizeCategorySlugParam } from '@/lib/products-store';

const BUCKET = 'tehnicagro';
const VIDEO_ROOT = 'video';

function isBannerVideoFileName(name: string): boolean {
    const n = name.trim();
    if (!n || n.startsWith('.')) return false;
    const lower = n.toLowerCase();
    return lower.startsWith('banner-') && (lower.endsWith('.mp4') || lower.endsWith('.mov'));
}

function bannerVideoSortKey(fileName: string): string {
    const lower = fileName.toLowerCase();
    const extensionRank = lower.endsWith('.mp4') ? '0' : '1';
    return `${extensionRank}:${lower}`;
}

/**
 * Publică URL pentru clipul hero al categoriei din Storage (bucket site, nu CRM).
 * Cale: `tehnicagro` / `video/{slug-categorie}/banner-*.mp4|mov` (preferă MP4, apoi primul fișier după nume).
 */
export async function getCategoryBannerMp4PublicUrl(categorySlug: string): Promise<string | null> {
    const folder = normalizeCategorySlugParam(categorySlug);
    if (!folder) return null;

    const prefix = `${VIDEO_ROOT}/${folder}`;
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
        console.warn('[category-storage-banner] list', prefix, error.message);
        return null;
    }

    const candidates = (data ?? [])
        .map((row) => row.name)
        .filter((name): name is string => Boolean(name) && isBannerVideoFileName(name))
        .sort((a, b) => bannerVideoSortKey(a).localeCompare(bannerVideoSortKey(b), 'en'));

    const fileName = candidates[0];
    if (!fileName) return null;

    const objectPath = `${prefix}/${fileName}`;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    return pub?.publicUrl?.trim() || null;
}
