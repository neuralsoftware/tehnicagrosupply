export type LeadAttribution = {
    currentUrl?: string;
    pagePath?: string;
    pageTitle?: string;
    referrer?: string;
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
};

const ATTRIBUTION_QUERY_KEYS = [
    'gclid',
    'gbraid',
    'wbraid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
] as const;

export function collectLeadAttribution(): LeadAttribution {
    if (typeof window === 'undefined') return {};

    const url = new URL(window.location.href);
    const attribution: LeadAttribution = {
        currentUrl: url.href,
        pagePath: `${url.pathname}${url.search}`,
        pageTitle: document.title,
        referrer: document.referrer || undefined,
    };

    for (const key of ATTRIBUTION_QUERY_KEYS) {
        const value = url.searchParams.get(key)?.trim();
        if (value) {
            attribution[key] = value;
        }
    }

    return attribution;
}
