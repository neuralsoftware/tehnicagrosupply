import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
// Modulul rulează doar pe server (API routes / products-store). Scrierile în Storage
// folosesc SERVICE_ROLE ca să funcționeze după închiderea politicilor publice de scriere
// pe bucketul `tehnicagro`. Fallback pe anon doar dacă cheia de server lipsește.
const supabaseStorageKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseStorageKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKET = 'tehnicagro';

/**
 * Citește un fișier JSON din același bucket folosit de `uploadToSupabase`.
 */
export async function readJsonFromSupabase<T>(storagePath: string, fallback: T): Promise<T> {
    if (!supabaseUrl || !supabaseAnonKey) {
        return fallback;
    }

    const key = storagePath.replace(/^\/+/, '');

    try {
        const { data, error } = await supabase.storage.from(BUCKET).download(key);
        if (error || !data) {
            return fallback;
        }
        const text = await data.text();
        return JSON.parse(text) as T;
    } catch {
        return fallback;
    }
}

/**
 * Șterge obiecte din Storage după path relativ la rădăcina bucketului.
 */
export async function removeSupabaseObjectsAtPaths(paths: string[]): Promise<void> {
    if (!supabaseUrl || !supabaseAnonKey || paths.length === 0) {
        return;
    }

    const keys = paths.map((p) => p.replace(/^\/+/, '')).filter(Boolean);
    if (keys.length === 0) {
        return;
    }

    const { error } = await supabase.storage.from(BUCKET).remove(keys);
    if (error) {
        console.warn('[supabase] remove', error.message);
    }
}

/**
 * Extrage calea în bucket din URL public returnat de getPublicUrl (public bucket).
 */
/**
 * Căi existente sub un prefix de folder în bucket (ex. `materiale` → `materiale/a.pdf`).
 */
/** `null` = apel eșuat (nu folosi Set gol ca „nu există fișiere”). */
export async function getExistingObjectPathsInFolder(folderPrefix: string): Promise<Set<string> | null> {
    const out = new Set<string>();
    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }
    const prefix = folderPrefix.replace(/^\/+/, '').replace(/\/+$/, '');
    let offset = 0;
    const limit = 1000;
    for (;;) {
        const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
            limit,
            offset,
            sortBy: { column: 'name', order: 'asc' },
        });
        if (error) {
            console.warn('[supabase] list folder', prefix, error.message);
            return null;
        }
        if (!data?.length) {
            break;
        }
        for (const row of data) {
            if (row?.name) {
                out.add(`${prefix}/${row.name}`);
            }
        }
        if (data.length < limit) {
            break;
        }
        offset += limit;
    }
    return out;
}

/**
 * Verifică dacă un URL public răspunde (ex. PDF încă în Storage).
 */
export async function isPublicUrlReachable(url: string): Promise<boolean> {
    const u = (url || '').trim();
    if (!u) {
        return false;
    }
    try {
        const r = await fetch(u, { method: 'HEAD', cache: 'no-store' });
        if (r.ok) {
            return true;
        }
        if (r.status === 405) {
            const g = await fetch(u, {
                method: 'GET',
                headers: { Range: 'bytes=0-0' },
                cache: 'no-store',
            });
            return g.ok || g.status === 206;
        }
        return false;
    } catch {
        return false;
    }
}

export function supabasePublicUrlToPath(publicUrl: string): string | null {
    try {
        const u = new URL(publicUrl);
        const marker = `/storage/v1/object/public/${BUCKET}/`;
        const idx = u.pathname.indexOf(marker);
        if (idx === -1) {
            return null;
        }
        return decodeURIComponent(u.pathname.slice(idx + marker.length));
    } catch {
        return null;
    }
}

function safeDecodeStorageKey(segment: string): string {
    try {
        return decodeURIComponent(segment.split('?')[0] ?? segment);
    } catch {
        return segment.split('?')[0] ?? segment;
    }
}

/**
 * Șterge un obiect din Storage după URL-ul public returnat de upload (sau URL echivalent).
 */
export const deleteFromSupabase = async (fileUrl: string): Promise<void> => {
    if (!fileUrl?.trim()) {
        return;
    }
    try {
        const baseUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/`;
        let filePath: string | null = null;
        if (fileUrl.startsWith(baseUrl)) {
            filePath = safeDecodeStorageKey(fileUrl.slice(baseUrl.length));
        } else {
            filePath = supabasePublicUrlToPath(fileUrl);
        }
        if (!filePath) {
            return;
        }
        const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Eroare la stergerea din Supabase:', error);
    }
};

/**
 * Upload în Storage (bucket public). Suprascrie fișierul la același path dacă există (upsert).
 * @returns URL public (getPublicUrl), gata de folosit în browser.
 */
export const uploadToSupabase = async (
    fileBuffer: Buffer | Blob | File,
    fileName: string,
    contentType: string
): Promise<string> => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Lipsesc NEXT_PUBLIC_SUPABASE_URL sau NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    const path = fileName.replace(/^\/+/, '');

    const { data, error } = await supabase.storage.from(BUCKET).upload(path, fileBuffer, {
        contentType,
        upsert: true,
    });

    if (error) {
        throw error;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    return urlData.publicUrl;
};
