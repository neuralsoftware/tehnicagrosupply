import { NextResponse } from 'next/server';
import {
    extractMetadataFromHtml,
    htmlToPlainTextExcerpt,
    enrichSourceWithOpenAI,
    enrichSourceWithRepere,
} from '@/lib/product-source-import';

export const maxDuration = 60;

function adminOk(request: Request, adminAuthBody?: string): boolean {
    const headerAuth = (request.headers.get('x-admin-auth') || '').trim();
    const bodyAuth = (adminAuthBody || '').trim();
    const serverPass = (process.env.ADMIN_PASSWORD || '').trim();
    return (
        (headerAuth !== '' && headerAuth === serverPass) || (bodyAuth !== '' && bodyAuth === serverPass)
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, adminAuth, useAi } = body as {
            url?: string;
            adminAuth?: string;
            useAi?: boolean;
        };

        if (!adminOk(request, adminAuth)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rawUrl = String(url || '').trim();
        if (!rawUrl) {
            return NextResponse.json({ error: 'Lipsește URL-ul' }, { status: 400 });
        }

        let target: URL;
        try {
            target = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
        } catch {
            return NextResponse.json({ error: 'URL invalid' }, { status: 400 });
        }

        if (!['http:', 'https:'].includes(target.protocol)) {
            return NextResponse.json({ error: 'Doar http(s)' }, { status: 400 });
        }

        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 12_000);
        let html: string;
        try {
            const res = await fetch(target.href, {
                signal: ctrl.signal,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (compatible; TehnicAgroCatalogBot/1.0; +https://tehnicagrosupply.ro)',
                    Accept: 'text/html,application/xhtml+xml',
                },
                redirect: 'follow',
            });
            const ct = res.headers.get('content-type') || '';
            if (!res.ok) {
                return NextResponse.json(
                    { error: `Pagina a răspuns ${res.status}. Încearcă un link direct către pagina HTML.` },
                    { status: 422 }
                );
            }
            if (!ct.includes('text/html') && !ct.includes('application/xhtml')) {
                return NextResponse.json(
                    {
                        error:
                            'Conținutul nu e HTML (ex. PDF direct). Deschide pagina în browser și copiază linkul paginii care conține metadatele.',
                    },
                    { status: 422 }
                );
            }
            html = await res.text();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            return NextResponse.json(
                { error: `Nu s-a putut încărca pagina: ${msg}. Unele site-uri blochează accesul automat.` },
                { status: 422 }
            );
        } finally {
            clearTimeout(t);
        }

        const meta = extractMetadataFromHtml(html, target.href);
        const excerpt = htmlToPlainTextExcerpt(html, 12000);

        const repere = enrichSourceWithRepere(target.href, meta, excerpt);

        let ai = null as { summary: string; bullets: string[] } | null;
        if (useAi && process.env.OPENAI_API_KEY) {
            try {
                ai = await enrichSourceWithOpenAI(excerpt);
            } catch {
                ai = null;
            }
        }

        return NextResponse.json({
            success: true,
            sourceUrl: target.href,
            title: meta.title,
            description: meta.description,
            imageUrl: meta.imageUrl,
            excerptPreview: excerpt.slice(0, 800),
            repere,
            ai,
            aiAvailable: Boolean(process.env.OPENAI_API_KEY),
        });
    } catch (err: unknown) {
        console.error('import-url:', err);
        return NextResponse.json({ error: 'Eroare server la import' }, { status: 500 });
    }
}
