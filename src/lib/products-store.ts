// ============================================================
// PRODUCTS STORE — Vercel Blob + Static JSON fallback
// ============================================================
// Products flow:
//   1. Static JSON files in /src/data/products/* (existing, never deleted)
//   2. Dynamic products stored in Vercel Blob as a single JSON array
//   3. This store merges both, with Blob overriding static on slug collision

import { put, list, del } from '@vercel/blob';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';

const PRODUCTS_BLOB_KEY = 'catalog/products.json';
const CATEGORIES_BLOB_KEY = 'catalog/categories.json';
const MATERIALE_BLOB_KEY = 'catalog/materiale.json';
const BROCHURE_PROFILES_BLOB_KEY = 'catalog/brochure-profiles.json';

/** Slug-uri vechi salvate în Blob / istoric → slug canonic din cod (redirect URL în next.config). */
const LEGACY_PRODUCT_SLUGS: Record<string, string> = {
    'green-plains-ads': 'multisem-ads',
};

export function normalizeLegacyProductSlug(slug: string): string {
    return LEGACY_PRODUCT_SLUGS[slug] || slug;
}

function normalizeDynamicProductRow(p: DynamicProduct): DynamicProduct {
    const ns = normalizeLegacyProductSlug(p.slug);
    if (ns === p.slug) return p;
    let id = p.id;
    if (p.id === 'avers-agro-green-plains-ads') id = 'avers-agro-multisem-ads';
    return { ...p, slug: ns, id };
}

/** După remap, pot exista două rânduri cu același slug — păstrăm cel mai recent. */
function dedupeDynamicProductsBySlug(products: DynamicProduct[]): DynamicProduct[] {
    const bySlug = new Map<string, DynamicProduct>();
    for (const p of products) {
        const cur = bySlug.get(p.slug);
        if (!cur || p.updatedAt > cur.updatedAt) bySlug.set(p.slug, p);
    }
    return Array.from(bySlug.values());
}

export interface ProductReferenceLink {
    label: string;
    url: string;
}

export interface DynamicProduct {
    id: string;
    slug: string;
    category: string;
    name: string;
    brand: string;
    badge?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description: string;
    longDescription?: string;
    imageSrc: string;
    /**
     * @deprecated Pentru PDF folosiți `ProductBrochureProfile` (tab „Date broșură”).
     * Rămân în blob doar ca fallback la generare PDF pentru date vechi.
     */
    gallery?: string[];
    /** @deprecated Vezi profil broșură */
    manufacturerUrl?: string;
    /** @deprecated Vezi profil broșură */
    referenceLinks?: ProductReferenceLink[];
    specs: string[];
    specIcons?: { icon: string; label: string; value: string }[];
    detailedSpecs: Record<string, Record<string, string>>;
    expertVerdict: string;
    videoUrl?: string;
    priceRange?: string;
    eligibility?: string;
    metaTitle?: string;
    metaDescription?: string;
    status: 'active' | 'draft';
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    slug: string;
    name: string;
    description?: string;
    status: 'active' | 'draft';
    createdAt: string;
    isStatic?: boolean; // true = hardcodat, nu poate fi șters
}

export interface Brochure {
    id: string;
    title: string;
    subtitle?: string;
    publicUrl: string;
    createdAt: string;
    productSlugs: string[];
    config: Record<string, any>;
}

/** Conținut bogat doar pentru broșuri PDF — nu este folosit pe site public */
export interface ProductBrochureProfile {
    slug: string;
    gallery?: string[];
    manufacturerUrl?: string;
    referenceLinks?: ProductReferenceLink[];
    /** Text principal în PDF (înlocuiește descrierea lungă a produsului în broșură) */
    brochureDescription?: string;
    updatedAt: string;
}

// Helper: read JSON from Blob
async function readBlob<T>(key: string, fallback: T): Promise<T> {
    try {
        const { blobs } = await list({ prefix: key });
        if (blobs.length === 0) return fallback;
        const blob = blobs.find(b => b.pathname === key);
        if (!blob) return fallback;
        const res = await fetch(blob.url);
        if (!res.ok) return fallback;
        return await res.json();
    } catch {
        return fallback;
    }
}

// Helper: write JSON to Blob
async function writeBlob<T>(key: string, data: T): Promise<string> {
    const blob = await put(key, JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
    });
    return blob.url;
}

// ── PRODUCTS ──────────────────────────────────────────────

export async function getProducts(): Promise<DynamicProduct[]> {
    const rawDynamic = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
    const dynamic = dedupeDynamicProductsBySlug(rawDynamic.map(normalizeDynamicProductRow));
    // Merge: static products converted to DynamicProduct shape, dynamic override
    const staticConverted: DynamicProduct[] = STATIC_PRODUCTS.map(p => ({
        ...p,
        category: p.category as string,
        status: 'active' as const,
        specs: p.specs || [],
        detailedSpecs: p.detailedSpecs || {},
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
    }));
    const dynamicSlugs = new Set(dynamic.map(p => p.slug));
    const merged = [...staticConverted.filter(p => !dynamicSlugs.has(p.slug)), ...dynamic];
    return merged;
}

export async function getProductBySlug(slug: string): Promise<DynamicProduct | null> {
    const products = await getProducts();
    const canonical = normalizeLegacyProductSlug(slug);
    return products.find(p => p.slug === canonical) || null;
}

export async function saveProduct(
    product: DynamicProduct,
    options?: { siteCatalogOnly?: boolean }
): Promise<void> {
    product = normalizeDynamicProductRow(product);
    const current = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
    const idx = current.findIndex(p => normalizeLegacyProductSlug(p.slug) === product.slug);
    const now = new Date().toISOString();
    const base = idx >= 0 ? { ...current[idx] } : {};
    const merged: DynamicProduct = {
        ...(base as DynamicProduct),
        ...product,
        slug: product.slug,
        updatedAt: now,
    };
    if (!merged.createdAt) merged.createdAt = idx >= 0 ? (base as DynamicProduct).createdAt || now : now;
    if (options?.siteCatalogOnly) {
        delete (merged as Partial<DynamicProduct>).gallery;
        delete (merged as Partial<DynamicProduct>).manufacturerUrl;
        delete (merged as Partial<DynamicProduct>).referenceLinks;
    }
    if (idx >= 0) {
        current[idx] = merged;
    } else {
        current.push(merged);
    }
    await writeBlob(PRODUCTS_BLOB_KEY, current);
}

export async function deleteProduct(slug: string): Promise<void> {
    const canonical = normalizeLegacyProductSlug(slug);
    const current = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
    await writeBlob(
        PRODUCTS_BLOB_KEY,
        current.filter(p => normalizeLegacyProductSlug(p.slug) !== canonical)
    );
    await deleteBrochureProfile(canonical);
}

// ── BROCHURE PRODUCT PROFILES (PDF-only enrichment) ───────

export async function getBrochureProfilesMap(): Promise<Record<string, ProductBrochureProfile>> {
    const raw = await readBlob<Record<string, ProductBrochureProfile>>(BROCHURE_PROFILES_BLOB_KEY, {});
    const out: Record<string, ProductBrochureProfile> = {};
    for (const [key, prof] of Object.entries(raw)) {
        const ns = normalizeLegacyProductSlug(key);
        const prev = out[ns];
        const next = { ...prof, slug: ns };
        if (!prev || (prev.updatedAt || '') < (next.updatedAt || '')) out[ns] = next;
    }
    return out;
}

export async function saveBrochureProfile(
    slug: string,
    patch: Partial<Omit<ProductBrochureProfile, 'slug' | 'updatedAt'>>
): Promise<void> {
    slug = normalizeLegacyProductSlug(slug);
    const map = await readBlob<Record<string, ProductBrochureProfile>>(BROCHURE_PROFILES_BLOB_KEY, {});
    for (const k of Object.keys(map)) {
        if (k !== slug && normalizeLegacyProductSlug(k) === slug) delete map[k];
    }
    const prev = map[slug];
    map[slug] = {
        ...prev,
        ...patch,
        slug,
        updatedAt: new Date().toISOString(),
    };
    await writeBlob(BROCHURE_PROFILES_BLOB_KEY, map);
}

export async function deleteBrochureProfile(slug: string): Promise<void> {
    const map = await readBlob<Record<string, ProductBrochureProfile>>(BROCHURE_PROFILES_BLOB_KEY, {});
    const target = normalizeLegacyProductSlug(slug);
    for (const k of Object.keys(map)) {
        if (normalizeLegacyProductSlug(k) === target) delete map[k];
    }
    await writeBlob(BROCHURE_PROFILES_BLOB_KEY, map);
}

/** Combinație produs + profil broșură pentru randare PDF */
/** Pregătește produsul pentru randare PDF: conținut broșură + imagini, fără URL-uri producător (document 100% TehnicAgro). */
export function mergeProductForPdf(
    product: DynamicProduct,
    profiles: Record<string, ProductBrochureProfile>
): DynamicProduct {
    const bp = profiles[product.slug];
    const merged: DynamicProduct =
        !bp
            ? {
                  ...product,
                  longDescription: product.longDescription || product.description,
              }
            : {
                  ...product,
                  gallery: bp.gallery !== undefined ? bp.gallery : product.gallery,
                  longDescription: bp.brochureDescription ?? product.longDescription ?? product.description,
              };
    const pdfOnly = { ...merged };
    delete (pdfOnly as Partial<DynamicProduct>).manufacturerUrl;
    delete (pdfOnly as Partial<DynamicProduct>).referenceLinks;
    if (pdfOnly.slug === 'multisem-ads' && /green\s*plains/i.test(pdfOnly.name || '')) {
        return { ...pdfOnly, name: 'Avers-Agro Multisem ADS' };
    }
    return pdfOnly;
}

// ── CATEGORIES ────────────────────────────────────────────

const STATIC_CATEGORIES: Category[] = [
    { slug: 'pregatire-sol', name: 'Pregătire Sol', status: 'active', isStatic: true, createdAt: '2025-01-01T00:00:00Z' },
    { slug: 'semanat-fertilizat', name: 'Semănat & Fertilizat', status: 'active', isStatic: true, createdAt: '2025-01-01T00:00:00Z' },
    { slug: 'recoltare-logistica', name: 'Recoltare & Logistică', status: 'active', isStatic: true, createdAt: '2025-01-01T00:00:00Z' },
    { slug: 'protectia-plantelor', name: 'Protecția Plantelor', status: 'draft', isStatic: true, createdAt: '2025-01-01T00:00:00Z' },
];

export async function getCategories(): Promise<Category[]> {
    const dynamic = await readBlob<Category[]>(CATEGORIES_BLOB_KEY, []);
    const dynamicSlugs = new Set(dynamic.map(c => c.slug));
    // Static categories can be overridden (e.g. status changed) by dynamic versions
    const merged = [...STATIC_CATEGORIES.filter(c => !dynamicSlugs.has(c.slug)), ...dynamic];
    return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getActiveCategories(): Promise<Category[]> {
    const cats = await getCategories();
    return cats.filter(c => c.status === 'active');
}

export async function saveCategory(category: Category): Promise<void> {
    const current = await readBlob<Category[]>(CATEGORIES_BLOB_KEY, []);
    const idx = current.findIndex(c => c.slug === category.slug);
    if (idx >= 0) {
        current[idx] = category;
    } else {
        current.push({ ...category, createdAt: new Date().toISOString() });
    }
    await writeBlob(CATEGORIES_BLOB_KEY, current);
}

export async function deleteCategory(slug: string): Promise<void> {
    const current = await readBlob<Category[]>(CATEGORIES_BLOB_KEY, []);
    await writeBlob(CATEGORIES_BLOB_KEY, current.filter(c => c.slug !== slug));
}

// ── BROCHURES ─────────────────────────────────────────────

export async function getBrochures(): Promise<Brochure[]> {
    const list = await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
    return list.map((b) => ({
        ...b,
        productSlugs: [...new Set((b.productSlugs || []).map(normalizeLegacyProductSlug))],
    }));
}

export async function saveBrochure(brochure: Brochure): Promise<void> {
    const current = await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
    current.unshift(brochure); // newest first
    // Keep only last 50
    await writeBlob(MATERIALE_BLOB_KEY, current.slice(0, 50));
}

export async function deleteBrochure(id: string): Promise<void> {
    const current = await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
    const found = current.find((b) => b.id === id);
    if (found?.publicUrl && /blob\.vercel-storage\.com/i.test(found.publicUrl)) {
        try {
            await del(found.publicUrl);
        } catch (e) {
            console.warn('[catalog] Nu s-a putut șterge PDF-ul din Blob (istoricul JSON se actualizează oricum):', e);
        }
    }
    await writeBlob(
        MATERIALE_BLOB_KEY,
        current.filter((b) => b.id !== id)
    );
}
