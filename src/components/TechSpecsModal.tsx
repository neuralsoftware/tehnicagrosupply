'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface TechSpecsModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    specs: Record<string, any>;
}

export function TechSpecsModal({ isOpen, onClose, productName, specs }: TechSpecsModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white border border-zinc-200 w-full max-w-3xl rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-200 flex justify-between items-start sticky top-0 bg-white z-10 rounded-t-xl">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-ea-green-600" />
                                <span className="text-ea-green-600 font-bold text-xs uppercase tracking-wider">Fișă Tehnică Digitală</span>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900">{productName}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto space-y-8">

                        {/* Dynamic Rendering of Specs */}
                        {Object.entries(specs).map(([category, items], idx) => (
                            <div key={idx} className="space-y-4">
                                <h3 className="text-lg font-bold text-zinc-900 border-l-4 border-ea-green-600 pl-4 uppercase">
                                    {category.replace(/_/g, ' ')}
                                </h3>

                                {Array.isArray(items) ? (
                                    // Render List or Comparison Table if array of objects
                                    Array.isArray(items) && typeof items[0] === 'object' ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left text-zinc-700">
                                                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50">
                                                    <tr>
                                                        {Object.keys(items[0]).map((header) => (
                                                            <th key={header} className="px-4 py-3 rounded-t-lg">{header.replace(/_/g, ' ')}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((row: any, i: number) => (
                                                        <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50">
                                                            {Object.values(row).map((val: any, j: number) => (
                                                                <td key={j} className="px-4 py-3 font-medium text-zinc-900">{val}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <ul className="grid sm:grid-cols-2 gap-3">
                                            {items.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-zinc-700 text-sm bg-zinc-50 p-3 rounded border border-zinc-200">
                                                    <CheckCircle2 className="w-4 h-4 text-ea-green-600 mt-0.5 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                ) : (
                                    // Render Key-Value Object
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {Object.entries(items).map(([key, value]) => (
                                            <div key={key} className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex flex-col">
                                                <span className="text-xs text-zinc-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                                    {key.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-zinc-900 font-medium break-words">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Legal / Data Disclaimer */}
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <p className="text-xs text-amber-700">
                                * Specificațiile tehnice sunt extrase din documentația oficială și pot suferi modificări din partea producătorului fără notificare prealabilă. Pentru confirmarea finală, vă rugăm să solicitați o ofertă personalizată.
                            </p>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-200 bg-zinc-50 z-10 rounded-b-xl flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-medium rounded transition-colors"
                        >
                            Închide
                        </button>
                        <a
                            href="#contact"
                            onClick={onClose}
                            className="ml-4 px-6 py-2 bg-ea-green-600 hover:bg-ea-green-500 text-white font-bold rounded shadow-lg shadow-ea-green-600/20 transition-colors"
                        >
                            Cere Ofertă Fermă
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
