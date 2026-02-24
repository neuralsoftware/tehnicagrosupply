// Product data loaded from individual JSON files
// To add a new product: create a .json file in src/data/products/[category]/ 
// then import and add it to the PRODUCTS array below.

import greenPlainsAds from './products/semanat-fertilizat/green-plains-ads.json';
import chainDiscKse680 from './products/pregatire-sol/chain-disc-kse-680.json';
import powerbank from './products/recoltare-logistica/powerbank.json';
import booster from './products/recoltare-logistica/booster.json';

export interface Product {
    id: string;
    slug: string;
    category: 'pregatire-sol' | 'semanat-fertilizat' | 'protectia-plantelor' | 'recoltare-logistica';
    name: string;
    brand: string;
    badge?: string;
    description: string;
    imageSrc: string;
    specs: string[];
    detailedSpecs: any;
    expertVerdict: string;
    priceRange?: string;
    eligibility?: string;
}

// All products — add new imports and entries here when expanding the catalog
export const PRODUCTS: Product[] = [
    greenPlainsAds as Product,
    chainDiscKse680 as Product,
    powerbank as Product,
    booster as Product,
];

export const CATEGORIES = {
    'pregatire-sol': 'Pregătire Sol',
    'semanat-fertilizat': 'Semănat & Fertilizat',
    'protectia-plantelor': 'Protecția Plantelor',
    'recoltare-logistica': 'Recoltare & Logistică',
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
