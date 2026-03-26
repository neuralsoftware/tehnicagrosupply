// ============================================================
// PRODUCTS STORE — Supabase Storage + Static JSON fallback
// ============================================================
// Products flow:
//   1. Static JSON files in /src/data/products/* (existing, never deleted)
//   2. Dynamic products stored in Supabase Storage as a single JSON array
//   3. This store merges both, with Storage overriding static on slug collision

import {
    readJsonFromSupabase,
    uploadToSupabase,
    deleteFromSupabase,
    getExistingObjectPathsInFolder,
    isPublicUrlReachable,
    supabasePublicUrlToPath,
} from '@/lib/supabase';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';

const PRODUCTS_BLOB_KEY = 'catalog/products.json';
const CATEGORIES_BLOB_KEY = 'catalog/categories.json';
const MATERIALE_BLOB_KEY = 'catalog/materiale.json';
const BROCHURE_PROFILES_BLOB_KEY = 'catalog/brochure-profiles.json';
/** Slug-uri ascunse explicit din catalog (ștergere admin); altfel produsele statice din repo reapăreau la refresh. */
const SUPPRESSED_SLUGS_KEY = 'catalog/suppressed-slugs.json';

/** Slug-uri vechi salvate în Blob / istoric → slug canonic din cod (redirect URL în next.config). */
const LEGACY_PRODUCT_SLUGS: Record<string, string> = {
    'green-plains-ads': 'multisem-ads',
};

export function normalizeLegacyProductSlug(slug: string): string {
    return LEGACY_PRODUCT_SLUGS[slug] || slug;
}

/** Acceptă active/draft indiferent de majuscule sau spații (date din Storage / import). Produse + categorii. */
function coerceActiveDraftStatus(v: unknown): 'active' | 'draft' | undefined {
    if (v === 'active' || v === 'draft') return v;
    if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        if (s === 'active') return 'active';
        if (s === 'draft') return 'draft';
    }
    return undefined;
}

function normalizeDynamicProductRow(p: DynamicProduct): DynamicProduct {
    const ns = normalizeLegacyProductSlug(p.slug);
    let id = p.id;
    if (p.id === 'avers-agro-green-plains-ads') id = 'avers-agro-multisem-ads';
    const statusNorm = coerceActiveDraftStatus(p.status);
    const patch =
        ns !== p.slug
            ? { slug: ns as string, id }
            : id !== p.id
              ? { id }
              : null;
    if (statusNorm !== undefined && statusNorm !== p.status) {
        const base = patch ? { ...p, ...patch } : { ...p };
        return { ...base, status: statusNorm };
    }
    if (patch) return { ...p, ...patch };
    return p;
}

/** După remap, pot exista două rânduri cu același slug — păstrăm cel mai recent (>= ca să câștige ultima salvare la același timestamp). */
function dedupeDynamicProductsBySlug(products: DynamicProduct[]): DynamicProduct[] {
    const bySlug = new Map<string, DynamicProduct>();
    for (const p of products) {
        const key = normalizeLegacyProductSlug(p.slug);
        const row = { ...p, slug: key };
        const cur = bySlug.get(key);
        if (!cur || row.updatedAt >= cur.updatedAt) {
            bySlug.set(key, row);
        }
    }
    return Array.from(bySlug.values());
}

export interface ProductReferenceLink {
    label: string;
    url: string;
}

/** Secțiuni detaliate pentru broșura PDF „deep dive” (un singur produs). */
export interface ProductFeatureBlock {
    image: string;
    title: string;
    description: string;
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
     * Rămân în Storage doar ca fallback la generare PDF pentru date vechi.
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
    /** Opțional: blocuri zig-zag în broșura dedicată unui singur produs (admin). */
    featureBlocks?: ProductFeatureBlock[];
}

export interface Category {
    slug: string;
    name: string;
    description?: string;
    status: 'active' | 'draft';
    createdAt: string;
    isStatic?: boolean; // true = hardcodat, nu poate fi șters
}

/**
 * Aliniază segmentul din URL cu slug-ul categoriei (caz, encoding, diacritice).
 * Evită 404 când utilizatorul ajunge la /utilaje/Viticol dar în baza de date e „viticol”.
 */
export function normalizeCategorySlugParam(param: string): string {
    return decodeURIComponent(String(param || ''))
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
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

async function readBlob<T>(key: string, fallback: T): Promise<T> {
    return readJsonFromSupabase(key, fallback);
}

async function writeBlob<T>(key: string, data: T): Promise<string> {
    return uploadToSupabase(Buffer.from(JSON.stringify(data), 'utf-8'), key, 'application/json');
}

/** Refuză salvarea dacă fișierul din Storage nu e listă — altfel riscăm să ștergem tot catalogul dinamic. */
function parseDynamicProductsFromStorage(raw: unknown): DynamicProduct[] {
    if (raw == null) {
        return [];
    }
    if (!Array.isArray(raw)) {
        throw new Error(
            'Catalogul din cloud (catalog/products.json) nu are forma corectă. Deschide Storage în Supabase și verifică fișierul — trebuie să fie o listă [...]. Până atunci nu putem salva, ca să nu pierdem datele.'
        );
    }
    return raw as DynamicProduct[];
}

function parseBrochureProfileMapFromStorage(raw: unknown): Record<string, ProductBrochureProfile> {
    if (raw == null || raw === '') {
        return {};
    }
    if (typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error(
            'Fișierul catalog/brochure-profiles.json din cloud nu este valid. Verifică în Supabase (trebuie obiect { ... }).'
        );
    }
    return { ...(raw as Record<string, ProductBrochureProfile>) };
}

async function getSuppressedSlugs(): Promise<Set<string>> {
    const raw = await readJsonFromSupabase<string[]>(SUPPRESSED_SLUGS_KEY, []);
    const list = Array.isArray(raw) ? raw : [];
    return new Set(list.map(normalizeLegacyProductSlug));
}

async function addSuppressedSlug(slug: string): Promise<void> {
    const canonical = normalizeLegacyProductSlug(slug);
    const rawList = await readJsonFromSupabase<string[]>(SUPPRESSED_SLUGS_KEY, []);
    const list = Array.isArray(rawList) ? rawList : [];
    if (!list.includes(canonical)) {
        list.push(canonical);
        await writeBlob(SUPPRESSED_SLUGS_KEY, list);
    }
}

async function removeSuppressedSlugIfPresent(slug: string): Promise<void> {
    const canonical = normalizeLegacyProductSlug(slug);
    const rawList = await readJsonFromSupabase<string[]>(SUPPRESSED_SLUGS_KEY, []);
    const list = Array.isArray(rawList) ? rawList : [];
    const next = list.filter((s) => normalizeLegacyProductSlug(s) !== canonical);
    if (next.length !== list.length) {
        await writeBlob(SUPPRESSED_SLUGS_KEY, next);
    }
}

function collectProductStorageUrls(product: DynamicProduct): string[] {
    const urls: string[] = [];
    const push = (u: unknown) => {
        if (typeof u === 'string' && u.trim()) {
            urls.push(u.trim());
        }
    };
    push(product.imageSrc);
    if (Array.isArray(product.gallery)) {
        for (const u of product.gallery) {
            push(u);
        }
    }
    if (Array.isArray(product.featureBlocks)) {
        for (const b of product.featureBlocks) {
            push(b?.image);
        }
    }
    return urls;
}

// ── PRODUCTS ──────────────────────────────────────────────

/** Peste rândul static (repo) aplicăm delta din Blob; nu pierdem nume/imagine dacă în Blob e ciornă incompletă. */
function overlayStaticWithDynamic(base: DynamicProduct, overlay: DynamicProduct): DynamicProduct {
    const str = (v: unknown, fallback: string) => {
        const s = typeof v === 'string' ? v.trim() : '';
        return s || fallback;
    };
    const specs =
        Array.isArray(overlay.specs) && overlay.specs.length > 0 ? overlay.specs : base.specs;
    const detailedSpecs =
        overlay.detailedSpecs && Object.keys(overlay.detailedSpecs).length > 0
            ? overlay.detailedSpecs
            : base.detailedSpecs;
    const overlaySt = coerceActiveDraftStatus(overlay.status);
    const status: 'active' | 'draft' =
        overlaySt !== undefined ? overlaySt : base.status;
    return {
        ...base,
        ...overlay,
        slug: overlay.slug,
        status,
        name: str(overlay.name, base.name),
        brand: str(overlay.brand, base.brand),
        category: str(overlay.category, base.category),
        description: str(overlay.description, base.description),
        imageSrc: str(overlay.imageSrc, base.imageSrc),
        expertVerdict: str(overlay.expertVerdict, base.expertVerdict),
        specs,
        detailedSpecs,
    };
}

export async function getProducts(): Promise<DynamicProduct[]> {
    const rawDynamicRaw = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
    const rawDynamic = Array.isArray(rawDynamicRaw) ? rawDynamicRaw : [];
    if (rawDynamicRaw != null && !Array.isArray(rawDynamicRaw)) {
        console.warn(
            '[products-store] catalog/products.json nu e o listă — se afișează doar produsele din cod până repari fișierul.'
        );
    }
    const dynamic = dedupeDynamicProductsBySlug(rawDynamic.map(normalizeDynamicProductRow));
    const staticConverted: DynamicProduct[] = STATIC_PRODUCTS.map(p => ({
        ...p,
        category: p.category as string,
        status: 'active' as const,
        specs: p.specs || [],
        detailedSpecs: p.detailedSpecs || {},
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
    }));
    const bySlug = new Map<string, DynamicProduct>();
    for (const p of staticConverted) {
        bySlug.set(p.slug, p);
    }
    for (const d of dynamic) {
        const base = bySlug.get(d.slug);
        bySlug.set(d.slug, base ? overlayStaticWithDynamic(base, d) : d);
    }
    const suppressed = await getSuppressedSlugs();
    return Array.from(bySlug.values()).filter(
        (p) => !suppressed.has(normalizeLegacyProductSlug(p.slug))
    );
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
    const rawCurrent = await readBlob<unknown>(PRODUCTS_BLOB_KEY, []);
    const current = parseDynamicProductsFromStorage(rawCurrent);
    const idx = current.findIndex(
        (p) => normalizeLegacyProductSlug(p.slug) === normalizeLegacyProductSlug(product.slug)
    );
    const now = new Date().toISOString();
    const base = idx >= 0 ? { ...current[idx] } : {};
    const merged: DynamicProduct = {
        ...(base as DynamicProduct),
        ...product,
        slug: product.slug,
        updatedAt: now,
    };
    if (!merged.createdAt) merged.createdAt = idx >= 0 ? (base as DynamicProduct).createdAt || now : now;
    const st = coerceActiveDraftStatus(product.status);
    if (st !== undefined) merged.status = st;
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
    try {
        await removeSuppressedSlugIfPresent(product.slug);
    } catch (e) {
        console.warn('[products-store] Nu am putut actualiza suppressed-slugs (produsul e salvat):', e);
    }
}

export async function deleteProduct(slug: string): Promise<void> {
    const canonical = normalizeLegacyProductSlug(slug);
    const rawCur = await readBlob<unknown>(PRODUCTS_BLOB_KEY, []);
    const current = parseDynamicProductsFromStorage(rawCur);
    const row = current.find((p) => normalizeLegacyProductSlug(p.slug) === canonical);
    await deleteBrochureProfile(canonical);
    const filtered = current.filter((p) => normalizeLegacyProductSlug(p.slug) !== canonical);
    await writeBlob(PRODUCTS_BLOB_KEY, filtered);
    await addSuppressedSlug(canonical);
    if (row) {
        for (const url of collectProductStorageUrls(row)) {
            await deleteFromSupabase(url);
        }
    }
}

// ── BROCHURE PRODUCT PROFILES (PDF-only enrichment) ───────

export async function getBrochureProfilesMap(): Promise<Record<string, ProductBrochureProfile>> {
    const rawUnknown = await readBlob<unknown>(BROCHURE_PROFILES_BLOB_KEY, {});
    const raw =
        rawUnknown && typeof rawUnknown === 'object' && !Array.isArray(rawUnknown)
            ? (rawUnknown as Record<string, ProductBrochureProfile>)
            : {};
    if (rawUnknown != null && (typeof rawUnknown !== 'object' || Array.isArray(rawUnknown))) {
        console.warn('[products-store] brochure-profiles.json nu e obiect — profilurile PDF sunt ignorate la citire.');
    }
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
    const rawMap = await readBlob<unknown>(BROCHURE_PROFILES_BLOB_KEY, {});
    const map = parseBrochureProfileMapFromStorage(rawMap);
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
    const rawMap = await readBlob<unknown>(BROCHURE_PROFILES_BLOB_KEY, {});
    const map = parseBrochureProfileMapFromStorage(rawMap);
    const target = normalizeLegacyProductSlug(slug);
    for (const k of Object.keys(map)) {
        if (normalizeLegacyProductSlug(k) !== target) continue;
        const prof = map[k];
        if (prof?.gallery?.length) {
            for (const u of prof.gallery) {
                if (typeof u === 'string' && u.trim()) {
                    await deleteFromSupabase(u.trim());
                }
            }
        }
        delete map[k];
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

function parseCategoriesFromStorage(raw: unknown): Category[] {
    if (raw == null) {
        return [];
    }
    if (!Array.isArray(raw)) {
        console.warn(
            '[products-store] catalog/categories.json nu e o listă — categoriile din cloud sunt ignorate până repari fișierul.'
        );
        return [];
    }
    return raw as Category[];
}

function normalizeCategoryRow(c: Category): Category {
    const st = coerceActiveDraftStatus(c.status) ?? 'draft';
    const slug = String(c.slug || '').trim();
    return { ...c, slug, status: st };
}

export async function getCategories(): Promise<Category[]> {
    const rawDynamic = await readBlob<unknown>(CATEGORIES_BLOB_KEY, []);
    const dynamic = parseCategoriesFromStorage(rawDynamic).map(normalizeCategoryRow);
    const dynamicSlugs = new Set(dynamic.map((c) => normalizeCategorySlugParam(c.slug)));
    const merged = [
        ...STATIC_CATEGORIES.filter(
            (c) => !dynamicSlugs.has(normalizeCategorySlugParam(c.slug))
        ).map(normalizeCategoryRow),
        ...dynamic,
    ];
    return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getActiveCategories(): Promise<Category[]> {
    const cats = await getCategories();
    return cats.filter(c => c.status === 'active');
}

export async function saveCategory(category: Category): Promise<void> {
    const raw = await readBlob<unknown>(CATEGORIES_BLOB_KEY, []);
    const current = parseCategoriesFromStorage(raw);
    const slug = normalizeCategorySlugParam(String(category.slug || ''));
    const idx = current.findIndex((c) => normalizeCategorySlugParam(c.slug) === slug);
    const previous = idx >= 0 ? current[idx] : null;
    const st = coerceActiveDraftStatus(category.status);
    const merged: Category = {
        ...(previous ?? ({} as Partial<Category>)),
        ...category,
        slug,
        name: String(category.name ?? previous?.name ?? '').trim(),
        status: st ?? coerceActiveDraftStatus(previous?.status) ?? 'draft',
        createdAt: previous?.createdAt ?? category.createdAt ?? new Date().toISOString(),
    };
    if (previous?.isStatic || category.isStatic) {
        merged.isStatic = true;
    }
    if (idx >= 0) {
        current[idx] = merged;
    } else {
        current.push(merged);
    }
    await writeBlob(CATEGORIES_BLOB_KEY, current);
}

export async function deleteCategory(slug: string): Promise<void> {
    const raw = await readBlob<unknown>(CATEGORIES_BLOB_KEY, []);
    const current = parseCategoriesFromStorage(raw);
    const key = normalizeCategorySlugParam(slug);
    await writeBlob(
        CATEGORIES_BLOB_KEY,
        current.filter((c) => normalizeCategorySlugParam(c.slug) !== key)
    );
}

// ── BROCHURES ─────────────────────────────────────────────

/**
 * Lista din admin citește doar catalog/materiale.json; dacă PDF-urile sunt șterse manual din Storage,
 * intrările rămân în JSON. Aici aliniem JSON-ul la fișierele reale din folderul materiale/.
 */
async function reconcileBrochureCatalogWithStorage(raw: Brochure[]): Promise<Brochure[]> {
    const materialePaths = await getExistingObjectPathsInFolder('materiale');
    if (materialePaths === null) {
        return raw;
    }

    const kept: Brochure[] = [];
    for (const b of raw) {
        const url = (b.publicUrl || '').trim();
        if (!url) {
            continue;
        }

        const path = supabasePublicUrlToPath(url);

        if (path?.startsWith('materiale/')) {
            if (materialePaths.has(path)) {
                kept.push(b);
            }
            continue;
        }

        if (/blob\.vercel-storage\.com/i.test(url)) {
            continue;
        }

        if (path) {
            if (await isPublicUrlReachable(url)) {
                kept.push(b);
            }
            continue;
        }

        if (await isPublicUrlReachable(url)) {
            kept.push(b);
        }
    }

    if (kept.length !== raw.length) {
        await writeBlob(MATERIALE_BLOB_KEY, kept);
    }
    return kept;
}

export async function getBrochures(): Promise<Brochure[]> {
    const list = await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
    const reconciled = await reconcileBrochureCatalogWithStorage(list);
    return reconciled.map((b) => ({
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
    const next = current.filter((b) => b.id !== id);
    await writeBlob(MATERIALE_BLOB_KEY, next);
    if (found?.publicUrl) {
        await deleteFromSupabase(found.publicUrl);
    }
}
