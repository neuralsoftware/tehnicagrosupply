'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Headphones, GraduationCap } from 'lucide-react';

const signals = [
    {
        icon: <Truck className="w-8 h-8 text-ea-green-500" />,
        title: "Livrare Rapidă",
        description: "Utilaje pe stoc, gata de livrare în toată România în 3-5 zile lucrătoare."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-ea-green-500" />,
        title: "Garanție 24 Luni",
        description: "Linie directă pentru suport tehnic și piese de schimb originale."
    },
    {
        icon: <GraduationCap className="w-8 h-8 text-ea-green-500" />,
        title: "Consultanță APIA",
        description: "Specialiștii noștri te ajută cu documentația pentru subvenția PD-04."
    },
    {
        icon: <Headphones className="w-8 h-8 text-ea-green-500" />,
        title: "Service Mobil",
        description: "Intervenții rapide direct în ferma ta, cu ingineri calificați."
    }
];

export function TrustSignals() {
    return (
        <section className="py-16 bg-zinc-950 border-y border-zinc-900">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {signals.map((signal, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800"
                        >
                            <div className="p-3 bg-ea-green-950/30 rounded-full border border-ea-green-900/50 group-hover:scale-110 transition-transform">
                                {signal.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                {signal.title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {signal.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
