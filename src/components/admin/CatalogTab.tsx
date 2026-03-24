'use client';
import { useState, useCallback } from 'react';
import { DynamicProduct } from '@/lib/products-store';
import { Pencil, Trash2, Plus, Check, X, Save, ChevronDown } from 'lucide-react';

const ICON_OPTIONS = ['Ruler', 'Zap', 'Weight', 'Gauge', 'ArrowRight', 'Settings', 'Truck', 'Leaf'];

function slugify(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ImageOptimizer({ onOptimized }: { onOptimized: (url: string) => void }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState(0);
    const [optimizedSize, setOptimizedSize] = useState(0);

    const optimize = useCallback((file: File, q: number) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 1200;
                const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/webp', q / 100);
                setPreview(dataUrl);
                const bytes = Math.round((dataUrl.length * 3) / 4);
                setOptimizedSize(bytes);
                onOptimized(dataUrl);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, [onOptimized]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setOriginalSize(file.size);
        optimize(file, quality);
    };

    return (
        <div className="space-y-3">
            <input type="file" accept="image/*" onChange={handleFile} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ea-green-600 file:text-white file:text-xs file:font-bold file:cursor-pointer" />
            {preview && (
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Calitate WebP: {quality}%</label>
                        <input type="range" min={40} max={95} value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1 accent-ea-green-500" />
                    </div>
                    <div className="flex gap-3 text-[10px] text-zinc-500 font-mono">
                        <span>Original: {(originalSize / 1024).toFixed(1)} KB</span>
                        <span className="text-ea-green-400">Optimizat: {(optimizedSize / 1024).toFixed(1)} KB (-{Math.round((1 - optimizedSize / originalSize) * 100)}%)</span>
                    </div>
                    <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg border border-zinc-700" />
                </div>
            )}
        </div>
    );
}

interface Props {
    adminAuth: string;
    categories: { slug: string; name: string }[];
}

export function CatalogTab({ adminAuth, categories }: Props) {
    const [products, setProducts] = useState<DynamicProduct[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [editing, setEditing] = useState<Partial<DynamicProduct> | null>(null);
    const [saving, setSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const load = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
        setLoaded(true);
    };

    const blank = (): Partial<DynamicProduct> => ({
        id: '', slug: '', name: '', brand: '', category: '', description: '', longDescription: '',
        imageSrc: '', specs: ['', '', ''], status: 'draft', expertVerdict: '', detailedSpecs: {},
        metaTitle: '', metaDescription: '', videoUrl: '', badge: '',
    });

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        const product = { ...editing, id: editing.id || editing.slug, imageSrc: imageUrl || editing.imageSrc };
        const method = products.find(p => p.slug === editing.slug) ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `/api/products/${editing.slug}` : '/api/products';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth }, body: JSON.stringify(product) });
        setSaving(false);
        setEditing(null);
        load();
    };

    const del = async (slug: string) => {
        if (!confirm('Ștergi produsul?')) return;
        await fetch(`/api/products/${slug}`, { method: 'DELETE', headers: { 'x-admin-auth': adminAuth } });
        load();
    };

    if (!loaded) return (
        <button onClick={load} className="px-6 py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm">
            Încarcă Catalog
        </button>
    );

    if (editing !== null) return (
        <div className="space-y-4 max-w-3xl">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase text-white">{editing.slug ? 'Editează Produs' : 'Produs Nou'}</h3>
                <button onClick={() => setEditing(null)} className="p-2 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[ ['Nume Produs *', 'name'], ['Brand *', 'brand'], ['Badge', 'badge'], ['URL Video (YouTube)', 'videoUrl'] ].map(([label, key]) => (
                    <div key={key}>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{label}</label>
                        <input value={(editing as Record<string, string>)[key] || ''} onChange={e => {
                            const v = e.target.value;
                            const update: Partial<DynamicProduct> = { [key]: v };
                            if (key === 'name') update.slug = slugify(v);
                            setEditing(prev => ({ ...prev, ...update }));
                        }} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                    </div>
                ))}
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Slug (URL)</label>
                    <input value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: slugify(e.target.value) }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-400 text-sm font-mono outline-none focus:ring-1 focus:ring-ea-green-500" />
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Categorie *</label>
                    <select value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500">
                        <option value="">Selectează...</option>
                        {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Status</label>
                    <select value={editing.status || 'draft'} onChange={e => setEditing(p => ({ ...p, status: e.target.value as 'active' | 'draft' }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500">
                        <option value="draft">Draft (invizibil)</option>
                        <option value="active">Activ (vizibil pe site)</option>
                    </select>
                </div>
            </div>
            {[ ['Descriere Scurtă *', 'description', 3], ['Descriere Lungă (pagina produs)', 'longDescription', 5], ['Verdict Expert', 'expertVerdict', 3] ].map(([label, key, rows]) => (
                <div key={String(key)}>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{String(label)}</label>
                    <textarea value={(editing as Record<string, string>)[String(key)] || ''} onChange={e => setEditing(p => ({ ...p, [String(key)]: e.target.value }))} rows={Number(rows)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-none" />
                </div>
            ))}
            <div>
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Imagine Produs</label>
                <div className="space-y-2">
                    <input value={editing.imageSrc || ''} onChange={e => { setEditing(p => ({ ...p, imageSrc: e.target.value })); setImageUrl(e.target.value); }} placeholder="/products/imagine.jpg sau URL extern" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                    <p className="text-[10px] text-zinc-600 uppercase font-bold">-- SAU UPLOADEAZĂ ȘI OPTIMIZEAZĂ --</p>
                    <ImageOptimizer onOptimized={url => setImageUrl(url)} />
                </div>
            </div>
            <div>
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Specificații Tehnice (min. 3)</label>
                {(editing.specs || ['', '', '']).map((spec, i) => (
                    <input key={i} value={spec} onChange={e => setEditing(p => { const s = [...(p?.specs || ['','',''])]; s[i] = e.target.value; return { ...p, specs: s }; })} placeholder={`Spec. ${i + 1} (ex: Lățime: 6.8m)`} className="w-full mb-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                ))}
                <button onClick={() => setEditing(p => ({ ...p, specs: [...(p?.specs || []), ''] }))} className="text-[10px] text-ea-green-500 font-bold uppercase hover:underline">+ Adaugă Spec.</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Meta Titlu SEO</label>
                    <input value={editing.metaTitle || ''} onChange={e => setEditing(p => ({ ...p, metaTitle: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Meta Descriere SEO</label>
                    <input value={editing.metaDescription || ''} onChange={e => setEditing(p => ({ ...p, metaDescription: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button onClick={() => setEditing(null)} className="px-6 py-3 text-zinc-500 font-black uppercase text-xs hover:text-white">Anulează</button>
                <button onClick={save} disabled={saving} className="px-8 py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-xl font-black uppercase text-xs flex items-center gap-2 disabled:opacity-50">
                    <Save className="w-4 h-4" />{saving ? 'Se salvează...' : 'Salvează Produsul'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-zinc-500 text-sm">{products.length} produse în catalog</p>
                <button onClick={() => setEditing(blank())} className="flex items-center gap-2 px-5 py-2.5 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-xl font-black uppercase text-xs">
                    <Plus className="w-4 h-4" />Adaugă Produs Nou
                </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-950 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="px-5 py-4 text-left">Produs</th>
                            <th className="px-5 py-4 text-left">Categorie</th>
                            <th className="px-5 py-4 text-left">Slug</th>
                            <th className="px-5 py-4 text-center">Status</th>
                            <th className="px-5 py-4 text-right">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {products.map(p => (
                            <tr key={p.slug} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-5 py-4"><div className="font-bold text-white">{p.name}</div><div className="text-[10px] text-zinc-500">{p.brand}</div></td>
                                <td className="px-5 py-4 text-zinc-400 text-xs">{p.category}</td>
                                <td className="px-5 py-4 text-zinc-600 font-mono text-xs">{p.slug}</td>
                                <td className="px-5 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${p.status === 'active' ? 'bg-ea-green-900/40 text-ea-green-400' : 'bg-zinc-800 text-zinc-500'}`}>{p.status === 'active' ? 'Activ' : 'Draft'}</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => { setEditing(p); setImageUrl(p.imageSrc); }} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => del(p.slug)} className="p-2 bg-zinc-800 hover:bg-red-900/40 rounded-lg text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
