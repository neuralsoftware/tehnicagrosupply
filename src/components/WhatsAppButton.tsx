'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const WHATSAPP_NUMBER = '40723380022';
const DEFAULT_MESSAGE = 'Bună ziua! Doresc informații despre utilajele agricole și subvențiile APIA 2026.';

export function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Show popup hint after 10 seconds if user hasn't interacted
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasInteracted) {
                setIsOpen(true);
                setTimeout(() => setIsOpen(false), 5000);
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [hasInteracted]);

    const handleClick = () => {
        setHasInteracted(true);
        setShowPulse(false);
        setIsOpen(!isOpen);
    };

    const openWhatsApp = (customMessage?: string) => {
        const message = encodeURIComponent(customMessage || DEFAULT_MESSAGE);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    const quickMessages = [
        { label: 'Vreau Ofertă', message: 'Bună ziua! Vreau să primesc o ofertă pentru utilajele agricole.' },
        { label: 'Întrebare Tehnică', message: 'Bună ziua! Am o întrebare tehnică despre utilajele No-Till.' },
        { label: 'Info Subvenții', message: 'Bună ziua! Doresc informații despre subvențiile APIA PD-04 și GAEC 6.' },
    ];

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200"
                        >
                            {/* Header */}
                            <div className="bg-[#25D366] p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">TehnicAgro Supply</p>
                                            <p className="text-[10px] opacity-90">Răspundem în ~5 minute</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Preview */}
                            <div className="p-4 bg-[#ECE5DD]">
                                <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                                    <p className="text-sm text-zinc-700">
                                        👋 Salut! Cum te putem ajuta astăzi?
                                    </p>
                                    <p className="text-[10px] text-zinc-400 text-right mt-1">acum</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="p-4 space-y-2">
                                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-3">
                                    Selectează subiectul:
                                </p>
                                {quickMessages.map((qm, i) => (
                                    <button
                                        key={i}
                                        onClick={() => openWhatsApp(qm.message)}
                                        className="w-full p-3 bg-zinc-50 hover:bg-[#25D366]/10 border border-zinc-200 hover:border-[#25D366] rounded-xl text-left text-sm font-medium text-zinc-700 hover:text-[#25D366] transition-all flex items-center justify-between group"
                                    >
                                        {qm.label}
                                        <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>

                            {/* Direct Chat */}
                            <div className="p-4 pt-0">
                                <button
                                    onClick={() => openWhatsApp()}
                                    className="w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Deschide WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Button */}
                <motion.button
                    onClick={handleClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-colors"
                >
                    {showPulse && (
                        <>
                            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-ea-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                1
                            </span>
                        </>
                    )}
                    <MessageCircle className="w-7 h-7 text-white" />
                </motion.button>

                {/* Tooltip */}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-20 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg"
                    >
                        Scrie-ne pe WhatsApp!
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-zinc-900"></div>
                    </motion.div>
                )}
            </div>
        </>
    );
}
