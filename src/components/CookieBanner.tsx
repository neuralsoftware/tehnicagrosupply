'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
    CONSENT_EVENT,
    CONSENT_OPEN_EVENT,
    CONSENT_DENIED,
    CONSENT_GRANTED,
    type ConsentChoice,
    type ConsentDecisionMethod,
    hasBrowserPrivacySignal,
    readConsent,
    writeConsent,
    syncGoogleConsent,
} from '@/lib/consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-KR6928Z45R';

type Category = {
    key: 'necessary' | 'analytics' | 'marketing';
    title: string;
    description: string;
    examples: string;
};

const CATEGORIES: Category[] = [
    {
        key: 'necessary',
        title: 'Strict necesare',
        description:
            'Fac site-ul să funcționeze: rețin ce ai ales aici și protejează formularele împotriva trimiterilor automate. Fără ele site-ul nu merge, așa că nu pot fi oprite.',
        examples: 'Preferința ta de cookie-uri · protecția formularelor',
    },
    {
        key: 'analytics',
        title: 'Analiză',
        description:
            'Ne arată câți oameni intră pe site și ce pagini citesc, ca să știm ce să îmbunătățim. Nu te identificăm după nume.',
        examples: 'Google Analytics · Microsoft Clarity',
    },
    {
        key: 'marketing',
        title: 'Marketing',
        description:
            'Ne permit să măsurăm ce reclamă te-a adus aici și să îți arătăm anunțuri relevante pe alte site-uri. Tot ele permit redarea clipurilor video găzduite pe YouTube.',
        examples: 'Google Ads · Meta Pixel · YouTube',
    },
];

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [draft, setDraft] = useState<ConsentChoice>(CONSENT_DENIED);
    const panelRef = useRef<HTMLDivElement>(null);
    const firstButtonRef = useRef<HTMLButtonElement>(null);

    /** Aplică decizia: o salvează, o trimite la Google și trezește scripturile care o așteaptă. */
    const decide = useCallback((choice: ConsentChoice, method: ConsentDecisionMethod) => {
        writeConsent(choice, method);
        syncGoogleConsent(choice);

        // Google Analytics a fost pornit cu `denied`; prima vizualizare de pagină se
        // trimite abia acum, după ce a fost acceptată analiza.
        if (choice.analytics && typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                send_to: GA_ID,
            });
        }

        setIsVisible(false);
        setShowDetails(false);
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            // Semnalul de confidențialitate din browser înseamnă „nu mă întreba, refuz”.
            if (hasBrowserPrivacySignal()) {
                const existing = readConsent();
                if (!existing) {
                    writeConsent(CONSENT_DENIED, 'browser_signal');
                    syncGoogleConsent(CONSENT_DENIED);
                }
                return;
            }

            const existing = readConsent();
            if (existing) {
                // Decizie validă (nu mai veche de 6 luni, pe versiunea curentă a politicii).
                syncGoogleConsent(existing);
                setDraft({ analytics: existing.analytics, marketing: existing.marketing });
                return;
            }

            setIsVisible(true);
        });

        const openSettings = () => {
            const existing = readConsent();
            setDraft(existing ? { analytics: existing.analytics, marketing: existing.marketing } : CONSENT_DENIED);
            setShowDetails(true);
            setIsVisible(true);
        };

        window.addEventListener(CONSENT_OPEN_EVENT, openSettings);
        return () => window.removeEventListener(CONSENT_OPEN_EVENT, openSettings);
    }, []);

    // Când panoul e deschis, Escape îl închide fără să schimbe nimic.
    useEffect(() => {
        if (!isVisible) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (showDetails) {
                setShowDetails(false);
                firstButtonRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isVisible, showDetails]);

    useEffect(() => {
        if (showDetails) panelRef.current?.focus();
    }, [showDetails]);

    // Alte componente (ex. blocul video) semnalează că vor să deschidă setările.
    useEffect(() => {
        const relay = () => {
            const existing = readConsent();
            setDraft(existing ? { analytics: existing.analytics, marketing: existing.marketing } : CONSENT_DENIED);
        };
        window.addEventListener(CONSENT_EVENT, relay);
        return () => window.removeEventListener(CONSENT_EVENT, relay);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-title"
            aria-describedby="consent-desc"
            className="fixed inset-x-3 bottom-3 z-[99999] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl md:inset-x-0 md:bottom-0 md:rounded-none"
        >
            <div className="mx-auto max-h-[80vh] max-w-7xl overflow-y-auto p-4 md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
                    <div className="min-w-0 flex-1">
                        <h2 id="consent-title" className="text-sm font-bold md:text-base">
                            Alege ce cookie-uri accepți
                        </h2>
                        <p id="consent-desc" className="mt-1 text-xs leading-snug text-slate-300 md:text-sm">
                            Folosim cookie-uri strict necesare ca site-ul să funcționeze. Pentru analiză și marketing
                            avem nevoie de acordul tău, iar acesta poate fi retras oricând din subsolul paginii.
                            Detalii în{' '}
                            <Link href="/politica-cookie" className="text-emerald-400 underline hover:text-emerald-300">
                                Politica de cookie-uri
                            </Link>{' '}
                            și{' '}
                            <Link href="/privacy-policy" className="text-emerald-400 underline hover:text-emerald-300">
                                Politica de confidențialitate
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Cele trei acțiuni au aceeași greutate vizuală — refuzul nu e ascuns. */}
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto">
                        <button
                            ref={firstButtonRef}
                            onClick={() => decide(CONSENT_DENIED, 'reject_all')}
                            className="min-h-11 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 sm:flex-none"
                        >
                            Refuz
                        </button>
                        <button
                            onClick={() => setShowDetails((v) => !v)}
                            aria-expanded={showDetails}
                            aria-controls="consent-panel"
                            className="min-h-11 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 sm:flex-none"
                        >
                            Personalizează
                        </button>
                        <button
                            onClick={() => decide(CONSENT_GRANTED, 'accept_all')}
                            className="min-h-11 flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 sm:flex-none"
                        >
                            Acceptă toate
                        </button>
                    </div>
                </div>

                {showDetails ? (
                    <div
                        id="consent-panel"
                        ref={panelRef}
                        tabIndex={-1}
                        className="mt-4 border-t border-slate-700 pt-4 outline-none"
                    >
                        <div className="grid gap-3 md:grid-cols-3">
                            {CATEGORIES.map((cat) => {
                                const locked = cat.key === 'necessary';
                                const checked = locked || draft[cat.key as 'analytics' | 'marketing'];
                                return (
                                    <div
                                        key={cat.key}
                                        className="flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-800/60 p-3"
                                    >
                                        <label className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                disabled={locked}
                                                onChange={(e) =>
                                                    setDraft((prev) => ({
                                                        ...prev,
                                                        [cat.key]: e.target.checked,
                                                    }))
                                                }
                                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-500 bg-slate-900 text-emerald-500 focus:ring-emerald-500 disabled:opacity-60"
                                            />
                                            <span className="min-w-0">
                                                <span className="block text-sm font-bold text-white">
                                                    {cat.title}
                                                    {locked ? (
                                                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                            Mereu active
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <span className="mt-1 block text-xs leading-snug text-slate-300">
                                                    {cat.description}
                                                </span>
                                                <span className="mt-1.5 block text-[11px] text-slate-500">
                                                    {cat.examples}
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => decide(draft, 'custom')}
                                className="min-h-11 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
                            >
                                Salvează alegerea
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
