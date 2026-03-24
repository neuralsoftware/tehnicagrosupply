'use client';
import { useState } from 'react';
import { DynamicProduct, Brochure } from '@/lib/products-store';
import { FileText, Download, Link2, MessageSquare, Mail, RefreshCcw, Loader } from 'lucide-react';

interface Props {
    adminAuth: string;
    allProducts: DynamicProduct[];
}

const PHONE = '+40 723 380 022';
const EMAIL = 'office@tehnicagrosupply.ro';

export function MaterialeTab({ adminAuth, allProducts }: Props) {
    const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
    const [config, setConfig] = useState({ title: '', subtitle: '', introTitle: '', introText: '', theme: 'green', phone: PHONE, email: EMAIL });
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<Brochure | null>(null);
    const [history, setHistory] = useState<Brochure[]>([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const toggleProduct = (slug: string) =>
        setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);

    const loadHistory = async () => {
        const res = await fetch('/api/materiale');
        const data = await res.json();
        setHistory(data.brochures || []);
        setHistoryLoaded(true);
    };

    const generate = async () => {
        if (selectedSlugs.length === 0) { alert('Selectează cel puțin un produs!'); return; }
        setGenerating(true);
        setResult(null);
        try {
            const res = await fetch('/api/materiale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth },
                body: JSON.stringify({ config, productSlugs: selectedSlugs }),
            });
            const data = await res.json();
            if (data.success) {
                setResult(data.brochure);
                loadHistory();
            } else {
                alert('Eroare: ' + data.error);
            }
        } finally {
            setGenerating(false);
        }
    };

    const share = (url: string, type: 'wa' | 'email') => {
        const title = config.title || 'Broșură TehnicAgro Supply';
        if (type === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
        else window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Bună ziua,\n\nVă trimitere materialul de prezentare:\n${url}\n\nTehnicAgro Supply`)}`, '_blank');
    };

    // Group products by category
    const byCategory: Record<string, DynamicProduct[]> = {};
    allProducts.filter(p => p.status === 'active').forEach(p => {
        if (!byCategory[p.category]) byCategory[p.category] = [];
        byCategory[p.category].push(p);
    });

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Configurare Broșură</h3>

                {/* Config fields */}
                <div className="grid grid-cols-2 gap-4">
                    {[['Titlu Document *', 'title', 'ex: Soluții Viticole TehnicAgro 2026'], ['Subtitlu', 'subtitle', 'ex: Utilaje eligibile IS-V-02 APIA'], ['Titlu Secțiune Intro', 'introTitle', 'ex: Partenerul tău de încredere'], ['Telefon Contact', 'phone', PHONE], ['Email Contact', 'email', EMAIL]].map(([label, key, ph]) => (
                        <div key={key}>
                            <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{label}</label>
                            <input value={(config as Record<string, string>)[key]} onChange={e => setConfig(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Temă Vizuală</label>
                        <select value={config.theme} onChange={e => setConfig(p => ({ ...p, theme: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none">
                            <option value="green">Verde TehnicAgro (Standard)</option>
                            <option value="dark">Negru Premium</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Mesaj Introductiv</label>
                    <textarea value={config.introText} onChange={e => setConfig(p => ({ ...p, introText: e.target.value }))} rows={3} placeholder="Descrieți pe scurt oferta sau contextul broșurii..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-none" />
                </div>
            </div>

            {/* Product selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Selectează Produse</h3>
                    <span className="text-[10px] text-zinc-500">{selectedSlugs.length}/8 selectate</span>
                </div>
                {Object.keys(byCategory).length === 0 ? (
                    <p className="text-zinc-600 text-sm italic">Nu există produse active. Activează produse din tab-ul Catalog.</p>
                ) : (
                    Object.entries(byCategory).map(([cat, prods]) => (
                        <div key={cat}>
                            <p className="text-[10px] text-ea-green-500 uppercase font-black tracking-widest mb-2">{cat}</p>
                            <div className="grid grid-cols-2 gap-2">
                                {prods.map(p => (
                                    <label key={p.slug} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedSlugs.includes(p.slug) ? 'border-ea-green-600 bg-ea-green-900/20 text-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                                        <input type="checkbox" checked={selectedSlugs.includes(p.slug)} onChange={() => toggleProduct(p.slug)} disabled={!selectedSlugs.includes(p.slug) && selectedSlugs.length >= 8} className="accent-ea-green-500" />
                                        <div>
                                            <div className="text-xs font-bold">{p.name}</div>
                                            <div className="text-[10px] text-zinc-500">{p.brand}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Generate button */}
            <button onClick={generate} disabled={generating || selectedSlugs.length === 0} className="w-full py-5 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-40 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-ea-green-900/20">
                {generating ? <><Loader className="w-5 h-5 animate-spin" />Generez PDF...</> : <><FileText className="w-5 h-5" />Generează Broșură PDF</>}
            </button>

            {/* Result */}
            {result && (
                <div className="bg-ea-green-950/30 border border-ea-green-900/50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ea-green-500/20 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-ea-green-400" /></div>
                        <div>
                            <p className="font-black text-white text-sm">{result.title}</p>
                            <p className="text-[10px] text-ea-green-400 uppercase font-bold">Broșură generată cu succes!</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <a href={result.publicUrl} download className="flex items-center justify-center gap-2 px-5 py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-xl font-black uppercase text-xs">
                            <Download className="w-4 h-4" />Descarcă PDF
                        </a>
                        <button onClick={() => { navigator.clipboard.writeText(result.publicUrl); alert('Link copiat!'); }} className="flex items-center justify-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-black uppercase text-xs">
                            <Link2 className="w-4 h-4" />Copiază Link
                        </button>
                        <button onClick={() => share(result.publicUrl, 'wa')} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-xl font-black uppercase text-xs border border-[#25D366]/30">
                            <MessageSquare className="w-4 h-4" />Trimite WhatsApp
                        </button>
                        <button onClick={() => share(result.publicUrl, 'email')} className="flex items-center justify-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-black uppercase text-xs">
                            <Mail className="w-4 h-4" />Trimite Email
                        </button>
                    </div>
                    <div className="bg-zinc-950 rounded-xl p-3">
                        <p className="text-[10px] text-zinc-500 mb-1 uppercase font-bold">Link Public Shareable</p>
                        <p className="text-xs text-ea-green-400 font-mono break-all">{result.publicUrl}</p>
                    </div>
                </div>
            )}

            {/* History */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Broșuri Anterioare</span>
                    <button onClick={loadHistory} className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1"><RefreshCcw className="w-3 h-3" />Actualizează</button>
                </div>
                {!historyLoaded ? (
                    <div className="px-5 py-6 text-center"><button onClick={loadHistory} className="text-xs text-zinc-500 hover:text-white">Încarcă istoricul</button></div>
                ) : history.length === 0 ? (
                    <div className="px-5 py-6 text-center text-zinc-600 text-sm italic">Nicio broșură generată încă.</div>
                ) : (
                    <div className="divide-y divide-zinc-800/50">
                        {history.slice(0, 10).map(b => (
                            <div key={b.id} className="px-5 py-4 flex items-center justify-between hover:bg-zinc-800/20">
                                <div>
                                    <p className="text-sm font-bold text-white">{b.title}</p>
                                    <p className="text-[10px] text-zinc-500">{new Date(b.createdAt).toLocaleString('ro-RO')} · {b.productSlugs.length} produse</p>
                                </div>
                                <div className="flex gap-2">
                                    <a href={b.publicUrl} download className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white text-[10px] font-bold uppercase flex items-center gap-1"><Download className="w-3 h-3" />PDF</a>
                                    <button onClick={() => { navigator.clipboard.writeText(b.publicUrl); alert('Link copiat!'); }} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white text-[10px] font-bold uppercase flex items-center gap-1"><Link2 className="w-3 h-3" />Link</button>
                                    <button onClick={() => share(b.publicUrl, 'wa')} className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg text-[#25D366] text-[10px] font-bold uppercase"><MessageSquare className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
