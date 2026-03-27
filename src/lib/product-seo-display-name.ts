/**
 * Titlu afișat în SEO (metadata, Open Graph) fără a repeta brandul când `name` îl conține deja.
 * Ex.: brand „Fliegl”, name „Fliegl Chain Disc KSE 680” → returnează doar name-ul complet.
 */
export function formatProductSeoDisplayName(product: { brand?: string; name?: string }): string {
    const brand = (product.brand || '').trim();
    const name = (product.name || '').trim();
    if (!brand) return name;
    if (!name) return brand;
    const b = brand.toLocaleLowerCase('ro-RO');
    const n = name.toLocaleLowerCase('ro-RO');
    if (n === b || n.startsWith(`${b} `) || n.startsWith(`${b}-`)) {
        return name;
    }
    return `${brand} ${name}`;
}
