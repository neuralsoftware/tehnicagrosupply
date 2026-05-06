import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download, FileText, Tag } from 'lucide-react';
import { getPromotions } from '@/lib/promotions-store';
import { getProducts } from '@/lib/products-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Promoții Utilaje Agricole | TehnicAgro Supply',
    description:
        'Promoții active pentru utilaje agricole, echipamente de recoltare, logistică și soluții tehnice disponibile prin TehnicAgro Supply.',
    alternates: { canonical: 'https://tehnicagrosupply.ro/promotii' },
};

function formatDate(date: string | undefined): string | null {
    if (!date) return null;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' }).format(parsed);
}

function getFramedPdfUrl(pdfUrl: string): string {
    const cleanUrl = pdfUrl.trim().split('#')[0] || pdfUrl.trim();
    return `${cleanUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`;
}

export default async function PromotionsPage() {
    const [promotions, products] = await Promise.all([getPromotions(), getProducts()]);
    const productBySlug = new Map(products.map((product) => [product.slug, product]));
    const mainPromotion = promotions[0];
    const product = mainPromotion?.productSlug ? productBySlug.get(mainPromotion.productSlug) : undefined;
    const productHref = product ? `/utilaje/${product.category}/${product.slug}` : null;
    const validUntil = formatDate(mainPromotion?.validUntil);

    return (
        <main className="min-h-screen bg-zinc-50 pt-24 text-zinc-900">
            <section className="flex min-h-[calc(100vh-6rem)] items-center py-8 md:py-12">
                <div className="mx-auto w-full max-w-6xl px-4">
                    {!mainPromotion ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
                            <FileText className="mx-auto mb-4 h-10 w-10 text-zinc-400" aria-hidden />
                            <h2 className="text-xl font-bold text-zinc-900">Nu există promoții active momentan.</h2>
                            <p className="mt-2 text-sm text-zinc-500">Revenim cu oferte noi în funcție de campaniile de sezon.</p>
                        </div>
                    ) : (
                        <article className="mx-auto overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
                            <div className="border-b border-zinc-100 px-5 py-6 text-center md:px-10 md:py-8">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ea-green-200 bg-ea-green-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-ea-green-700">
                                    <Tag className="h-4 w-4" aria-hidden />
                                    {mainPromotion.badge || 'Campanie activă'}
                                </div>
                                <h1 className="mx-auto max-w-4xl text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-5xl">
                                    {mainPromotion.title}
                                </h1>
                                {mainPromotion.subtitle ? (
                                    <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-ea-green-700 md:text-base">
                                        {mainPromotion.subtitle}
                                    </p>
                                ) : null}
                                {mainPromotion.description ? (
                                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 md:text-base">
                                        {mainPromotion.description}
                                    </p>
                                ) : null}
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                    <span>{mainPromotion.kind === 'pdf' ? 'PDF promoțional' : 'Promoție'}</span>
                                    {validUntil ? <span>Valabil până la {validUntil}</span> : null}
                                </div>
                            </div>

                            <div className="bg-zinc-100 p-3 md:p-6">
                                {mainPromotion.pdfUrl ? (
                                    <div className="mx-auto max-w-3xl rounded-[1.35rem] bg-white p-2 shadow-2xl ring-1 ring-zinc-200 md:p-4">
                                        {/* Desktop: iframe embed */}
                                        <div className="relative hidden aspect-[210/297] w-full overflow-hidden rounded-2xl bg-white md:block">
                                            <iframe
                                                src={getFramedPdfUrl(mainPromotion.pdfUrl)}
                                                title={`Afiș promoție ${mainPromotion.title}`}
                                                className="pointer-events-none absolute inset-0 h-full w-full border-0 bg-white"
                                                scrolling="no"
                                            />
                                        </div>
                                        {/* Mobile: PDF nu se poate afișa inline — link direct */}
                                        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-zinc-50 p-8 text-center md:hidden">
                                            <FileText className="h-12 w-12 text-ea-green-600" aria-hidden />
                                            <p className="text-sm font-semibold text-zinc-700">Apasă pentru a vedea PDF-ul promoției</p>
                                            <a
                                                href={mainPromotion.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-xl bg-ea-green-600 px-6 py-3 text-sm font-bold text-white"
                                            >
                                                <FileText className="h-4 w-4" aria-hidden />
                                                Deschide PDF
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mx-auto flex min-h-[420px] max-w-4xl items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
                                        <div>
                                            <FileText className="mx-auto mb-4 h-12 w-12 text-zinc-400" aria-hidden />
                                            <h2 className="text-xl font-bold text-zinc-900">Promoția nu are PDF atașat încă.</h2>
                                            <p className="mt-2 text-sm text-zinc-500">
                                                Poți atașa PDF-ul din Admin, tabul Promoții.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-3 border-t border-zinc-100 px-5 py-6 sm:flex-row">
                                {mainPromotion.pdfUrl ? (
                                    <a
                                        href={mainPromotion.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ea-green-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-ea-green-500 sm:w-auto"
                                    >
                                        <Download className="h-4 w-4" aria-hidden />
                                        Descarcă PDF
                                    </a>
                                ) : null}
                                {productHref ? (
                                    <Link
                                        href={productHref}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-900 transition-colors hover:border-ea-green-300 hover:text-ea-green-700 sm:w-auto"
                                    >
                                        {mainPromotion.ctaLabel || 'Vezi utilaj'}
                                        <ArrowRight className="h-4 w-4" aria-hidden />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/contact"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-900 transition-colors hover:border-ea-green-300 hover:text-ea-green-700 sm:w-auto"
                                    >
                                        Cere detalii
                                        <ArrowRight className="h-4 w-4" aria-hidden />
                                    </Link>
                                )}
                            </div>
                        </article>
                    )}
                </div>
            </section>
        </main>
    );
}
