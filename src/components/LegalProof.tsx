'use client';

import { motion } from 'framer-motion';
import { Scale, FileText, AlertTriangle } from 'lucide-react';

export function LegalProof() {
    return (
        <section className="py-16 bg-zinc-900 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase text-white flex items-center justify-center gap-3">
                        <Scale className="w-8 h-8 text-ea-green-500" />
                        Contextul Legislativ 2026
                    </h2>
                    <p className="text-zinc-400 mt-2">De ce arătura clasică te costă subvenția.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1: PD-04 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-950 p-6 rounded-lg border border-ea-green-600/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileText className="w-24 h-24 text-ea-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-ea-green-500 mb-3">Eco-Schema PD-04</h3>
                        <div className="text-zinc-300 text-sm space-y-2">
                            <p><strong>Beneficiu:</strong> <span className="text-white text-lg font-bold">~56.28 EUR/ha</span></p>
                            <p className="italic border-l-2 border-zinc-700 pl-3 my-2">
                                "Practici benefice aplicabile în teren arabil: tehnologii de tip conservativ (no-till / strip-till) pe minim 50% din suprafață."
                            </p>
                            <p className="text-xs text-zinc-500 uppercase mt-4">Sursa: Planul Național Strategic 2023-2027</p>
                        </div>
                    </motion.div>

                    {/* Card 2: GAEC 6 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-950 p-6 rounded-lg border border-ea-red-600/30"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle className="w-24 h-24 text-ea-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-ea-red-600 mb-3">GAEC 6 (Obligatoriu)</h3>
                        <div className="text-zinc-300 text-sm space-y-2">
                            <p><strong>Cerință:</strong> Acoperirea solului în perioade sensibile.</p>
                            <p className="italic border-l-2 border-zinc-700 pl-3 my-2">
                                "Între 15 iunie și 30 septembrie, fermierii trebuie să asigure acoperirea solului pe 80-85% din suprafața arabilă."
                            </p>
                            <p className="text-ea-red-500 font-semibold text-xs mt-2">RISC: Arătura de vară poate duce la penalizări APIA.</p>
                        </div>
                    </motion.div>

                    {/* Card 3: Soluția */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-zinc-900 to-ea-green-900/20 p-6 rounded-lg border border-zinc-700"
                    >
                        <h3 className="text-xl font-bold text-white mb-3">Matematica T.S.S.</h3>
                        <div className="text-zinc-300 text-sm space-y-4">
                            <p>Tehnicagro Supply Solution:</p>
                            <ul className="list-disc list-inside space-y-1 text-zinc-400">
                                <li>Semănat Direct (Avers) = <span className="text-green-400">Eligibil PD-04</span></li>
                                <li>Discuit Superficial (Fliegl) = <span className="text-green-400">Eligibil GAEC 6</span></li>
                            </ul>
                            <div className="bg-zinc-800 p-3 rounded text-center">
                                <span className="block text-xs text-zinc-500">Rezultat Net</span>
                                <span className="block text-lg font-bold text-white">Conformitate 100%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
