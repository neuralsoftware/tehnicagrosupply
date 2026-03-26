import * as fs from 'fs';
import * as path from 'path';
import { PRODUCTS as STATIC_PRODUCTS } from '../src/data/products';
import { readJsonFromSupabase, uploadToSupabase } from '../src/lib/supabase';

const PRODUCTS_BLOB_KEY = 'catalog/products.json';

function loadEnvLocal(): void {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        return;
    }
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) {
            continue;
        }
        const eq = t.indexOf('=');
        if (eq <= 0) {
            continue;
        }
        const k = t.slice(0, eq).trim();
        let v = t.slice(eq + 1).trim();
        if (
            (v.startsWith('"') && v.endsWith('"')) ||
            (v.startsWith("'") && v.endsWith("'"))
        ) {
            v = v.slice(1, -1);
        }
        if (process.env[k] === undefined) {
            process.env[k] = v;
        }
    }
}

async function migrate() {
    loadEnvLocal();

    console.log('Începe migrarea imaginilor către Supabase Storage...');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error(
            'Lipsește NEXT_PUBLIC_SUPABASE_URL sau NEXT_PUBLIC_SUPABASE_ANON_KEY (verifică .env.local).'
        );
        return;
    }

    const dynamicProducts = await readJsonFromSupabase<Record<string, unknown>[]>(
        PRODUCTS_BLOB_KEY,
        []
    );
    if (dynamicProducts.length > 0) {
        console.log(`Am găsit ${dynamicProducts.length} produse dinamice în Storage.`);
    } else {
        console.log('Nu există încă catalog dinamic în Storage (se pornește de la lista goală).');
    }

    const dynamicSlugs = new Set(
        dynamicProducts.map((p) => (p as { slug?: string }).slug).filter(Boolean)
    );
    const allProducts = [
        ...STATIC_PRODUCTS.filter((p) => !dynamicSlugs.has(p.slug)),
        ...dynamicProducts,
    ];

    console.log(`Analizăm ${allProducts.length} produse pentru imagini locale...`);

    const updatedProducts: Record<string, unknown>[] = [];

    for (const product of allProducts) {
        const p = { ...product } as {
            name?: string;
            imageSrc?: string;
            slug?: string;
        };

        if (p.imageSrc && p.imageSrc.startsWith('/')) {
            const localPath = path.join(process.cwd(), 'public', p.imageSrc);

            if (fs.existsSync(localPath)) {
                console.log(`Se încarcă imaginea pentru [${p.name}]: ${p.imageSrc}`);

                try {
                    const fileBuffer = fs.readFileSync(localPath);
                    const contentType = p.imageSrc.endsWith('.png') ? 'image/png' : 'image/jpeg';
                    const base = path.basename(p.imageSrc).replace(/[^a-zA-Z0-9._-]/g, '_');
                    const storagePath = `products/${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${base}`;
                    const publicUrl = await uploadToSupabase(fileBuffer, storagePath, contentType);

                    console.log(`Succes: ${publicUrl}`);
                    p.imageSrc = publicUrl;
                } catch (uploadErr) {
                    console.error(`Eroare la încărcarea ${p.imageSrc}:`, uploadErr);
                }
            } else {
                console.warn(`Fișierul nu a fost găsit local: ${localPath}`);
            }
        } else {
            console.log(`Produsul [${p.name}] are deja o imagine externă / cloud.`);
        }

        updatedProducts.push(p);
    }

    console.log(`Se salvează lista finală (${updatedProducts.length} produse) în Supabase Storage...`);

    try {
        await uploadToSupabase(
            Buffer.from(JSON.stringify(updatedProducts), 'utf-8'),
            PRODUCTS_BLOB_KEY,
            'application/json'
        );
        console.log('Migrare finalizată. Catalog JSON actualizat în bucket.');
    } catch (saveErr) {
        console.error('Eroare la salvarea catalogului final:', saveErr);
    }
}

void migrate();
