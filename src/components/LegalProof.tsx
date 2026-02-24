'use client';

import { motion } from 'framer-motion';
import { Scale, FileText, AlertTriangle } from 'lucide-react';

export function LegalProof() {
    return (
        <section className="py-16 bg-zinc-50 border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase text-zinc-900 flex items-center justify-center gap-3">
                        <Scale className="w-8 h-8 text-ea-green-600" />
                        Fonduri & Context Legislativ 2026
                    </h2>
                    <p className="text-zinc-500 mt-2">De ce arătura clasică te costă subvenția.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1: PD-04 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 rounded-lg border border-ea-green-200 relative overflow-hidden shadow-sm"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileText className="w-24 h-24 text-ea-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-ea-green-600 mb-3">Eco-Schema PD-04</h3>
                        <div className="text-zinc-600 text-sm space-y-2">
                            <p><strong className="text-zinc-800">Beneficiu:</strong> <span className="text-zinc-900 text-lg font-bold">~56.28 EUR/ha</span></p>
                            <p className="italic border-l-2 border-zinc-200 pl-3 my-2">
                                &quot;Practici benefice aplicabile în teren arabil: tehnologii de tip conservativ (no-till / strip-till) pe minim 50% din suprafață.&quot;
                            </p>
                            <p className="text-xs text-zinc-400 uppercase mt-4">Sursa: Planul Național Strategic 2023-2027</p>
                        </div>
                    </motion.div>

                    {/* Card 2: GAEC 6 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-lg border border-red-200 relative overflow-hidden shadow-sm"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <AlertTriangle className="w-24 h-24 text-ea-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-ea-red-600 mb-3">GAEC 6 (Obligatoriu)</h3>
                        <div className="text-zinc-600 text-sm space-y-2">
                            <p><strong className="text-zinc-800">Cerință:</strong> Acoperirea solului în perioade sensibile.</p>
                            <p className="italic border-l-2 border-zinc-200 pl-3 my-2">
                                &quot;Între 15 iunie și 30 septembrie, fermierii trebuie să asigure acoperirea solului pe 80-85% din suprafața arabilă.&quot;
                            </p>
                            <p className="text-ea-red-600 font-semibold text-xs mt-2">RISC: Arătura de vară poate duce la penalizări APIA.</p>
                        </div>
                    </motion.div>

                    {/* Card 3: DR-12 Funding */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-6 rounded-lg border border-ea-green-200 relative overflow-hidden shadow-sm"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Scale className="w-24 h-24 text-ea-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-ea-green-600 mb-3">Fonduri EU DR-12</h3>
                        <div className="text-zinc-600 text-sm space-y-2">
                            <p><strong className="text-zinc-800">Sprijin:</strong> <span className="text-zinc-900 text-lg font-bold">200.000 EUR / proiect</span></p>
                            <p className="italic border-l-2 border-zinc-200 pl-3 my-2">
                                &quot;Achiziția de utilaje agricole performante pentru tineri fermieri și fermieri recent instalați.&quot;
                            </p>
                            <p className="text-ea-green-600 font-semibold text-xs mt-2">Intensitate: Până la 80% fonduri nerambursabile.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Bonus Section: Solution Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-12 bg-white p-6 rounded-xl border border-zinc-200 text-center shadow-sm"
                >
                    <p className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Strategia Tehnicagro Supply</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="space-y-1">
                            <span className="block text-ea-green-600 font-bold text-xl leading-none">PD-04</span>
                            <span className="block text-zinc-400 text-[10px] uppercase">Eco-Schema</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-ea-red-600 font-bold text-xl leading-none">GAEC 6</span>
                            <span className="block text-zinc-400 text-[10px] uppercase">Protecția Solului</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-ea-green-600 font-bold text-xl leading-none">DR-12</span>
                            <span className="block text-zinc-400 text-[10px] uppercase">Finanțare Utilaje</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
