'use client';
import { useState, useEffect } from 'react';
import { Category } from '@/lib/products-store';
import { Plus, Pencil, Trash2, Save, X, CheckCircle, Clock } from 'lucide-react';

function slugify(str: string) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface Props {
    adminAuth: string;
    onCategoriesChange: (cats: Category[]) => void;
}

export function CategoriiTab({ adminAuth, onCategoriesChange }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [editing, setEditing] = useState<Partial<Category> | null>(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        setCategories(data.categories || []);
        onCategoriesChange(data.categories || []);
        setLoaded(true);
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (!editing?.slug || !editing?.name) return;
        setSaving(true);
        const slugFinal = String(editing.slug || '').trim();
        const statusFinal: 'active' | 'draft' = editing.status === 'active' ? 'active' : 'draft';
        const payload = {
            slug: slugFinal,
            name: String(editing.name || '').trim(),
            description: (editing.description ?? '').trim(),
            status: statusFinal,
            createdAt: editing.createdAt || new Date().toISOString(),
            ...(editing.isStatic ? { isStatic: true as const } : {}),
        };
        const method = categories.some((c) => c.slug === slugFinal) ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `/api/categories/${encodeURIComponent(slugFinal)}` : '/api/categories';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'x-admin-auth': (adminAuth || '').trim() },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert((data as { error?: string }).error || `Eroare la salvare (${res.status}).`);
            setSaving(false);
            return;
        }
        setSaving(false);
        setEditing(null);
        load();
    };

    const toggleStatus = async (cat: Category) => {
        const updated = { ...cat, status: cat.status === 'active' ? 'draft' : 'active' } as Category;
        const res = await fetch(`/api/categories/${encodeURIComponent(cat.slug)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-admin-auth': (adminAuth || '').trim() },
            body: JSON.stringify(updated),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert((data as { error?: string }).error || 'Nu s-a putut schimba statusul.');
            return;
        }
        load();
    };

    const del = async (slug: string) => {
        const res = await fetch(`/api/categories/${slug}`, { method: 'DELETE', headers: { 'x-admin-auth': adminAuth } });
        const data = await res.json();
        if (!res.ok) { alert(data.error); return; }
        load();
    };

    if (!loaded) return (
        <div className="flex items-center gap-3 px-4 py-8 text-zinc-500 text-xs uppercase font-bold tracking-widest">
            <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
            Se încarcă categoriile...
        </div>
    );

    return (
        <div className="space-y-4">
            {editing !== null && (
                <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-4 max-w-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-white uppercase">{editing.isStatic ? 'Editează Categorie' : 'Categorie Nouă'}</h3>
                        <button onClick={() => setEditing(null)}><X className="w-4 h-4 text-zinc-500" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Slug (URL)</label>
                            <input value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p, slug: slugify(e.target.value) }))} disabled={!!editing.isStatic} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 disabled:opacity-40 font-mono" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Nume Afișat</label>
                            <input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Descriere</label>
                        <textarea value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none focus:ring-1 focus:ring-ea-green-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Status Inițial</label>
                        <select value={editing.status || 'draft'} onChange={e => setEditing(p => ({ ...p, status: e.target.value as 'active' | 'draft' }))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm outline-none">
                            <option value="draft">Draft (invizibil în Navbar)</option>
                            <option value="active">Activ (vizibil în Navbar)</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setEditing(null)} className="px-5 py-2 text-zinc-500 font-black uppercase text-xs">Anulează</button>
                        <button onClick={save} disabled={saving} className="px-6 py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-xl font-black uppercase text-xs flex items-center gap-2">
                            <Save className="w-4 h-4" />{saving ? 'Se salvează...' : 'Salvează'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <p className="text-zinc-500 text-sm">{categories.length} categorii ({categories.filter(c => c.status === 'active').length} active)</p>
                <button onClick={() => setEditing({ slug: '', name: '', description: '', status: 'draft', createdAt: new Date().toISOString() })} className="flex items-center gap-2 px-5 py-2.5 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-xl font-black uppercase text-xs">
                    <Plus className="w-4 h-4" />Categorie Nouă
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-950 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="px-5 py-4 text-left">Categorie</th>
                            <th className="px-5 py-4 text-left">Slug</th>
                            <th className="px-5 py-4 text-center">Status</th>
                            <th className="px-5 py-4 text-right">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {categories.map(cat => (
                            <tr key={cat.slug} className="hover:bg-zinc-800/20">
                                <td className="px-5 py-4">
                                    <div className="font-bold text-white">{cat.name}</div>
                                    {cat.isStatic && <span className="text-[9px] text-zinc-600 uppercase font-bold">Categorie de bază</span>}
                                </td>
                                <td className="px-5 py-4 text-zinc-500 font-mono text-xs">/utilaje/{cat.slug}</td>
                                <td className="px-5 py-4 text-center">
                                    <button onClick={() => toggleStatus(cat)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 mx-auto transition-all ${cat.status === 'active' ? 'bg-ea-green-900/40 text-ea-green-400 hover:bg-ea-green-900/60' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}>
                                        {cat.status === 'active' ? <><CheckCircle className="w-3 h-3" />Activ</> : <><Clock className="w-3 h-3" />Draft</>}
                                    </button>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => setEditing(cat)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                                        {!cat.isStatic && <button onClick={() => del(cat.slug)} className="p-2 bg-zinc-800 hover:bg-red-900/40 rounded-lg text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
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
