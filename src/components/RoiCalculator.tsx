'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Banknote, Droplets, Download, Send, CheckCircle2 } from 'lucide-react';

export function RoiCalculator() {
    const [hectares, setHectares] = useState<number>(100);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [contact, setContact] = useState('');

    // Constants
    const SUBSIDY_EUR = 56.28;
    const FUEL_SAVING_L = 40; // Liters per ha saved
    const FUEL_PRICE_RON = 8.0;
    const EUR_RON_RATE = 5.0;

    // Calculations
    const subsidyIncome = hectares * SUBSIDY_EUR * EUR_RON_RATE;
    const fuelSavings = hectares * FUEL_SAVING_L * FUEL_PRICE_RON;
    const totalBenefit = subsidyIncome + fuelSavings;

    const handleDownloadReport = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would normally send to a backend/spreadsheet
        // For now, we simulate success and redirect to WhatsApp
        const message = `Buna ziua! Am calculat un beneficiu de ${totalBenefit.toLocaleString('ro-RO')} RON/an pentru ferma mea de ${hectares} ha. Doresc raportul detaliat si oferta personalizata. Contact: ${contact}`;
        const encodedMessage = encodeURIComponent(message);

        setSubmitted(true);
        setTimeout(() => {
            window.open(`https://wa.me/40723380022?text=${encodedMessage}`, '_blank');
        }, 1500);
    };

    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ea-green-900 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <span className="inline-block px-4 py-1 rounded-full bg-ea-green-900/30 border border-ea-green-800 text-ea-green-500 text-sm font-semibold uppercase tracking-wider">
                        Calculator Profitabilitate
                    </span>
                    <h2 className="text-4xl font-bold uppercase text-white">
                        Cât pierzi dacă nu te modernizezi?
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Introdu suprafața fermei tale și vezi impactul financiar al tehnologiei Tehnicagro Supply.
                    </p>
                </div>

                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl p-8 md:p-12">
                    {/* Input Slider */}
                    <div className="mb-12">
                        <label className="flex justify-between items-center mb-4">
                            <span className="text-zinc-300 font-medium text-lg">Suprafața Fermei (Hectare):</span>
                            <span className="text-3xl font-bold text-white bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                                {hectares} ha
                            </span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="2000"
                            step="10"
                            value={hectares}
                            onChange={(e) => setHectares(Number(e.target.value))}
                            className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-ea-green-500"
                        />
                        <div className="flex justify-between text-xs text-zinc-500 mt-2">
                            <span>10 ha</span>
                            <span>2000 ha</span>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid md:grid-cols-3 gap-6">

                        {/* Box 1: Subsidies */}
                        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col items-center text-center group hover:border-ea-green-600/50 transition-colors">
                            <Banknote className="w-10 h-10 text-ea-green-500 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Venit Extra APIA (PD-04)</span>
                            <span className="text-3xl font-bold text-white">
                                {subsidyIncome.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-zinc-500">RON</span>
                            </span>
                        </div>

                        {/* Box 2: Fuel */}
                        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col items-center text-center group hover:border-blue-600/50 transition-colors">
                            <Droplets className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Economie Motorină</span>
                            <span className="text-3xl font-bold text-white">
                                {fuelSavings.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-zinc-500">RON</span>
                            </span>
                        </div>

                        {/* Box 3: Total */}
                        <div className="bg-gradient-to-br from-ea-green-900 to-zinc-900 p-6 rounded-xl border border-ea-green-500 flex flex-col items-center text-center shadow-[0_0_30px_rgba(22,101,52,0.2)]">
                            <Calculator className="w-10 h-10 text-white mb-4" />
                            <span className="text-ea-green-200 text-sm uppercase tracking-wider mb-2 font-bold">Beneficiu Total / An</span>
                            <span className="text-4xl font-bold text-white">
                                {totalBenefit.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-lg font-normal text-ea-green-200">RON</span>
                            </span>
                        </div>
                    </div>

                    {/* Lead Magnet Action */}
                    <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col items-center">
                        {!showForm ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-zinc-950 font-black rounded-lg uppercase tracking-tight shadow-xl hover:bg-zinc-100 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Descarcă Planul de Profit de {totalBenefit.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} RON
                            </motion.button>
                        ) : (
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.form
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleDownloadReport}
                                        className="w-full max-w-md space-y-4"
                                    >
                                        <div className="text-center space-y-2 mb-4">
                                            <h3 className="text-xl font-bold text-white uppercase italic">Ultimul pas: Unde trimitem raportul?</h3>
                                            <p className="text-zinc-400 text-sm">Vei primi fișa tehnică și calculul detaliat pe WhatsApp/Email.</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Telefon sau Email"
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-700"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-2 bottom-2 px-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-md transition-colors"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center space-y-3 text-center"
                                    >
                                        <div className="w-16 h-16 bg-ea-green-600 rounded-full flex items-center justify-center mb-2">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Se generează raportul...</h3>
                                        <p className="text-zinc-400">Te redirecționăm acum pe WhatsApp pentru validare.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                        <p className="mt-6 text-zinc-600 text-xs italic">
                            *Raportul include costurile de exploatare, amortizarea utilajului și calculul subvenției APIA PD-04.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
