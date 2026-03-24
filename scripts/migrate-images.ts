import { put, list } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import { PRODUCTS as STATIC_PRODUCTS } from '../src/data/products';

const PRODUCTS_BLOB_KEY = 'catalog/products.json';

async function migrate() {
    console.log('🚀 Începe migrarea imaginilor către Vercel Blob...');

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ Lipsește BLOB_READ_WRITE_TOKEN în variabilele de mediu.');
        return;
    }

    // 1. Get current dynamic products from Blob
    let dynamicProducts: any[] = [];
    try {
        const { blobs } = await list({ prefix: PRODUCTS_BLOB_KEY });
        const blob = blobs.find(b => b.pathname === PRODUCTS_BLOB_KEY);
        if (blob) {
            const res = await fetch(blob.url);
            dynamicProducts = await res.json();
            console.log(`📦 Am găsit ${dynamicProducts.length} produse dinamice pe Blob.`);
        }
    } catch (err) {
        console.log('ℹ️ Nu există produse dinamice pe Blob încă.');
    }

    // 2. Merge with static products to get a full list to migrate
    const dynamicSlugs = new Set(dynamicProducts.map(p => p.slug));
    const allProducts = [
        ...STATIC_PRODUCTS.filter(p => !dynamicSlugs.has(p.slug)),
        ...dynamicProducts
    ];

    console.log(`🔍 Analizăm ${allProducts.length} produse pentru imagini locale...`);

    const updatedProducts = [];

    for (const product of allProducts) {
        const p = { ...product };
        
        // Check if image is local (starts with /)
        if (p.imageSrc && p.imageSrc.startsWith('/')) {
            const localPath = path.join(process.cwd(), 'public', p.imageSrc);
            
            if (fs.existsSync(localPath)) {
                console.log(`📤 Se încarcă imaginea pentru [${p.name}]: ${p.imageSrc}`);
                
                try {
                    const fileBuffer = fs.readFileSync(localPath);
                    const contentType = p.imageSrc.endsWith('.png') ? 'image/png' : 'image/jpeg';
                    
                    const blobResult = await put(`products/${path.basename(p.imageSrc)}`, fileBuffer, {
                        access: 'public',
                        contentType,
                        addRandomSuffix: true,
                    });
                    
                    console.log(`✅ Succes: ${blobResult.url}`);
                    p.imageSrc = blobResult.url;
                } catch (uploadErr) {
                    console.error(`❌ Eroare la încărcarea ${p.imageSrc}:`, uploadErr);
                }
            } else {
                console.warn(`⚠️ Fișierul nu a fost găsit local: ${localPath}`);
            }
        } else {
            console.log(`ℹ️ Produsul [${p.name}] are deja o imagine externă/Blob.`);
        }
        
        updatedProducts.push(p);
    }

    // 3. Save the full list back to Blob as dynamic products
    console.log(`💾 Se salvează lista finală (${updatedProducts.length} produse) pe Vercel Blob...`);
    
    try {
        const finalBlobResult = await put(PRODUCTS_BLOB_KEY, JSON.stringify(updatedProducts), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
        });
        console.log(`✨ Migrare finalizată cu succes!`);
        console.log(`🔗 Catalog JSON: ${finalBlobResult.url}`);
    } catch (saveErr) {
        console.error('❌ Eroare la salvarea catalogului final:', saveErr);
    }
}

migrate();
