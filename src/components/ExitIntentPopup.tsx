'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Clock, Calculator } from 'lucide-react';

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if already shown in this session
        const alreadyShown = sessionStorage.getItem('exitPopupShown');
        if (alreadyShown) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        };

        // Also show after 45 seconds if user is still on page
        const timer = setTimeout(() => {
            if (!hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        }, 45000);

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(timer);
        };
    }, [hasShown]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleCTA = () => {
        setIsVisible(false);
        // Scroll to audit section
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
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[61] overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="bg-ea-green-600 p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="inline-block mb-3"
                            >
                                <Gift className="w-12 h-12" />
                            </motion.div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                Așteaptă! Nu pleca încă.
                            </h3>
                            <p className="text-ea-green-100 text-sm mt-2">
                                Ai acces gratuit la un instrument care îți poate economisi mii de euro.
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-ea-green-100 rounded-xl shrink-0">
                                        <Calculator className="w-6 h-6 text-ea-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 mb-1">
                                            Audit GRATUIT de Eficiență
                                        </h4>
                                        <p className="text-sm text-zinc-600">
                                            Calculează exact câți bani poți economisi și câtă subvenție poți accesa cu tehnologia No-Till.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 text-center">
                                <div>
                                    <span className="block text-3xl font-black text-ea-green-600">56€</span>
                                    <span className="text-[10px] uppercase text-zinc-500 font-bold">per hectar/an</span>
                                </div>
                                <div className="w-px h-12 bg-zinc-200"></div>
                                <div>
                                    <span className="block text-3xl font-black text-ea-green-600">320 RON</span>
                                    <span className="text-[10px] uppercase text-zinc-500 font-bold">economie motorină/ha</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-ea-red-500 text-sm font-bold">
                                <Clock className="w-4 h-4" />
                                <span>Deadline APIA se apropie rapid!</span>
                            </div>

                            <button
                                onClick={handleCTA}
                                className="w-full py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white font-black rounded-2xl uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-ea-green-200"
                            >
                                Calculează Beneficiul Meu
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleClose}
                                className="w-full text-center text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                Nu, mulțumesc. Prefer să pierd bani.
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
