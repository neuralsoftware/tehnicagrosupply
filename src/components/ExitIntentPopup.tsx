'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Calculator } from 'lucide-react';

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if already shown in this session OR if converted
        const alreadyShown = sessionStorage.getItem('exitPopupShown');
        const isConverted = localStorage.getItem('tehnicagro_lead_submitted');

        if (alreadyShown || isConverted) {
            setHasShown(true);
            return;
        }

        const showPopup = () => {
            const isConvertedNow = localStorage.getItem('tehnicagro_lead_submitted');
            if (!hasShown && !isConvertedNow) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        };

        // DESKTOP: Mouse leaves viewport
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) showPopup();
        };

        // MOBILE: Tab visibility change (user switches app)
        const handleVisibilityChange = () => {
            if (document.hidden) return;
            // User came back — show popup when they return
            showPopup();
        };

        // MOBILE: Rapid scroll-up (back behavior)
        let lastScrollY = window.scrollY;
        let rapidScrollCount = 0;
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY < lastScrollY && lastScrollY - currentY > 100) {
                rapidScrollCount++;
                if (rapidScrollCount >= 2) showPopup();
            } else {
                rapidScrollCount = 0;
            }
            lastScrollY = currentY;
        };

        // Timer: show after 30s on mobile, 45s on desktop
        const isMobile = window.innerWidth < 768;
        const timer = setTimeout(() => {
            showPopup();
        }, isMobile ? 30000 : 45000);

        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [hasShown]);

    const handleClose = () => setIsVisible(false);

    const handleCTA = () => {
        setIsVisible(false);
        document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-50 bg-zinc-900 rounded-3xl border border-zinc-700 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-ea-green-600 p-6 text-center relative">
                            <button
                                onClick={handleClose}
                                className="absolute top-3 right-3 p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <Gift className="w-12 h-12 text-white mx-auto mb-3 animate-bounce" />
                            <h3 className="text-2xl font-black text-white uppercase">
                                Așteaptă! Nu Pleca Încă
                            </h3>
                            <p className="text-ea-green-100 text-sm mt-2 font-medium">
                                Ai un audit de eficiență gratuit care te așteaptă
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-xl">
                                <Calculator className="w-8 h-8 text-ea-green-500 shrink-0" />
                                <div>
                                    <p className="text-white font-bold text-sm">Calculator ROI Personalizat</p>
                                    <p className="text-zinc-400 text-xs">Află cât poți câștiga cu subvenția APIA PD-04</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCTA}
                                className="w-full py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white font-black rounded-xl uppercase tracking-wide transition-all shadow-lg shadow-ea-green-900/30 flex items-center justify-center gap-2"
                            >
                                Calculează Acum — Gratuit
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleClose}
                                className="w-full text-center text-zinc-600 text-xs hover:text-zinc-400 transition-colors py-2"
                            >
                                Nu, mulțumesc. Prefer să plec.
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
