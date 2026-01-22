'use client';

import { motion } from 'framer-motion';
import { Award, ShieldCheck, Zap, UserCheck } from 'lucide-react';

export function ExpertAuthority() {
    return (
        <section className="py-24 bg-white text-zinc-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-ea-green-500/10 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-zinc-100 rounded-3xl p-8 border border-zinc-200 shadow-xl overflow-hidden">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-24 h-24 bg-ea-green-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-ea-green-200">
                                    <UserCheck className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-1">Expertiza TehnicAgro</h3>
                                    <p className="text-ea-green-600 font-bold text-sm uppercase tracking-widest">Echipa de Consultanți Tehnici</p>
                                    <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Award key={s} className="w-4 h-4 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <blockquote className="text-xl font-medium italic text-zinc-700 leading-relaxed mb-8">
                                "Agricultura performantă începe cu alegerea corectă a tehnologiei. Ne bazăm pe experiența acumulată în teren pentru a configura utilaje care nu doar lucrează solul, ci protejează capitalul fermierului prin eficiență și conformitate legislativă."
                            </blockquote>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                    <span className="block text-3xl font-black text-ea-green-600">15+ Ani</span>
                                    <span className="text-[10px] uppercase font-bold text-zinc-500">Expertiză tehnică</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                    <span className="block text-3xl font-black text-ea-green-600">500+</span>
                                    <span className="text-[10px] uppercase font-bold text-zinc-500">Ferme transformate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <span className="text-ea-green-600 font-black uppercase tracking-[0.3em] text-xs">Expertiză Multi-Disciplinară</span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight">
                                De ce să alegi <span className="text-ea-green-600">TehnicAgro</span>?
                            </h2>
                            <p className="text-lg text-zinc-600 leading-relaxed">
                                Nu vindem doar utilaje. Oferim un ecosistem complet de performanță agricolă, adaptat solului românesc și legislației APIA în continuă schimbare.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-6 items-start">
                                <div className="p-3 bg-ea-green-50 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-ea-green-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold uppercase tracking-tight mb-1">Garanția Conformității 2026</h4>
                                    <p className="text-zinc-500 text-sm">Validăm fiecare utilaj prin prisma GAEC 6 și PD-04, asigurându-ne că ești eligibil pentru fiecare euro din subvenție.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="p-3 bg-ea-green-50 rounded-xl">
                                    <Zap className="w-6 h-6 text-ea-green-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold uppercase tracking-tight mb-1">ROI Demonstrat imediat</h4>
                                    <p className="text-zinc-500 text-sm">Sistemele noastre reduc drastic consumul de carburant și numărul de treceri, oferind amortizarea investiției încă din primul sezon.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <a
                                href="#audit"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 text-white font-black rounded-xl uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl"
                            >
                                Începe Auditul de Eficiență
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
