'use client';
import { useState, useEffect } from 'react';
import { DynamicProduct, ProductFeatureBlock } from '@/lib/products-store';
import { Pencil, Trash2, Plus, X, Save, FileStack } from 'lucide-react';
import { ImageOptimizer } from './ImageOptimizer';

function slugify(str: string) {
    return String(str || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
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
    const [deepDiveBusySlug, setDeepDiveBusySlug] = useState<string | null>(null);
    const DEEP_DIVE_PHONE = '+40 723 380 022';
    const DEEP_DIVE_EMAIL = 'tehnicagro.supply@gmail.com';

    const load = async () => {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data.products || []);
        setLoaded(true);
    };

    useEffect(() => {
        load();
    }, []);

    const blank = (): Partial<DynamicProduct> => ({
        id: '',
        slug: '',
        name: '',
        brand: '',
        category: '',
        description: '',
        imageSrc: '',
        specs: ['', '', ''],
        status: 'draft',
        expertVerdict: '',
        detailedSpecs: {},
        metaTitle: '',
        metaDescription: '',
        videoUrl: '',
        badge: '',
        featureBlocks: [],
    });

    const save = async () => {
        if (!editing) return;
        const slugFinal = (editing.slug || slugify(editing.name || '')).trim();
        const categoryFinal = (editing.category || '').trim();
        const nameFinal = (editing.name || '').trim();
        if (!slugFinal || !nameFinal || !categoryFinal) {
            alert('Completează numele, categoria și slug-ul (sau lasă numele să genereze slug-ul).');
            return;
        }
        setSaving(true);
        const sitePayload = {
            id: editing.id || slugFinal || `product-${slugFinal}-${Date.now()}`,
            slug: slugFinal,
            name: nameFinal,
            brand: (editing.brand || '').trim(),
            badge: editing.badge,
            category: categoryFinal,
            description: editing.description || '',
            imageSrc: imageUrl || editing.imageSrc || '',
            specs: editing.specs || [],
            detailedSpecs: editing.detailedSpecs || {},
            expertVerdict: editing.expertVerdict || '',
            status: editing.status || 'draft',
            metaTitle: editing.metaTitle,
            metaDescription: editing.metaDescription,
            videoUrl: editing.videoUrl,
            priceRange: editing.priceRange,
            eligibility: editing.eligibility,
            specIcons: editing.specIcons,
            createdAt: editing.createdAt || '',
            updatedAt: editing.updatedAt || '',
            featureBlocks: Array.isArray(editing.featureBlocks)
                ? editing.featureBlocks.map((b) => ({
                      image: String(b?.image || '').trim(),
                      title: String(b?.title || '').trim(),
                      description: String(b?.description || '').trim(),
                  }))
                : [],
        } satisfies Partial<DynamicProduct>;

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-auth': (adminAuth || '').trim() },
                body: JSON.stringify({
                    ...sitePayload,
                    adminAuth: (adminAuth || '').trim(),
                    siteCatalogOnly: true,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                alert((data as { error?: string }).error || `Eroare server (${res.status}). Produsul nu a fost salvat.`);
                return;
            }
            setEditing(null);
            setImageUrl('');
            await load();
        } finally {
            setSaving(false);
        }
    };

    const generateDeepDiveForSlug = async (slug: string, name: string) => {
        if (
            !window.confirm(
                `Generezi broșura PDF dedicată (deep dive) pentru „${name}”? Vezi tab-ul Materiale → istoric pentru link.`
            )
        ) {
            return;
        }
        setDeepDiveBusySlug(slug);
        try {
            const res = await fetch('/api/materiale/single', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminAuth: (adminAuth || '').trim(),
                    productSlug: slug,
                    config: {
                        title: `Broșură dedicată: ${name}`,
                        phone: DEEP_DIVE_PHONE,
                        email: DEEP_DIVE_EMAIL,
                    },
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                alert((data as { error?: string; details?: string }).error || 'Eroare la generare.');
                return;
            }
            const url = (data as { brochure?: { publicUrl?: string } }).brochure?.publicUrl;
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
            else alert('PDF generat; verifică istoricul în Materiale publicitare.');
        } catch (e) {
            alert('Eroare rețea: ' + String(e));
        } finally {
            setDeepDiveBusySlug(null);
        }
    };

    const del = async (slug: string) => {
        if (!confirm('Ștergi produsul?')) return;
        await fetch(`/api/products/${slug}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminAuth }),
        });
        load();
    };

    if (!loaded)
        return (
            <div className="flex items-center gap-3 px-4 py-8 text-zinc-500 text-xs uppercase font-bold tracking-widest leading-none">
                <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
                Se încarcă catalogul...
            </div>
        );

    if (editing !== null)
        return (
            <div className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black uppercase text-white tracking-tight">
                            {editing.slug ? 'Editează Produs' : 'Produs Nou'}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            Catalog site. Text lung + galerie extra: tab „Date broșură”.
                        </p>
                        <p className="text-[10px] text-sky-400/95 font-bold uppercase tracking-widest mt-2 max-w-xl leading-relaxed">
                            Broșură PDF dedicată (deep dive): secțiunea albastră „Blocuri broșură dedicată” este mai jos, imediat după
                            imaginea principală.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setImageUrl('');
                            setEditing(null);
                        }}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    {(
                        [
                            ['Nume Produs *', 'name'],
                            ['Brand *', 'brand'],
                            ['Badge', 'badge'],
                            ['URL Video (YouTube)', 'videoUrl'],
                        ] as const
                    ).map(([label, key]) => (
                        <div key={key}>
                            <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                                {label}
                            </label>
                            <input
                                value={(editing as Record<string, string>)[key] || ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    const update: Partial<DynamicProduct> = { [key]: v };
                                    if (key === 'name' && !editing.slug) update.slug = slugify(v);
                                    setEditing((prev) => ({ ...prev, ...update }));
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 transition-all"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                            Slug (URL Manual)
                        </label>
                        <input
                            value={editing.slug || ''}
                            onChange={(e) => setEditing((p) => ({ ...p, slug: slugify(e.target.value) }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-400 text-sm font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                            Categorie *
                        </label>
                        <select
                            value={editing.category || ''}
                            onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500"
                        >
                            <option value="">Selectează...</option>
                            {categories.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                    {(
                        [
                            ['Descriere (site — scurtă, pentru curiozitate și SEO) *', 'description', 4],
                            ['Verdict Expert', 'expertVerdict', 3],
                        ] as const
                    ).map(([label, key, rows]) => (
                        <div key={key}>
                            <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                                {label}
                            </label>
                            <textarea
                                value={(editing as Record<string, string>)[key] || ''}
                                onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                                rows={rows}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-none transition-all"
                            />
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-3">
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                        Imagine principală (site + previzualizare broșură)
                    </label>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                value={imageUrl || editing.imageSrc || ''}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setEditing((p) => ({ ...p, imageSrc: e.target.value }));
                                }}
                                placeholder="URL imagine (sau încarcă mai jos)"
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500 opacity-70"
                            />
                            {(imageUrl || editing.imageSrc) && (
                                <img
                                    src={imageUrl || editing.imageSrc}
                                    alt=""
                                    className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
                                />
                            )}
                        </div>
                        <ImageOptimizer
                            onOptimized={(url) => {
                                setImageUrl(url);
                                setEditing((p) => ({ ...p, imageSrc: url }));
                            }}
                            adminAuth={adminAuth}
                            filename={editing.slug || 'product'}
                        />
                    </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 border-l-4 border-l-sky-500 space-y-4 ring-1 ring-sky-900/30">
                    <div>
                        <label className="block text-[11px] text-sky-300 uppercase font-black tracking-widest">
                            Blocuri broșură dedicată (PDF deep dive)
                        </label>
                        <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-medium normal-case">
                            Aici adaugi secțiunile pentru broșura pe un singur produs (titlu, text, poză). Se văd în PDF zig-zag, câte 2
                            pe pagină. Nu apare pe site public — doar în PDF generat din Catalog sau din Materiale.
                        </p>
                    </div>
                    {(editing.featureBlocks || []).map((block, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl border border-zinc-700 bg-zinc-950/60 space-y-3"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-sky-400 font-black uppercase">Bloc {idx + 1}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditing((p) => {
                                            if (!p) return p;
                                            return {
                                                ...p,
                                                featureBlocks: (p.featureBlocks || []).filter((_, i) => i !== idx),
                                            };
                                        })
                                    }
                                    className="text-[10px] text-zinc-500 hover:text-red-400 font-bold uppercase"
                                >
                                    Elimină
                                </button>
                            </div>
                            <input
                                value={block.title}
                                onChange={(e) =>
                                    setEditing((p) => {
                                        if (!p) return p;
                                        const blocks: ProductFeatureBlock[] = [...(p.featureBlocks || [])];
                                        blocks[idx] = { ...blocks[idx], title: e.target.value };
                                        return { ...p, featureBlocks: blocks };
                                    })
                                }
                                placeholder="Titlu secțiune (ex: Lățimi de lucru)"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-sky-500/50"
                            />
                            <textarea
                                value={block.description}
                                onChange={(e) =>
                                    setEditing((p) => {
                                        if (!p) return p;
                                        const blocks: ProductFeatureBlock[] = [...(p.featureBlocks || [])];
                                        blocks[idx] = { ...blocks[idx], description: e.target.value };
                                        return { ...p, featureBlocks: blocks };
                                    })
                                }
                                placeholder="Text descriptiv"
                                rows={3}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-sky-500/50 resize-none"
                            />
                            <input
                                value={block.image}
                                onChange={(e) =>
                                    setEditing((p) => {
                                        if (!p) return p;
                                        const blocks: ProductFeatureBlock[] = [...(p.featureBlocks || [])];
                                        blocks[idx] = { ...blocks[idx], image: e.target.value };
                                        return { ...p, featureBlocks: blocks };
                                    })
                                }
                                placeholder="URL imagine bloc"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-sky-500/50"
                            />
                            <ImageOptimizer
                                onOptimized={(url) =>
                                    setEditing((p) => {
                                        if (!p) return p;
                                        const blocks: ProductFeatureBlock[] = [...(p.featureBlocks || [])];
                                        blocks[idx] = { ...blocks[idx], image: url };
                                        return { ...p, featureBlocks: blocks };
                                    })
                                }
                                adminAuth={adminAuth}
                                filename={`${editing.slug || 'product'}-deep-${idx}`}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setEditing((p) => {
                                if (!p) return p;
                                return {
                                    ...p,
                                    featureBlocks: [...(p.featureBlocks || []), { image: '', title: '', description: '' }],
                                };
                            })
                        }
                        className="text-[11px] text-sky-300 font-black uppercase hover:text-white transition-colors flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" /> Adaugă bloc broșură dedicată
                    </button>
                </div>

                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3">
                        Specificații tehnice principale
                    </label>
                    {(Array.isArray(editing.specs) ? editing.specs : ['', '', '']).map((spec, i) => (
                        <div key={i} className="flex gap-2 items-center mb-2">
                            <input
                                value={spec}
                                onChange={(e) =>
                                    setEditing((p) => {
                                        if (!p) return p;
                                        const s = Array.isArray(p.specs) ? [...p.specs] : ['', '', ''];
                                        s[i] = e.target.value;
                                        return { ...p, specs: s };
                                    })
                                }
                                placeholder={`Spec. ${i + 1} (ex: Lățime: 6.8m)`}
                                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 transition-all font-bold"
                            />
                            <button
                                type="button"
                                title="Șterge această specificație"
                                onClick={() =>
                                    setEditing((p) => {
                                        if (!p) return p;
                                        const s = Array.isArray(p.specs) ? [...p.specs] : ['', '', ''];
                                        s.splice(i, 1);
                                        return { ...p, specs: s };
                                    })
                                }
                                className="shrink-0 p-3 rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/30 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setEditing((p) => ({ ...p, specs: [...(Array.isArray(p?.specs) ? p.specs : []), ''] }))}
                        className="text-[10px] text-ea-green-500 font-black uppercase hover:text-white transition-colors flex items-center gap-1 mt-2"
                    >
                        <Plus className="w-3 h-3" /> Adaugă specificație
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                            Meta titlu SEO
                        </label>
                        <input
                            value={editing.metaTitle || ''}
                            onChange={(e) => setEditing((p) => ({ ...p, metaTitle: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                            Meta descriere SEO
                        </label>
                        <input
                            value={editing.metaDescription || ''}
                            onChange={(e) => setEditing((p) => ({ ...p, metaDescription: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500"
                        />
                    </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Status</label>
                    <select
                        value={editing.status || 'draft'}
                        onChange={(e) =>
                            setEditing((p) => ({
                                ...p,
                                status: e.target.value as 'active' | 'draft',
                            }))
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500"
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Activ (vizibil pe site)</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 py-10 border-t border-zinc-800">
                    <button
                        type="button"
                        onClick={() => {
                            setImageUrl('');
                            setEditing(null);
                        }}
                        className="px-8 py-4 text-zinc-500 font-black uppercase text-xs hover:text-white transition-colors leading-none"
                    >
                        Renunță
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className="px-10 py-5 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-ea-green-900/40 transition-all hover:-translate-y-1 active:translate-y-0 leading-none disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Se salvează în Cloud...' : 'Salvează Produsul'}
                    </button>
                </div>
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Catalog Utilaje (site)</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                        {products.length} produse · pentru PDF detaliat vezi tab „Date broșură”
                    </p>
                    <p className="text-[11px] text-sky-400/90 font-semibold mt-3 max-w-2xl leading-snug normal-case">
                        Pentru <strong className="text-sky-300">blocurile broșură dedicată</strong> (PDF pe un singur produs): apasă
                        creionul la un produs — secțiunea albastră e imediat sub imaginea principală.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setImageUrl('');
                        setEditing(blank());
                    }}
                    className="flex items-center gap-2 px-6 py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-ea-green-900/20 transition-all hover:scale-105 active:scale-95 leading-none"
                >
                    <Plus className="w-4 h-4" /> Adaugă produs
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-950 text-zinc-500 text-[10px] uppercase font-black tracking-widest border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-5 text-left">Utilaj / Brand</th>
                            <th className="px-6 py-5 text-left">Categorie</th>
                            <th className="px-6 py-5 text-left">Imagine</th>
                            <th className="px-4 py-5 text-center whitespace-nowrap" title="Blocuri pentru PDF dedicat">
                                Blocuri PDF
                            </th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Gestiune</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {products.map((p) => (
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
                                            <img
                                                src={p.imageSrc}
                                                alt=""
                                                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 transition-transform group-hover/img:scale-110"
                                            />
                                            {/public\.blob\.vercel-storage\.com|supabase\.co\/storage\//i.test(
                                                p.imageSrc
                                            ) && (
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-ea-green-500 rounded-full border-2 border-zinc-900"
                                                    title="Stocat în cloud"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-dotted border-zinc-700" />
                                    )}
                                </td>
                                <td className="px-4 py-5 text-center">
                                    <span
                                        className={`inline-flex min-w-[2rem] justify-center text-[10px] font-black tabular-nums rounded-lg px-2 py-1 border ${
                                            (p.featureBlocks?.length || 0) > 0
                                                ? 'text-sky-400 border-sky-700/50 bg-sky-950/40'
                                                : 'text-zinc-600 border-zinc-800 bg-zinc-950/50'
                                        }`}
                                        title="Număr blocuri broșură dedicată (vezi formularul produsului)"
                                    >
                                        {p.featureBlocks?.length ?? 0}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-ea-green-500/10 text-ea-green-400' : 'bg-zinc-950 text-zinc-600'}`}
                                    >
                                        <div
                                            className={`w-1 h-1 rounded-full ${p.status === 'active' ? 'bg-ea-green-500' : 'bg-zinc-600'}`}
                                        />
                                        {p.status === 'active' ? 'Activ' : 'Draft'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => generateDeepDiveForSlug(p.slug, p.name)}
                                            disabled={deepDiveBusySlug === p.slug}
                                            title="Generează broșură dedicată (un produs)"
                                            className="p-3 bg-zinc-950 hover:bg-sky-950/40 border border-zinc-800 rounded-xl text-zinc-500 hover:text-sky-400 transition-all disabled:opacity-40"
                                        >
                                            {deepDiveBusySlug === p.slug ? (
                                                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FileStack className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing({
                                                    ...p,
                                                    featureBlocks: p.featureBlocks?.length ? [...p.featureBlocks] : [],
                                                });
                                                setImageUrl(p.imageSrc);
                                            }}
                                            className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => del(p.slug)}
                                            className="p-3 bg-zinc-950 hover:bg-red-950/20 border border-zinc-800 rounded-xl text-zinc-600 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
