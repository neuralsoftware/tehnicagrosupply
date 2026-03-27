'use client';

import { useState, useRef } from 'react';
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

function formatLeadApiError(data: {
    error?: string;
    details?: unknown;
}): string {
    if (typeof data.details === 'string' && data.details.trim()) {
        const base = data.error || 'Cererea nu a putut fi procesată';
        return `${base} ${data.details}`;
    }
    if (Array.isArray(data.details) && data.details.length > 0) {
        const parts = data.details
            .map((d) => (d && typeof d === 'object' && 'message' in d ? String((d as { message?: string }).message || '') : ''))
            .filter(Boolean);
        if (parts.length) return parts.join(' ');
    }
    return data.error || 'Cererea nu a putut fi procesată.';
}

export function RoiCalculator({
    embedded = false,
    compact = false,
}: {
    embedded?: boolean;
    compact?: boolean;
} = {}) {
    const [hectares, setHectares] = useState<number>(100);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const isFetchingRef = useRef(false);

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

        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setIsSubmitting(true);
        setFormError(null);

        const leadData = {
            name: contact.trim(),
            phone: phone.trim(),
            email: email.trim(),
            county,
            hectares,
            crops: selectedCrops,
            urgency,
            subsidyIncome,
            fuelSavings,
            totalBenefit,
            message: `Hectare: ${hectares}, Culturi: ${selectedCrops.join(', ')}, Urgență: ${urgency}, Beneficiu Total: ${totalBenefit} RON`,
            source: 'ROI Calculator',
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData),
            });

            const data = (await res.json().catch(() => ({}))) as {
                success?: boolean;
                lead?: { id?: string | number };
                error?: string;
                details?: unknown;
            };

            if (!res.ok || !data.success) {
                setFormError(formatLeadApiError(data));
                return;
            }

            const id = data.lead?.id;
            if (id != null && String(id)) {
                setLeadId(String(id));
            }

            if (typeof window !== 'undefined') {
                if ((window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
                    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'generate_lead', {
                        value: totalBenefit,
                        currency: 'RON',
                        event_category: 'Lead Generation',
                        event_label: `${county} - ${hectares}ha - ${selectedCrops.join(', ')}`,
                        hectares: hectares,
                        county: county,
                        crops_count: selectedCrops.length,
                        urgency: urgency,
                    });
                }
                if ((window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq) {
                    (window as typeof window & { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead', {
                        content_name: 'ROI Calculator TehnicAgro',
                        value: totalBenefit,
                        currency: 'RON',
                        content_category: 'Lead Generation',
                    });
                }
                localStorage.setItem('tehnicagro_lead_submitted', 'true');
            }

            if (leadData.email) {
                const reportRes = await fetch('/api/send-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData),
                });
                if (!reportRes.ok) {
                    console.warn('[ROI] send-report', reportRes.status);
                }
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error in lead submission flow:', error);
            setFormError('Eroare de rețea. Verifică conexiunea și încearcă din nou.');
        } finally {
            isFetchingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const resetCalculator = () => {
        setShowForm(false);
        setSubmitted(false);
        setFormError(null);
        setLeadId(null);
        setCallRequested(false);
        setContact('');
        setPhone('');
        setEmail('');
        setCounty('');
        setSelectedCrops([]);
        setUrgency('');
        setGdprConsent(false);
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

    const isSymmetricPanel = embedded && compact;
    const shellClass = compact
        ? isSymmetricPanel
            ? 'flex h-full min-h-0 flex-col rounded-2xl border border-slate-200/60 bg-slate-50 p-6 shadow-sm md:p-8'
            : 'rounded-2xl border border-slate-200/60 bg-slate-50 p-5 shadow-sm md:p-6'
        : 'rounded-3xl border border-slate-200/60 bg-slate-50 p-8 shadow-sm md:p-12';
    const headCls = compact ? 'mb-5 space-y-2 text-center' : 'mb-10 space-y-3 text-center';
    const badgeCls = compact
        ? 'inline-block rounded-full border border-slate-200/60 bg-white px-3 py-1 text-xs font-medium text-ea-green-700 shadow-sm'
        : 'inline-block rounded-full border border-slate-200/60 bg-white px-4 py-1.5 text-sm font-medium text-ea-green-700 shadow-sm';
    const h2Cls = compact
        ? 'text-2xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-3xl'
        : 'text-3xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-4xl';
    const descCls = compact ? 'mx-auto max-w-2xl text-sm text-zinc-500' : 'mx-auto max-w-2xl text-lg text-zinc-500';
    const sliderBlockCls = compact ? 'mb-6 mx-auto max-w-full' : 'mb-12 mx-auto max-w-3xl';
    const sliderLabelRowCls = compact ? 'mb-4 flex items-center justify-between' : 'mb-6 flex items-center justify-between';
    const haLabelCls = compact ? 'text-sm font-medium text-zinc-700' : 'text-lg font-medium text-zinc-700';
    const haBadgeCls = compact
        ? 'rounded-lg border border-slate-200/60 bg-white px-3 py-1.5 text-2xl font-semibold tabular-nums text-zinc-900 md:text-3xl'
        : 'rounded-xl border border-slate-200/60 bg-white px-5 py-2.5 text-4xl font-semibold tabular-nums text-zinc-900';
    const teaserBlockCls = compact ? 'mb-6 space-y-4' : 'mb-12 space-y-8';
    const resultGridCls = compact ? 'grid grid-cols-3 gap-2 md:gap-3' : 'grid gap-6 md:grid-cols-3';
    const resultCardPad = compact ? 'p-3 md:p-4' : 'p-6';
    const resultIconCls = compact ? 'mb-2 h-7 w-7' : 'mb-4 h-10 w-10';
    const actionPt =
        compact && isSymmetricPanel
            ? 'mt-auto border-t border-zinc-200 pt-6'
            : compact
              ? 'border-t border-zinc-200 pt-6'
              : 'border-t border-zinc-200 pt-10';
    const mainColumnCls = isSymmetricPanel ? 'flex min-h-0 flex-1 flex-col' : '';

    const shell = (
        <div className={shellClass}>
                    <div className={headCls}>
                        <span className={badgeCls}>
                            Instrument profesional de diagnoză
                        </span>
                        <h2 className={h2Cls}>
                            Audit de eficiență tehnologică
                        </h2>
                        <p className={descCls}>
                            Analizăm impactul tehnologiilor No-Till și conservatoare asupra rentabilității fermei tale în contextul noilor subvenții 2026.
                        </p>
                    </div>

                    <div className={mainColumnCls}>
                    {/* Input Slider */}
                    <div className={sliderBlockCls}>
                        <label className={sliderLabelRowCls}>
                            <span className={haLabelCls}>Suprafață (ha)</span>
                            <span className={haBadgeCls}>
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
                            className="w-full h-4 bg-zinc-200 rounded-xl appearance-none cursor-pointer accent-ea-green-600"
                        />
                        <div className="flex justify-between text-xs font-medium text-zinc-600 mt-3 px-1">
                            <span>10 ha</span>
                            <span>Model Standard</span>
                            <span>Exploatație Comercială</span>
                            <span>Aria Mare</span>
                            <span>3000 ha</span>
                        </div>
                    </div>

                    {/* Results Block - Hidden/Teaser until submitted */}
                    {!submitted ? (
                        <div className={teaserBlockCls}>
                            <div className={resultGridCls}>
                                <div className={`flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white ${resultCardPad} text-center shadow-sm`}>
                                    <Banknote className={`${resultIconCls} text-ea-green-600`} />
                                    <span className="mb-2 text-xs font-medium text-zinc-600">Venit securizat APIA</span>
                                    <span className={`font-semibold tabular-nums text-zinc-400 ${compact ? 'text-xl' : 'text-3xl'}`}>— <span className={`font-normal text-zinc-400 ${compact ? 'text-sm' : 'text-lg'}`}>RON</span></span>
                                </div>
                                <div className={`flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white ${resultCardPad} text-center shadow-sm`}>
                                    <Droplets className={`${resultIconCls} text-blue-600`} />
                                    <span className="mb-2 text-xs font-medium text-zinc-600">Optimizare costuri</span>
                                    <span className={`font-semibold tabular-nums text-zinc-400 ${compact ? 'text-xl' : 'text-3xl'}`}>— <span className={`font-normal text-zinc-400 ${compact ? 'text-sm' : 'text-lg'}`}>RON</span></span>
                                </div>
                                <div className={`flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white ${resultCardPad} text-center shadow-sm`}>
                                    <TrendingUp className={`${resultIconCls} text-ea-green-600`} />
                                    <span className="mb-2 text-xs font-medium text-zinc-600">Impact profit net estimat</span>
                                    <span className={`font-semibold tabular-nums text-zinc-400 ${compact ? 'text-xl' : 'text-3xl'}`}>— <span className={`font-normal text-zinc-400 ${compact ? 'text-sm' : 'text-lg'}`}>RON</span></span>
                                </div>
                            </div>

                            {!showForm && (
                                <div className="flex flex-col items-center gap-3">
                                    <p className={`text-center text-zinc-500 ${compact ? 'max-w-sm text-xs' : 'max-w-md text-sm'}`}>
                                        Pornește auditul pentru estimări personalizate — îți cerem câteva date, în deplină siguranță.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => {
                                            setFormError(null);
                                            setShowForm(true);
                                            if (typeof window !== 'undefined' && (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq) {
                                                (window as typeof window & { fbq: (...args: unknown[]) => void }).fbq('trackCustom', 'AuditStart');
                                            }
                                        }}
                                        className={`inline-flex items-center gap-2 rounded-lg bg-ea-green-600 font-medium text-white shadow-sm transition-colors hover:bg-ea-green-500 ${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}
                                    >
                                        <Calculator className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
                                        Află rezultatul pentru {hectares} ha
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={compact ? 'mb-6 grid grid-cols-3 gap-2 md:gap-3' : 'mb-12 grid gap-6 md:grid-cols-3 md:gap-8'}>
                            <div className={`group flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white ${resultCardPad} text-center shadow-sm transition-shadow hover:shadow-md`}>
                                <Banknote className={`${resultIconCls} text-ea-green-600 transition-transform group-hover:scale-105`} />
                                <span className="mb-2 text-xs font-medium text-zinc-500">Venit securizat APIA</span>
                                <span className={`font-semibold tabular-nums text-zinc-900 ${compact ? 'text-lg md:text-xl' : 'text-3xl'}`}>
                                    {subsidyIncome.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}{' '}
                                    <span className={`font-normal text-zinc-500 ${compact ? 'text-xs' : 'text-sm'}`}>RON</span>
                                </span>
                            </div>
                            <div className={`group flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white ${resultCardPad} text-center shadow-sm transition-shadow hover:shadow-md`}>
                                <Droplets className={`${resultIconCls} text-blue-600 transition-transform group-hover:scale-105`} />
                                <span className="mb-2 text-xs font-medium text-zinc-500">Optimizare costuri input</span>
                                <span className={`font-semibold tabular-nums text-zinc-900 ${compact ? 'text-lg md:text-xl' : 'text-3xl'}`}>
                                    {(fuelSavings + inputSavings).toLocaleString('ro-RO', { maximumFractionDigits: 0 })}{' '}
                                    <span className={`font-normal text-zinc-500 ${compact ? 'text-xs' : 'text-sm'}`}>RON</span>
                                </span>
                            </div>
                            <div className={`group flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white ${resultCardPad} text-center shadow-sm transition-shadow hover:shadow-md`}>
                                <TrendingUp className={`${resultIconCls} text-ea-green-600 transition-transform group-hover:scale-105`} />
                                <span className="mb-2 text-xs font-medium text-zinc-500">Impact profit net / an</span>
                                <span className={`font-semibold tabular-nums text-ea-green-600 ${compact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>
                                    {totalBenefit.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}{' '}
                                    <span className={`font-normal text-ea-green-700 ${compact ? 'text-xs' : 'text-sm'}`}>RON</span>
                                </span>
                            </div>
                        </div>
                    )}



                    {/* Action Area */}
                    <div className={actionPt}>
                        {!showForm ? (
                            <div className="text-center text-zinc-500 text-sm">
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
                                        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
                                            <div className="text-center mb-6">
                                                <h3 className="text-xl font-bold text-zinc-900 mb-2">Completare date pentru generare</h3>
                                                <p className="text-zinc-500 text-sm">
                                                    Pentru analiza financiară pe {hectares} hectare, completează câmpurile de mai jos.
                                                </p>
                                            </div>

                                            {formError && (
                                                <div
                                                    role="alert"
                                                    className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                                                >
                                                    <AlertCircle className="w-5 h-5 shrink-0 text-red-600" aria-hidden />
                                                    <span>{formError}</span>
                                                </div>
                                            )}

                                            {/* ESSENTIAL FIELDS */}
                                            <div className="space-y-6 mb-8">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Nume / Fermă *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={contact}
                                                            onChange={(e) => setContact(e.target.value)}
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-900 focus:ring-2 focus:ring-ea-green-500/50 outline-none transition-all"
                                                            placeholder="Numele tău sau denumirea fermei"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Adresă de E-mail *</label>
                                                        <input
                                                            type="email"
                                                            required
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-900 focus:ring-2 focus:ring-ea-green-500/50 outline-none transition-all"
                                                            placeholder="adresa@email.ro"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Telefon (Opțional)</label>
                                                        <input
                                                            type="tel"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-900 focus:ring-2 focus:ring-ea-green-500/50 outline-none transition-all"
                                                            placeholder="07xx xxx xxx"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Județ *</label>
                                                        <select
                                                            required
                                                            value={county}
                                                            onChange={(e) => setCounty(e.target.value)}
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-900 focus:ring-2 focus:ring-ea-green-500/50 outline-none appearance-none"
                                                        >
                                                            <option value="">Selectează județul fermei</option>
                                                            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* OPTIONAL DETAILS - Collapsible */}
                                            <details className="mb-8 group">
                                                <summary className="cursor-pointer text-zinc-500 text-xs font-bold uppercase tracking-wider hover:text-zinc-700 transition-colors flex items-center gap-2">
                                                    <span className="group-open:rotate-90 transition-transform">▶</span>
                                                    Specificul Fermei (Opțional - pentru acuratețe maximă)
                                                </summary>
                                                <div className="mt-4 grid md:grid-cols-2 gap-6 pl-4 border-l-2 border-zinc-200">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Culturi Principale</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {CROPS.map(crop => (
                                                                <button
                                                                    key={crop}
                                                                    type="button"
                                                                    onClick={() => toggleCrop(crop)}
                                                                    className={`px-3 py-2 rounded-lg text-[10px] uppercase font-bold border transition-all ${selectedCrops.includes(crop)
                                                                        ? 'bg-ea-green-600 border-ea-green-500 text-white shadow-md'
                                                                        : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400'
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
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-900 focus:ring-2 focus:ring-ea-green-500/50 outline-none appearance-none"
                                                        >
                                                            <option value="">Alegeți perioada vizată</option>
                                                            {URGENCY_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </details>

                                            <div className="flex items-start gap-3 mb-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                                <input
                                                    type="checkbox"
                                                    id="gdpr-audit"
                                                    required
                                                    checked={gdprConsent}
                                                    onChange={(e) => setGdprConsent(e.target.checked)}
                                                    className="mt-1 w-4 h-4 rounded border-zinc-300 bg-white text-ea-green-600 focus:ring-ea-green-500 cursor-pointer"
                                                />
                                                <label htmlFor="gdpr-audit" className="text-[11px] text-zinc-400 leading-snug cursor-pointer">
                                                    Sunt de acord cu prelucrarea datelor conform{' '}
                                                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-ea-green-500 hover:underline font-bold">
                                                        Politicii de Confidențialitate
                                                    </a>.
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-5 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Clock className="w-5 h-5 animate-spin" />
                                                        Se procesează...
                                                    </>
                                                ) : (
                                                    'Primește Raportul Tehnic Gratuit'
                                                )}
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
                                        className="max-w-4xl mx-auto bg-zinc-50 text-zinc-900 rounded-3xl overflow-hidden shadow-lg border border-zinc-200"
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

                                                    <div className="bg-zinc-900 text-white p-8 rounded-3xl relative overflow-hidden border border-zinc-700">
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
                                                                        Consultă <a href="https://apia.org.ro/wp-content/uploads/2023/04/Ghid-informativ-PD-04.pdf" target="_blank" rel="noopener noreferrer" className="text-ea-green-600 underline">Ghidul Solicitantului</a> și
                                                                        asigură-te că deții <a href="https://apia.org.ro/categorii-documente/modele-caiete-pentru-eco-schemele-din-sectorul-vegetal/" target="_blank" rel="noopener noreferrer" className="text-ea-green-600 underline">Modelele de Caiete</a> necesare pentru audit.
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
                                                                Acest raport digital este o diagnoză preliminară. Pentru a primi{' '}
                                                <strong>oferta tehnică oficială</strong> și validarea conformității APIA, un specialist
                                                TehnicAgro te va contacta în cel mai scurt timp.
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
    );

    if (embedded) {
        return (
            <div className={`flex w-full min-w-0 flex-col ${compact ? 'h-full min-h-0' : ''}`}>
                {shell}
            </div>
        );
    }
    return (
        <section id="audit" className="relative overflow-hidden bg-white py-12 md:py-16">
            <div className="relative z-10 mx-auto max-w-5xl px-4">{shell}</div>
        </section>
    );
}
