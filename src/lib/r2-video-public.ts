const DEFAULT_VIDEO_CDN_BASE_URL = 'https://pub-956963153a8e40c0852ae49d504d4f93.r2.dev';

const R2_PUBLIC_BASE_URL = (
    process.env.NEXT_PUBLIC_VIDEO_CDN_BASE_URL ||
    process.env.R2_PUBLIC_BASE_URL ||
    DEFAULT_VIDEO_CDN_BASE_URL
).replace(/\/+$/, '');

const SUPABASE_VIDEO_PATH_MARKER = '/storage/v1/object/public/tehnicagro/video/';

function encodeStoragePath(path: string): string {
    return path
        .replace(/^\/+/, '')
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
}

export function getR2VideoPublicUrl(storageObjectPath: string): string {
    return `${R2_PUBLIC_BASE_URL}/${encodeStoragePath(storageObjectPath)}`;
}

export function supabaseVideoPublicUrlToR2Path(publicUrl: string): string | null {
    try {
        const parsed = new URL(publicUrl);
        const markerIndex = parsed.pathname.indexOf(SUPABASE_VIDEO_PATH_MARKER);
        if (markerIndex === -1) return null;
        const encodedPath = parsed.pathname.slice(markerIndex + SUPABASE_VIDEO_PATH_MARKER.length);
        const decodedPath = encodedPath
            .split('/')
            .map((segment) => decodeURIComponent(segment))
            .join('/');
        return decodedPath ? `video/${decodedPath}` : null;
    } catch {
        return null;
    }
}
