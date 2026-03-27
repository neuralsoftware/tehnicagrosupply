import { getActiveCategories } from '@/lib/products-store';
import { formatCategoryTitle } from '@/lib/category-display-titles';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Catalog Utilaje Agricole | TehnicAgro Supply',
    description:
        'Toate categoriile de utilaje: pregătire sol, semănat No-Till, recoltare, viticultură și altele. Oferte și finanțare APIA / AFIR.',
    alternates: { canonical: 'https://tehnicagrosupply.ro/utilaje' },
};

export default async function UtilajeCatalogPage() {
    const categories = await getActiveCategories();
    const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name, 'ro'));

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 mb-6">
                    <ol className="flex flex-wrap gap-2">
                        <li>
                            <Link href="/" className="hover:text-ea-green-600">
                                Acasă
                            </Link>
                        </li>
                        <li aria-hidden>/</li>
                        <li className="text-zinc-900 font-semibold">Utilaje</li>
                    </ol>
                </nav>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 mb-3">
                    Catalog utilaje
                </h1>
                <p className="text-zinc-600 max-w-2xl mb-12">
                    Alege categoria potrivită — fiecare pagină listează utilajele disponibile, cu specificații și opțiuni de finanțare acolo unde este cazul.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((cat) => {
                        const title = formatCategoryTitle(cat.slug, cat.name);
                        const href = `/utilaje/${cat.slug}`;
                        return (
                            <Link
                                key={cat.slug}
                                href={href}
                                className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 shadow-sm transition-all hover:border-ea-green-300 hover:bg-white hover:shadow-md"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-ea-green-700 transition-colors">
                                        {title}
                                    </h2>
                                    {cat.description ? (
                                        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{cat.description}</p>
                                    ) : null}
                                </div>
                                <ArrowRight className="w-5 h-5 text-ea-green-600 shrink-0 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                    <p className="text-zinc-600 text-sm mb-4">
                        Cauți piese de schimb sau consultanță pentru un utilaj deja achiziționat?
                    </p>
                    <Link
                        href="/piese-schimb"
                        className="inline-flex items-center gap-2 text-ea-green-700 font-semibold text-sm hover:text-ea-green-600"
                    >
                        Piese de schimb
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
