/** URL public site — ENV sau producție. */
export function getSiteBaseUrl(): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (fromEnv) {
        return fromEnv.replace(/\/+$/, '');
    }
    return 'https://tehnicagrosupply.ro';
}
