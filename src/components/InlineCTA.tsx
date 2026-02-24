'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calculator, Phone } from 'lucide-react';

interface InlineCTAProps {
    variant?: 'calculator' | 'contact';
}

export function InlineCTA({ variant = 'calculator' }: InlineCTAProps) {
    if (variant === 'contact') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8 px-4"
            >
                <div className="max-w-3xl mx-auto bg-ea-green-50 rounded-2xl border border-ea-green-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6 text-ea-green-600 shrink-0" />
                        <div>
                            <p className="text-zinc-900 font-bold text-sm">Ai întrebări? Vorbim direct.</p>
                            <p className="text-zinc-500 text-xs">Specialist disponibil pe WhatsApp</p>
                        </div>
                    </div>
                    <a
                        href="https://wa.me/40723380022?text=Bună%20ziua!%20Doresc%20informații%20despre%20utilaje."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-lg"
                    >
                        Scrie pe WhatsApp
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-8 px-4"
        >
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-ea-green-600 shrink-0" />
                    <div>
                        <p className="text-zinc-900 font-bold text-sm">Calculează economiile fermei tale</p>
                        <p className="text-zinc-500 text-xs">Rezultat instant, fără obligații</p>
                    </div>
                </div>
                <Link
                    href="#audit"
                    className="px-6 py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-ea-green-600/20"
                >
                    Calculează Acum
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
