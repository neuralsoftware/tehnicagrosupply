'use client';

import { motion } from 'framer-motion';
import { Check, Info, FileText } from 'lucide-react';
import { useState } from 'react';
import { TechSpecsModal } from './TechSpecsModal';

interface ProductProps {
    title: string;
    description: string;
    imageSrc: string;
    specs: string[];
    ctaLabel: string;
    reversed?: boolean;
    id?: string;
    badge?: string;
    detailedSpecs?: any; // Structured data for the modal
    expertVerdict?: string; // High-authority recommendation
}

export function ProductSection({ title, description, imageSrc, specs, ctaLabel, reversed, id, badge, detailedSpecs, expertVerdict }: ProductProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section id={id} className={`py-24 bg-zinc-900 text-white overflow-hidden relative`}>
            {/* Optional: Pattern background */}
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className={`flex flex-col lg:flex-row gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative group"
                    >
                        {/* Tech Border Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-ea-green-600 to-zinc-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative h-[300px] lg:h-[450px] bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 shadow-2xl flex items-center justify-center">
                            <div className="absolute top-4 right-4 z-20">
                                {badge && (
                                    <span className="bg-ea-green-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider">
                                        {badge}
                                    </span>
                                )}
                            </div>

                            {/* Proper Image Placeholder */}
                            <div className="w-full h-full relative">
                                <img
                                    src={imageSrc}
                                    alt={title}
                                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-zinc-800">
                                    <div className="w-20 h-20 bg-zinc-700/50 rounded-full flex items-center justify-center mb-4">
                                        <Info className="w-8 h-8 opacity-50" />
                                    </div>
                                    <span className="font-mono text-sm">[IMAGINE: {imageSrc}]</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reversed ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide border-l-4 border-ea-green-500 pl-6">
                                {title}
                            </h2>
                            <div className="h-1 w-24 bg-zinc-800 ml-6 rounded-full"></div>
                        </div>

                        <p className="text-lg text-zinc-300 leading-relaxed font-light">
                            {description}
                        </p>

                        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-ea-green-500 rounded-full"></span>
                                Specificații Tehnice
                            </h3>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {specs.map((spec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                                        <Check className="w-4 h-4 text-ea-green-500 shrink-0 mt-0.5" />
                                        {spec}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {expertVerdict && (
                            <div className="bg-ea-green-900/10 border border-ea-green-500/30 p-6 rounded-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-ea-green-500/5 blur-3xl rounded-full"></div>
                                <h4 className="text-ea-green-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Check className="w-3 h-3" />
                                    Verdict Expert TehnicAgro
                                </h4>
                                <p className="text-sm font-bold text-zinc-100 italic leading-relaxed">
                                    "{expertVerdict}"
                                </p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded shadow-lg hover:shadow-xl transition-all uppercase tracking-wide text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                {ctaLabel}
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Modal */}
            <TechSpecsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={title}
                specs={detailedSpecs || {}}
            />
        </section>
    );
}
