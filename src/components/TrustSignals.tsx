'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Headphones, GraduationCap } from 'lucide-react';

const signals = [
    {
        icon: <Truck className="w-6 h-6 text-ea-green-600" />,
        title: "Livrare la Termen",
        description: "Proces transparent: Contract, Avans, Comandă și Livrare conform termenelor stabilite."
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-ea-green-600" />,
        title: "Garanție 12 Luni",
        description: "Garanție tehnică de 12 luni de la punerea în funcțiune, cu suport complet pentru piese."
    },
    {
        icon: <GraduationCap className="w-6 h-6 text-ea-green-600" />,
        title: "Expertiză APIA",
        description: "Consultanță tehnică pentru conformarea utilajelor cu cerințele eco-schemei PD-04."
    },
    {
        icon: <Headphones className="w-6 h-6 text-ea-green-600" />,
        title: "Service Mobil",
        description: "Echipă tehnică dedicată pentru intervenții și asistență direct în ferma ta."
    }
];

export function TrustSignals() {
    return (
        <section className="border-y border-zinc-100 bg-white py-20">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {signals.map((signal, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="flex items-start gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="shrink-0 rounded-xl border border-slate-200/60 bg-slate-50/80 p-2.5">
                                {signal.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold tracking-tight text-zinc-900">
                                    {signal.title}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mt-1">
                                    {signal.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
