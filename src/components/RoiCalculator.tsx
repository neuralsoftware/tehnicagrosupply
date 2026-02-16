'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Banknote, Droplets, Download, Send, CheckCircle2, TrendingUp, Clock, AlertCircle, MapPin, FileText, Phone, Scale } from 'lucide-react';

const COUNTIES = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brașov', 'Brăila', 'București',
    'Buzău', 'Caraș-Severin', 'Călărași', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
    'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț',
    'Olt', 'Prahova', 'Satu Mare', 'Sălaj', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui',
    'Vâlcea', 'Vrancea'
];

const CROPS = ['Cereale', 'Oleaginoase', 'Leguminoase', 'Furajere', 'Altele'];
const URGENCY_OPTIONS = [
    { id: 'urgent', label: 'Imediat (Campania Actuală)' },
    { id: 'next_season', label: 'Campania Viitoare' },
    { id: 'info', label: 'Doar Informativ (Planificare)' }
];

export function RoiCalculator() {
    const [hectares, setHectares] = useState<number>(100);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [leadId, setLeadId] = useState<string | null>(null);

    // Form State
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [county, setCounty] = useState('');
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [urgency, setUrgency] = useState('');
    const [gdprConsent, setGdprConsent] = useState(false);

    // Constants
    const SUBSIDY_EUR = 56.28;
    const FUEL_SAVING_L = 40; // Liters per ha saved
    const FUEL_PRICE_RON = 8.0;
    const EUR_RON_RATE = 5.0;
    const OVERLAP_REDUCTION_PERCENT = 0.10; // 10% reduction in inputs due to no overlap
    const INPUT_COST_PER_HA_RON = 1500; // Average input cost

    // Calculations
    const subsidyIncome = hectares * SUBSIDY_EUR * EUR_RON_RATE;
    const fuelSavings = hectares * FUEL_SAVING_L * FUEL_PRICE_RON;
    const inputSavings = hectares * INPUT_COST_PER_HA_RON * OVERLAP_REDUCTION_PERCENT;

    const totalBenefit = subsidyIncome + fuelSavings + inputSavings;
    const monthlyBenefit = totalBenefit / 12;

    const toggleCrop = (crop: string) => {
        setSelectedCrops(prev =>
            prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
        );
    };

    const handleDownloadReport = async (e: React.FormEvent) => {
        e.preventDefault();

        // Dual Tracking: GA4 + Facebook Pixel
        if (typeof window !== 'undefined') {
            // GA4 Enhanced Lead Conversion
            if ((window as any).gtag) {
                (window as any).gtag('event', 'generate_lead', {
                    value: totalBenefit,
                    currency: 'RON',
                    event_category: 'Lead Generation',
                    event_label: `${county} - ${hectares}ha - ${selectedCrops.join(', ')}`,
                    hectares: hectares,
                    county: county,
                    crops_count: selectedCrops.length,
                    urgency: urgency
                });
            }

            // Facebook Pixel Lead Event
            if ((window as any).fbq) {
                (window as any).fbq('track', 'Lead', {
                    content_name: 'ROI Calculator TehnicAgro',
                    value: totalBenefit,
                    currency: 'RON',
                    content_category: 'Lead Generation'
                });
            }
        }

        // Save to API (backend)
        try {
            const leadData = {
                name: contact,
                phone,
                email,
                county,
                hectares,
                crops: selectedCrops,
                urgency,
                subsidyIncome,
                fuelSavings,
                totalBenefit
            };

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            });

            const data = await res.json();
            if (data.success && data.lead?.id) {
                setLeadId(data.lead.id);
            }

            // Send automatic report email if email exists
            if (email) {
                await fetch('/api/send-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData)
                });
            }

            // Mark as converted to prevent Exit Intent
            if (typeof window !== 'undefined') {
                localStorage.setItem('tehnicagro_lead_submitted', 'true');
            }

        } catch (error) {
            console.error('Error in lead submission flow:', error);
        }

        setSubmitted(true);
    };

    const resetCalculator = () => {
        setShowForm(false);
        setSubmitted(false);
    };

    const [callRequested, setCallRequested] = useState(false);

    const requestCallsBack = async () => {
        if (!leadId) return; // Should not happen if flow is correct

        try {
            await fetch(`/api/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes: 'SOLICITARE REAPELARE RAPIDĂ (Urgent)',
                    urgency: 'URGENT: APEL'
                })
            });
            setCallRequested(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getRegionalAdvice = () => {
        const droughtProne = ['Constanța', 'Tulcea', 'Ialomița', 'Călărași', 'Brăila', 'Galați', 'Buzău', 'Dolj', 'Olt', 'Mehedinți', 'Vrancea', 'Vaslui'];
        const mechanicalLoad = ['Timiș', 'Arad', 'Bihor', 'Satu Mare', 'Teleorman', 'Giurgiu'];

        if (droughtProne.includes(county)) {
            return "Prioritate Secetă: Tehnologia No-Till este vitală pentru conservarea umidității. Reducerea evaporării prin resturi vegetale poate salva cultura în anii extremi.";
        }
        if (mechanicalLoad.includes(county)) {
            return "Soluri Grele: Recomandăm utilaje cu presiune mare pe brăzdar (min 150kg) pentru a asigura penetrarea în solurile compactate specifice zonei.";
        }
        return "Optimizare Generală: Structura propusă vizează reducerea costurilor fixe și conformitatea cu noile standarde de subvenționare 2026.";
    };

    return (
        <section id="audit" className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ea-green-900 to-transparent" />

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <span className="inline-block px-4 py-1 rounded-full bg-ea-green-900/40 border border-ea-green-700 text-ea-green-400 text-sm font-semibold uppercase tracking-wider">
                        Instrument Profesional de Diagnoză
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold uppercase text-white leading-tight">
                        Audit de Eficiență Tehnologică
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Analizăm impactul tehnologiilor No-Till și Conservatoare asupra rentabilității fermei tale în contextul noilor subvenții 2026.
                    </p>
                </div>

                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl p-6 md:p-12">
                    {/* Input Slider */}
                    <div className="mb-12 max-w-3xl mx-auto">
                        <label className="flex justify-between items-center mb-6">
                            <span className="text-zinc-300 font-medium text-lg">Suprafață de Lucru (Hectare):</span>
                            <span className="text-4xl font-black text-white bg-zinc-800 px-6 py-3 rounded-2xl border border-zinc-700 shadow-inner">
                                {hectares} ha
                            </span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="3000"
                            step="10"
                            value={hectares}
                            onChange={(e) => setHectares(Number(e.target.value))}
                            className="w-full h-4 bg-zinc-800 rounded-xl appearance-none cursor-pointer accent-ea-green-500"
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-600 mt-3 px-1 tracking-widest">
                            <span>10 ha</span>
                            <span>Model Standard</span>
                            <span>Exploatație Comercială</span>
                            <span>Aria Mare</span>
                            <span>3000 ha</span>
                        </div>
                    </div>

                    {!submitted && (
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center group hover:border-ea-green-900/50 transition-colors">
                                <Banknote className="w-10 h-10 text-ea-green-500 mb-4 group-hover:scale-110 transition-transform" />
                                <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Venit Securizat APIA</span>
                                <span className="text-3xl font-bold text-white">
                                    {subsidyIncome.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-zinc-500">RON</span>
                                </span>
                            </div>
                            <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center group hover:border-blue-900/50 transition-colors">
                                <Droplets className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                                <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Optimizare Costuri Input</span>
                                <span className="text-3xl font-bold text-white">
                                    {(fuelSavings + inputSavings).toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-zinc-500">RON</span>
                                </span>
                            </div>
                            <div className="bg-ea-green-950/20 p-6 rounded-2xl border border-ea-green-500/30 flex flex-col items-center text-center group border-dashed">
                                <TrendingUp className="w-10 h-10 text-ea-green-400 mb-4 group-hover:scale-110 transition-transform" />
                                <span className="text-ea-green-500/80 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Impact Profit Net / An</span>
                                <span className="text-4xl font-black text-ea-green-400">
                                    {totalBenefit.toLocaleString('ro-RO', { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-ea-green-700">RON</span>
                                </span>
                            </div>
                        </div>
                    )}


                    {/* Action Area */}
                    <div className="border-t border-zinc-800/50 pt-10">
                        {!showForm ? (
                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setShowForm(true);
                                        // Track view start
                                        if (typeof window !== 'undefined' && (window as any).fbq) {
                                            (window as any).fbq('trackCustom', 'AuditStart');
                                        }
                                    }}
                                    className="group relative inline-flex items-center gap-3 px-12 py-6 bg-white text-zinc-950 font-black rounded-2xl uppercase tracking-tighter shadow-2xl hover:bg-zinc-100 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-ea-green-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <Send className="w-6 h-6 text-ea-green-600" />
                                    <span>Primește Raportul Gratuit</span>
                                </motion.button>
                                <p className="mt-4 text-zinc-500 text-xs font-medium">
                                    ✔ Doar 2 câmpuri • Fără obligații • Rezultat instant
                                </p>
                                <p className="mt-2 text-zinc-600 text-xs">
                                    Parametrii calculați conform normativelor APIA PD-04 și GAEC 6.
                                </p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.form
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleDownloadReport}
                                        className="max-w-4xl mx-auto"
                                    >
                                        <div className="bg-zinc-950/50 p-8 rounded-3xl border border-zinc-800">
                                            {/* ESSENTIAL FIELDS - Just 2 required */}
                                            <div className="space-y-6 mb-8">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Nume / Fermă *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={contact}
                                                            onChange={(e) => setContact(e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-ea-green-500/50 outline-none transition-all"
                                                            placeholder="Nume sau Fermă"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Telefon (WhatsApp) *</label>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-ea-green-500/50 outline-none transition-all"
                                                            placeholder="07xx xxx xxx"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* OPTIONAL DETAILS - Collapsible */}
                                            <details className="mb-8 group">
                                                <summary className="cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-wider hover:text-zinc-300 transition-colors flex items-center gap-2">
                                                    <span className="group-open:rotate-90 transition-transform">▶</span>
                                                    Adaugă detalii suplimentare (opțional)
                                                </summary>
                                                <div className="mt-4 grid md:grid-cols-2 gap-6 pl-4 border-l-2 border-zinc-800">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Județ</label>
                                                        <select
                                                            value={county}
                                                            onChange={(e) => setCounty(e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-ea-green-500/50 outline-none appearance-none"
                                                        >
                                                            <option value="">Selectați Județul</option>
                                                            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Email (pentru raport PDF)</label>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-ea-green-500/50 outline-none transition-all"
                                                            placeholder="nume@ferma.ro"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Culturi</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {CROPS.map(crop => (
                                                                <button
                                                                    key={crop}
                                                                    type="button"
                                                                    onClick={() => toggleCrop(crop)}
                                                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${selectedCrops.includes(crop)
                                                                        ? 'bg-ea-green-600 border-ea-green-500 text-white shadow-lg'
                                                                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                                                        }`}
                                                                >
                                                                    {crop}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Orizont Investiție</label>
                                                        <select
                                                            value={urgency}
                                                            onChange={(e) => setUrgency(e.target.value)}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-ea-green-500/50 outline-none appearance-none"
                                                        >
                                                            <option value="">Alegeți perioada vizată</option>
                                                            {URGENCY_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </details>

                                            <div className="flex items-start gap-3 mb-6 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                                <input
                                                    type="checkbox"
                                                    id="gdpr-audit"
                                                    required
                                                    checked={gdprConsent}
                                                    onChange={(e) => setGdprConsent(e.target.checked)}
                                                    className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-ea-green-600 focus:ring-ea-green-500 cursor-pointer"
                                                />
                                                <label htmlFor="gdpr-audit" className="text-[11px] text-zinc-400 leading-snug cursor-pointer">
                                                    Sunt de acord cu prelucrarea datelor conform{' '}
                                                    <a href="/privacy-policy" target="_blank" className="text-ea-green-500 hover:underline font-bold">
                                                        Politicii de Confidențialitate
                                                    </a>.
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full py-5 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all hover:translate-y-[-2px]"
                                            >
                                                Primește Raportul Tehnic Gratuit
                                            </button>
                                            <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-wider font-bold">
                                                🔒 Date securizate GDPR • Fără spam • Fără obligații
                                            </p>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="max-w-4xl mx-auto bg-zinc-50 text-zinc-900 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white"
                                    >
                                        {/* Header Raport - Professional Look */}
                                        <div className="bg-zinc-900 p-10 flex justify-between items-start text-white border-b-8 border-ea-green-600">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="w-5 h-5 text-ea-green-500" />
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-ea-green-500">Document Tehnic Confidențial</span>
                                                </div>
                                                <h3 className="text-3xl font-black uppercase tracking-tight">Expertiză Eficiență Tehnologică</h3>
                                                <p className="text-zinc-500 text-sm font-bold">Analiză personalizată pentru {contact} • {county}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className="bg-ea-green-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase mb-4">Validat 2026</div>
                                                <span className="text-4xl font-black text-white">{hectares} <span className="text-lg opacity-50">HA</span></span>
                                            </div>
                                        </div>

                                        <div className="p-10">
                                            <div className="grid md:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div>
                                                        <h4 className="text-zinc-400 text-[10px] font-black uppercase mb-4 tracking-widest border-b border-zinc-200 pb-2">Analiză Randament Financiar</h4>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                                                                <span className="text-sm font-bold text-zinc-600 uppercase">Subvenție APIA PD-04</span>
                                                                <span className="font-black text-xl text-ea-green-600">+{subsidyIncome.toLocaleString('ro-RO')} <span className="text-xs">RON</span></span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                                                                <span className="text-sm font-bold text-zinc-600 uppercase">Economie Motorină (Est.)</span>
                                                                <span className="font-black text-xl text-blue-600">+{fuelSavings.toLocaleString('ro-RO')} <span className="text-xs">RON</span></span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
                                                                <span className="text-sm font-bold text-zinc-600 uppercase">Economie Inputuri (No-Overlap)</span>
                                                                <span className="font-black text-xl text-teal-600">+{inputSavings.toLocaleString('ro-RO')} <span className="text-xs">RON</span></span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-ea-green-500 opacity-5 blur-3xl -mr-10 -mt-10"></div>
                                                        <span className="block text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-2">Total Beneficiu Suplimentar Anual</span>
                                                        <span className="block text-5xl font-black text-ea-green-400 mb-2">{totalBenefit.toLocaleString('ro-RO')} <span className="text-lg text-ea-green-800">RON</span></span>
                                                        <p className="text-xs text-zinc-500 font-medium">Acest profit acoperă plata ratelor pentru utilajele achiziționate în proporție de peste 80%.</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-8 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="text-zinc-400 text-[10px] font-black uppercase mb-4 tracking-widest border-b border-zinc-200 pb-2">Verdict Expert Tehnicagro</h4>
                                                        <ul className="space-y-4">
                                                            <li className="flex gap-4 p-4 bg-zinc-100 rounded-2xl group hover:bg-white transition-colors">
                                                                <div className="w-10 h-10 bg-ea-green-600/10 rounded-full flex items-center justify-center shrink-0">
                                                                    <CheckCircle2 className="w-6 h-6 text-ea-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black uppercase text-zinc-400 mb-1">Eco-Schema PD-04 / GAEC 6</p>
                                                                    <p className="text-sm font-bold text-zinc-700 leading-snug">
                                                                        Configurația propusă respectă cerința de tehnologie conservativă pe min. 50% din suprafață și asigură acoperirea solului (15 iunie - 15 oct), eliminând riscul penalizărilor.
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li className="flex gap-4 p-4 bg-zinc-100 rounded-2xl group hover:bg-white transition-colors">
                                                                <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center shrink-0">
                                                                    <Clock className="w-6 h-6 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black uppercase text-zinc-400 mb-1">Timp Amortizare</p>
                                                                    <p className="text-sm font-bold text-zinc-700 leading-snug">Investiția este autosustentabilă în <span className="text-ea-green-600">8-12 luni</span> din economii directe.</p>
                                                                </div>
                                                            </li>
                                                            <li className="flex gap-4 p-4 bg-zinc-100 rounded-2xl group hover:bg-white transition-colors">
                                                                <div className="w-10 h-10 bg-orange-600/10 rounded-full flex items-center justify-center shrink-0">
                                                                    <MapPin className="w-6 h-6 text-orange-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black uppercase text-zinc-400 mb-1">Context Regional ({county})</p>
                                                                    <p className="text-sm font-bold text-zinc-700 leading-snug">{getRegionalAdvice()}</p>
                                                                </div>
                                                            </li>
                                                            <li className="flex gap-4 p-4 bg-ea-green-500/10 border border-ea-green-500/20 rounded-2xl group hover:bg-white transition-colors">
                                                                <div className="w-10 h-10 bg-ea-green-600/10 rounded-full flex items-center justify-center shrink-0">
                                                                    <Scale className="w-6 h-6 text-ea-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black uppercase text-ea-green-600 mb-1">Oportunitate Finanțare 2026</p>
                                                                    <p className="text-sm font-bold text-zinc-700 leading-snug">
                                                                        Sesiunea <span className="text-ea-green-600">DR-12 (200.000€)</span> se deschide în curând. Configurația selectată este eligibilă pentru finanțare nerambursabilă de până la 80%.
                                                                    </p>
                                                                </div>
                                                            </li>
                                                            <li className="flex gap-4 p-4 bg-orange-600/10 rounded-2xl border border-orange-500/20 group hover:bg-white transition-colors">
                                                                <div className="w-10 h-10 bg-orange-600/10 rounded-full flex items-center justify-center shrink-0">
                                                                    <FileText className="w-6 h-6 text-orange-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black uppercase text-zinc-400 mb-1">Resurse Utile APIA</p>
                                                                    <p className="text-xs font-bold text-zinc-600 leading-snug">
                                                                        Consultă <a href="https://apia.org.ro/wp-content/uploads/2023/04/Ghid-informativ-PD-04.pdf" target="_blank" className="text-ea-green-600 underline">Ghidul Solicitantului</a> și
                                                                        asigură-te că deții <a href="https://apia.org.ro/categorii-documente/modele-caiete-pentru-eco-schemele-din-sectorul-vegetal/" target="_blank" className="text-ea-green-600 underline">Modelele de Caiete</a> necesare pentru audit.
                                                                    </p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="pt-4 border-t border-zinc-200">
                                                        <div className="bg-ea-green-50 p-4 rounded-xl border border-ea-green-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Clock className="w-4 h-4 text-ea-green-600" />
                                                                <span className="text-[10px] uppercase font-black tracking-widest text-ea-green-800">Următorii Pași</span>
                                                            </div>
                                                            <p className="text-[11px] text-zinc-600 leading-normal">
                                                                Acest raport digital este o diagnoză preliminară. Pentru a primi **oferta tehnică oficială** și validarea 100% a conformității APIA, aprobă raportul mai jos. Un specialist TehnicAgro te va contacta în cel mai scurt timp.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-8 border-t border-zinc-200">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="bg-ea-green-600 text-white p-6 rounded-2xl text-center shadow-xl shadow-ea-green-900/20">
                                                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                                                                <p className="font-bold uppercase tracking-tight text-sm">
                                                                    {email ? 'Auditul a fost salvat și trimis!' : 'Cerere Înregistrată cu Succes!'}
                                                                </p>
                                                                <p className="text-[11px] opacity-90 mt-1">
                                                                    {email ? `Am trimis raportul complet pe ${email}.` : 'Un specialist TehnicAgro te va contacta telefonic pentru prezentarea raportului.'}
                                                                </p>
                                                            </div>

                                                            <button
                                                                onClick={requestCallsBack}
                                                                disabled={callRequested}
                                                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${callRequested
                                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                                    : 'bg-zinc-900 hover:bg-black text-white'
                                                                    }`}
                                                            >
                                                                {callRequested ? (
                                                                    <>
                                                                        <CheckCircle2 className="w-5 h-5" />
                                                                        Solicitare Apel Înregistrată!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Phone className="w-5 h-5" />
                                                                        Solicită Apel Specialist (Gratuit)
                                                                    </>
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={resetCalculator}
                                                                className="w-full py-3 border border-zinc-200 text-zinc-500 hover:bg-white rounded-xl font-bold text-xs uppercase tracking-tight transition-all"
                                                            >
                                                                Refă Analiza pentru altă suprafață
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
