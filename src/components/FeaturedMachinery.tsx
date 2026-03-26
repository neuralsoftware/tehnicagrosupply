'use client';

import { PRODUCTS } from '@/data/products';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FeaturedProductCard } from '@/components/FeaturedProductCard';

export function FeaturedMachinery() {
    return (
        <section id="oferta" className="border-y border-zinc-100 bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
                            Utilaje <span className="text-ea-green-600">performante</span>
                        </h2>
                        <p className="text-zinc-500 max-w-xl text-lg">
                            Tehnologie de ultimă oră pentru agricultura de precizie, optimizată pentru subvențiile 2026.
                        </p>
                    </div>
                    <Link
                        href="/utilaje/pregatire-sol"
                        className="text-ea-green-700 font-medium text-sm md:text-base flex items-center gap-2 hover:gap-3 transition-all"
                    >
                        Vezi tot catalogul
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {PRODUCTS.map((product, index) => (
                        <FeaturedProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
