'use client';

import { useEffect, useState } from 'react';
import { Category, DynamicProduct } from '@/lib/products-store';
import { Package, FolderOpen, FileText, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { CatalogTab } from '@/components/admin/CatalogTab';
import { CategoriiTab } from '@/components/admin/CategoriiTab';
import { ProgrameTab } from '@/components/admin/ProgrameTab';
import { MaterialeTab } from '@/components/admin/MaterialeTab';

type Tab = 'catalog' | 'categorii' | 'programe' | 'materiale';

const DEFAULT_CATEGORIES: Category[] = [
    { slug: 'pregatire-sol', name: 'Pregătire Sol', status: 'active', createdAt: '' },
    { slug: 'semanat-fertilizat', name: 'Semănat & Fertilizat', status: 'active', createdAt: '' },
    { slug: 'recoltare-logistica', name: 'Recoltare & Logistică', status: 'active', createdAt: '' },
    { slug: 'viticol', name: 'Viticol', status: 'draft', createdAt: '' },
    { slug: 'legumicol', name: 'Legumicol', status: 'draft', createdAt: '' },
    { slug: 'protectia-plantelor', name: 'Protecția Plantelor', status: 'draft', createdAt: '' },
];

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('catalog');
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
    const [allProducts, setAllProducts] = useState<DynamicProduct[]>([]);
    const [adminAuth, setAdminAuth] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setAllProducts(data.products || []);
        } catch { /* fallback to empty */ }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput }),
            });
            if (res.ok) {
                localStorage.setItem('admin_auth', 'true');
                localStorage.setItem('admin_pass', passwordInput);
                setIsAuthenticated(true);
                setAdminAuth(passwordInput);
                fetchProducts();
            } else {
                setAuthError('Parolă incorectă. Acces refuzat.');
            }
        } catch {
            setAuthError('Eroare conexiune server.');
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth');
        const pass = localStorage.getItem('admin_pass') || '';
        if (auth === 'true') {
            setIsAuthenticated(true);
            setAdminAuth(pass);
            fetchProducts();
        }
        setCheckingAuth(false);

        // Auto-refresh data when user returns to this tab/window
        const onFocus = () => setRefreshKey(k => k + 1);
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 uppercase font-black text-xs tracking-widest">
                Verificare Securitate...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-ea-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-ea-green-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Admin TehnicAgro</h2>
                    <p className="text-zinc-500 text-xs mb-8 uppercase font-bold tracking-widest">Panou de gestiune catalog & materiale</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Parolă administrator"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center text-white focus:ring-1 focus:ring-ea-green-500 outline-none transition-all placeholder:text-zinc-700"
                            autoFocus
                        />
                        {authError && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{authError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full py-4 bg-ea-green-600 hover:bg-ea-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-ea-green-900/20 transition-all active:scale-95"
                        >
                            Intră în Admin
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const TABS = [
        { id: 'catalog', label: 'Catalog Utilaje', icon: <Package className="w-4 h-4" /> },
        { id: 'categorii', label: 'Categorii', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'programe', label: 'Programe APIA/AFIR', icon: <Landmark className="w-4 h-4" /> },
        { id: 'materiale', label: 'Materiale Publicitare', icon: <FileText className="w-4 h-4" /> },
    ] as const;

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-ea-green-500">TehnicAgro — Admin</h1>
                        <p className="text-zinc-600 text-[11px]">Gestiune catalog, categorii, programe finanțare și materiale publicitare</p>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem('admin_auth'); localStorage.removeItem('admin_pass'); setIsAuthenticated(false); }}
                        className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase font-black tracking-widest transition-colors"
                    >
                        Deconectare
                    </button>
                </div>
                {/* Tab bar */}
                <div className="max-w-[1400px] mx-auto px-6 flex gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as Tab);
                                setRefreshKey(k => k + 1); // forțează remount = date fresh
                            }}
                            className={`flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'border-ea-green-500 text-ea-green-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {tab.icon}{tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {activeTab === 'catalog' && (
                    <CatalogTab key={refreshKey} adminAuth={adminAuth} categories={categories} />
                )}
                {activeTab === 'categorii' && (
                    <CategoriiTab key={refreshKey} adminAuth={adminAuth} onCategoriesChange={setCategories} />
                )}
                {activeTab === 'programe' && (
                    <ProgrameTab key={refreshKey} adminAuth={adminAuth} />
                )}
                {activeTab === 'materiale' && (
                    <MaterialeTab key={refreshKey} adminAuth={adminAuth} allProducts={allProducts} />
                )}
            </div>
        </div>
    );
}
