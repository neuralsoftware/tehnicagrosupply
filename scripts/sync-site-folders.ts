/**
 * Sincronizează structura de foldere pentru clipuri categorie în Supabase Storage (site marketing),
 * pe baza categoriilor **active** din admin (catalog/categories.json + statice), nu CRM.
 *
 * Creează `video/{slug}/` prin upload `.keep` doar dacă folderul e gol (fără niciun fișier).
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (recomandat pentru upload).
 *      Fallback: NEXT_PUBLIC_SUPABASE_ANON_KEY (poate eșua la RLS).
 */

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();
const pathEnv = resolve(root, '.env');
const pathEnvLocal = resolve(root, '.env.local');

/** Înainte de orice import care încarcă `@/lib/supabase` (chei goale → crash). */
if (existsSync(pathEnv)) config({ path: pathEnv });
if (existsSync(pathEnvLocal)) config({ path: pathEnvLocal, override: true });

const BUCKET = 'tehnicagro';
const VIDEO_ROOT = 'video';
const PLACEHOLDER = '.keep';

function normalizeEnvValue(v: string | undefined): string {
    if (v === undefined) return '';
    let s = v.trim();
    if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
    ) {
        s = s.slice(1, -1).trim();
    }
    return s;
}

async function main() {
    const { getActiveCategories, normalizeCategorySlugParam } = await import('../src/lib/products-store');
    const { EXTRA_VIDEO_FOLDER_SLUGS } = await import('../src/lib/site-video-paths');

    const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/+$/, '');
    const serviceKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const key = serviceKey || anonKey;

    if (!url || !key) {
        console.error(
            'Lipsesc NEXT_PUBLIC_SUPABASE_URL și (SUPABASE_SERVICE_ROLE_KEY sau NEXT_PUBLIC_SUPABASE_ANON_KEY).'
        );
        process.exit(1);
    }

    if (!serviceKey) {
        console.warn(
            '[sync-site-folders] Folosesc cheia anon — dacă upload-ul eșuează, setează SUPABASE_SERVICE_ROLE_KEY.'
        );
    }

    const admin = createClient(url, key, { auth: { persistSession: false } });

    const categories = await getActiveCategories();
    const slugs = [
        ...new Set([
            ...categories.map((c) => normalizeCategorySlugParam(c.slug)).filter(Boolean),
            ...EXTRA_VIDEO_FOLDER_SLUGS.map((s) => normalizeCategorySlugParam(s)).filter(Boolean),
        ]),
    ].sort((a, b) => a.localeCompare(b, 'en'));

    console.log('[sync-site-folders] Categorii active (site):', slugs.length, slugs.join(', '));

    for (const slug of slugs) {
        const prefix = `${VIDEO_ROOT}/${slug}`;
        const { data: listed, error: listErr } = await admin.storage
            .from(BUCKET)
            .list(prefix, { limit: 100, offset: 0 });

        if (listErr) {
            console.error('[sync-site-folders] list eșuat', prefix, listErr.message);
            continue;
        }

        if (listed && listed.length > 0) {
            console.log('[sync-site-folders] OK există conținut:', prefix, `(${listed.length} intrări)`);
            continue;
        }

        const placeholderPath = `${prefix}/${PLACEHOLDER}`;
        const body = new Uint8Array([
            35,
            32,
            112,
            108,
            97,
            99,
            101,
            104,
            111,
            108,
            100,
            101,
            114,
            32,
            115,
            105,
            116,
            101,
            10,
        ]); // "# placeholder site\n"

        const { error: upErr } = await admin.storage.from(BUCKET).upload(placeholderPath, body, {
            contentType: 'text/plain; charset=utf-8',
            upsert: false,
        });

        if (upErr) {
            console.error('[sync-site-folders] upload eșuat', placeholderPath, upErr.message);
            continue;
        }

        console.log('[sync-site-folders] Creat folder (placeholder):', prefix);
    }

    console.log('[sync-site-folders] Gata.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
