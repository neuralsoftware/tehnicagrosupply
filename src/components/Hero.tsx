'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

function HeroContent() {
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');

    const defaultHeadline = (
        <>
            <span className="block text-white tracking-tight drop-shadow-sm">
                Tehnologie agricolă pentru performanță maximă.
            </span>
            <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                Soluții premium pentru cultură mare și viticultură.
            </span>
        </>
    );

    let headline = defaultHeadline;

    if (ref === 'subventie') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Ghidare pentru eco-scheme și conformitate PAC.
                </span>
            </>
        );
    } else if (ref === 'roi') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Date clare pentru decizii în ferma ta.
                </span>
            </>
        );
    } else if (ref === 'avers') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Avers-Agro și soluții No-Till de precizie.
                </span>
            </>
        );
    } else if (ref === 'dr12') {
        headline = (
            <>
                <span className="block text-white tracking-tight drop-shadow-sm">
                    Tehnologie agricolă pentru performanță maximă.
                </span>
                <span className="block mt-3 text-lg sm:text-xl md:text-2xl font-normal text-emerald-200/95 tracking-tight drop-shadow-sm">
                    Finanțare și utilaje aliniate la programele naționale.
                </span>
            </>
        );
    }

    return (
        <section className="relative min-h-[min(100dvh,900px)] flex items-center justify-center overflow-hidden pt-20 pb-12">
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900"
                aria-hidden
            />
            {/* Accente subtile „agricultură de precizie” peste gradient */}
            <div
                className="absolute inset-0 z-[1] opacity-40 pointer-events-none"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 75% 25%, rgba(34,197,94,0.12), transparent 42%), radial-gradient(circle at 25% 75%, rgba(15,118,110,0.1), transparent 45%)',
                }}
                aria-hidden
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 sm:space-y-7">
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-3xl sm:text-4xl md:text-[2.4rem] lg:text-[2.65rem] font-semibold leading-snug px-2 normal-case text-white"
                >
                    {headline}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.7 }}
                    className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed px-2"
                >
                    Utilaje și consultanță pentru ferme care cer fiabilitate, randament și respectarea standardelor în câmp.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
                >
                    <Link
                        href="#audit"
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm sm:text-base font-medium rounded-lg transition-colors shadow-lg shadow-black/25 text-center"
                    >
                        Calculează beneficiul fermei tale
                    </Link>
                    <Link
                        href="#contact"
                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm sm:text-base border border-white/35 bg-white/10 text-white hover:bg-white/15 backdrop-blur-sm transition-colors text-center"
                    >
                        Solicită expertiză tehnică
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export function Hero() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
            }
        >
            <HeroContent />
        </Suspense>
    );
}
