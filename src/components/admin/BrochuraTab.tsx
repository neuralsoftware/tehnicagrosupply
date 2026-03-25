'use client';

import { useState, useEffect, useMemo } from 'react';
import { DynamicProduct, ProductBrochureProfile } from '@/lib/products-store';
import { ImageOptimizer } from './ImageOptimizer';
import { Save, Sparkles, Loader, Link2, Plus, BookOpen } from 'lucide-react';

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

function emptyDraft(slug: string, existing?: ProductBrochureProfile): ProductBrochureProfile {
    return {
        slug,
        gallery: existing?.gallery ?? [],
        manufacturerUrl: existing?.manufacturerUrl ?? '',
        referenceLinks: existing?.referenceLinks ?? [],
        brochureDescription: existing?.brochureDescription ?? '',
        updatedAt: existing?.updatedAt ?? '',
    };
}

export function BrochuraTab({ adminAuth, allProducts }: { adminAuth: string; allProducts: DynamicProduct[] }) {
    const [profiles, setProfiles] = useState<Record<string, ProductBrochureProfile>>({});
    const [loaded, setLoaded] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
    const [draft, setDraft] = useState<ProductBrochureProfile | null>(null);
    const [saving, setSaving] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [importBusy, setImportBusy] = useState(false);
    const [importPreview, setImportPreview] = useState<ImportPreviewResult | null>(null);
    const [useAiImport, setUseAiImport] = useState(false);

    const loadProfiles = async () => {
        const res = await fetch('/api/brochure-profiles', { headers: { 'x-admin-auth': adminAuth }, cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setProfiles(data.profiles || {});
        setLoaded(true);
    };

    useEffect(() => {
        loadProfiles();
    }, [adminAuth]);

    const product = useMemo(
        () => (selectedSlug ? allProducts.find((p) => p.slug === selectedSlug) : undefined),
        [allProducts, selectedSlug]
    );

    const selectProduct = (slug: string) => {
        setSelectedSlug(slug);
        setDraft(emptyDraft(slug, profiles[slug]));
        setImportPreview(null);
        setImportUrl('');
    };

    const saveProfile = async () => {
        if (!draft || !selectedSlug) return;
        setSaving(true);
        try {
            const res = await fetch('/api/brochure-profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth },
                body: JSON.stringify({
                    adminAuth,
                    slug: selectedSlug,
                    gallery: draft.gallery ?? [],
                    manufacturerUrl: draft.manufacturerUrl ?? '',
                    referenceLinks:
                        draft.referenceLinks?.filter((l) => l.url.trim()) ?? [],
                    brochureDescription: draft.brochureDescription ?? '',
                }),
            });
            const data = await res.json();
            if (res.ok) {
                await loadProfiles();
                if (data.profile) setDraft(emptyDraft(selectedSlug, data.profile));
            } else alert(data.error || 'Salvare eșuată');
        } finally {
            setSaving(false);
        }
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

    if (!loaded)
        return (
            <div className="flex items-center gap-3 px-4 py-8 text-zinc-500 text-xs uppercase font-bold tracking-widest">
                <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
                Se încarcă profilurile pentru broșură...
            </div>
        );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-ea-green-400" />
                        Date broșură (PDF)
                    </h2>
                    <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                        Aici pui tot ce e „bogat”: poze extra, text lung, linkuri producător. Nu apare pe site — doar în materialele
                        publicitare generate. Site-ul rămâne curat din tab-ul Catalog.
                    </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-h-[70vh] overflow-y-auto">
                    {allProducts.map((p) => (
                        <button
                            key={p.slug}
                            type="button"
                            onClick={() => selectProduct(p.slug)}
                            className={`w-full text-left px-4 py-3 border-b border-zinc-800 flex justify-between items-center hover:bg-zinc-800/50 transition-colors ${selectedSlug === p.slug ? 'bg-ea-green-900/20 border-l-2 border-l-ea-green-500' : ''}`}
                        >
                            <span className="font-bold text-sm text-white uppercase">{p.name}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">{profiles[p.slug] ? '●' : '○'}</span>
                        </button>
                    ))}
                    {allProducts.length === 0 && (
                        <p className="p-6 text-zinc-500 text-xs">Nu există produse în catalog. Adaugă mai întâi din tab-ul Catalog.</p>
                    )}
                </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
                {!selectedSlug || !draft ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 text-sm">
                        Alege un produs din listă pentru a edita conținutul destinat broșurii PDF.
                    </div>
                ) : (
                    <>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{product?.name}</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{product?.brand} · {product?.category}</p>
                            {product?.description && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDraft((d) =>
                                            d
                                                ? {
                                                      ...d,
                                                      brochureDescription: d.brochureDescription?.trim()
                                                          ? d.brochureDescription
                                                          : product.description,
                                                  }
                                                : d
                                        )
                                    }
                                    className="mt-4 text-[10px] text-sky-400 font-black uppercase hover:text-sky-300"
                                >
                                    Copiază descrierea scurtă din catalog în text broșură (dacă e goală)
                                </button>
                            )}
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-2">
                            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                                Text detaliat pentru PDF
                            </label>
                            <textarea
                                value={draft.brochureDescription || ''}
                                onChange={(e) => setDraft((d) => (d ? { ...d, brochureDescription: e.target.value } : d))}
                                rows={10}
                                placeholder="Explicații tehnice, context, beneficii — vizibil doar în broșură..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-y min-h-[200px]"
                            />
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                                <Link2 className="w-3.5 h-3.5 text-ea-green-500" /> Galerie imagini (doar PDF)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {(draft.gallery || []).map((gurl, gi) => (
                                    <div key={`${gurl}-${gi}`} className="relative group/thumb">
                                        <img src={gurl} alt="" className="w-20 h-20 rounded-xl object-cover border border-zinc-800" />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDraft((d) =>
                                                    d
                                                        ? { ...d, gallery: (d.gallery || []).filter((_, j) => j !== gi) }
                                                        : d
                                                )
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
                                filename={`bro-${selectedSlug}-gal-${(draft.gallery?.length || 0) + 1}`}
                                onOptimized={(url) =>
                                    setDraft((d) => (d ? { ...d, gallery: [...(d.gallery || []), url] } : d))
                                }
                            />
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-3">
                            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                                Link producător / fișă tehnică (PDF)
                            </label>
                            <input
                                value={draft.manufacturerUrl || ''}
                                onChange={(e) =>
                                    setDraft((d) => (d ? { ...d, manufacturerUrl: e.target.value } : d))
                                }
                                placeholder="https://…"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                            />
                            <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-4 block">
                                Linkuri referință
                            </label>
                            {(draft.referenceLinks || []).map((row, i) => (
                                <div key={i} className="flex gap-2 flex-wrap">
                                    <input
                                        value={row.label}
                                        onChange={(e) =>
                                            setDraft((d) => {
                                                if (!d) return d;
                                                const ref = [...(d.referenceLinks || [])];
                                                ref[i] = { ...ref[i], label: e.target.value };
                                                return { ...d, referenceLinks: ref };
                                            })
                                        }
                                        placeholder="Etichetă"
                                        className="flex-1 min-w-[120px] bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500"
                                    />
                                    <input
                                        value={row.url}
                                        onChange={(e) =>
                                            setDraft((d) => {
                                                if (!d) return d;
                                                const ref = [...(d.referenceLinks || [])];
                                                ref[i] = { ...ref[i], url: e.target.value };
                                                return { ...d, referenceLinks: ref };
                                            })
                                        }
                                        placeholder="https://…"
                                        className="flex-[2] min-w-[180px] bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDraft((d) =>
                                                d
                                                    ? {
                                                          ...d,
                                                          referenceLinks: (d.referenceLinks || []).filter((_, j) => j !== i),
                                                      }
                                                    : d
                                            )
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
                                    setDraft((d) =>
                                        d
                                            ? {
                                                  ...d,
                                                  referenceLinks: [...(d.referenceLinks || []), { label: '', url: '' }],
                                              }
                                            : d
                                    )
                                }
                                className="text-[10px] text-ea-green-500 font-black uppercase flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Adaugă link
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-3xl border border-ea-green-900/40 space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-ea-green-400" />
                                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">
                                    Preluare din link (doar pentru câmpurile broșură)
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed">
                                Meta titlu/descriere de pe pagina producătorului + repere fixe (fără cost). Opțional AI dacă există{' '}
                                <code className="text-ea-green-500/90">OPENAI_API_KEY</code>.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    value={importUrl}
                                    onChange={(e) => setImportUrl(e.target.value)}
                                    placeholder="https://…"
                                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-xs font-mono outline-none focus:ring-1 focus:ring-ea-green-500"
                                />
                                <label className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase whitespace-nowrap px-2">
                                    <input
                                        type="checkbox"
                                        checked={useAiImport}
                                        onChange={(e) => setUseAiImport(e.target.checked)}
                                        className="accent-ea-green-500"
                                    />
                                    Cu AI
                                </label>
                                <button
                                    type="button"
                                    disabled={importBusy}
                                    onClick={runImportFromUrl}
                                    className="px-5 py-3 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-50 text-white rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2"
                                >
                                    {importBusy ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    Citește pagina
                                </button>
                            </div>
                            {importPreview &&
                                (importPreview.title ||
                                    importPreview.description ||
                                    importPreview.repere ||
                                    importPreview.ai) && (
                                    <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 text-xs">
                                        {importPreview.title && (
                                            <div className="text-white font-bold">{importPreview.title}</div>
                                        )}
                                        {importPreview.description && (
                                            <p className="text-zinc-400 line-clamp-4">{importPreview.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200"
                                                onClick={() =>
                                                    setDraft((d) =>
                                                        d
                                                            ? {
                                                                  ...d,
                                                                  brochureDescription:
                                                                      importPreview.description || d.brochureDescription,
                                                              }
                                                            : d
                                                    )
                                                }
                                            >
                                                Pune în text PDF
                                            </button>
                                            <button
                                                type="button"
                                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200"
                                                onClick={() => {
                                                    if (importPreview.imageUrl) {
                                                        const u = importPreview.imageUrl;
                                                        setDraft((d) =>
                                                            d ? { ...d, gallery: [...(d.gallery || []), u] } : d
                                                        );
                                                    }
                                                }}
                                            >
                                                Adaugă imagine în galerie
                                            </button>
                                            <button
                                                type="button"
                                                className="px-3 py-2 bg-zinc-800 rounded-lg text-[10px] font-black uppercase text-zinc-200"
                                                onClick={() =>
                                                    setDraft((d) =>
                                                        d
                                                            ? {
                                                                  ...d,
                                                                  manufacturerUrl:
                                                                      importPreview.sourceUrl || d.manufacturerUrl,
                                                              }
                                                            : d
                                                    )
                                                }
                                            >
                                                Link sursă = producător
                                            </button>
                                        </div>
                                        {importPreview.repere &&
                                            (importPreview.repere.summary ||
                                                (importPreview.repere.bullets?.length ?? 0) > 0) && (
                                                <div className="pt-2 border-t border-zinc-800 space-y-2">
                                                    <div className="text-[10px] font-black uppercase text-sky-400">
                                                        Repere [{importPreview.repere.ruleId}]
                                                    </div>
                                                    {importPreview.repere.summary && (
                                                        <p className="text-zinc-300">{importPreview.repere.summary}</p>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="px-3 py-2 bg-sky-900/40 rounded-lg text-[10px] font-black uppercase text-sky-200"
                                                        onClick={() =>
                                                            setDraft((d) =>
                                                                d
                                                                    ? {
                                                                          ...d,
                                                                          brochureDescription: [
                                                                              importPreview.repere?.summary,
                                                                              (importPreview.repere?.bullets || []).map(
                                                                                  (x) => `• ${x}`
                                                                              ).join('\n'),
                                                                          ]
                                                                              .filter(Boolean)
                                                                              .join('\n\n'),
                                                                      }
                                                                    : d
                                                            )
                                                        }
                                                    >
                                                        Aplică repere în text PDF
                                                    </button>
                                                </div>
                                            )}
                                        {importPreview.ai &&
                                            (importPreview.ai.summary ||
                                                (importPreview.ai.bullets?.length ?? 0) > 0) && (
                                                <div className="pt-2 border-t border-zinc-800 space-y-2">
                                                    <div className="text-[10px] font-black uppercase text-ea-green-400">
                                                        Sugestie AI
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="px-3 py-2 bg-ea-green-900/40 rounded-lg text-[10px] font-black uppercase text-ea-green-300"
                                                        onClick={() =>
                                                            setDraft((d) =>
                                                                d
                                                                    ? {
                                                                          ...d,
                                                                          brochureDescription: [
                                                                              importPreview.ai?.summary,
                                                                              (importPreview.ai?.bullets || []).map(
                                                                                  (x) => `• ${x}`
                                                                              ).join('\n'),
                                                                          ]
                                                                              .filter(Boolean)
                                                                              .join('\n\n'),
                                                                      }
                                                                    : d
                                                            )
                                                        }
                                                    >
                                                        Aplică AI în text PDF
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={saveProfile}
                                disabled={saving}
                                className="px-10 py-5 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Salvează profil broșură
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
