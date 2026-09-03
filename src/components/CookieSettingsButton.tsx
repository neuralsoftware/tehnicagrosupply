'use client';

import { CONSENT_OPEN_EVENT } from '@/lib/consent';

/**
 * Deschide panoul de setări al bannerului. Există ca să poată fi pus și în pagini
 * server-rendered (politica de cookie-uri), nu doar în footer.
 */
export function CookieSettingsButton({ label = 'Deschide setările de cookie-uri' }: { label?: string }) {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
            className="inline-flex min-h-11 items-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
            {label}
        </button>
    );
}
