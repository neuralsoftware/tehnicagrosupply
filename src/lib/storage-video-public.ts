import { getR2VideoPublicUrl, supabaseVideoPublicUrlToR2Path } from '@/lib/r2-video-public';
import { HOME_SHOWCASE_STORAGE } from '@/lib/site-video-paths';

/** URL public pentru un obiect din `tehnicagro` (ex. `video/home-showcase/…`). */
export function getTehnicagroStoragePublicUrl(storageObjectPath: string): string {
    const key = storageObjectPath.replace(/^\/+/, '');
    return getR2VideoPublicUrl(key);
}

/** Mapare veche `/downloads/…` → cale Storage (singura sursă pentru MP4 pe site). */
const LEGACY_DOWNLOADS_TO_STORAGE: Record<string, string> = {
    '/downloads/video ADS 2026.mp4': HOME_SHOWCASE_STORAGE.aversAds,
    '/downloads/video KSE teren.mp4': HOME_SHOWCASE_STORAGE.flieglKseTeren,
};

/**
 * `heroVideoUrl` / `videoUrl`: URL absolut, cale `video/…` în bucket, sau legacy `/downloads/…`.
 */
export function resolveSiteVideoRef(ref: string | undefined | null): string | undefined {
    if (ref == null) return undefined;
    const t = String(ref).trim();
    if (!t) return undefined;
    if (/^https?:\/\//i.test(t)) {
        const r2Path = supabaseVideoPublicUrlToR2Path(t);
        return r2Path ? getTehnicagroStoragePublicUrl(r2Path) : t;
    }
    if (t.startsWith('video/')) return getTehnicagroStoragePublicUrl(t);
    const legacyKey = t.startsWith('/') ? t : `/${t}`;
    const mapped = LEGACY_DOWNLOADS_TO_STORAGE[legacyKey] ?? LEGACY_DOWNLOADS_TO_STORAGE[t];
    if (mapped) return getTehnicagroStoragePublicUrl(mapped);
    if (legacyKey.startsWith('/downloads/')) return undefined;
    return t;
}

function applyVideoFields<T extends { heroVideoUrl?: string; videoUrl?: string }>(p: T): T {
    return {
        ...p,
        heroVideoUrl: resolveSiteVideoRef(p.heroVideoUrl),
        videoUrl: resolveSiteVideoRef(p.videoUrl),
    };
}

/** Folosit în `getProducts` — toate referințele MP4 devin URL-uri Storage. */
export function resolveProductVideoUrls<T extends { heroVideoUrl?: string; videoUrl?: string }>(
    p: T
): T {
    return applyVideoFields(p);
}
