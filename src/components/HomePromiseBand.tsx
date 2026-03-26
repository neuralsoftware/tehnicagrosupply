'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const guarantees = [
    'Garanție 12 luni piese și manoperă',
    'Suport tehnic telefonic dedicat',
    'Fișe tehnice complete pentru APIA',
    'Service mobil în toată România',
];

/** Banda 2 (home): promisiune + dovezi financiare, fără secțiuni redundante. */
export function HomePromiseBand() {
    return (
        <section className="border-y border-zinc-100 bg-slate-50 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                            Promisiunea noastră
                        </h2>
                        <p className="text-sm leading-relaxed text-zinc-600 md:text-base">
                            Suntem noi pe piață și știm că trebuie să ne{' '}
                            <span className="font-semibold text-ea-green-600">demonstrăm valoarea</span>. Suport tehnic
                            complet, prețuri transparente, fără costuri ascunse — succesul fermei tale e reperul nostru.
                        </p>
                        <ul className="grid gap-2.5 sm:grid-cols-2">
                            {guarantees.map((g) => (
                                <li key={g} className="flex items-start gap-2 text-sm text-zinc-700">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ea-green-600" />
                                    <span>{g}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-ea-green-700 hover:text-ea-green-600"
                        >
                            Vezi auditul de eficiență
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 }}
                            className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
                        >
                            <div className="text-center">
                                <span className="block text-4xl font-semibold tabular-nums text-ea-green-700">56€</span>
                                <span className="mt-1 block text-sm font-medium text-zinc-500">Subvenție APIA / hectar</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
                        >
                            <div className="text-center">
                                <span className="block text-4xl font-semibold tabular-nums text-blue-700">320 RON</span>
                                <span className="mt-1 block text-sm font-medium text-zinc-500">
                                    Economie motorină / hectar
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
