'use client';
import { useState, useEffect } from 'react';
import { FundingProgram } from '@/data/funding-programs';
import { RefreshCcw, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Props {
    adminAuth: string;
    onUnauthorized?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-ea-green-900/40 text-ea-green-400 border-ea-green-900',
    suspended: 'bg-red-900/30 text-red-400 border-red-900',
    upcoming: 'bg-amber-900/30 text-amber-400 border-amber-900',
};
const STATUS_LABELS: Record<string, string> = { active: 'Activ', suspended: 'Suspendat', upcoming: 'Viitor' };
const STATUS_ICONS: Record<string, React.ReactNode> = {
    active: <CheckCircle className="w-3 h-3" />,
    suspended: <XCircle className="w-3 h-3" />,
    upcoming: <Clock className="w-3 h-3" />,
};

export function ProgrameTab({ adminAuth }: Props) {
    const [programs, setPrograms] = useState<Record<string, FundingProgram[]>>({});
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});

    const load = async () => {
        const res = await fetch('/api/funding-programs', { cache: 'no-store' });
        const data = await res.json();
        setPrograms(data.programs || {});
        setLoaded(true);
    };

    useEffect(() => {
        let cancelled = false;
        void (async () => {
            try {
                const res = await fetch('/api/funding-programs', { cache: 'no-store' });
                const data = await res.json();
                if (cancelled) return;
                setPrograms(data.programs || {});
                setLoaded(true);
            } catch {
                if (!cancelled) setLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const update = async (code: string, updates: Partial<FundingProgram>) => {
        setSaving(code);
        await fetch('/api/funding-programs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth },
            body: JSON.stringify({ code, updates }),
        });
        setSaving(null);
        load();
    };

    const markVerified = (p: FundingProgram) => update(p.code, { lastVerified: new Date().toISOString().split('T')[0] });
    const cycleStatus = (p: FundingProgram) => {
        const next: Record<string, FundingProgram['status']> = { active: 'suspended', suspended: 'upcoming', upcoming: 'active' };
        update(p.code, { status: next[p.status] });
    };
    const saveNotes = (p: FundingProgram) => update(p.code, { notes: notes[p.code] });

    const allPrograms = Object.values(programs).flat();

    if (!loaded) return (
        <div className="flex items-center gap-3 px-4 py-8 text-zinc-500 text-xs uppercase font-bold tracking-widest">
            <div className="w-4 h-4 border-2 border-ea-green-500 border-t-transparent rounded-full animate-spin" />
            Se încarcă programele APIA/AFIR...
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">{allPrograms.length} programe — {allPrograms.filter(p => p.status === 'active').length} active</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Actualizează statusul manual după verificarea pe afir.ro / apia.org.ro</p>
                </div>
                <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white text-xs font-bold uppercase">
                    <RefreshCcw className="w-3.5 h-3.5" />Reîncarcă
                </button>
            </div>

            {Object.entries(programs).map(([category, progs]) => (
                <div key={category} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 bg-zinc-950 border-b border-zinc-800">
                        <span className="text-[10px] text-ea-green-500 font-black uppercase tracking-widest">{category}</span>
                    </div>
                    {progs.map(p => (
                        <div key={p.code} className="px-5 py-5 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-black text-white text-sm">{p.code}</span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 border ${STATUS_STYLES[p.status]}`}>
                                            {STATUS_ICONS[p.status]}{STATUS_LABELS[p.status]}
                                        </span>
                                        <span className="text-[9px] text-zinc-600 uppercase font-bold">{p.agency}</span>
                                    </div>
                                    <p className="text-zinc-300 text-xs font-medium mb-1">{p.title}</p>
                                    <p className="text-zinc-500 text-[10px]">Max: {p.maxGrant} · Termen: {p.deadline}</p>
                                    {p.notes && <p className="text-amber-400 text-[10px] mt-1 italic">{p.notes}</p>}
                                    <p className="text-zinc-600 text-[9px] mt-1">Verificat: {p.lastVerified || 'Niciodată'}</p>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                    <a href={p.sourceUrl} target="_blank" rel="noopener" className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white text-[10px] font-bold uppercase">
                                        <ExternalLink className="w-3 h-3" />Verifică
                                    </a>
                                    <button onClick={() => markVerified(p)} disabled={saving === p.code} className="px-3 py-1.5 bg-zinc-800 hover:bg-ea-green-900/40 rounded-lg text-zinc-400 hover:text-ea-green-400 text-[10px] font-bold uppercase">
                                        {saving === p.code ? '...' : '✓ Verificat Azi'}
                                    </button>
                                    <button onClick={() => cycleStatus(p)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${STATUS_STYLES[p.status]}`}>
                                        Schimbă Status
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <input
                                    value={notes[p.code] ?? p.notes ?? ''}
                                    onChange={e => setNotes(n => ({ ...n, [p.code]: e.target.value }))}
                                    placeholder="Note admin (ex: Sesiunea deschisă din 02.02.2026)..."
                                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:ring-1 focus:ring-ea-green-500"
                                />
                                <button onClick={() => saveNotes(p)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white text-[10px] font-bold uppercase">Salvează</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
