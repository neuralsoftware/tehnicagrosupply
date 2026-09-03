'use client';

import { useEffect, useState } from 'react';
import { PlayCircle, ShieldCheck } from 'lucide-react';
import { CONSENT_EVENT, CONSENT_OPEN_EVENT, currentConsent } from '@/lib/consent';

type Props = {
    /** Adresa de încorporare (YouTube fără cookie-uri sau Vimeo). */
    src: string;
    title: string;
    className?: string;
};

/**
 * YouTube și Vimeo scriu date pe dispozitivul vizitatorului din momentul în care iframe-ul
 * intră în pagină — deci nu pot fi încărcate înainte de acordul pentru marketing
 * (Legea 506/2004 art. 4 alin. 5). Până atunci arătăm un afiș cu buton de redare:
 * dacă vizitatorul apasă, îl întrebăm o singură dată și pornim clipul.
 */
export function ConsentGatedVideo({ src, title, className }: Props) {
    const [allowed, setAllowed] = useState(false);
    /** Redare punctuală, doar pentru acest clip, fără a schimba setarea generală. */
    const [unlockedOnce, setUnlockedOnce] = useState(false);

    useEffect(() => {
        const read = () => setAllowed(currentConsent().marketing);
        read();
        window.addEventListener(CONSENT_EVENT, read);
        return () => window.removeEventListener(CONSENT_EVENT, read);
    }, []);

    if (allowed || unlockedOnce) {
        return (
            <iframe
                src={src}
                className={className}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title={title}
            />
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center gap-4 bg-zinc-900 p-6 text-center ${className ?? ''}`}>
            <ShieldCheck className="h-8 w-8 text-ea-green-500" aria-hidden="true" />
            <div className="max-w-md space-y-1">
                <p className="text-sm font-bold text-white">Clipul este găzduit pe YouTube</p>
                <p className="text-xs leading-snug text-zinc-400">
                    La redare, YouTube primește adresa ta IP și poate salva date pe dispozitiv. Pornim clipul doar
                    dacă ești de acord.
                </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <button
                    type="button"
                    onClick={() => setUnlockedOnce(true)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ea-green-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-ea-green-500"
                >
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    Redă clipul o dată
                </button>
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                    Acceptă mereu
                </button>
            </div>
        </div>
    );
}
