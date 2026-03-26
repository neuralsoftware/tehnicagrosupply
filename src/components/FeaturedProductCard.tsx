'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

/** Model minimal pentru cardul din homepage (produse statice sau din catalog). */
export interface FeaturedProductCardModel {
    id: string;
    slug: string;
    category: string;
    name: string;
    description: string;
    imageSrc: string;
    badge?: string;
    specs: string[];
}

export function FeaturedProductCard({ product, index }: { product: FeaturedProductCardModel; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-ea-green-500/50 hover:shadow-lg transition-all"
        >
            <div className="aspect-[16/9] overflow-hidden relative shrink-0">
                <img
                    src={product.imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                {product.badge ? (
                    <div className="absolute top-4 left-4">
                        <span className="bg-ea-green-600 text-white text-xs font-medium px-3 py-1 rounded-md shadow-md">
                            {product.badge}
                        </span>
                    </div>
                ) : null}
            </div>

            <div className="p-8 flex flex-col flex-1 min-h-0">
                <div className="flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight mb-2 group-hover:text-ea-green-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2">{product.description}</p>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                        {product.specs.slice(0, 2).map((spec, i) => (
                            <div key={i} className="flex items-center gap-2 text-zinc-600 text-xs font-medium">
                                <Check className="w-3.5 h-3.5 text-ea-green-600 shrink-0" />
                                {spec.split(':')[0]}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <Link
                        href={`/utilaje/${product.category}/${product.slug}`}
                        className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-ea-green-600 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Vezi detalii tehnice
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
