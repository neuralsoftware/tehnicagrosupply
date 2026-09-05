'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { PROCESSORS, PROCESSOR_CATEGORY_LABEL } from '@/data/gdpr-processors';
import { PROCESSING_ACTIVITIES, REGISTRU_VERSION } from '@/data/gdpr-registru';

type GdprStatus = {
    consents: { total: number; marketingAcceptat: number; marketingRefuzat: number };
    retentie: {
        total: number;
        expirate: number;
        expiraCurand: number;
        inTermen: number;
        celMaiApropiatTermen: string | null;
    };
    furnizori: { processor_key: string; accepted: boolean; accepted_at: string | null; note: string | null }[];
};

function Stat({
    label,
    value,
    hint,
    tone = 'normal',
}: {
    label: string;
    value: string | number;
    hint?: string;
    tone?: 'normal' | 'warn' | 'bad' | 'good';
}) {
    const toneClass =
        tone === 'bad'
            ? 'border-red-800 text-red-400'
            : tone === 'warn'
              ? 'border-amber-800 text-amber-400'
              : tone === 'good'
                ? 'border-ea-green-800 text-ea-green-400'
                : 'border-zinc-800 text-white';
    return (
        <div className={`rounded-xl border bg-zinc-900 p-4 ${toneClass}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-black tabular-nums">{value}</p>
            {hint ? <p className="mt-1 text-[11px] leading-snug text-zinc-500">{hint}</p> : null}
        </div>
    );
}

export function GdprTab({ adminAuth }: { adminAuth: string }) {
    const [status, setStatus] = useState<GdprStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/gdpr', { headers: { 'x-admin-auth': adminAuth } });
            if (!res.ok) throw new Error(`Eroare ${res.status}`);
            setStatus((await res.json()) as GdprStatus);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Nu s-au putut încărca datele.');
        } finally {
            setLoading(false);
        }
    }, [adminAuth]);

    useEffect(() => {
        void load();
    }, [load]);

    const toggleProcessor = async (key: string, accepted: boolean) => {
        setSaving(key);
        try {
            const res = await fetch('/api/gdpr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth },
                body: JSON.stringify({ processorKey: key, accepted }),
            });
            if (!res.ok) throw new Error('Nu s-a putut salva.');
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Eroare la salvare.');
        } finally {
            setSaving(null);
        }
    };

    const statusFor = (key: string) => status?.furnizori.find((f) => f.processor_key === key);
    const semnate = PROCESSORS.filter((p) => statusFor(p.name)?.accepted).length;

    return (
        <div className="space-y-10">
            {error ? (
                <p className="rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">{error}</p>
            ) : null}

            {/* ---------- Stare generală ---------- */}
            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400">
                    <ShieldCheck className="h-4 w-4" /> Stare conformitate
                </h2>
                {loading ? (
                    <p className="text-sm text-zinc-500">Se încarcă…</p>
                ) : status ? (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Stat
                            label="Dovezi de consimțământ"
                            value={status.consents.total}
                            hint="Înregistrări în registrul GDPR"
                        />
                        <Stat
                            label="Acord marketing"
                            value={`${status.consents.marketingAcceptat} da / ${status.consents.marketingRefuzat} nu`}
                            hint="Cui îi poți trimite comunicări comerciale"
                        />
                        <Stat
                            label="De șters acum"
                            value={status.retentie.expirate}
                            tone={status.retentie.expirate > 0 ? 'bad' : 'good'}
                            hint={
                                status.retentie.expirate > 0
                                    ? 'Termenul legal de păstrare a trecut'
                                    : 'Nicio înregistrare peste termen'
                            }
                        />
                        <Stat
                            label="Expiră în 90 de zile"
                            value={status.retentie.expiraCurand}
                            tone={status.retentie.expiraCurand > 0 ? 'warn' : 'normal'}
                            hint={
                                status.retentie.celMaiApropiatTermen
                                    ? `Primul termen: ${new Date(status.retentie.celMaiApropiatTermen).toLocaleDateString('ro-RO')}`
                                    : undefined
                            }
                        />
                    </div>
                ) : null}
            </section>

            {/* ---------- Contracte cu furnizorii ---------- */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400">
                        <FileText className="h-4 w-4" /> Contracte de prelucrare (art. 28)
                    </h2>
                    <span className="text-xs text-zinc-500">
                        {PROCESSORS.length} acorduri în vigoare · {semnate} verificate de tine
                    </span>
                </div>
                <p className="max-w-3xl text-xs leading-relaxed text-zinc-500">
                    Fiecare furnizor care atinge date personale are nevoie de un acord de prelucrare. La toți cei de
                    mai jos acordul este <strong className="text-zinc-300">deja în vigoare automat</strong>, prin
                    simpla folosire a serviciului — textul fiecărui contract o spune explicit, iar firma fiind
                    stabilită în România intră sub regimul european implicit. Nu ai nimic de acceptat. Butonul de
                    mai jos e doar pentru evidența ta: marchează că ai citit documentul, cu dată, ca să ai ce arăta
                    la un control. Copiile sunt arhivate la <code className="text-zinc-400">docs/gdpr/dpa/</code>.
                </p>

                <div className="space-y-2">
                    {PROCESSORS.map((p) => {
                        const st = statusFor(p.name);
                        const done = st?.accepted === true;
                        return (
                            <div
                                key={p.name}
                                className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-start md:justify-between ${
                                    done ? 'border-ea-green-900 bg-ea-green-950/20' : 'border-zinc-800 bg-zinc-900'
                                }`}
                            >
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-white">{p.name}</span>
                                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                            {PROCESSOR_CATEGORY_LABEL[p.category]}
                                        </span>
                                        {p.acceptance === 'automat' ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ea-green-400">
                                                <CheckCircle2 className="h-3 w-3" /> în vigoare automat
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                                                <AlertTriangle className="h-3 w-3" /> de acceptat în cont
                                            </span>
                                        )}
                                        {done ? (
                                            <span className="text-[11px] text-zinc-500">
                                                verificat
                                                {st?.accepted_at
                                                    ? ` ${new Date(st.accepted_at).toLocaleDateString('ro-RO')}`
                                                    : ''}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="text-xs text-zinc-400">{p.entity}</p>
                                    <p className="text-xs text-zinc-500">
                                        <span className="font-semibold text-zinc-400">Cum se aplică:</span> {p.dpaAction}
                                    </p>
                                    <p className="text-[11px] text-zinc-600">
                                        Date: {p.dataTypes} · Locație: {p.location}
                                        {p.transferBasis ? ` · Transfer: ${p.transferBasis}` : ''}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-stretch gap-2 md:w-52">
                                    <a
                                        href={p.dpaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
                                    >
                                        Deschide documentul <ExternalLink className="h-3 w-3" />
                                    </a>
                                    <button
                                        onClick={() => toggleProcessor(p.name, !done)}
                                        disabled={saving === p.name}
                                        className={`min-h-9 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
                                            done
                                                ? 'border border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                                                : 'bg-ea-green-600 text-white hover:bg-ea-green-500'
                                        }`}
                                    >
                                        {saving === p.name
                                            ? 'Se salvează…'
                                            : done
                                              ? 'Șterge marcajul'
                                              : p.acceptance === 'automat'
                                                ? 'Am citit documentul'
                                                : 'Am acceptat acordul'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ---------- Registrul art. 30 ---------- */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400">
                        <Clock className="h-4 w-4" /> Registrul activităților de prelucrare (art. 30)
                    </h2>
                    <span className="text-xs text-zinc-500">Versiunea {REGISTRU_VERSION}</span>
                </div>
                <p className="max-w-3xl text-xs leading-relaxed text-zinc-500">
                    Acesta e documentul cerut primul într-un control ANSPDCP. Nu se depune nicăieri și nu se publică
                    — se ține la firmă și se prezintă la cerere. Se actualizează ori de câte ori apare un scop nou
                    sau un furnizor nou.
                </p>

                <div className="space-y-2">
                    {PROCESSING_ACTIVITIES.map((a) => (
                        <details key={a.id} className="rounded-xl border border-zinc-800 bg-zinc-900">
                            <summary className="flex cursor-pointer items-center gap-3 p-4 text-sm font-bold text-white">
                                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                                    {a.id}
                                </span>
                                {a.name}
                            </summary>
                            <dl className="space-y-3 border-t border-zinc-800 p-4 text-xs">
                                {(
                                    [
                                        ['Scopul', a.purpose],
                                        ['Temeiul legal', a.legalBasis],
                                        ['Persoane vizate', a.subjects],
                                        ['Categorii de date', a.dataCategories],
                                        ['Destinatari', a.recipients],
                                        ['Transferuri în afara SEE', a.transfers ?? 'Nu există'],
                                        ['Termen de păstrare', a.retention],
                                        ['Măsuri de securitate', a.securityMeasures],
                                    ] as const
                                ).map(([label, value]) => (
                                    <div key={label} className="grid gap-1 md:grid-cols-[11rem_1fr] md:gap-4">
                                        <dt className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                            {label}
                                        </dt>
                                        <dd className="text-zinc-300">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
