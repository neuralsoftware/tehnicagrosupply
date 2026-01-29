'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Target, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
        <section className="py-24 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(22,101,52,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(22,101,52,0.1),transparent_50%)]"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-ea-green-900/40 border border-ea-green-700 text-ea-green-400 text-xs font-black uppercase tracking-[0.2em]">
                            De Ce TehnicAgro?
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight">
                            Partener Nou.<br />
                            <span className="text-ea-green-500">Rezultate Imediate.</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Nu avem un istoric de 15 ani. Avem ceva mai bun: <span className="text-white font-semibold">utilaje de ultimă generație</span>,
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
                            className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-ea-green-900/50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-ea-green-600/10 rounded-xl flex items-center justify-center text-ea-green-500 mb-4 group-hover:bg-ea-green-600/20 transition-colors">
                                {adv.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">
                                {adv.title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
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
                    className="bg-gradient-to-r from-ea-green-900/30 via-ea-green-800/20 to-ea-green-900/30 rounded-3xl border border-ea-green-700/30 p-8 md:p-12"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Left - Promise */}
                        <div className="flex-1 space-y-6">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                                Promisiunea Noastră
                            </h3>
                            <p className="text-zinc-300 text-lg leading-relaxed">
                                Suntem noi pe piață și știm că trebuie să ne <span className="text-ea-green-400 font-bold">demonstrăm valoarea</span>.
                                De aceea oferim suport tehnic complet, prețuri transparente și niciun cost ascuns.
                                Succesul fermei tale este cea mai bună reclamă pentru noi.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {guarantees.map((guarantee, index) => (
                                    <div key={index} className="flex items-center gap-2 text-zinc-300">
                                        <CheckCircle2 className="w-5 h-5 text-ea-green-500 shrink-0" />
                                        <span className="text-sm font-medium">{guarantee}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right - Key Numbers */}
                        <div className="lg:w-80 space-y-4">
                            <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800">
                                <div className="text-center space-y-1">
                                    <span className="block text-5xl font-black text-ea-green-400">56€</span>
                                    <span className="block text-sm text-zinc-500 uppercase tracking-wider font-bold">Subvenție APIA / Hectar</span>
                                </div>
                            </div>
                            <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800">
                                <div className="text-center space-y-1">
                                    <span className="block text-5xl font-black text-blue-400">320 RON</span>
                                    <span className="block text-sm text-zinc-500 uppercase tracking-wider font-bold">Economie Motorină / Hectar</span>
                                </div>
                            </div>
                            <Link
                                href="#audit"
                                className="block w-full py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white text-center font-black rounded-xl uppercase tracking-wide transition-all shadow-lg shadow-ea-green-900/30 flex items-center justify-center gap-2"
                            >
                                Calculează-ți Beneficiul
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
