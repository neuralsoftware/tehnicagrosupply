'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function Contact() {
    const [farmName, setFarmName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
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
                    county: 'Nespecificat',
                    hectares: 0,
                    totalBenefit: 0,
                    crops: [],
                    urgency: 'wait',
                    status: 'new'
                })
            });
            if (res.ok) {
                setIsSubmitted(true);
            } else {
                alert('Eroare la trimitere. Vă rugăm să ne contactați telefonic.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-green-900/10 relative overflow-hidden">

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold uppercase tracking-wide text-white">
                        Nu mai pierde timp.
                    </h2>
                    <p className="text-xl text-zinc-300 mt-4">
                        Utilajele se vând rapid. Asigură-ți tehnologia pentru campania de primăvară.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl max-w-lg mx-auto relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ea-green-500 opacity-5 blur-3xl -mr-10 -mt-10"></div>

                    {!isSubmitted ? (
                        <form className="space-y-4 text-left relative z-10" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Nume Fermă / Proprietar</label>
                                <input
                                    type="text"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-600 text-sm"
                                    placeholder="Ex: Agromec SRL"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Telefon</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-600 text-sm"
                                        placeholder="07xx xxx xxx"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Email (Opțional)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-600 text-sm"
                                        placeholder="nume@ferma.ro"
                                    />
                                </div>
                            </div>
                            <div className="flex items-start gap-3 mt-4">
                                <input
                                    type="checkbox"
                                    id="gdpr-contact"
                                    required
                                    checked={gdprConsent}
                                    onChange={(e) => setGdprConsent(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-ea-green-600 focus:ring-ea-green-500"
                                />
                                <label htmlFor="gdpr-contact" className="text-[10px] text-zinc-400 leading-tight">
                                    Sunt de acord cu prelucrarea datelor în scopul primirii ofertei personalizate, conform{' '}
                                    <a href="/privacy-policy" target="_blank" className="text-ea-green-500 hover:underline">
                                        Politicii de Confidențialitate
                                    </a>.
                                </label>
                            </div>
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
                            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Cerere Recepționată!</h3>
                            <p className="text-sm text-zinc-400">Un specialist TehnicAgro analizează solicitarea ta și te va contacta în cel mai scurt timp.</p>
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
