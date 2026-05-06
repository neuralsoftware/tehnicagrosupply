import type { Metadata } from 'next';
import Image from 'next/image';
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

export default async function PromotionsPage() {
    const [promotions, products] = await Promise.all([getPromotions(), getProducts()]);
    const productBySlug = new Map(products.map((product) => [product.slug, product]));

    return (
        <main className="min-h-screen bg-white pt-24 text-zinc-900">
            <section className="border-b border-zinc-100 bg-zinc-50 py-14 md:py-18">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ea-green-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-ea-green-700">
                            <Tag className="h-4 w-4" aria-hidden />
                            Oferte active
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-950 md:text-6xl">
                            Promoții TehnicAgro
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
                            Materiale comerciale, oferte de sezon și prezentări PDF pentru utilaje disponibile în campaniile curente.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {promotions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
                            <FileText className="mx-auto mb-4 h-10 w-10 text-zinc-400" aria-hidden />
                            <h2 className="text-xl font-bold text-zinc-900">Nu există promoții active momentan.</h2>
                            <p className="mt-2 text-sm text-zinc-500">Revenim cu oferte noi în funcție de campaniile de sezon.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            {promotions.map((promotion) => {
                                const product = promotion.productSlug ? productBySlug.get(promotion.productSlug) : undefined;
                                const imageUrl = promotion.imageUrl || product?.imageSrc;
                                const productHref = product ? `/utilaje/${product.category}/${product.slug}` : null;
                                const validUntil = formatDate(promotion.validUntil);

                                return (
                                    <article
                                        key={promotion.id}
                                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                                    >
                                        {imageUrl ? (
                                            <div className="relative aspect-[16/9] bg-zinc-100">
                                                <Image
                                                    src={imageUrl}
                                                    alt={promotion.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                                {promotion.badge ? (
                                                    <span className="absolute left-4 top-4 rounded-md bg-ea-green-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow">
                                                        {promotion.badge}
                                                    </span>
                                                ) : null}
                                            </div>
                                        ) : null}

                                        <div className="p-6 md:p-8">
                                            <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                                <span>{promotion.kind === 'pdf' ? 'PDF promoțional' : 'Promoție'}</span>
                                                {validUntil ? <span>Valabil până la {validUntil}</span> : null}
                                            </div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950">
                                                {promotion.title}
                                            </h2>
                                            {promotion.subtitle ? (
                                                <p className="mt-2 text-sm font-semibold text-ea-green-700">{promotion.subtitle}</p>
                                            ) : null}
                                            {promotion.description ? (
                                                <p className="mt-4 text-sm leading-relaxed text-zinc-600">{promotion.description}</p>
                                            ) : null}

                                            {(promotion.priceLabel || promotion.priceValue) && (
                                                <div className="mt-6 rounded-xl border border-ea-green-100 bg-ea-green-50 p-4">
                                                    {promotion.priceLabel ? (
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-ea-green-700">
                                                            {promotion.priceLabel}
                                                        </p>
                                                    ) : null}
                                                    {promotion.priceValue ? (
                                                        <p className="mt-1 text-2xl font-black text-zinc-950">{promotion.priceValue}</p>
                                                    ) : null}
                                                </div>
                                            )}

                                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                                {promotion.pdfUrl ? (
                                                    <a
                                                        href={promotion.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-ea-green-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-ea-green-500"
                                                    >
                                                        <Download className="h-4 w-4" aria-hidden />
                                                        Descarcă PDF
                                                    </a>
                                                ) : null}
                                                {productHref ? (
                                                    <Link
                                                        href={productHref}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-900 transition-colors hover:border-ea-green-300 hover:text-ea-green-700"
                                                    >
                                                        {promotion.ctaLabel || 'Vezi utilajul'}
                                                        <ArrowRight className="h-4 w-4" aria-hidden />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href="/contact"
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-900 transition-colors hover:border-ea-green-300 hover:text-ea-green-700"
                                                    >
                                                        Cere detalii
                                                        <ArrowRight className="h-4 w-4" aria-hidden />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

