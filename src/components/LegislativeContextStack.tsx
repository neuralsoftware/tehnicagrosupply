'use client';

import { motion } from 'framer-motion';
import { Scale, FileText, AlertTriangle } from 'lucide-react';

/** Coloană legislativă în același panou vizual ca și calculatorul (audit home). */
export function LegislativeContextStack() {
    return (
        <div className="flex h-full min-h-0 min-w-0 flex-col rounded-2xl border border-slate-200/60 bg-slate-50 p-6 shadow-sm md:p-8">
            <div className="mb-3 shrink-0 flex items-center gap-2 text-zinc-900">
                <Scale className="h-5 w-5 shrink-0 text-ea-green-600" />
                <h2 className="text-lg font-semibold tracking-tight md:text-xl">Fonduri & legislație 2026</h2>
            </div>
            <p className="mb-4 shrink-0 text-xs leading-snug text-zinc-500">
                GAEC 6 — obligatoriu acum. PD-04 — depunere campania 2027 (Mar–Iun 2027).
            </p>

            <div className="flex min-h-0 flex-1 flex-col gap-3">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex min-h-0 flex-1 flex-col justify-center rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-4"
                >
                    <div className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ea-green-600" />
                        <div className="min-w-0 space-y-1.5 text-xs text-zinc-600">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-sm font-semibold text-zinc-900">Eco-schemă PD-04</h3>
                                <span className="text-[9px] font-black uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Campania 2027</span>
                            </div>
                            <p>
                                <span className="font-medium text-zinc-800">Beneficiu:</span>{' '}
                                <span className="font-semibold text-zinc-900">~56,28 EUR/ha</span>
                            </p>
                            <p className="border-l-2 border-zinc-200 pl-2 text-[11px] italic leading-snug text-zinc-500">
                                No-till / strip-till pe min. 50% din suprafața arabilă. Depunere: Mar–Iun 2027.
                            </p>
                            <p className="text-[10px] font-medium text-zinc-400">Campania 2026 închisă · PNS 2023–2027</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="flex min-h-0 flex-1 flex-col justify-center rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-4"
                >
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ea-red-600" />
                        <div className="min-w-0 space-y-1.5 text-xs text-zinc-600">
                            <h3 className="text-sm font-semibold text-zinc-900">GAEC 6</h3>
                            <p className="font-medium text-zinc-800">Acoperire sol în perioade sensibile.</p>
                            <p className="border-l-2 border-zinc-200 pl-2 text-[11px] italic leading-snug text-zinc-500">
                                15 iunie – 30 sept.: 80–85% suprafață acoperită.
                            </p>
                            <p className="text-[11px] text-zinc-700">
                                <span className="text-ea-red-600">Atenție:</span> arătura de vară → risc penalizări.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex min-h-0 flex-1 flex-col justify-center rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-4"
                >
                    <div className="flex items-start gap-2">
                        <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <div className="min-w-0 space-y-1.5 text-xs text-zinc-600">
                            <h3 className="text-sm font-semibold text-zinc-900">IS-V-01 · viticultură</h3>
                            <p className="text-[11px] font-medium text-zinc-500">PNS România · restructurare / reconversie</p>
                            <p>MADR: modernizare plantații și sisteme noi.</p>
                            <p>
                                <span className="font-medium text-zinc-800">Plafon orientativ:</span>{' '}
                                <span className="font-semibold text-zinc-900">până la 100.000 EUR / proiect</span>
                            </p>
                            <p className="border-l-2 border-zinc-200 pl-2 text-[10px] italic leading-snug text-zinc-500">
                                Informativ; prevalează ghidurile oficiale MADR/AFIR.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
