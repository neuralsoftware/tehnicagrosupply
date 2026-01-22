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
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg"
                >
                    Încasează subvenția <br />
                    <span className="text-ea-green-500">APIA PD-04</span> (56€/ha) <br />
                    <span className="text-4xl md:text-6xl text-zinc-300">și uită de arătură.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto font-light"
                >
                    Soluția 2026 pentru conformare <span className="font-semibold text-white">GAEC 6</span>:
                    Semănători No-Till <span className="font-semibold text-white">Avers-Agro</span> și
                    Discuri Conservatoare <span className="font-semibold text-white">Fliegl</span>.
                    <br />
                    <span className="text-ea-red-600 font-bold block mt-2">Nu pierde banii din cauza utilajelor vechi.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="#oferta"
                        className="w-full sm:w-auto px-8 py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white text-lg font-bold rounded-md uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(22,101,52,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] text-center"
                    >
                        Vreau Subvenția + Oferta
                    </Link>
                    <Link
                        href="#contact"
                        className="w-full sm:w-auto px-8 py-4 border border-zinc-500 hover:bg-zinc-800 text-zinc-100 text-lg font-medium rounded-md uppercase tracking-wide transition-all text-center"
                    >
                        Consultă un Expert APIA
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
