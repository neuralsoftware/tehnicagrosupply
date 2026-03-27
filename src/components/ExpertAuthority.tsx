'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Target, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

export function ExpertAuthority() {
    const advantages = [
        {
            icon: <Target className="w-6 h-6" />,
            title: "Focus pe Rezultate",
            description: "Nu vindem povești. Vindem utilaje cu specificații tehnice precise și beneficii măsurabile în prima campanie."
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Conformitate Garantată",
            description: "Fiecare utilaj este validat pentru cerințele GAEC 6 și PD-04. Zero riscuri la audit APIA."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Răspuns în 24h",
            description: "Echipă dedicată care răspunde rapid la orice întrebare tehnică sau solicitare de ofertă."
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            title: "Livrare Rapidă",
            description: "Utilaje în stoc sau la comandă cu termene clare. Instalare și instruire incluse."
        }
    ];

    const guarantees = [
        "Garanție 12 luni piese și manoperă",
        "Suport tehnic telefonic dedicat",
        "Fișe tehnice complete pentru APIA",
        "Service mobil în toată România"
    ];

    return (
        <section className="py-20 bg-zinc-50 relative overflow-hidden border-y border-zinc-100">

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200/60 text-ea-green-700 text-xs font-medium shadow-sm">
                            De ce TehnicAgro?
                        </span>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                            Soluții validate.
                            <br />
                            <span className="text-ea-green-600">Rezultate imediate.</span>
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                            Combinăm <span className="text-zinc-900 font-semibold">utilaje de ultimă generație</span> cu
                            prețuri competitive și determinarea de a demonstra valoare din prima colaborare.
                        </p>
                    </motion.div>
                </div>

                {/* Advantages Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {advantages.map((adv, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-ea-green-50 rounded-xl flex items-center justify-center text-ea-green-600 mb-4 group-hover:bg-ea-green-100 transition-colors">
                                {adv.icon}
                            </div>
                            <h3 className="mb-2 text-lg font-semibold tracking-tight text-zinc-900">
                                {adv.title}
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                {adv.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Main CTA Block */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm md:p-12"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Left - Promise */}
                        <div className="flex-1 space-y-6">
                            <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                                Promisiunea noastră
                            </h3>
                            <p className="text-zinc-600 text-lg leading-relaxed">
                                Suntem noi pe piață și știm că trebuie să ne <span className="text-ea-green-600 font-bold">demonstrăm valoarea</span>.
                                De aceea oferim suport tehnic complet, prețuri transparente și niciun cost ascuns.
                                Succesul fermei tale este cea mai bună reclamă pentru noi.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {guarantees.map((guarantee, index) => (
                                    <div key={index} className="flex items-center gap-2 text-zinc-700">
                                        <CheckCircle2 className="w-5 h-5 text-ea-green-600 shrink-0" />
                                        <span className="text-sm font-medium">{guarantee}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right - Key Numbers */}
                        <div className="lg:w-80 space-y-4">
                            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                                <div className="space-y-1 text-center">
                                    <span className="block text-4xl font-semibold tabular-nums text-ea-green-700">56€</span>
                                    <span className="block text-sm font-medium text-zinc-500">Subvenție APIA / hectar</span>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                                <div className="space-y-1 text-center">
                                    <span className="block text-4xl font-semibold tabular-nums text-blue-700">320 RON</span>
                                    <span className="block text-sm font-medium text-zinc-500">Economie motorină / hectar</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ea-green-600 py-4 text-center font-semibold text-white shadow-sm transition-all hover:bg-ea-green-500"
                            >
                                Calculează-ți beneficiul
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
