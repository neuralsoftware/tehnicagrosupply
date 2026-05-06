import { deleteFromSupabase, readJsonFromSupabase, uploadToSupabase } from '@/lib/supabase';

const PROMOTIONS_BLOB_KEY = 'catalog/promotions.json';

export type PromotionStatus = 'active' | 'draft';
export type PromotionKind = 'pdf' | 'template';

export interface Promotion {
    id: string;
    slug: string;
    title: string;
    kind: PromotionKind;
    status: PromotionStatus;
    subtitle?: string;
    description?: string;
    badge?: string;
    productSlug?: string;
    productName?: string;
    imageUrl?: string;
    pdfUrl?: string;
    priceLabel?: string;
    priceValue?: string;
    validUntil?: string;
    ctaLabel?: string;
    createdAt: string;
    updatedAt: string;
}

function slugify(input: string): string {
    return input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function normalizeStatus(value: unknown): PromotionStatus {
    return String(value || '').trim().toLowerCase() === 'draft' ? 'draft' : 'active';
}

function normalizeKind(value: unknown): PromotionKind {
    return String(value || '').trim().toLowerCase() === 'pdf' ? 'pdf' : 'template';
}

function parsePromotions(value: unknown): Promotion[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is Partial<Promotion> => item !== null && typeof item === 'object')
        .map((item) => {
            const title = String(item.title || '').trim();
            const id = String(item.id || item.slug || slugify(title) || `promo-${Date.now()}`).trim();
            const now = new Date().toISOString();
            return {
                id,
                slug: String(item.slug || slugify(title) || id).trim(),
                title,
                kind: normalizeKind(item.kind),
                status: normalizeStatus(item.status),
                subtitle: item.subtitle ? String(item.subtitle) : undefined,
                description: item.description ? String(item.description) : undefined,
                badge: item.badge ? String(item.badge) : undefined,
                productSlug: item.productSlug ? String(item.productSlug) : undefined,
                productName: item.productName ? String(item.productName) : undefined,
                imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
                pdfUrl: item.pdfUrl ? String(item.pdfUrl) : undefined,
                priceLabel: item.priceLabel ? String(item.priceLabel) : undefined,
                priceValue: item.priceValue ? String(item.priceValue) : undefined,
                validUntil: item.validUntil ? String(item.validUntil) : undefined,
                ctaLabel: item.ctaLabel ? String(item.ctaLabel) : undefined,
                createdAt: item.createdAt ? String(item.createdAt) : now,
                updatedAt: item.updatedAt ? String(item.updatedAt) : now,
            };
        })
        .filter((item) => item.title);
}

async function writePromotions(data: Promotion[]): Promise<void> {
    await uploadToSupabase(
        Buffer.from(JSON.stringify(data, null, 2), 'utf-8'),
        PROMOTIONS_BLOB_KEY,
        'application/json'
    );
}

export async function getPromotions(options?: { includeDrafts?: boolean }): Promise<Promotion[]> {
    const raw = await readJsonFromSupabase<unknown>(PROMOTIONS_BLOB_KEY, []);
    const list = parsePromotions(raw).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    if (options?.includeDrafts) return list;
    return list.filter((item) => item.status === 'active');
}

export async function savePromotion(input: Partial<Promotion>): Promise<Promotion> {
    const current = await getPromotions({ includeDrafts: true });
    const now = new Date().toISOString();
    const title = String(input.title || '').trim();
    if (!title) {
        throw new Error('Titlul promoției este obligatoriu.');
    }

    const id = String(input.id || input.slug || slugify(title) || `promo-${Date.now()}`).trim();
    const prev = current.find((item) => item.id === id);
    const next: Promotion = {
        id,
        slug: String(input.slug || prev?.slug || slugify(title) || id).trim(),
        title,
        kind: normalizeKind(input.kind || prev?.kind),
        status: normalizeStatus(input.status || prev?.status),
        subtitle: input.subtitle?.trim() || undefined,
        description: input.description?.trim() || undefined,
        badge: input.badge?.trim() || undefined,
        productSlug: input.productSlug?.trim() || undefined,
        productName: input.productName?.trim() || undefined,
        imageUrl: input.imageUrl?.trim() || undefined,
        pdfUrl: input.pdfUrl?.trim() || undefined,
        priceLabel: input.priceLabel?.trim() || undefined,
        priceValue: input.priceValue?.trim() || undefined,
        validUntil: input.validUntil?.trim() || undefined,
        ctaLabel: input.ctaLabel?.trim() || undefined,
        createdAt: prev?.createdAt || now,
        updatedAt: now,
    };

    const withoutCurrent = current.filter((item) => item.id !== id);
    await writePromotions([next, ...withoutCurrent].slice(0, 100));
    return next;
}

export async function deletePromotion(id: string): Promise<void> {
    const current = await getPromotions({ includeDrafts: true });
    const found = current.find((item) => item.id === id);
    await writePromotions(current.filter((item) => item.id !== id));
    if (found?.pdfUrl) {
        await deleteFromSupabase(found.pdfUrl);
    }
}

