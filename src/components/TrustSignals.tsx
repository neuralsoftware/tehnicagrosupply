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
        <section className="py-12 bg-white border-y border-zinc-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {signals.map((signal, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="flex items-start gap-4 p-5 rounded-xl hover:bg-ea-green-50 transition-colors border border-transparent hover:border-ea-green-200"
                        >
                            <div className="p-2.5 bg-ea-green-50 rounded-xl border border-ea-green-200 shrink-0">
                                {signal.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
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
