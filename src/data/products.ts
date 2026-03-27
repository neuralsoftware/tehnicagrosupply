// Product data loaded from individual JSON files
// To add a new product: create a .json file in src/data/products/[category]/
// Dynamic products (added from Admin) are stored in Vercel Blob via products-store.ts

import multisemAds from './products/semanat-fertilizat/multisem-ads.json';
import chainDiscKse680 from './products/pregatire-sol/chain-disc-kse-680.json';
import powerbank from './products/recoltare-logistica/powerbank.json';
import booster from './products/recoltare-logistica/booster.json';

export interface Product {
    id: string;
    slug: string;
    category: string; // extended: 'pregatire-sol' | 'semanat-fertilizat' | 'recoltare-logistica' | 'viticol' | 'legumicol' | 'protectia-plantelor' | ...
    name: string;
    brand: string;
    badge?: string;
    description: string;
    longDescription?: string;       // Rich descriere pentru pagina de produs
    imageSrc: string;
    gallery?: string[];
    manufacturerUrl?: string;
    referenceLinks?: { label: string; url: string }[];
    specs: string[];
    specIcons?: { icon: string; label: string; value: string }[]; // 3 specs cu iconițe
    detailedSpecs: any;
    expertVerdict: string;
    videoUrl?: string;              // URL YouTube/Vimeo embed
    /** URL MP4 (https… sau cale `video/…` în bucket Supabase tehnicagro) — hero full-bleed pe pagina de produs */
    heroVideoUrl?: string;
    priceRange?: string;
    eligibility?: string;
    metaTitle?: string;             // SEO: titlu custom
    metaDescription?: string;       // SEO: descriere custom
    status?: 'active' | 'draft';    // draft = invizibil pe site
}

// Static products — existente, neschimbate
export const PRODUCTS: Product[] = [
    multisemAds as Product,
    chainDiscKse680 as Product,
    powerbank as Product,
    booster as Product,
];

// Base categories (static) — new categories can be added from Admin UI
export const CATEGORIES: Record<string, string> = {
    'pregatire-sol': 'Pregătire Sol',
    'semanat-fertilizat': 'Semănat & Fertilizat',
    'recoltare-logistica': 'Recoltare & Logistică',
    'protectia-plantelor': 'Protecția Plantelor',
    'viticol': 'Viticol',
    'legumicol': 'Legumicol',
};

export type CategorySlug = string;
