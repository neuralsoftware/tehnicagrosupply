/**
 * Încarcă în Supabase Storage (bucket tehnicagro) cele două MP4 folosite pe home în VideoGallery.
 * Surse locale implicite (nume cu spații, ca în codul vechi):
 *   - public/downloads/video ADS 2026.mp4  → video/home-showcase/showcase-avers-ads.mp4
 *   - public/downloads/video KSE teren.mp4 → video/home-showcase/showcase-fliegl-kse-teren.mp4
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (recomandat).
 */

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();
const pathEnv = resolve(root, '.env');
const pathEnvLocal = resolve(root, '.env.local');

if (existsSync(pathEnv)) config({ path: pathEnv });
if (existsSync(pathEnvLocal)) config({ path: pathEnvLocal, override: true });

const BUCKET = 'tehnicagro';

const UPLOADS: { localRelative: string; storagePath: string; contentType: string }[] = [
    {
        localRelative: 'public/downloads/video ADS 2026.mp4',
        storagePath: 'video/home-showcase/showcase-avers-ads.mp4',
        contentType: 'video/mp4',
    },
    {
        localRelative: 'public/downloads/video KSE teren.mp4',
        storagePath: 'video/home-showcase/showcase-fliegl-kse-teren.mp4',
        contentType: 'video/mp4',
    },
];

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
    const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/+$/, '');
    const serviceKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const key = serviceKey || anonKey;

    if (!url || !key) {
        console.error('Lipsesc NEXT_PUBLIC_SUPABASE_URL și cheia Supabase.');
        process.exit(1);
    }

    if (!serviceKey) {
        console.warn('Recomandat: SUPABASE_SERVICE_ROLE_KEY pentru upload sigur.');
    }

    const admin = createClient(url, key, { auth: { persistSession: false } });

    for (const item of UPLOADS) {
        const abs = resolve(root, item.localRelative);
        if (!existsSync(abs)) {
            console.warn('[skip] Fișier local lipsă:', item.localRelative);
            console.warn('       Pune MP4-urile la aceste căi sau modifică UPLOADS în script.');
            continue;
        }

        const buf = await readFile(abs);

        const { error } = await admin.storage.from(BUCKET).upload(item.storagePath, buf, {
            contentType: item.contentType,
            upsert: true,
        });

        if (error) {
            console.error('Upload eșuat', item.storagePath, error.message);
            continue;
        }

        const { data } = admin.storage.from(BUCKET).getPublicUrl(item.storagePath);
        console.log('OK', item.storagePath, '→', data.publicUrl);
    }

    console.log('Gata.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
