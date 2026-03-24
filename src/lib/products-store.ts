// ============================================================
// PRODUCTS STORE — Vercel Blob + Static JSON fallback
// ============================================================
// Products flow:
//   1. Static JSON files in /src/data/products/* (existing, never deleted)
//   2. Dynamic products stored in Vercel Blob as a single JSON array
//   3. This store merges both, with Blob overriding static on slug collision

import { put, list } from '@vercel/blob';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';

const PRODUCTS_BLOB_KEY = 'catalog/products.json';
const CATEGORIES_BLOB_KEY = 'catalog/categories.json';
const MATERIALE_BLOB_KEY = 'catalog/materiale.json';

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
    const dynamic = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
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
    return products.find(p => p.slug === slug) || null;
}

export async function saveProduct(product: DynamicProduct): Promise<void> {
    const current = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
    const idx = current.findIndex(p => p.slug === product.slug);
    if (idx >= 0) {
        current[idx] = { ...product, updatedAt: new Date().toISOString() };
    } else {
        current.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    await writeBlob(PRODUCTS_BLOB_KEY, current);
}

export async function deleteProduct(slug: string): Promise<void> {
    const current = await readBlob<DynamicProduct[]>(PRODUCTS_BLOB_KEY, []);
    await writeBlob(PRODUCTS_BLOB_KEY, current.filter(p => p.slug !== slug));
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
    return await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
}

export async function saveBrochure(brochure: Brochure): Promise<void> {
    const current = await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
    current.unshift(brochure); // newest first
    // Keep only last 50
    await writeBlob(MATERIALE_BLOB_KEY, current.slice(0, 50));
}

export async function deleteBrochure(id: string): Promise<void> {
    const current = await readBlob<Brochure[]>(MATERIALE_BLOB_KEY, []);
    await writeBlob(MATERIALE_BLOB_KEY, current.filter(b => b.id !== id));
}
