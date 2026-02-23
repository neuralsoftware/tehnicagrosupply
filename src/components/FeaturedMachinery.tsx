'use client';

import { PRODUCTS } from '@/data/products';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeaturedMachinery() {
    return (
        <section id="oferta" className="py-24 bg-zinc-900 border-y border-zinc-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                            Utilaje <span className="text-ea-green-500">Performante</span>
                        </h2>
                        <p className="text-zinc-400 max-w-xl text-lg">
                            Tehnologie de ultimă oră pentru agricultura de precizie, optimizată pentru subvențiile 2026.
                        </p>
                    </div>
                    <Link
                        href="/utilaje/pregatire-sol"
                        className="text-ea-green-500 font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                    >
                        Vezi tot catalogul
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {PRODUCTS.slice(0, 2).map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 hover:border-ea-green-500/50 transition-all"
                        >
                            {/* Image Container */}
                            <div className="aspect-[16/9] overflow-hidden relative">
                                <img
                                    src={product.imageSrc}
                                    alt={product.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-ea-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                                        {product.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-ea-green-500 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-zinc-500 text-sm line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {product.specs.slice(0, 2).map((spec, i) => (
                                        <div key={i} className="flex items-center gap-2 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                                            <Check className="w-3 h-3 text-ea-green-500" />
                                            {spec.split(':')[0]}
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={`/utilaje/${product.category}/${product.slug}`}
                                    className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-zinc-950 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3"
                                >
                                    Vezi Detalii Tehnice
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
