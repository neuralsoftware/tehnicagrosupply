'use client';
import { useState, useCallback, useEffect } from 'react';
import { DynamicProduct } from '@/lib/products-store';
import { Pencil, Trash2, Plus, Check, X, Save, Sparkles, Loader, Link2 } from 'lucide-react';

type ImportPreviewResult = {
    success?: boolean;
    sourceUrl?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    excerptPreview?: string;
    repere?: { summary: string; bullets: string[]; ruleId: string } | null;
    ai?: { summary: string; bullets: string[] } | null;
    aiAvailable?: boolean;
    error?: string;
};

const ICON_OPTIONS = ['Ruler', 'Zap', 'Weight', 'Gauge', 'ArrowRight', 'Settings', 'Truck', 'Leaf'];

function slugify(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ImageOptimizer({ onOptimized, adminAuth, filename }: { onOptimized: (url: string) => void, adminAuth: string, filename: string }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState(0);
    const [optimizedSize, setOptimizedSize] = useState(0);
    const [uploading, setUploading] = useState(false);

    const optimizeAndUpload = useCallback((file: File, q: number) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const MAX = 1200;
                const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Convert to Blob for upload
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    setPreview(canvas.toDataURL('image/webp', q / 100));
                    setOptimizedSize(blob.size);
                    
                    // Upload to Blob via API
                    setUploading(true);
                    try {
                        const formData = new FormData();
                        formData.append('file', blob, `${filename || 'product'}.webp`);
                        formData.append('filename', `${filename || 'product'}.webp`);

                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'x-admin-auth': adminAuth },
                            body: formData,
                        });
                        const data = await res.json();
                        if (data.url) onOptimized(data.url);
                        else alert('Upload failed: ' + data.error);
                    } catch (err) {
                        alert('Upload error: ' + String(err));
                    } finally {
                        setUploading(false);
                    }
                }, 'image/webp', q / 100);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, [onOptimized, adminAuth, filename]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setOriginalSize(file.size);
        optimizeAndUpload(file, quality);
    };

    return (
        <div className="space-y-3 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
            <input type="file" accept="image/*" onChange={handleFile} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ea-green-600 file:text-white file:text-xs file:font-bold file:cursor-pointer disabled:opacity-50" disabled={uploading} />
            {preview && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Calitate WebP: {quality}%</label>
                        <input type="range" min={40} max={95} value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1 accent-ea-green-500" disabled={uploading} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-600 uppercase">Original: {(originalSize / 1024).toFixed(1)} KB</span>
                        <span className="text-ea-green-400 font-bold uppercase">Optimized: {(optimizedSize / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-zinc-800 group">
                        <img src={preview} alt="preview" className="w-full h-32 object-cover transition-all group-hover:scale-105" />
                        {uploading && (
                            <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">Se încarcă pe Blob...</span>
                            </div>
                        )}
                        {!uploading && <div className="absolute top-2 right-2 bg-ea-green-600 text-white p-1 rounded-md shadow-lg"><Check className="w-3 h-3" /></div>}
                    </div>
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
    const [importUrl, setImportUrl] = useState('');
    const [importBusy, setImportBusy] = useState(false);
    const [importPreview, setImportPreview] = useState<ImportPreviewResult | null>(null);
    const [useAiImport, setUseAiImport] = useState(false);

    const load = async () => {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data.products || []);
        setLoaded(true);
    };

    useEffect(() => { load(); }, []);

    const blank = (): Partial<DynamicProduct> => ({
        id: '', slug: '', name: '', brand: '', category: '', description: '', longDescription: '',
        imageSrc: '', gallery: [], manufacturerUrl: '', referenceLinks: [],
        specs: ['', '', ''], status: 'draft', expertVerdict: '', detailedSpecs: {},
        metaTitle: '', metaDescription: '', videoUrl: '', badge: '',
    });

    const save = async () => {
        if (!editing) return;
        setSaving(true);
        // Ensure we use the uploaded Blob URL if available
        const product = { ...editing, id: editing.id || editing.slug, imageSrc: imageUrl || editing.imageSrc };
        const method = products.find(p => p.slug === editing.slug) ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `/api/products/${editing.slug}` : '/api/products';
        await fetch(url, { 
            method, 
            headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth }, 
            body: JSON.stringify({ ...product, adminAuth }) // Move auth to body as we did for brochures
        });
        setSaving(false);
        setEditing(null);
        setImageUrl('');
        setImportPreview(null);
        setImportUrl('');
        load();
    };

    const runImportFromUrl = async () => {
        if (!importUrl.trim()) {
            alert('Introdu un URL (https://…)');
            return;
        }
        setImportBusy(true);
        setImportPreview(null);
        try {
            const res = await fetch('/api/products/import-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth },
                body: JSON.stringify({ url: importUrl.trim(), adminAuth, useAi: useAiImport }),
            });
            const data = (await res.json()) as ImportPreviewResult;
            if (!res.ok) {
                alert(data.error || 'Import eșuat');
                return;
            }
            setImportPreview(data);
        } catch (e) {
            alert('Eroare rețea: ' + String(e));
        } finally {
            setImportBusy(false);
        }
    };

    const del = async (slug: string) => {
        if (!confirm('Ștergi produsul?')) return;
        await fetch(`/api/products/${slug}`, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminAuth }) 
        });
        load();
    };

    if (!loaded) return (
        <div className="flex items-center gap-3 px-4 py-8 text-zinc-500 text-xs uppercase font-bold tracking-widest leading-none">
            <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
            Se încarcă catalogul...
        </div>
    );

    if (editing !== null) return (
        <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tight">{editing.slug ? 'Editează Produs' : 'Produs Nou'}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Toate imaginile sunt acum stocate pe Vercel Blob</p>
                </div>
                <button onClick={() => setEditing(null)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                {[ ['Nume Produs *', 'name'], ['Brand *', 'brand'], ['Badge', 'badge'], ['URL Video (YouTube)', 'videoUrl'] ].map(([label, key]) => (
                    <div key={key}>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{label}</label>
                        <input value={(editing as Record<string, string>)[key] || ''} onChange={e => {
                            const v = e.target.value;
                            const update: Partial<DynamicProduct> = { [key]: v };
                            if (key === 'name' && !editing.slug) update.slug = slugify(v);
                            setEditing(prev => ({ ...prev, ...update }));
                        }} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 transition-all" />
                    </div>
                ))}
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Slug (URL Manual)</label>
                    <input value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: slugify(e.target.value) }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-400 text-sm font-mono outline-none focus:ring-1 focus:ring-ea-green-500" />
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Categorie *</label>
                    <select value={editing.category || ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500">
                        <option value="">Selectează...</option>
                        {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                {[ ['Descriere Scurtă *', 'description', 3], ['Descriere Lungă (pagina produs)', 'longDescription', 5], ['Verdict Expert', 'expertVerdict', 3] ].map(([label, key, rows]) => (
                    <div key={String(key)}>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{String(label)}</label>
                        <textarea value={(editing as Record<string, string>)[String(key)] || ''} onChange={e => setEditing(p => ({ ...p, [String(key)]: e.target.value }))} rows={Number(rows)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-none transition-all" />
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-3">
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest">Imagine Produs (Vercel Blob)</label>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input value={imageUrl || editing.imageSrc || ''} onChange={e => { setImageUrl(e.target.value); setEditing(p => ({ ...p, imageSrc: e.target.value })); }} placeholder="URL Image (Auto-populated from upload)" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500 opacity-70" />
                        {(imageUrl || editing.imageSrc) && <img src={imageUrl || editing.imageSrc} alt="" className="w-12 h-12 rounded-lg object-cover border border-zinc-800" />}
                    </div>
                    <ImageOptimizer onOptimized={url => { setImageUrl(url); setEditing(p => ({ ...p, imageSrc: url })); }} adminAuth={adminAuth} filename={editing.slug || 'product'} />
                </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <Link2 className="w-3.5 h-3.5 text-ea-green-500" /> Galerie imagini (opțional)
                </label>
                <p className="text-[10px] text-zinc-600">Poze suplimentare pentru pagina produsului și PDF. Încarcă sau lipește URL după upload.</p>
                <div className="flex flex-wrap gap-2">
                    {(editing.gallery || []).map((gurl, gi) => (
                        <div key={`${gurl}-${gi}`} className="relative group/thumb">
                            <img src={gurl} alt="" className="w-20 h-20 rounded-xl object-cover border border-zinc-800" />
                            <button
                                type="button"
                                onClick={() =>
                                    setEditing((p) => ({
                                        ...p,
                                        gallery: (p?.gallery || []).filter((_, j) => j !== gi),
                                    }))
                                }
                                className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full text-[10px] font-black opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <ImageOptimizer
                    adminAuth={adminAuth}
                    filename={`${editing.slug || 'product'}-gal-${(editing.gallery?.length || 0) + 1}`}
                    onOptimized={(url) =>
                        setEditing((p) => ({ ...p, gallery: [...(p?.gallery || []), url] }))
                    }
                />
            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-3">
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest">Link principal producător / fișă tehnică</label>
                <input
                    value={editing.manufacturerUrl || ''}
                    onChange={(e) => setEditing((p) => ({ ...p, manufacturerUrl: e.target.value }))}
                    placeholder="https://…"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                />
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-4">Linkuri adiționale</label>
                {(editing.referenceLinks || []).map((row, i) => (
                    <div key={i} className="flex gap-2 flex-wrap">
                        <input
                            value={row.label}
                            onChange={(e) =>
                                setEditing((p) => {
                                    const ref = [...(p?.referenceLinks || [])];
                                    ref[i] = { ...ref[i], label: e.target.value };
                                    return { ...p, referenceLinks: ref };
                                })
                            }
                            placeholder="Etichetă (ex. Catalog PDF)"
                            className="flex-1 min-w-[120px] bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500"
                        />
                        <input
                            value={row.url}
                            onChange={(e) =>
                                setEditing((p) => {
                                    const ref = [...(p?.referenceLinks || [])];
                                    ref[i] = { ...ref[i], url: e.target.value };
                                    return { ...p, referenceLinks: ref };
                                })
                            }
                            placeholder="https://…"
                            className="flex-[2] min-w-[180px] bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setEditing((p) => ({
                                    ...p,
                                    referenceLinks: (p?.referenceLinks || []).filter((_, j) => j !== i),
                                }))
                            }
                            className="px-3 py-2 text-red-400 hover:text-red-300 text-xs font-black uppercase"
                        >
                            Șterge
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() =>
                        setEditing((p) => ({
                            ...p,
                            referenceLinks: [...(p?.referenceLinks || []), { label: '', url: '' }],
                        }))
                    }
                    className="text-[10px] text-ea-green-500 font-black uppercase flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Adaugă link
                </button>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-3xl border border-ea-green-900/40 space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-ea-green-400" />
                    <label className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Preluare din link (previzualizare)</label>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Citește titlu și scurtă descriere din pagina web. <strong className="text-zinc-400">Fără cost:</strong> dacă URL-ul sau textul se potrivesc cu reperele
                    noastre fixe (producători, tipuri de lucru), apare o sugestie de context TehnicAgro — poți apăsa „Aplică în descriere”. Opțional: bifează{' '}
                    <strong className="text-zinc-400">Cu AI</strong> doar dacă pe server există <code className="text-ea-green-500/90">OPENAI_API_KEY</code>.
                    Verifică mereu textul înainte de Salvare.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://site-producator.ro/model"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                    />
                    <label className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase whitespace-nowrap px-2">
                        <input type="checkbox" checked={useAiImport} onChange={(e) => setUseAiImport(e.target.checked)} className="accent-ea-green-500" />
                        Cu AI
                    </label>
                    <button
                        type="button"
                        disabled={importBusy}
                        onClick={runImportFromUrl}
                        className="px-5 py-3 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-50 text-white rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2"
                    >
                        {importBusy ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Citește pagina
                    </button>
                </div>
                {importPreview &&
                    (importPreview.title ||
                        importPreview.description ||
                        importPreview.imageUrl ||
                        importPreview.repere) && (
                    <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 text-xs">
                        {importPreview.title && (
                            <div className="text-white font-bold">{importPreview.title}</div>
                        )}
                        {importPreview.description && (
                            <p className="text-zinc-400 leading-relaxed line-clamp-4">{importPreview.description}</p>
                        )}
                        {importPreview.imageUrl && (
                            <img src={importPreview.imageUrl} alt="" className="max-h-24 rounded-lg border border-zinc-800 object-contain" />
                        )}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() =>
                                    setEditing((p) => ({
                                        ...p,
                                        description: importPreview.description || p?.description,
                                    }))
                                }
                            >
                                Pune în descriere scurtă
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() =>
                                    setEditing((p) => ({
                                        ...p,
                                        longDescription: importPreview.description || p?.longDescription,
                                    }))
                                }
                            >
                                Pune în descriere lungă
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() => {
                                    if (importPreview.imageUrl) {
                                        setImageUrl(importPreview.imageUrl);
                                        setEditing((p) => ({ ...p, imageSrc: importPreview.imageUrl! }));
                                    }
                                }}
                            >
                                Imagine principală
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() => {
                                    if (importPreview.imageUrl) {
                                        const u = importPreview.imageUrl;
                                        setEditing((p) => ({ ...p, gallery: [...(p?.gallery || []), u] }));
                                    }
                                }}
                            >
                                Adaugă în galerie
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() =>
                                    setEditing((p) => ({
                                        ...p,
                                        manufacturerUrl: importPreview.sourceUrl || p?.manufacturerUrl,
                                    }))
                                }
                            >
                                Link producător = sursă
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() =>
                                    setEditing((p) => ({
                                        ...p,
                                        metaTitle: importPreview.title || p?.metaTitle,
                                    }))
                                }
                            >
                                Meta titlu (SEO)
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200 hover:bg-zinc-700"
                                onClick={() =>
                                    setEditing((p) => ({
                                        ...p,
                                        metaDescription:
                                            (importPreview.description?.slice(0, 160) || '') || p?.metaDescription,
                                    }))
                                }
                            >
                                Meta descriere (SEO)
                            </button>
                        </div>
                        {importPreview.repere &&
                            (importPreview.repere.summary || (importPreview.repere.bullets?.length ?? 0) > 0) && (
                                <div className="pt-3 border-t border-zinc-800 space-y-2">
                                    <div className="text-[10px] font-black uppercase text-sky-400">
                                        Context TehnicAgro (repere fixe){' '}
                                        <span className="text-zinc-600 font-mono normal-case">
                                            [{importPreview.repere.ruleId}]
                                        </span>
                                    </div>
                                    {importPreview.repere.summary && (
                                        <p className="text-zinc-300 leading-relaxed">{importPreview.repere.summary}</p>
                                    )}
                                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                                        {(importPreview.repere.bullets || []).map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="px-3 py-2 bg-sky-900/40 rounded-lg text-[10px] font-black uppercase text-sky-200 hover:bg-sky-900/60"
                                            onClick={() =>
                                                setEditing((p) => ({
                                                    ...p,
                                                    longDescription: [
                                                        importPreview.repere?.summary,
                                                        (importPreview.repere?.bullets || []).map((x) => `• ${x}`).join('\n'),
                                                    ]
                                                        .filter(Boolean)
                                                        .join('\n\n'),
                                                }))
                                            }
                                        >
                                            Aplică repere în descriere lungă
                                        </button>
                                    </div>
                                </div>
                            )}
                        {importPreview.ai && (importPreview.ai.summary || (importPreview.ai.bullets?.length ?? 0) > 0) && (
                            <div className="pt-3 border-t border-zinc-800 space-y-2">
                                <div className="text-[10px] font-black uppercase text-ea-green-400">Sugestie AI</div>
                                {importPreview.ai.summary && (
                                    <p className="text-zinc-300 leading-relaxed">{importPreview.ai.summary}</p>
                                )}
                                <ul className="list-disc list-inside text-zinc-400 space-y-1">
                                    {(importPreview.ai.bullets || []).map((b, i) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="px-3 py-2 bg-ea-green-900/40 rounded-lg text-[10px] font-black uppercase text-ea-green-300"
                                        onClick={() =>
                                            setEditing((p) => ({
                                                ...p,
                                                longDescription: [importPreview.ai?.summary, (importPreview.ai?.bullets || []).map((x) => `• ${x}`).join('\n')]
                                                    .filter(Boolean)
                                                    .join('\n\n'),
                                            }))
                                        }
                                    >
                                        Aplică tot în descriere lungă
                                    </button>
                                </div>
                            </div>
                        )}
                        {!importPreview.aiAvailable && useAiImport && (
                            <p className="text-[10px] text-amber-500/90">AI indisponibil: lipsește OPENAI_API_KEY pe server.</p>
                        )}
                    </div>
                    )}
            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3">Specificații Tehnice Principale</label>
                {(editing.specs || ['', '', '']).map((spec, i) => (
                    <input key={i} value={spec} onChange={e => setEditing(p => { const s = [...(p?.specs || ['','',''])]; s[i] = e.target.value; return { ...p, specs: s }; })} placeholder={`Spec. ${i + 1} (ex: Lățime: 6.8m)`} className="w-full mb-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 transition-all font-bold" />
                ))}
                <button onClick={() => setEditing(p => ({ ...p, specs: [...(p?.specs || []), ''] }))} className="text-[10px] text-ea-green-500 font-black uppercase hover:text-white transition-colors flex items-center gap-1 mt-2">
                    <Plus className="w-3 h-3" /> Adaugă Specificație
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Meta Titlu SEO</label>
                    <input value={editing.metaTitle || ''} onChange={e => setEditing(p => ({ ...p, metaTitle: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Meta Descriere SEO</label>
                    <input value={editing.metaDescription || ''} onChange={e => setEditing(p => ({ ...p, metaDescription: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                </div>
            </div>

            <div className="flex justify-end gap-3 py-10 border-t border-zinc-800">
                <button onClick={() => setEditing(null)} className="px-8 py-4 text-zinc-500 font-black uppercase text-xs hover:text-white transition-colors leading-none">Renunță</button>
                <button onClick={save} disabled={saving} className="px-10 py-5 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-ea-green-900/40 transition-all hover:-translate-y-1 active:translate-y-0 leading-none disabled:opacity-50">
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Se salvează în Cloud...' : 'Salvează Produsul'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Catalog Produse</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{products.length} produse active pe Vercel Blob</p>
                </div>
                <button onClick={() => setEditing(blank())} className="flex items-center gap-2 px-6 py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-ea-green-900/20 transition-all hover:scale-105 active:scale-95 leading-none">
                    <Plus className="w-4 h-4" /> Adaugă Produs
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-950 text-zinc-500 text-[10px] uppercase font-black tracking-widest border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-5 text-left">Utilaj / Brand</th>
                            <th className="px-6 py-5 text-left">Categorie</th>
                            <th className="px-6 py-5 text-left">Imagine</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Gestiune</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {products.map(p => (
                            <tr key={p.slug} className="hover:bg-zinc-800/30 transition-all group">
                                <td className="px-6 py-5">
                                    <div className="font-black text-white uppercase tracking-tight">{p.name}</div>
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase">{p.brand}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded">
                                        {p.category}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    {p.imageSrc ? (
                                        <div className="relative group/img">
                                            <img src={p.imageSrc} alt="" className="w-12 h-12 rounded-xl object-cover border border-zinc-800 transition-transform group-hover/img:scale-110" />
                                            {p.imageSrc.includes('public.blob.vercel-storage.com') && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-ea-green-500 rounded-full border-2 border-zinc-900" title="Stocat pe Blob" />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-dotted border-zinc-700" />
                                    )}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-ea-green-500/10 text-ea-green-400' : 'bg-zinc-950 text-zinc-600'}`}>
                                        <div className={`w-1 h-1 rounded-full ${p.status === 'active' ? 'bg-ea-green-500' : 'bg-zinc-600'}`} />
                                        {p.status === 'active' ? 'Activ' : 'Draft'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => { setEditing({ ...p, gallery: p.gallery ?? [], referenceLinks: p.referenceLinks ?? [] }); setImageUrl(p.imageSrc); }} className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => del(p.slug)} className="p-3 bg-zinc-950 hover:bg-red-950/20 border border-zinc-800 rounded-xl text-zinc-600 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="py-20 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
                        Niciun produs găsit. Începe prin a adăuga unul!
                    </div>
                )}
            </div>
        </div>
    );
}
