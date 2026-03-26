import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FeaturedProductCard, type FeaturedProductCardModel } from '@/components/FeaturedProductCard';
import type { DynamicProduct } from '@/lib/products-store';

function toCardModel(p: DynamicProduct): FeaturedProductCardModel {
    return {
        id: p.id,
        slug: p.slug,
        category: p.category,
        name: p.name,
        description: p.description,
        imageSrc: p.imageSrc,
        badge: p.badge,
        specs: Array.isArray(p.specs) ? p.specs : [],
    };
}

/** Produse vizibile din categoria viticolă (catalog Supabase + static) — sub bannerul de sezon. */
export function HomeViticultureProducts({ products }: { products: DynamicProduct[] }) {
    if (!products.length) return null;

    return (
        <section
            className="bg-white pb-10 md:pb-12 border-b border-zinc-100"
            aria-label="Utilaje viticole recomandate"
        >
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-sm font-medium text-zinc-600 mb-6 max-w-2xl">
                    Din catalogul viticol: utilaje reale disponibile pentru livrare și consultanță.
                </p>
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {products.map((p, index) => (
                        <FeaturedProductCard key={p.id} product={toCardModel(p)} index={index} />
                    ))}
                </div>
                <div className="mt-10 flex justify-center md:justify-start">
                    <Link
                        href="/utilaje/viticol"
                        className="inline-flex items-center gap-2 text-ea-green-700 text-sm font-medium hover:text-ea-green-600 transition-colors"
                    >
                        Toată gama pentru viticultură
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
