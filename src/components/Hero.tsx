'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

// LIVE Countdown Component - updates every second
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const deadline = new Date('2026-03-15T23:59:59');

        const update = () => {
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    const units = [
        { value: timeLeft.days, label: 'Zile' },
        { value: timeLeft.hours, label: 'Ore' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
    ];

    return (
        <div className="flex items-center gap-2">
            {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-1">
                    <div className="bg-ea-red-900/40 border border-ea-red-500/30 rounded-lg px-2 py-1 min-w-[40px] text-center">
                        <span className="text-xl font-black text-ea-red-400 tabular-nums">{String(unit.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[8px] uppercase text-ea-red-500/70 font-bold">{unit.label}</span>
                    {i < units.length - 1 && <span className="text-ea-red-600 font-bold mx-0.5">:</span>}
                </div>
            ))}
        </div>
    );
}

// Sticky Navigation - appears on scroll
function StickyNav() {
    const [visible, setVisible] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <motion.header
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-xl"
        >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-lg font-black text-white uppercase tracking-wide">
                    Tehnic<span className="text-ea-green-500">Agro</span>
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="#audit" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                        Calculator ROI
                    </Link>
                    <Link href="#oferta" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                        Produse
                    </Link>
                    <a href="tel:+40723380022" className="flex items-center gap-2 text-zinc-300 hover:text-white text-sm font-medium transition-colors">
                        <Phone className="w-4 h-4" />
                        0723 380 022
                    </a>
                    <Link
                        href="#contact"
                        className="px-5 py-2.5 bg-ea-green-600 hover:bg-ea-green-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-ea-green-900/30 animate-pulse hover:animate-none"
                    >
                        Solicită Ofertă Acum
                    </Link>
                </div>

                {/* Mobile */}
                <div className="flex md:hidden items-center gap-3">
                    <a href="tel:+40723380022" className="p-2 bg-ea-green-600 rounded-lg text-white">
                        <Phone className="w-5 h-5" />
                    </a>
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-zinc-400">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-4 space-y-3"
                >
                    <Link href="#audit" onClick={() => setMobileOpen(false)} className="block text-zinc-300 text-sm font-medium py-2">
                        Calculator ROI
                    </Link>
                    <Link href="#oferta" onClick={() => setMobileOpen(false)} className="block text-zinc-300 text-sm font-medium py-2">
                        Produse
                    </Link>
                    <Link
                        href="#contact"
                        onClick={() => setMobileOpen(false)}
                        className="block text-center py-3 bg-ea-green-600 text-white font-bold rounded-lg"
                    >
                        Solicită Ofertă Acum
                    </Link>
                </motion.div>
            )}
        </motion.header>
    );
}

function HeroContent() {
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');

    let headline = (
        <>
            Eficiență Garantată <br />
            <span className="text-ea-green-500">Securizează Subvenția</span> <br />
            <span className="text-4xl md:text-6xl text-zinc-300">și Maximizează Profitul.</span>
        </>
    );

    if (ref === 'subventie') {
        headline = (
            <>
                Maximizați <span className="text-ea-green-500">Subvenția APIA</span> <br />
                <span className="text-4xl md:text-6xl text-zinc-300">cu Tehnologia TehnicAgro.</span>
            </>
        );
    } else if (ref === 'roi') {
        headline = (
            <>
                Calculați <span className="text-ea-green-500">ROI-ul Fermei</span> <br />
                <span className="text-4xl md:text-6xl text-zinc-300">și Reduceți Costurile.</span>
            </>
        );
    } else if (ref === 'avers') {
        headline = (
            <>
                Puterea <span className="text-ea-green-500">Avers-Agro</span> <br />
                <span className="text-4xl md:text-6xl text-zinc-300">Performanță No-Till Reală.</span>
            </>
        );
    } else if (ref === 'dr12') {
        headline = (
            <>
                Proiecte <span className="text-ea-green-500">DR-12: 200.000€</span> <br />
                <span className="text-4xl md:text-6xl text-zinc-300">Finanțare 80% pt. Utilaje.</span>
            </>
        );
    }

    const badgeText = ref === 'dr12'
        ? "Sesiune DR-12 estimată în Februarie - Pregătește proiectul"
        : "Atenție: Deadline depunere cereri APIA PD-04 se apropie";

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
            {/* Background Image Placeholder or Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
                className="absolute inset-0 bg-zinc-900 opacity-40 grayscale"
                style={{ backgroundImage: 'radial-gradient(circle at center, #166534 0%, transparent 70%)', opacity: 0.2 }}
            />

            {/* LOGO - Initial Header (hidden when sticky takes over) */}
            <header className="absolute top-0 left-0 right-0 z-30 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-xl font-black text-white uppercase tracking-wide">
                            Tehnic<span className="text-ea-green-500">Agro</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#audit" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                            Calculator ROI
                        </Link>
                        <Link href="#oferta" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                            Produse
                        </Link>
                        <Link href="#contact" className="px-4 py-2 bg-ea-green-600 hover:bg-ea-green-500 text-white text-sm font-bold rounded-lg transition-all">
                            Contact
                        </Link>
                    </div>
                </div>
            </header>

            <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-8 pt-20">
                {/* Urgency Badge with LIVE Countdown */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-3 rounded-2xl bg-ea-red-900/20 border border-ea-red-500/30"
                >
                    <div className="flex items-center gap-2 text-ea-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ea-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-ea-red-500"></span>
                        </span>
                        {badgeText}
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-ea-red-500/30"></div>
                    <CountdownTimer />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg"
                >
                    {headline}
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
                    <span className="text-zinc-400 text-lg block mt-4 italic">„Tehnologia corectă nu este o cheltuială, este cea mai sigură investiție a fermei tale."</span>
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
                        Calculează Beneficiul în 30 Secunde
                    </Link>
                    <Link
                        href="#contact"
                        className="w-full sm:w-auto px-10 py-5 border border-zinc-600 hover:bg-zinc-800 text-zinc-100 text-lg font-medium rounded-lg uppercase tracking-wide transition-all text-center"
                    >
                        Solicită Expertiză Tehnică
                    </Link>
                </motion.div>

                {/* Value Propositions - Real Benefits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="pt-8 flex items-center justify-center gap-8 text-zinc-500"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-ea-green-500">56€</span>
                        <span className="text-xs uppercase tracking-wider">Subvenție/ha</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-ea-green-500">-40L</span>
                        <span className="text-xs uppercase tracking-wider">Motorină/ha</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-ea-green-500">100%</span>
                        <span className="text-xs uppercase tracking-wider">Eligibil APIA</span>
                    </div>
                </motion.div>
            </div>

            {/* Sticky Nav - separate component */}
            <StickyNav />
        </section>
    );
}

export function Hero() {
    return (
        <Suspense fallback={<div className="h-screen bg-zinc-950" />}>
            <HeroContent />
        </Suspense>
    );
}
