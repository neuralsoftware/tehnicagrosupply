'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';

// APIA PD-04 Official Deadlines 2026
const APIA_SESSION_OPEN = new Date('2026-03-16T00:00:00');
const APIA_DEADLINE = new Date('2026-06-05T23:59:59');

type ApiaPhase = 'pre-session' | 'active-session' | 'session-closed';

function getApiaPhase(): ApiaPhase {
    const now = new Date();
    if (now < APIA_SESSION_OPEN) return 'pre-session';
    if (now <= APIA_DEADLINE) return 'active-session';
    return 'session-closed';
}

// LIVE Countdown Component - updates every second
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [phase, setPhase] = useState<ApiaPhase>(getApiaPhase());

    useEffect(() => {
        const update = () => {
            const currentPhase = getApiaPhase();
            setPhase(currentPhase);

            if (currentPhase === 'session-closed') {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const target = currentPhase === 'pre-session' ? APIA_SESSION_OPEN : APIA_DEADLINE;
            const now = new Date();
            const diff = target.getTime() - now.getTime();

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

    // Phase 3: No timer at all
    if (phase === 'session-closed') return null;

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
                    <div className="bg-zinc-900 rounded-lg px-2 py-1 min-w-[36px] text-center">
                        <span className="text-lg sm:text-xl font-black text-white tabular-nums">{String(unit.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[8px] uppercase text-zinc-500 font-bold">{unit.label}</span>
                    {i < units.length - 1 && <span className="text-zinc-400 font-bold mx-0.5">:</span>}
                </div>
            ))}
        </div>
    );
}

function HeroContent() {
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');

    let headline = (
        <>
            Eficiență Garantată. <span className="text-ea-green-600">Securizează Subvenția</span><br />
            <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-500">și Maximizează Profitul.</span>
        </>
    );

    if (ref === 'subventie') {
        headline = (
            <>
                Maximizați <span className="text-ea-green-600">Subvenția APIA</span><br />
                <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-500">cu Tehnologia TehnicAgro.</span>
            </>
        );
    } else if (ref === 'roi') {
        headline = (
            <>
                Calculați <span className="text-ea-green-600">ROI-ul Fermei</span><br />
                <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-500">și Reduceți Costurile.</span>
            </>
        );
    } else if (ref === 'avers') {
        headline = (
            <>
                Puterea <span className="text-ea-green-600">Avers-Agro</span><br />
                <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-500">Performanță No-Till Reală.</span>
            </>
        );
    } else if (ref === 'dr12') {
        headline = (
            <>
                Proiecte <span className="text-ea-green-600">DR-12: 200.000€</span><br />
                <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-zinc-500">Finanțare 80% pt. Utilaje.</span>
            </>
        );
    }

    const phase = getApiaPhase();
    let badgeText: string;
    if (ref === 'dr12') {
        badgeText = "Sesiune DR-12 — Pregătește proiectul acum";
    } else if (phase === 'pre-session') {
        badgeText = "Sesiunea APIA PD-04 se deschide pe 16 Martie 2026";
    } else if (phase === 'active-session') {
        badgeText = "Atenție: Termen limită depunere APIA — 5 Iunie 2026";
    } else {
        badgeText = "Campanie APIA 2026 — Pregătește-te pentru campania următoare";
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-ea-green-50 overflow-hidden pt-20">
            {/* Subtle decorative background */}
            <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(22,101,52,0.08), transparent 50%), radial-gradient(circle at 30% 80%, rgba(22,101,52,0.05), transparent 50%)' }}
            />

            <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-6 sm:space-y-8">
                {/* Urgency Badge with LIVE Countdown */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-2xl bg-zinc-900 border-2 border-red-500/60"
                >
                    <div className="flex items-center gap-2 text-red-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        {badgeText}
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-zinc-700"></div>
                    <CountdownTimer />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tight text-zinc-900 px-2"
                >
                    {headline}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-zinc-500 max-w-3xl mx-auto font-light px-2"
                >
                    Parteneriatul tău strategic pentru <span className="font-semibold text-zinc-900">Performanță Agricolă</span>.
                    Implementăm tehnologii No-Till <span className="font-semibold text-zinc-900">Avers-Agro</span> și
                    soluții <span className="font-semibold text-zinc-900">Fliegl</span> conforme cu <span className="text-ea-green-600 font-bold">GAEC 6 și APIA PD-04</span>.
                    <br />
                    <span className="text-zinc-400 text-sm sm:text-base block mt-4 italic">„Tehnologia corectă nu este o cheltuială, este cea mai sigură investiție a fermei tale."</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="#audit"
                        className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-ea-green-600 hover:bg-ea-green-500 text-white text-base sm:text-lg font-bold rounded-lg uppercase tracking-wide transition-all shadow-lg shadow-ea-green-600/20 hover:shadow-xl hover:shadow-ea-green-500/30 text-center flex items-center justify-center gap-2"
                    >
                        Calculează Beneficiul Fermei Tale
                    </Link>
                    <Link
                        href="#contact"
                        className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-zinc-800 hover:bg-zinc-700 text-white text-base sm:text-lg font-bold rounded-lg uppercase tracking-wide transition-all text-center"
                    >
                        Solicită Expertiză Tehnică
                    </Link>
                </motion.div>

                {/* Value Propositions - Real Benefits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-zinc-400"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-ea-green-600">56€</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider">Subvenție/ha</span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-zinc-200"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-ea-green-600">-40L</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider">Motorină/ha</span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-zinc-200"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-ea-green-600">100%</span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider">Eligibil APIA</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export function Hero() {
    return (
        <Suspense fallback={<div className="h-screen bg-white" />}>
            <HeroContent />
        </Suspense>
    );
}
