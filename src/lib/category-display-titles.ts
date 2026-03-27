/** Titlu afișat în UI/SEO pentru slug-uri de categorie (catalog, breadcrumbs). */
export const CATEGORY_DISPLAY_TITLE: Record<string, string> = {
    viticol: 'Viticultură',
    viticultura: 'Viticultură',
    'pregatire-sol': 'Pregătire sol',
    'semanat-fertilizat': 'Semănat și fertilizat',
    'recoltare-logistica': 'Recoltare și logistică',
    'protectia-plantelor': 'Protecția plantelor',
    legumicol: 'Legumicol',
};

export function formatCategoryTitle(slug: string, rawName: string): string {
    const mapped = CATEGORY_DISPLAY_TITLE[slug];
    if (mapped) return mapped;
    const t = rawName.trim();
    if (!t) return t;
    const allShouty = t === t.toUpperCase() && /[A-ZĂÂÎȘȚ]/.test(t);
    if (allShouty) {
        const lower = t.toLocaleLowerCase('ro-RO');
        return lower.charAt(0).toLocaleUpperCase('ro-RO') + lower.slice(1);
    }
    return t;
}
