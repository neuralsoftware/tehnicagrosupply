import type { DynamicProduct } from '@/lib/products-store';

/** Clip fallback pentru paginile viticole când niciun produs din categorie nu are MP4 propriu. */
export const CATEGORY_HERO_PROVITIS_MP4 =
    'https://provitis.fr/wp-content/uploads/2025/02/Video-des-gammes-PROVITIS.mp4';

function isDirectMp4Url(raw: string): boolean {
    const u = raw.trim();
    if (!u) return false;
    const lower = u.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) {
        return false;
    }
    return lower.includes('.mp4');
}

/**
 * Extrage URL-uri unice către fișiere MP4 de la produsele din categorie
 * (`heroVideoUrl` sau `videoUrl` doar dacă arată ca link direct .mp4).
 */
export function collectCategoryHeroMp4Urls(products: DynamicProduct[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of products) {
        for (const key of ['heroVideoUrl', 'videoUrl'] as const) {
            const raw = p[key];
            if (typeof raw !== 'string') continue;
            const u = raw.trim();
            if (!isDirectMp4Url(u)) continue;
            if (seen.has(u)) continue;
            seen.add(u);
            out.push(u);
        }
    }
    return out;
}
