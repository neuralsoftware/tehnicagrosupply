'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, MapPin, Zap } from 'lucide-react';

export function SocialProof() {
    return (
        <section className="border-y border-zinc-100 bg-zinc-50 py-20">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-4 py-1.5 text-xs font-medium text-ea-green-700 shadow-sm">
                        <Zap className="h-3 w-3" />
                        De ce ne aleg fermierii
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                    >
                        <Users className="mx-auto mb-3 h-8 w-8 text-ea-green-600" />
                        <span className="text-4xl font-semibold tabular-nums text-ea-green-600">56</span>
                        <span className="text-xl font-semibold text-ea-green-700"> EUR/ha</span>
                        <p className="mt-2 text-sm font-medium text-zinc-500">Subvenție APIA PD-04</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                    >
                        <TrendingUp className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                        <span className="text-4xl font-semibold tabular-nums text-blue-600">-40L</span>
                        <span className="text-xl font-semibold text-blue-700"> /ha</span>
                        <p className="mt-2 text-sm font-medium text-zinc-500">Economie motorină</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                    >
                        <MapPin className="mx-auto mb-3 h-8 w-8 text-ea-green-600" />
                        <span className="text-4xl font-semibold tabular-nums text-ea-green-600">100%</span>
                        <p className="mt-2 text-sm font-medium text-zinc-500">Eligibil GAEC 6</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
