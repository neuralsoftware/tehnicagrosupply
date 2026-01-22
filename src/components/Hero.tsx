'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
            {/* Background Image Placeholder or Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
                className="absolute inset-0 bg-zinc-900 opacity-40 grayscale"
                style={{ backgroundImage: 'radial-gradient(circle at center, #166534 0%, transparent 70%)', opacity: 0.2 }}
            />

            <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ea-red-900/20 border border-ea-red-500/30 text-ea-red-500 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ea-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-ea-red-500"></span>
                    </span>
                    Atenție: Deadline depunere cereri APIA PD-04 se apropie
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg"
                >
                    Eficiență Garantată <br />
                    <span className="text-ea-green-500">Securizează Subvenția</span> <br />
                    <span className="text-4xl md:text-6xl text-zinc-300">și Maximizează Profitul.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto font-light"
                >
                    Parteneriatul tău strategic pentru <span className="font-semibold text-white">Performanță Agricolă</span>.
                    Implementăm tehnologii No-Till <span className="font-semibold text-white">Avers-Agro</span> și
                    soluții <span className="font-semibold text-white">Fliegl</span> conforme cu <span className="text-ea-green-500 font-bold">GAEC 6 și APIA PD-04</span>.
                    <br />
                    <span className="text-zinc-400 text-lg block mt-4 italic">„Tehnologia corectă nu este o cheltuială, este cea mai sigură investiție a fermei tale.”</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="#audit"
                        className="w-full sm:w-auto px-10 py-5 bg-ea-green-600 hover:bg-ea-green-500 text-white text-lg font-bold rounded-lg uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(22,101,52,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] text-center flex items-center justify-center gap-2"
                    >
                        Începe Auditul de Eficiență
                    </Link>
                    <Link
                        href="#contact"
                        className="w-full sm:w-auto px-10 py-5 border border-zinc-600 hover:bg-zinc-800 text-zinc-100 text-lg font-medium rounded-lg uppercase tracking-wide transition-all text-center"
                    >
                        Solicită Expertiză Tehnică
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
