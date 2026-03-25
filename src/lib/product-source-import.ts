/**
 * Extrage metadate utile din HTML (open graph / meta clasice), fără dependență cheerio.
 * Folosit pentru „import din link” în admin; rezultatul e previzualizare — utilizatorul confirmă.
 */

import { PRODUCT_IMPORT_REPERE, type ImportReperRule } from '@/data/product-import-repere';

function decodeBasicEntities(s: string): string {
    return s
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');
}

function metaContent(html: string, prop: string, attr: 'property' | 'name' = 'property'): string | undefined {
    const reForward = new RegExp(
        `<meta[^>]+${attr}=["']${prop}["'][^>]+content=["']([^"']*)["']`,
        'i'
    );
    const reReverse = new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${prop}["']`,
        'i'
    );
    const m = html.match(reForward) || html.match(reReverse);
    return m?.[1] ? decodeBasicEntities(m[1]).trim() : undefined;
}

export function extractMetadataFromHtml(html: string, pageUrl: string): {
    title?: string;
    description?: string;
    imageUrl?: string;
} {
    const title =
        metaContent(html, 'og:title', 'property') ||
        metaContent(html, 'twitter:title', 'name') ||
        (html.match(/<title[^>]*>([^<]{1,500})<\/title>/i)?.[1] || '').trim();

    const description =
        metaContent(html, 'og:description', 'property') ||
        metaContent(html, 'twitter:description', 'name') ||
        metaContent(html, 'description', 'name');

    let imageUrl =
        metaContent(html, 'og:image', 'property') ||
        metaContent(html, 'og:image:url', 'property') ||
        metaContent(html, 'twitter:image', 'name');

    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
        try {
            imageUrl = new URL(imageUrl, pageUrl).href;
        } catch {
            /* păstrăm relativ */
        }
    }

    return {
        title: title || undefined,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
    };
}

/** Text brut pentru LLM: taie script/style și limitează lungimea */
export function htmlToPlainTextExcerpt(html: string, maxLen: number): string {
    let t = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (t.length > maxLen) t = t.slice(0, maxLen) + '…';
    return t;
}

export type AiEnrichment = { summary: string; bullets: string[] };

export type RepereEnrichment = AiEnrichment & { ruleId: string };

export function normalizeForReperMatch(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function reperRuleMatches(rule: ImportReperRule, hostNorm: string, haystack: string): boolean {
    if (rule.hostMustIncludeAll?.length) {
        if (!rule.hostMustIncludeAll.every((f) => hostNorm.includes(normalizeForReperMatch(f)))) {
            return false;
        }
    } else if (rule.hostFragments?.length) {
        if (!rule.hostFragments.some((f) => hostNorm.includes(normalizeForReperMatch(f)))) {
            return false;
        }
    }

    if (rule.allTextFragments?.length) {
        if (!rule.allTextFragments.every((f) => haystack.includes(normalizeForReperMatch(f)))) {
            return false;
        }
    }

    if (rule.anyTextFragments?.length) {
        if (!rule.anyTextFragments.some((f) => haystack.includes(normalizeForReperMatch(f)))) {
            return false;
        }
    }

    return true;
}

/**
 * Potrivește URL-ul și textul extras cu reguli locale (fără cost API).
 * Prima regulă din listă care se potrivește produce textul de context.
 */
export function enrichSourceWithRepere(
    pageUrl: string,
    meta: { title?: string; description?: string },
    excerpt: string
): RepereEnrichment | null {
    let hostNorm = '';
    try {
        hostNorm = normalizeForReperMatch(new URL(pageUrl).hostname.replace(/^www\./i, ''));
    } catch {
        return null;
    }

    const haystack = normalizeForReperMatch(
        [pageUrl, meta.title, meta.description, excerpt].filter(Boolean).join(' ')
    );

    for (const rule of PRODUCT_IMPORT_REPERE) {
        if (!reperRuleMatches(rule, hostNorm, haystack)) continue;
        const summary = rule.summary.trim();
        const bullets = rule.bullets.map((b) => b.trim()).filter(Boolean).slice(0, 8);
        if (!summary && bullets.length === 0) continue;
        return { summary, bullets, ruleId: rule.id };
    }
    return null;
}

export async function enrichSourceWithOpenAI(text: string): Promise<AiEnrichment | null> {
    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key || text.length < 50) return null;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            max_tokens: 900,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                        'Răspunzi doar cu JSON: {"summary":"2-4 fraze în română, factual, despre utilaj sau echipament agricol","bullets":["max 6 puncte scurte în română"]}. Nu promite dosare APIA/AFIR, vizite în câmp sau garanții legale. Dacă textul sursă e gol sau irelevant, pune summary gol și bullets [].',
                },
                {
                    role: 'user',
                    content: `Text sursă (extras din pagină web):\n\n${text.slice(0, 14000)}`,
                },
            ],
        }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as { summary?: string; bullets?: string[] };
        const summary = String(parsed.summary || '').trim();
        const bullets = Array.isArray(parsed.bullets)
            ? parsed.bullets.map((b) => String(b).trim()).filter(Boolean).slice(0, 6)
            : [];
        if (!summary && bullets.length === 0) return null;
        return { summary, bullets };
    } catch {
        return null;
    }
}
