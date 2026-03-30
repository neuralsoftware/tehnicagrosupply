'use client';
import { useState, useEffect, useMemo } from 'react';
import { DynamicProduct, Brochure, ProductBrochureProfile } from '@/lib/products-store';
import { MAX_MULTI_BROCHURE_PRODUCTS } from '@/lib/materiale-limits';
import { FileText, Download, Link2, MessageSquare, Mail, RefreshCcw, Loader, Sparkles, Layers, ImageIcon, Trash2, FileStack } from 'lucide-react';

interface Props {
    adminAuth: string;
    allProducts: DynamicProduct[];
    /** Când ești pe acest tab, se reîncarcă profilurile „Date broșură”. Dacă lipsește, se consideră mereu vizibil. */
    tabVisible?: boolean;
}

const MIN_PDF_TEXT_HINT = 40;

/** Indicii pentru PDF: date din Catalog (Descriere / descriere lungă) sau din tab-ul Date broșură (opțional, suprascrie). */
function pdfContentHints(product: DynamicProduct, profile: ProductBrochureProfile | undefined) {
    const fromProfile = (profile?.brochureDescription || '').trim();
    const fromCatalog = (product.longDescription || product.description || '').trim();
    const textOk =
        fromProfile.length >= MIN_PDF_TEXT_HINT || fromCatalog.length >= MIN_PDF_TEXT_HINT;
    const profPhotos = (profile?.gallery || []).filter((u) => u && String(u).trim()).length;
    const catPhotos = (product.gallery || []).filter((u) => u && String(u).trim()).length;
    const extraPhotos = profPhotos > 0 || catPhotos > 0;
    return { textOk, extraPhotos, hasProfile: Boolean(profile) };
}

const PHONE = '+40 723 380 022';
/** Același email ca în footer-ul site-ului (contact real) */
const EMAIL = 'tehnicagro.supply@gmail.com';

const TEMPLATES: Record<string, { title: string; subtitle: string; introTitle: string; introText: string }> = {
    viticol: {
        title: 'Soluții Premium pentru Viticultură',
        subtitle:
            'De la lucrări în vie până la utilaje pentru recoltă și logistică — precizie și fiabilitate pentru plantația dumneavoastră.',
        introTitle: 'Partenerul tău în Excelența Viticolă',
        introText: 'Vă propunem o selecție de utilaje de înaltă performanță, special concepute pentru exigențele viticulturii moderne. Toate soluțiile prezentate sunt eligibile pentru finațare prin programele APIA și AFIR, oferindu-vă un avantaj competitiv durabil.'
    },
    'pregatire-sol': {
        title: 'Performanță în Pregătirea Solului',
        subtitle: 'Eficiență maximă și conservarea structurii solului',
        introTitle: 'Baza unei recolte reușite',
        introText: 'Utilajele noastre pentru pregătirea solului sunt proiectate să lucreze în condiții dificile, asigurând un pat germinativ optim cu un consum minim de combustibil. Descoperiți soluțiile noastre pentru cultivare, arat și grapare.'
    },
    'semanat-fertilizat': {
        title: 'Precizie la Semănat și Fertilizat',
        subtitle: 'Distribuție uniformă pentru o dezvoltare armonioasă a culturilor',
        introTitle: 'Tehnologie de Vârf pentru Productivitate',
        introText: 'Fiecare bob contează. Semănătorile și mașinile de fertilizat din oferta TehnicAgro Supply asigură o plasare precisă a semințelor și a nutrienților, fiind compatibile cu sistemele GPS de ultimă generație.'
    },
    'recoltare-logistica': {
        title: 'Soluții Eficiente pentru Recoltare',
        subtitle: 'Viteză și rigoare în gestionarea recoltei tale',
        introTitle: 'Finalizați sezonul cu succes',
        introText: 'Timpul este critic în perioada recoltării. Oferim utilaje de transport și logistică robuste, capabile să susțină ritmul intens al campaniilor agricole moderne, minimizând pierderile și timpii morți.'
    },
    'protectia-plantelor': {
        title: 'Protecția Plantelor la Standarde Europene',
        subtitle: 'Siguranță, acuratețe și respect pentru mediu',
        introTitle: 'Control Total asupra Tratamentelelor',
        introText: 'Echipamentele noastre de stropit și protecție asigură o acoperire uniformă și reduc deriva soluțiilor, încadrându-se perfect în normele GAEC și oferind o eficiență maximă a tratamentelor fitosanitare.'
    },
    // Mixt / Multi-categorie
    'mix-cultura-mare': {
        title: 'Tehnologie Completă pentru Cultură Mare',
        subtitle: 'Flux de lucru integrat: Pregătire, Semănat și Fertilizare',
        introTitle: 'Soluția completă pentru ferma ta',
        introText: 'Am selectat cele mai performante utilaje pentru a vă oferi o soluție completă în gestionarea culturilor mari. De la pregătirea precisă a patului germinativ până la semănatul de mare viteză, TehnicAgro Supply vă asigură echipamentele necesare pentru a maximiza randamentul la hectar.'
    },
    'mix-logistica-recolta': {
        title: 'Soluții pentru Recoltare și Logistică',
        subtitle: 'Eficiență în campanie: de la câmp la depozit',
        introTitle: 'Campanii rapide fără pierderi',
        introText: 'Această selecție de utilaje este dedicată optimizării procesului de recoltare și transport. Oferim soluții care minimizează timpii de descărcare și asigură transportul în siguranță al recoltei, indiferent de condițiile terenului.'
    },
    'mix-ferma-moderna': {
        title: 'TEHNICAGRO SUPPLY',
        subtitle: 'Echipamente pentru Ferma Viitorului',
        introTitle: 'Modernizare prin TehnicAgro Supply',
        introText: 'Ferma modernă necesită versatilitate. Vă propunem un pachet mixt de utilaje care acoperă diversele nevoi ale exploatației dumneavoastră, asigurând o mecanizare eficientă și conformitate deplină cu standardele europene de mediu.'
    }
};

export function MaterialeTab({ adminAuth, allProducts, tabVisible = true }: Props) {
    const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
    const [config, setConfig] = useState({ title: '', subtitle: '', introTitle: '', introText: '', theme: 'green', phone: PHONE, email: EMAIL });
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<Brochure | null>(null);
    const [history, setHistory] = useState<Brochure[]>([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [brochureProfiles, setBrochureProfiles] = useState<Record<string, ProductBrochureProfile>>({});
    const [deepDiveSlug, setDeepDiveSlug] = useState('');
    const [generatingDeepDive, setGeneratingDeepDive] = useState(false);

    useEffect(() => {
        if (!tabVisible || !adminAuth.trim()) return;
        let cancelled = false;
        (async () => {
            const res = await fetch(`/api/brochure-profiles?_=${Date.now()}`, {
                headers: { 'x-admin-auth': adminAuth.trim() },
                cache: 'no-store',
            });
            if (!res.ok || cancelled) return;
            const data = await res.json();
            setBrochureProfiles(data.profiles || {});
        })();
        return () => {
            cancelled = true;
        };
    }, [tabVisible, adminAuth, generating]);

    const toggleProduct = (slug: string) =>
        setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);

    const loadHistory = async () => {
        const res = await fetch(`/api/materiale?_=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        setHistory(data.brochures || []);
        setHistoryLoaded(true);
    };

    useEffect(() => {
        if (!tabVisible || !adminAuth.trim()) return;
        let cancelled = false;
        (async () => {
            const res = await fetch(`/api/materiale?_=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json().catch(() => ({}));
            if (cancelled || !res.ok) return;
            setHistory((data as { brochures?: Brochure[] }).brochures || []);
            setHistoryLoaded(true);
        })();
        return () => {
            cancelled = true;
        };
    }, [tabVisible, adminAuth]);

    const applyTemplate = (key: string) => {
        const t = TEMPLATES[key];
        if (t) setConfig(p => ({ ...p, ...t }));
    };

    const generateDeepDiveSingle = async () => {
        const slug = deepDiveSlug.trim();
        if (!slug) {
            alert('Alege produsul pentru PDF-ul de prezentare.');
            return;
        }
        setGeneratingDeepDive(true);
        try {
            const cleanToken = (adminAuth || '').trim();
            const res = await fetch('/api/materiale/single', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminAuth: cleanToken,
                    productSlug: slug,
                    config: {
                        phone: config.phone,
                        email: config.email,
                    },
                }),
            });
            const data = await res.json();
            if (res.ok && data.success && data.brochure) {
                const nb = data.brochure as Brochure;
                setResult(nb);
                setHistory((prev) => [nb, ...prev.filter((x) => x.id !== nb.id)]);
                void loadHistory();
                if (nb.publicUrl) window.open(nb.publicUrl, '_blank', 'noopener,noreferrer');
            } else {
                const detail = typeof data.details === 'string' && data.details ? `\n\n${data.details}` : '';
                alert((data.error || 'Eroare') + detail);
            }
        } catch (err) {
            alert('Eroare conexiune: ' + String(err));
        } finally {
            setGeneratingDeepDive(false);
        }
    };

    const generate = async () => {
        if (selectedSlugs.length === 0) { alert('Selectează cel puțin un produs!'); return; }
        setGenerating(true);
        setResult(null);
        try {
            // Trim token to avoid invisible spaces from localStorage
            const cleanToken = (adminAuth || '').trim();
            const res = await fetch('/api/materiale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Header-ul x-admin-auth este mutat în BODY pentru fiabilitate maximă
                body: JSON.stringify({
                    config,
                    productSlugs: selectedSlugs,
                    adminAuth: cleanToken // <--- AUTH ÎN BODY (Final Fix for 401)
                }),
            });
            const data = await res.json();
            if (res.ok && data.success && data.brochure) {
                const nb = data.brochure as Brochure;
                setResult(nb);
                setHistory((prev) => [nb, ...prev.filter((x) => x.id !== nb.id)]);
                void loadHistory();
            } else {
                const detail = typeof data.details === 'string' && data.details ? `\n\nDetalii: ${data.details}` : '';
                if (res.status === 401) alert('Eroare: Sesiune expirată sau parolă incorectă (401 Unauthorized)');
                else alert('Eroare: ' + (data.error || 'Server error') + detail);
            }
        } catch (err) {
            alert('Eroare conexiune: ' + String(err));
        } finally {
            setGenerating(false);
        }
    };

    const removeFromHistory = async (b: Brochure) => {
        if (
            !window.confirm(
                `Ștergi din istoric „${b.title}”? Fișierul PDF va fi eliminat din stocare și nu va mai fi accesibil la linkul public.`
            )
        ) {
            return;
        }
        setDeletingId(b.id);
        try {
            const res = await fetch(`/api/materiale?id=${encodeURIComponent(b.id)}`, {
                method: 'DELETE',
                headers: { 'x-admin-auth': (adminAuth || '').trim() },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 401) alert('Sesiune expirată sau parolă incorectă.');
                else alert((data as { error?: string }).error || 'Eroare la ștergere.');
                return;
            }
            if ((data as { success?: boolean }).success === true) {
                setHistory((prev) => prev.filter((x) => x.id !== b.id));
                setResult((prev) => (prev?.id === b.id ? null : prev));
                void loadHistory();
            }
        } catch (err) {
            alert('Eroare rețea: ' + String(err));
        } finally {
            setDeletingId(null);
        }
    };

    const share = (url: string, type: 'wa' | 'email') => {
        const title = config.title || 'Broșură TehnicAgro Supply';
        if (type === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
        else window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Bună ziua,\n\nVă trimitere materialul de prezentare:\n${url}\n\nTehnicAgro Supply`)}`, '_blank');
    };

    /** Toate produsele (inclusiv ciornă) — la fel ca în tab-ul „Date broșură”; sortat alfabetic */
    const productsSorted = useMemo(
        () =>
            [...allProducts].sort((a, b) =>
                a.name.localeCompare(b.name, 'ro', { sensitivity: 'base' })
            ),
        [allProducts]
    );

    const byCategory: Record<string, DynamicProduct[]> = {};
    productsSorted.forEach((p) => {
        if (!byCategory[p.category || 'diverse']) byCategory[p.category || 'diverse'] = [];
        byCategory[p.category || 'diverse'].push(p);
    });

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-ea-green-500" /> Configurare Broșură
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-relaxed max-w-2xl">
                        <strong className="text-zinc-400">Important:</strong> broșura multi-produs folosește datele din{' '}
                        <strong className="text-zinc-300">Catalog → Produse</strong> (descriere, specificații, poză principală, galerie
                        veche din produs). Tab-ul <strong className="text-ea-green-500/90">Date broșură</strong> este{' '}
                        <strong className="text-zinc-400">opțional</strong>: îl folosești doar dacă vrei text și poze{' '}
                        <em>suplimentare</em> doar pentru PDF (înlocuiesc automat golurile din catalog, nu șterg ce ai completat acolo).
                    </p>
                </div>

                {/* Template bar */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest">Alege Domeniu Simplu</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries({
                                viticol: 'Viticultură',
                                'pregatire-sol': 'Soil Prep',
                                'semanat-fertilizat': 'Se seeding',
                                'recoltare-logistica': 'Harvesting',
                                'protectia-plantelor': 'Protection'
                            }).map(([k, label]) => (
                                <button key={k} onClick={() => applyTemplate(k)} className="px-3 py-1.5 bg-zinc-800 hover:bg-ea-green-600/30 hover:text-ea-green-400 text-zinc-400 text-[10px] uppercase font-black tracking-widest rounded-lg border border-zinc-700 transition-all flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest text-ea-green-500">Alege Combinație Mixtă (Multi-categorie)</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries({
                                'mix-cultura-mare': 'Tehnologie Cultură Mare',
                                'mix-logistica-recolta': 'Recoltare + Logistică',
                                'mix-ferma-moderna': 'Fermă Modernă (General)'
                            }).map(([k, label]) => (
                                <button key={k} onClick={() => applyTemplate(k)} className="px-3 py-1.5 bg-ea-green-950/20 hover:bg-ea-green-600/30 text-ea-green-400 text-[10px] uppercase font-black tracking-widest rounded-lg border border-ea-green-900/40 transition-all flex items-center gap-1.5">
                                    <Layers className="w-3 h-3 text-ea-green-500" /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Config fields */}
                <div className="grid grid-cols-2 gap-4">
                    {[['Titlu Document *', 'title', 'ex: Soluții Viticole TehnicAgro 2026'], ['Subtitlu', 'subtitle', 'ex: Utilaje eligibile IS-V-02 APIA'], ['Titlu Secțiune Intro', 'introTitle', 'ex: Partenerul tău de încredere'], ['Telefon Contact', 'phone', PHONE], ['Email Contact', 'email', EMAIL]].map(([label, key, ph]) => (
                        <div key={key}>
                            <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{label}</label>
                            <input value={(config as Record<string, string>)[key]} onChange={e => setConfig(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 transition-all" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Temă Vizuală</label>
                        <select value={config.theme} onChange={e => setConfig(p => ({ ...p, theme: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none shadow-inner">
                            <option value="green">Verde TehnicAgro (Standard)</option>
                            <option value="dark">Negru Premium</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Mesaj Introductiv</label>
                    <textarea value={config.introText} onChange={e => setConfig(p => ({ ...p, introText: e.target.value }))} rows={5} placeholder="Descrieți pe scurt oferta sau contextul broșurii..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-none transition-all leading-relaxed" />
                </div>
            </div>

            <div className="bg-zinc-900 border border-sky-900/40 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                    <FileStack className="w-4 h-4" /> Broșură dedicată (un singur produs)
                </h3>
                <p className="text-[10px] text-zinc-500 leading-relaxed max-w-2xl">
                    Folosește aceeași copertă hero ca la catalog. Paginile următoare sunt din{' '}
                    <strong className="text-zinc-400">blocurile broșură dedicată</strong> definite în Catalog la fiecare produs
                    (zig-zag, 2 blocuri pe pagină). Nu înlocuiește broșura multi-produs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Produs</label>
                        <select
                            value={deepDiveSlug}
                            onChange={(e) => setDeepDiveSlug(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-sky-500/50"
                        >
                            <option value="">Alege produsul…</option>
                            {productsSorted.map((p) => (
                                <option key={p.slug} value={p.slug}>
                                    {p.name} · {p.brand}
                                    {p.status === 'draft' ? ' (ciornă)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={generateDeepDiveSingle}
                        disabled={generatingDeepDive || !deepDiveSlug}
                        className="shrink-0 px-6 py-4 bg-sky-700 hover:bg-sky-600 disabled:opacity-40 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-sky-600/50"
                    >
                        {generatingDeepDive ? <Loader className="w-4 h-4 animate-spin" /> : <FileStack className="w-4 h-4" />}
                        Generează broșură dedicată
                    </button>
                </div>
            </div>

            {/* Product selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Selectează Produse</h3>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        {selectedSlugs.length}/{MAX_MULTI_BROCHURE_PRODUCTS} selectate
                    </span>
                </div>
                {Object.keys(byCategory).length === 0 ? (
                    <p className="text-zinc-600 text-sm italic">Nu există produse în catalog. Adaugă produse din tab-ul Catalog.</p>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(byCategory).map(([cat, prods]) => (
                            <div key={cat} className="space-y-3">
                                <p className="text-[11px] text-ea-green-500 uppercase font-black tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-ea-green-500 rounded-full" /> {cat}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {prods.map(p => (
                                        <label key={p.slug} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedSlugs.includes(p.slug) ? 'border-ea-green-600 bg-ea-green-900/10 text-white shadow-lg shadow-ea-green-900/10' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/50'}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedSlugs.includes(p.slug)}
                                                onChange={() => toggleProduct(p.slug)}
                                                disabled={
                                                    !selectedSlugs.includes(p.slug) &&
                                                    selectedSlugs.length >= MAX_MULTI_BROCHURE_PRODUCTS
                                                }
                                                className="w-4 h-4 rounded accent-ea-green-500 bg-zinc-950 border-zinc-700"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-black truncate flex flex-wrap items-center gap-2">
                                                    <span>{p.name}</span>
                                                    {p.status === 'draft' && (
                                                        <span className="text-[9px] uppercase font-bold text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                                            Ciornă
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-zinc-600 font-bold uppercase">{p.brand}</div>
                                                {(() => {
                                                    const prof = brochureProfiles[p.slug];
                                                    const { textOk, extraPhotos, hasProfile } = pdfContentHints(p, prof);
                                                    return (
                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                            {!hasProfile && (
                                                                <span className="text-[9px] uppercase font-bold text-sky-400/90 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/25">
                                                                    PDF din catalog
                                                                </span>
                                                            )}
                                                            {hasProfile && (
                                                                <span className="text-[9px] uppercase font-bold text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                                                                    + PDF extra
                                                                </span>
                                                            )}
                                                            <span
                                                                className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${textOk ? 'text-ea-green-400 border-ea-green-500/30 bg-ea-green-500/10' : 'text-zinc-500 border-zinc-700 bg-zinc-900/80'}`}
                                                            >
                                                                Text PDF {textOk ? '✓' : '…'}
                                                            </span>
                                                            <span
                                                                className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5 ${extraPhotos ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' : 'text-zinc-500 border-zinc-700 bg-zinc-900/80'}`}
                                                            >
                                                                <ImageIcon className="w-2.5 h-2.5" /> Galerie {extraPhotos ? '✓' : '…'}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Generate button */}
            <button onClick={generate} disabled={generating || selectedSlugs.length === 0} className="w-full py-5 bg-ea-green-600 hover:bg-ea-green-500 disabled:opacity-40 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-ea-green-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0">
                {generating ? <><Loader className="w-5 h-5 animate-spin" />Se calculează și se generează PDF-ul...</> : <><FileText className="w-5 h-5" />Generează Document Publicitar</>}
            </button>

            {/* Result */}
            {result && (
                <div className="bg-ea-green-950/20 border border-ea-green-900/40 rounded-3xl p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-ea-green-500/20 rounded-2xl flex items-center justify-center border border-ea-green-500/30"><FileText className="w-7 h-7 text-ea-green-400" /></div>
                        <div>
                            <p className="font-black text-white text-lg tracking-tight uppercase leading-tight">{result.title}</p>
                            <p className="text-[11px] text-ea-green-500 uppercase font-black tracking-widest mt-1">Gata de partajat pe WhatsApp/Email!</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <a href={result.publicUrl} target="_blank" className="flex items-center justify-center gap-2 px-6 py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase text-xs transition-all shadow-xl shadow-ea-green-900/20">
                            <Download className="w-4 h-4" />Descarcă PDF
                        </a>
                        <button onClick={() => { navigator.clipboard.writeText(result.publicUrl); alert('Link copiat!'); }} className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase text-xs transition-all">
                            <Link2 className="w-4 h-4" />Copiază Link
                        </button>
                        <button onClick={() => share(result.publicUrl, 'wa')} className="flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-2xl font-black uppercase text-xs border border-[#25D366]/30 transition-all">
                            <MessageSquare className="w-4 h-4" />WhatsApp
                        </button>
                        <button onClick={() => share(result.publicUrl, 'email')} className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase text-xs transition-all">
                            <Mail className="w-4 h-4" />Email
                        </button>
                    </div>
                    <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800/50">
                        <p className="text-[10px] text-zinc-600 mb-2 uppercase font-black tracking-widest">Link Public Shareable</p>
                        <p className="text-xs text-ea-green-500 font-mono break-all selection:bg-ea-green-500/30">{result.publicUrl}</p>
                    </div>
                </div>
            )}

            {/* History */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
                    <span className="text-[11px] text-zinc-500 font-black uppercase tracking-widest">Istoric Documente Prezentare</span>
                    <button onClick={loadHistory} className="text-[11px] text-zinc-600 hover:text-white flex items-center gap-2 transition-colors uppercase font-black tracking-widest"><RefreshCcw className="w-3 h-3" />Actualizează</button>
                </div>
                {!historyLoaded ? (
                    <div className="px-5 py-8 text-center"><button onClick={loadHistory} className="text-xs text-zinc-600 hover:text-white uppercase font-black tracking-widest">Încarcă istoricul</button></div>
                ) : history.length === 0 ? (
                    <div className="px-5 py-8 text-center text-zinc-600 text-sm italic">Niciun document generat încă.</div>
                ) : (
                    <div className="divide-y divide-zinc-800/30">
                        {history.map((b) => (
                            <div key={b.id} className="px-6 py-5 flex items-center justify-between hover:bg-zinc-800/20 transition-all group gap-3">
                                <div className="min-w-0 pr-4">
                                    <p className="text-sm font-black text-white truncate uppercase tracking-tight">{b.title}</p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase mt-0.5">{new Date(b.createdAt).toLocaleString('ro-RO')} · {b.productSlugs.length} produse</p>
                                </div>
                                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                                    <a href={b.publicUrl} target="_blank" rel="noreferrer" className="p-3 bg-zinc-950 hover:bg-ea-green-600/20 rounded-xl text-zinc-500 hover:text-ea-green-400 border border-zinc-800 transition-all"><Download className="w-4 h-4" /></a>
                                    <button type="button" onClick={() => { navigator.clipboard.writeText(b.publicUrl); alert('Link copiat!'); }} className="p-3 bg-zinc-950 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white border border-zinc-800 transition-all"><Link2 className="w-4 h-4" /></button>
                                    <button type="button" onClick={() => share(b.publicUrl, 'wa')} className="p-3 bg-zinc-950 hover:bg-[#25D366]/10 rounded-xl text-zinc-500 hover:text-[#25D366] border border-zinc-800 transition-all"><MessageSquare className="w-4 h-4" /></button>
                                    <button
                                        type="button"
                                        onClick={() => removeFromHistory(b)}
                                        disabled={deletingId === b.id}
                                        title="Șterge din istoric"
                                        className="p-3 bg-zinc-950 hover:bg-red-950/60 rounded-xl text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 transition-all disabled:opacity-40 disabled:pointer-events-none"
                                    >
                                        {deletingId === b.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
