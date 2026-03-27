'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const JUDETE = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila',
    'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța',
    'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
    'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt',
    'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea',
    'Vâlcea', 'Vaslui', 'Vrancea',
];

interface ContactProps {
    productName?: string; // CRM: transmite ce utilaj a cerut clientul
    /** Home: logo-uri + formular pe același ecran (split ~40/60). */
    variant?: 'default' | 'homeSplit';
}

export function Contact({ productName, variant = 'default' }: ContactProps = {}) {
    const [farmName, setFarmName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [county, setCounty] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isFetchingRef = useRef(false);
    const [gdprConsent, setGdprConsent] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    /** aria-invalid: false la încărcare; true doar după încercare submit sau onBlur pe câmp */
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [countyBlurred, setCountyBlurred] = useState(false);
    const [gdprBlurred, setGdprBlurred] = useState(false);

    const countyInvalid = (submitAttempted || countyBlurred) && !county.trim();
    const gdprInvalid = (submitAttempted || gdprBlurred) && !gdprConsent;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setIsSubmitting(true);

        // Dual Tracking: GA4 + Facebook Pixel
        if (typeof window !== 'undefined') {
            // GA4 Lead Event
            if ((window as any).gtag) {
                (window as any).gtag('event', 'generate_lead', {
                    event_category: 'Contact',
                    event_label: 'General Inquiry',
                    transport_type: 'beacon'
                });
            }

            // Facebook Pixel Lead Event
            if ((window as any).fbq) {
                (window as any).fbq('track', 'Lead', {
                    content_name: 'General Contact Form',
                    content_category: 'Lead Generation'
                });
            }
        }

        try {
            const pageTitle = typeof document !== 'undefined' ? document.title : 'Pagină Necunoscută';
            const pagePath = typeof window !== 'undefined' ? window.location.pathname : '';
            const contextString = `\n\n--- \n📍 Context Lead: Trimis de pe pagina "${pageTitle}" (${pagePath})`;
            const enrichedMessage = (message || 'Fără mesaj adăugat de client.') + contextString;

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: farmName,
                    phone: phone,
                    email: email,
                    county: county,
                    message: enrichedMessage,
                    source: `Formular Contact (Pagina: ${pageTitle})`,
                    productName: productName || undefined,
                })
            });
            const data = await res.json();

            if (data.success) {

                setIsSubmitted(true);
                setStatusMessage("Mesajul a fost trimis cu succes! Vă vom contacta în curând.");
                setSubmitAttempted(false);
                setCountyBlurred(false);
                setGdprBlurred(false);

                // Clear fields
                setFarmName('');
                setPhone('');
                setEmail('');
                setCounty('');
                setMessage('');
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('tehnicagro_lead_submitted', 'true');
                }
            } else {
                const detail =
                    typeof data.details === 'string' && data.details.trim()
                        ? `\n\n${data.details}`
                        : '';
                const msg = (data.error || 'A apărut o eroare la server.') + detail;
                setStatusMessage(msg);
                alert(msg);
            }
        } catch (err) {
            console.error(err);
            setStatusMessage("A apărut o eroare. Vă rugăm să ne contactați telefonic.");
            alert("A apărut o eroare. Vă rugăm să ne contactați telefonic.");
        } finally {
            isFetchingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const formCardClass =
        variant === 'homeSplit'
            ? 'relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm md:p-8'
            : 'relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl';

    if (variant === 'homeSplit') {
        return (
            <section id="contact" className="relative overflow-hidden bg-ea-green-50 py-12 md:py-16">
                <div className="relative z-10 mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-5 md:gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6 md:col-span-2"
                        >
                            <div>
                                <p className="text-xs font-medium text-zinc-500">Producători reprezentați</p>
                                <div className="mt-4 flex flex-wrap items-center gap-6 md:gap-8">
                                    <img
                                        src="/logos/brands/avers-agro.png"
                                        alt="Avers-Agro"
                                        className="h-10 object-contain opacity-80 transition-opacity hover:opacity-100 md:h-11"
                                    />
                                    <img
                                        src="/logos/brands/fliegl.svg"
                                        alt="Fliegl"
                                        className="h-8 object-contain opacity-80 transition-opacity hover:opacity-100 md:h-9"
                                    />
                                    <img
                                        src="/logos/brands/k-factor.webp"
                                        alt="K-Factor"
                                        className="h-8 object-contain brightness-0 opacity-70 transition-opacity hover:opacity-100 md:h-9"
                                    />
                                    <img
                                        src="/logos/brands/provitis.svg"
                                        alt="Provitis"
                                        className="h-9 w-auto object-contain object-left opacity-80 transition-opacity hover:opacity-100 md:h-10"
                                    />
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-zinc-600">
                                Parteneri OEM și consultanță tehnică pentru conformitate APIA, eficiență în câmp și finanțare
                                nerambursabilă — același interlocutor de la ofertă la livrare.
                            </p>
                        </motion.div>

                        <div className="md:col-span-3 md:min-w-0">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.05 }}
                                className="mb-6 text-left"
                            >
                                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                                    Nu mai pierde timp.
                                </h2>
                                <p className="mt-2 text-base text-zinc-600 md:text-lg">
                                    Utilajele se vând rapid. Asigură-ți tehnologia pentru campania de primăvară.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className={formCardClass}
                            >
                                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ea-green-500 opacity-5 blur-3xl" />
                                {!isSubmitted ? (
                                    <form className="relative z-10 space-y-4 text-left" onSubmit={handleSubmit}>
                                        {productName && (
                                            <div className="flex items-center gap-2 rounded-xl border border-ea-green-200 bg-ea-green-50 px-4 py-3">
                                                <div className="h-2 w-2 shrink-0 rounded-full bg-ea-green-500" />
                                                <p className="text-xs font-semibold text-ea-green-800">
                                                    Cerere pentru:{' '}
                                                    <span className="text-ea-green-600">{productName}</span>
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                Nume fermă / proprietar
                                            </label>
                                            <input
                                                type="text"
                                                value={farmName}
                                                onChange={(e) => setFarmName(e.target.value)}
                                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-ea-green-500"
                                                placeholder="Ex: Agromec SRL"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    Telefon
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-ea-green-500"
                                                    placeholder="07xx xxx xxx"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-ea-green-500"
                                                    placeholder="nume@ferma.ro"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                Județ
                                            </label>
                                            <select
                                                value={county}
                                                onChange={(e) => setCounty(e.target.value)}
                                                onBlur={() => setCountyBlurred(true)}
                                                aria-invalid={countyInvalid}
                                                aria-describedby={countyInvalid ? 'err-county-split' : undefined}
                                                className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none transition-all focus:ring-1 focus:ring-ea-green-500"
                                                required
                                            >
                                                <option value="" disabled>
                                                    Selectează județul
                                                </option>
                                                {JUDETE.map((j) => (
                                                    <option key={j} value={j}>
                                                        {j}
                                                    </option>
                                                ))}
                                            </select>
                                            {countyInvalid ? (
                                                <p id="err-county-split" className="mt-1 text-xs text-red-600" role="alert">
                                                    Selectează județul.
                                                </p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                Mesaj (opțional)
                                            </label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-ea-green-500"
                                                placeholder="Ce utilaje te interesează, suprafață fermă..."
                                                rows={3}
                                            />
                                        </div>
                                        <div className="flex items-start gap-3 pt-1">
                                            <input
                                                type="checkbox"
                                                id="gdpr-contact-split"
                                                required
                                                checked={gdprConsent}
                                                onChange={(e) => setGdprConsent(e.target.checked)}
                                                onBlur={() => setGdprBlurred(true)}
                                                aria-invalid={gdprInvalid}
                                                aria-describedby={gdprInvalid ? 'err-gdpr-split' : undefined}
                                                className="mt-1 h-4 w-4 rounded border-zinc-300 bg-zinc-50 text-ea-green-600 focus:ring-ea-green-500"
                                            />
                                            <label htmlFor="gdpr-contact-split" className="text-[10px] leading-tight text-zinc-400">
                                                Sunt de acord cu prelucrarea datelor conform{' '}
                                                <a href="/privacy-policy" target="_blank" className="text-ea-green-500 hover:underline">
                                                    Politicii de Confidențialitate
                                                </a>
                                                .
                                            </label>
                                        </div>
                                        {gdprInvalid ? (
                                            <p id="err-gdpr-split" className="text-xs text-red-600" role="alert">
                                                Bifează acordul GDPR pentru a trimite.
                                            </p>
                                        ) : null}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            onClick={() => setSubmitAttempted(true)}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ea-green-600 py-4 font-semibold text-white shadow-sm transition-all hover:bg-ea-green-500 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Se trimite...' : 'Cere ofertă personalizată'}
                                        </button>
                                        <p className="text-center text-[9px] font-medium uppercase leading-tight text-zinc-600">
                                            Datele tale sunt protejate conform standardelor TehnicAgro.
                                        </p>
                                    </form>
                                ) : (
                                    <div className="relative z-10 space-y-4 py-8 text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ea-green-500/10">
                                            <svg className="h-8 w-8 text-ea-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-zinc-900">Cerere recepționată</h3>
                                        <p className="text-sm text-zinc-500">
                                            {statusMessage ||
                                                'Un specialist TehnicAgro analizează solicitarea ta și te va contacta în cel mai scurt timp.'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setSubmitAttempted(false);
                                                setCountyBlurred(false);
                                                setGdprBlurred(false);
                                            }}
                                            className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600 transition-colors hover:text-zinc-400"
                                        >
                                            Trimite altă cerere
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="relative overflow-hidden bg-ea-green-50 py-12 md:py-16">

            <div className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                        Nu mai pierde timp.
                    </h2>
                    <p className="mt-3 text-lg text-zinc-600 md:text-xl">
                        Utilajele se vând rapid. Asigură-ți tehnologia pentru campania de primăvară.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className={formCardClass}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ea-green-500 opacity-5 blur-3xl -mr-10 -mt-10"></div>

                    {!isSubmitted ? (
                        <form className="space-y-4 text-left relative z-10" onSubmit={handleSubmit}>
                            {/* Product Badge — shown when form is embedded on a product page */}
                            {productName && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-ea-green-50 border border-ea-green-200 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-ea-green-500 flex-shrink-0" />
                                    <p className="text-xs font-black text-ea-green-800 uppercase tracking-wide">
                                        Cerere pentru: <span className="text-ea-green-600">{productName}</span>
                                    </p>
                                </div>
                            )}
                            {/* Nume */}
                            <div>
                                <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Nume Fermă / Proprietar</label>
                                <input
                                    type="text"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-400 text-sm"
                                    placeholder="Ex: Agromec SRL"
                                    required
                                />
                            </div>

                            {/* Telefon + Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Telefon</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-400 text-sm"
                                        placeholder="07xx xxx xxx"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-400 text-sm"
                                        placeholder="nume@ferma.ro"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Județ */}
                            <div>
                                <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Județ</label>
                                <select
                                    value={county}
                                    onChange={(e) => setCounty(e.target.value)}
                                    onBlur={() => setCountyBlurred(true)}
                                    aria-invalid={countyInvalid}
                                    aria-describedby={countyInvalid ? 'err-county-default' : undefined}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-ea-green-500 outline-none transition-all text-sm appearance-none"
                                    required
                                >
                                    <option value="" disabled>Selectează județul</option>
                                    {JUDETE.map((j) => (
                                        <option key={j} value={j}>{j}</option>
                                    ))}
                                </select>
                                {countyInvalid ? (
                                    <p id="err-county-default" className="mt-1 text-xs text-red-600" role="alert">
                                        Selectează județul.
                                    </p>
                                ) : null}
                            </div>

                            {/* Mesaj */}
                            <div>
                                <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Mesaj (Opțional)</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-400 text-sm resize-none"
                                    placeholder="Descrie ce utilaje te interesează, suprafața fermei, sau alte detalii relevante..."
                                    rows={3}
                                />
                            </div>

                            {/* GDPR */}
                            <div className="flex items-start gap-3 mt-2">
                                <input
                                    type="checkbox"
                                    id="gdpr-contact"
                                    required
                                    checked={gdprConsent}
                                    onChange={(e) => setGdprConsent(e.target.checked)}
                                    onBlur={() => setGdprBlurred(true)}
                                    aria-invalid={gdprInvalid}
                                    aria-describedby={gdprInvalid ? 'err-gdpr-default' : undefined}
                                    className="mt-1 w-4 h-4 rounded border-zinc-300 bg-zinc-50 text-ea-green-600 focus:ring-ea-green-500"
                                />
                                <label htmlFor="gdpr-contact" className="text-[10px] text-zinc-400 leading-tight">
                                    Sunt de acord cu prelucrarea datelor în scopul primirii ofertei personalizate, conform{' '}
                                    <a href="/privacy-policy" target="_blank" className="text-ea-green-500 hover:underline">
                                        Politicii de Confidențialitate
                                    </a>.
                                </label>
                            </div>
                            {gdprInvalid ? (
                                <p id="err-gdpr-default" className="text-xs text-red-600" role="alert">
                                    Bifează acordul GDPR pentru a trimite.
                                </p>
                            ) : null}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={() => setSubmitAttempted(true)}
                                className="w-full py-5 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-2xl mt-4 transition-all shadow-xl shadow-ea-green-900/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Se trimite...' : 'Cere Ofertă Personalizată'}
                            </button>
                            <p className="text-[9px] text-zinc-600 text-center leading-tight uppercase font-medium">
                                Datele tale sunt protejate conform standardelor TehnicAgro.
                            </p>
                        </form>
                    ) : (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-ea-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-ea-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tighter">Cerere Recepționată!</h3>
                            <p className="text-sm text-zinc-500">{statusMessage || 'Un specialist TehnicAgro analizează solicitarea ta și te va contacta în cel mai scurt timp.'}</p>
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setSubmitAttempted(false);
                                    setCountyBlurred(false);
                                    setGdprBlurred(false);
                                }}
                                className="text-[10px] uppercase font-black text-zinc-600 hover:text-zinc-400 tracking-widest transition-colors"
                            >
                                Trimite altă cerere
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
