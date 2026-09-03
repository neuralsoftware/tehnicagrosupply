export type ProductDemoVideo =
    | { kind: 'iframe'; src: string }
    | { kind: 'video'; src: string; mimeType: string };

function cleanUrl(raw: string): string {
    return raw.trim();
}

function getPathForExtension(raw: string): string {
    try {
        return new URL(raw).pathname.toLowerCase();
    } catch {
        return raw.split(/[?#]/)[0]?.toLowerCase() ?? raw.toLowerCase();
    }
}

function getDirectVideoMimeType(raw: string): string | null {
    const path = getPathForExtension(raw);
    if (path.endsWith('.mp4')) return 'video/mp4';
    if (path.endsWith('.mov')) return 'video/quicktime';
    if (path.endsWith('.webm')) return 'video/webm';
    return null;
}

/** youtube-nocookie.com nu scrie nimic pe dispozitiv până la redarea efectivă. */
const YT_EMBED_HOST = 'https://www.youtube-nocookie.com/embed/';

function getYouTubeEmbedUrl(raw: string): string | null {
    try {
        const url = new URL(raw);
        const host = url.hostname.replace(/^www\./, '').toLowerCase();
        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (url.pathname === '/watch') {
                const id = url.searchParams.get('v');
                return id ? `${YT_EMBED_HOST}${id}` : null;
            }
            if (url.pathname.startsWith('/shorts/')) {
                const id = url.pathname.split('/').filter(Boolean)[1];
                return id ? `${YT_EMBED_HOST}${id}` : null;
            }
            if (url.pathname.startsWith('/embed/')) {
                const id = url.pathname.split('/').filter(Boolean)[1];
                return id ? `${YT_EMBED_HOST}${id}${url.search}` : null;
            }
        }
        if (host === 'youtu.be') {
            const id = url.pathname.split('/').filter(Boolean)[0];
            return id ? `${YT_EMBED_HOST}${id}` : null;
        }
    } catch {
        /* fallback below */
    }

    if (raw.includes('youtube.com') || raw.includes('youtu.be')) {
        return raw.replace('watch?v=', 'embed/').replace('www.youtube.com', 'www.youtube-nocookie.com');
    }
    return null;
}

function getVimeoEmbedUrl(raw: string): string | null {
    try {
        const url = new URL(raw);
        const host = url.hostname.replace(/^www\./, '').toLowerCase();
        if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
        if (host === 'player.vimeo.com') return raw;
        const id = url.pathname.split('/').filter(Boolean)[0];
        return id ? `https://player.vimeo.com/video/${id}` : null;
    } catch {
        return null;
    }
}

export function resolveProductDemoVideo(raw: string | undefined | null): ProductDemoVideo | null {
    if (!raw) return null;
    const src = cleanUrl(raw);
    if (!src) return null;

    const directMimeType = getDirectVideoMimeType(src);
    if (directMimeType) return { kind: 'video', src, mimeType: directMimeType };

    const youtube = getYouTubeEmbedUrl(src);
    if (youtube) return { kind: 'iframe', src: youtube };

    const vimeo = getVimeoEmbedUrl(src);
    if (vimeo) return { kind: 'iframe', src: vimeo };

    return { kind: 'iframe', src };
}
