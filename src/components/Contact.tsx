'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function Contact() {
    const [farmName, setFarmName] = useState('');
    const [phone, setPhone] = useState('');

    const handleWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `Buna ziua, sunt interesat de oferta Tehnicagro Supply. Nume ferma: ${farmName}, Telefon: ${phone}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/40723380022?text=${encodedMessage}`, '_blank');
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
                    className="bg-zinc-900 p-8 rounded-xl border border-zinc-700 shadow-2xl max-w-lg mx-auto"
                >
                    <form className="space-y-4 text-left" onSubmit={handleWhatsApp}>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Nume Fermă</label>
                            <input
                                type="text"
                                value={farmName}
                                onChange={(e) => setFarmName(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:ring-2 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-600"
                                placeholder="Ex: Agromec SRL"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Telefon</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:ring-2 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-600"
                                placeholder="07xx xxx xxx"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white font-bold rounded uppercase tracking-wide mt-4 transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                            <span>Cere Ofertă WhatsApp</span>
                            <span className="text-xs font-normal opacity-80">(Gratuit)</span>
                        </button>
                        <p className="text-[10px] text-zinc-600 text-center leading-tight">
                            Prin trimiterea acestui formular, sunteți de acord cu prelucrarea datelor cu caracter personal în scopul transmiterii ofertei comerciale, conform Politicii de Confidențialitate TehnicAgro Supply.
                        </p>
                    </form>
                    <div className="mt-6 text-sm text-zinc-500 text-center space-y-2">
                        <div>Sau sună direct: <a href="tel:0723380022" className="text-white hover:underline font-semibold">0723 380 022</a></div>
                        <div>Email: <a href="mailto:tehnicagro.supply@gmail.com" className="text-ea-green-500 hover:underline">tehnicagro.supply@gmail.com</a></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
