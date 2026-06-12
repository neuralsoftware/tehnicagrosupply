'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DynamicProduct } from '@/lib/products-store';
import type { Promotion, PromotionKind, PromotionStatus } from '@/lib/promotions-store';
import { ExternalLink, FileText, Plus, Save, Trash2 } from 'lucide-react';

const EMPTY_PROMOTION: Partial<Promotion> = {
    kind: 'template',
    status: 'active',
    title: '',
    subtitle: '',
    description: '',
    badge: '',
    productSlug: '',
    productName: '',
    imageUrl: '',
    pdfUrl: '',
    priceLabel: '',
    priceValue: '',
    validUntil: '',
    ctaLabel: 'Vezi utilajul',
};

export function PromotiiTab({
    adminAuth,
    allProducts,
    tabVisible,
}: {
    adminAuth: string;
    allProducts: DynamicProduct[];
    tabVisible: boolean;
    onUnauthorized?: () => void;
}) {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [draft, setDraft] = useState<Partial<Promotion>>(EMPTY_PROMOTION);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const selectedProduct = useMemo(
        () => allProducts.find((product) => product.slug === draft.productSlug),
        [allProducts, draft.productSlug]
    );

    const loadPromotions = useCallback(async () => {
        const res = await fetch(`/api/promotions?_=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'x-admin-auth': (adminAuth || '').trim() },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) setPromotions((data as { promotions?: Promotion[] }).promotions || []);
    }, [adminAuth]);

    useEffect(() => {
        if (!tabVisible || !adminAuth.trim()) return;
        void loadPromotions();
    }, [tabVisible, adminAuth, loadPromotions]);

    const startNew = () => {
        setDraft(EMPTY_PROMOTION);
        setPdfFile(null);
    };

    const editPromotion = (promotion: Promotion) => {
        setDraft(promotion);
        setPdfFile(null);
    };

    const save = async () => {
        if (!draft.title?.trim()) {
            alert('Completează titlul promoției.');
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            const fields: Array<keyof Promotion> = [
                'id',
                'slug',
                'title',
                'subtitle',
                'description',
                'badge',
                'productSlug',
                'productName',
                'imageUrl',
                'pdfUrl',
                'priceLabel',
                'priceValue',
                'validUntil',
                'ctaLabel',
            ];
            formData.set('kind', draft.kind || 'template');
            formData.set('status', draft.status || 'active');
            for (const key of fields) {
                const value = draft[key];
                if (typeof value === 'string' && value.trim()) formData.set(key, value.trim());
            }
            if (selectedProduct) {
                formData.set('productName', selectedProduct.name);
                if (!draft.imageUrl?.trim()) formData.set('imageUrl', selectedProduct.imageSrc);
            }
            if (pdfFile) formData.set('pdf', pdfFile);

            const res = await fetch('/api/promotions', {
                method: 'POST',
                headers: { 'x-admin-auth': (adminAuth || '').trim() },
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                alert((data as { error?: string }).error || 'Eroare la salvare.');
                return;
            }
            const promotion = (data as { promotion?: Promotion }).promotion;
            if (promotion) {
                setDraft(promotion);
                setPdfFile(null);
                await loadPromotions();
                if (promotion.status === 'active') {
                    window.open('/promotii', '_blank', 'noopener,noreferrer');
                }
            }
        } finally {
            setSaving(false);
        }
    };

    const remove = async (promotion: Promotion) => {
        if (!window.confirm(`Ștergi promoția „${promotion.title}”?`)) return;
        setDeletingId(promotion.id);
        try {
            const res = await fetch(`/api/promotions?id=${encodeURIComponent(promotion.id)}`, {
                method: 'DELETE',
                headers: { 'x-admin-auth': (adminAuth || '').trim() },
            });
            if (!res.ok) {
                alert('Eroare la ștergere.');
                return;
            }
            if (draft.id === promotion.id) startNew();
            await loadPromotions();
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <aside className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-white">Promoții</h2>
                        <p className="text-xs text-zinc-500">PDF-uri și template-uri afișate pe /promotii</p>
                    </div>
                    <button
                        type="button"
                        onClick={startNew}
                        className="inline-flex items-center gap-2 rounded-xl bg-ea-green-600 px-3 py-2 text-xs font-black uppercase text-white hover:bg-ea-green-500"
                    >
                        <Plus className="h-4 w-4" />
                        Nou
                    </button>
                </div>
                <div className="space-y-3">
                    {promotions.map((promotion) => (
                        <button
                            key={promotion.id}
                            type="button"
                            onClick={() => editPromotion(promotion)}
                            className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                                draft.id === promotion.id
                                    ? 'border-ea-green-500 bg-ea-green-500/10'
                                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-bold text-white">{promotion.title}</p>
                                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        {promotion.kind === 'pdf' ? 'PDF' : 'Template'} · {promotion.status}
                                    </p>
                                </div>
                                {promotion.pdfUrl ? <FileText className="h-4 w-4 text-ea-green-400" /> : null}
                            </div>
                        </button>
                    ))}
                    {promotions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
                            Nu există promoții salvate.
                        </div>
                    ) : null}
                </div>
            </aside>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">Editor promoție</h3>
                        <p className="text-xs text-zinc-500">
                            Încarcă PDF-ul promoției sau creează o promoție direct din câmpurile de mai jos.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {draft.id ? (
                            <button
                                type="button"
                                onClick={() => remove(draft as Promotion)}
                                disabled={deletingId === draft.id}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-900/60 px-4 py-3 text-xs font-black uppercase text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Șterge
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={save}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-ea-green-600 px-5 py-3 text-xs font-black uppercase text-white hover:bg-ea-green-500 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Se salvează...' : 'Salvează'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tip promoție</span>
                        <select
                            value={draft.kind || 'template'}
                            onChange={(e) => setDraft((prev) => ({ ...prev, kind: e.target.value as PromotionKind }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                        >
                            <option value="template">Template în pagina /promotii</option>
                            <option value="pdf">PDF încărcat</option>
                        </select>
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</span>
                        <select
                            value={draft.status || 'active'}
                            onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as PromotionStatus }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                        >
                            <option value="active">Activă pe site</option>
                            <option value="draft">Draft</option>
                        </select>
                    </label>
                    <label className="space-y-1 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Titlu *</span>
                        <input
                            value={draft.title || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Promoție culegător porumb Ziegler"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Produs asociat</span>
                        <select
                            value={draft.productSlug || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, productSlug: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                        >
                            <option value="">Fără produs asociat</option>
                            {allProducts.map((product) => (
                                <option key={product.slug} value={product.slug}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Badge</span>
                        <input
                            value={draft.badge || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, badge: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Campanie recoltare"
                        />
                    </label>
                    <label className="space-y-1 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subtitlu</span>
                        <input
                            value={draft.subtitle || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Ofertă disponibilă în limita stocului"
                        />
                    </label>
                    <label className="space-y-1 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Descriere</span>
                        <textarea
                            value={draft.description || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                            className="min-h-28 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Descrie promoția, configurația inclusă sau condițiile comerciale."
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Etichetă preț/beneficiu</span>
                        <input
                            value={draft.priceLabel || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, priceLabel: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Avantaj promoțional"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Valoare afișată</span>
                        <input
                            value={draft.priceValue || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, priceValue: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Preț la cerere / discount / configurație"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Valabil până la</span>
                        <input
                            type="date"
                            value={draft.validUntil || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, validUntil: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Text buton</span>
                        <input
                            value={draft.ctaLabel || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, ctaLabel: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder="Vezi utilajul"
                        />
                    </label>
                    <label className="space-y-1 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Imagine promoție</span>
                        <input
                            value={draft.imageUrl || ''}
                            onChange={(e) => setDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:ring-1 focus:ring-ea-green-500"
                            placeholder={selectedProduct ? 'Dacă rămâne gol, folosește imaginea produsului asociat' : 'URL imagine'}
                        />
                    </label>
                    <label className="space-y-1 md:col-span-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">PDF promoțional</span>
                        <input
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ea-green-600 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white"
                        />
                        {draft.pdfUrl ? (
                            <a
                                href={draft.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-ea-green-400 hover:text-ea-green-300"
                            >
                                PDF existent
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : null}
                    </label>
                </div>
            </section>
        </div>
    );
}
