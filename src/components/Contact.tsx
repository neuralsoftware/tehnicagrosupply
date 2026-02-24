'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const JUDETE = [
    'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila',
    'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța',
    'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
    'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt',
    'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea',
    'Vâlcea', 'Vaslui', 'Vrancea',
];

export function Contact() {
    const [farmName, setFarmName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [county, setCounty] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [gdprConsent, setGdprConsent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

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
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: farmName,
                    phone: phone,
                    email: email || '',
                    county: county || 'Nespecificat',
                    hectares: 0,
                    totalBenefit: 0,
                    crops: ['Formular Contact'],
                    urgency: 'Discuție',
                    status: 'new',
                    message: message || '',
                })
            });
            if (res.ok) {
                setIsSubmitted(true);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('tehnicagro_lead_submitted', 'true');
                }
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Eroare necunoscută' }));
                alert(`Eroare server: ${errorData.error || res.statusText}. Cod: ${res.status}`);
            }
        } catch (err) {
            console.error(err);
            alert('Eroare conexiune: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-ea-green-50 relative overflow-hidden">

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold uppercase tracking-wide text-zinc-900">
                        Nu mai pierde timp.
                    </h2>
                    <p className="text-xl text-zinc-600 mt-4">
                        Utilajele se vând rapid. Asigură-ți tehnologia pentru campania de primăvară.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl max-w-xl mx-auto relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ea-green-500 opacity-5 blur-3xl -mr-10 -mt-10"></div>

                    {!isSubmitted ? (
                        <form className="space-y-4 text-left relative z-10" onSubmit={handleSubmit}>
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
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-ea-green-500 outline-none transition-all text-sm appearance-none"
                                    required
                                >
                                    <option value="" disabled>Selectează județul</option>
                                    {JUDETE.map((j) => (
                                        <option key={j} value={j}>{j}</option>
                                    ))}
                                </select>
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
                                    className="mt-1 w-4 h-4 rounded border-zinc-300 bg-zinc-50 text-ea-green-600 focus:ring-ea-green-500"
                                />
                                <label htmlFor="gdpr-contact" className="text-[10px] text-zinc-400 leading-tight">
                                    Sunt de acord cu prelucrarea datelor în scopul primirii ofertei personalizate, conform{' '}
                                    <a href="/privacy-policy" target="_blank" className="text-ea-green-500 hover:underline">
                                        Politicii de Confidențialitate
                                    </a>.
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-5 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-2xl mt-4 transition-all shadow-xl shadow-ea-green-900/20 flex items-center justify-center gap-2"
                            >
                                {isSending ? 'Se trimite...' : 'Cere Ofertă Personalizată'}
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
                            <p className="text-sm text-zinc-500">Un specialist TehnicAgro analizează solicitarea ta și te va contacta în cel mai scurt timp.</p>
                            <button
                                onClick={() => setIsSubmitted(false)}
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
