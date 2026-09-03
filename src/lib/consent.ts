/**
 * Modelul de consimțământ pentru cookie-uri și tehnologii similare.
 *
 * Reguli respectate:
 *  - GDPR art. 4 pct. 11 + art. 7: consimțământ specific pe scop, dovedibil, retras la fel de ușor.
 *  - Legea 506/2004 art. 4 alin. (5): nimic nu se stochează pe dispozitiv înainte de acord.
 *  - Proiectul de modificare a Legii 506/2004 (aflat în Parlament): buton de refuz la fel de
 *    vizibil ca cel de acceptare, fără opțiuni prebifate, retragere la fel de simplă.
 *  - Digital Omnibus, propunere art. 88a/88b GDPR (în trilog, nu încă în vigoare): nu se
 *    reîntreabă timp de 6 luni după un refuz; semnalul din browser este respectat.
 *
 * Când se schimbă scopurile sau furnizorii, se incrementează `CONSENT_POLICY_VERSION`:
 * toate consimțămintele mai vechi devin invalide și bannerul reapare.
 */

export const CONSENT_POLICY_VERSION = '2026-09-03';

/** Cheia nouă. `cookie_consent` (vechea cheie) e migrată o singură dată, apoi ștearsă. */
export const CONSENT_STORAGE_KEY = 'tehnicagro_consent';
export const LEGACY_CONSENT_KEY = 'cookie_consent';

/** 6 luni — și maximul recomandat de autorități, și fereastra din propunerea art. 88a. */
export const CONSENT_MAX_AGE_DAYS = 180;

/** Se emite pe `window` ori de câte ori decizia se schimbă. */
export const CONSENT_EVENT = 'tehnicagro-consent-change';

/** Evenimentul care deschide panoul de setări (din footer sau din politica de cookie-uri). */
export const CONSENT_OPEN_EVENT = 'openCookieSettings';

export type ConsentDecisionMethod =
    | 'accept_all'
    | 'reject_all'
    | 'custom'
    | 'browser_signal'
    | 'migrated';

export type ConsentRecord = {
    version: string;
    /** ISO 8601 — momentul exact al deciziei. Dovada cerută de art. 7 alin. (1). */
    decidedAt: string;
    /** ISO 8601 — după această dată bannerul reapare. */
    expiresAt: string;
    analytics: boolean;
    marketing: boolean;
    method: ConsentDecisionMethod;
};

/** Ce alege utilizatorul în panou. Categoria „strict necesare” nu e opțională, deci nu apare aici. */
export type ConsentChoice = Pick<ConsentRecord, 'analytics' | 'marketing'>;

export const CONSENT_DENIED: ConsentChoice = { analytics: false, marketing: false };
export const CONSENT_GRANTED: ConsentChoice = { analytics: true, marketing: true };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function addDays(from: Date, days: number): Date {
    return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Semnalul de confidențialitate din browser (Global Privacy Control).
 * Când e activ îl tratăm ca refuz explicit — utilizatorul l-a pornit tocmai ca să nu fie întrebat.
 */
export function hasBrowserPrivacySignal(): boolean {
    if (typeof navigator === 'undefined') return false;
    return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** Citește decizia validă. Returnează `null` dacă nu există, e expirată sau e pe o versiune veche. */
export function readConsent(): ConsentRecord | null {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (raw) {
            const parsed: unknown = JSON.parse(raw);
            if (!isRecord(parsed)) return null;
            if (parsed.version !== CONSENT_POLICY_VERSION) return null;
            if (typeof parsed.expiresAt !== 'string' || new Date(parsed.expiresAt) <= new Date()) return null;

            return {
                version: CONSENT_POLICY_VERSION,
                decidedAt: String(parsed.decidedAt ?? ''),
                expiresAt: parsed.expiresAt,
                analytics: parsed.analytics === true,
                marketing: parsed.marketing === true,
                method: (parsed.method as ConsentDecisionMethod) ?? 'custom',
            };
        }

        return migrateLegacyConsent();
    } catch {
        return null;
    }
}

/**
 * Vizitatorii care au ales înainte de bannerul pe categorii nu sunt întrebați din nou imediat:
 * „Acceptă” acoperea și analiza și marketingul, „Refuz” le refuza pe amândouă. Înregistrarea
 * migrată expiră după 6 luni, deci toată lumea trece în final prin bannerul granular.
 */
function migrateLegacyConsent(): ConsentRecord | null {
    if (typeof window === 'undefined') return null;

    let legacy: string | null = null;
    try {
        legacy = window.localStorage.getItem(LEGACY_CONSENT_KEY);
    } catch {
        return null;
    }
    if (legacy !== 'granted' && legacy !== 'denied') return null;

    const now = new Date();
    const record: ConsentRecord = {
        version: CONSENT_POLICY_VERSION,
        decidedAt: now.toISOString(),
        expiresAt: addDays(now, CONSENT_MAX_AGE_DAYS).toISOString(),
        analytics: legacy === 'granted',
        marketing: legacy === 'granted',
        method: 'migrated',
    };

    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
        window.localStorage.removeItem(LEGACY_CONSENT_KEY);
    } catch {
        /* modul privat / stocare blocată — decizia rămâne doar pentru sesiunea curentă */
    }
    return record;
}

/** Salvează decizia, notifică pagina și returnează înregistrarea completă (dovada). */
export function writeConsent(choice: ConsentChoice, method: ConsentDecisionMethod): ConsentRecord {
    const now = new Date();
    const record: ConsentRecord = {
        version: CONSENT_POLICY_VERSION,
        decidedAt: now.toISOString(),
        expiresAt: addDays(now, CONSENT_MAX_AGE_DAYS).toISOString(),
        analytics: choice.analytics,
        marketing: choice.marketing,
        method,
    };

    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
            window.localStorage.removeItem(LEGACY_CONSENT_KEY);
        } catch {
            /* stocare indisponibilă — decizia se aplică în sesiunea curentă */
        }
        window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_EVENT, { detail: record }));
    }

    return record;
}

/** Ce e permis acum. Fără decizie salvată, totul în afara strictului necesar e oprit. */
export function currentConsent(): ConsentChoice {
    const record = readConsent();
    if (record) return { analytics: record.analytics, marketing: record.marketing };
    return CONSENT_DENIED;
}

/**
 * Scriptul inline din `<head>`, care rulează înainte de orice altceva și setează starea
 * implicită Google Consent Mode v2. Trebuie să fie sincron: dacă rulează după gtag.js,
 * primele evenimente pleacă pe setarea greșită.
 *
 * Se ține în sincron cu `readConsent()` de mai sus.
 */
export const CONSENT_BOOTSTRAP_SCRIPT = `
(function () {
    var analytics = false, marketing = false;
    try {
        if (navigator && navigator.globalPrivacyControl === true) {
            analytics = false; marketing = false;
        } else {
            var raw = window.localStorage.getItem('${CONSENT_STORAGE_KEY}');
            if (raw) {
                var c = JSON.parse(raw);
                if (c && c.version === '${CONSENT_POLICY_VERSION}' && c.expiresAt && new Date(c.expiresAt) > new Date()) {
                    analytics = c.analytics === true;
                    marketing = c.marketing === true;
                }
            } else if (window.localStorage.getItem('${LEGACY_CONSENT_KEY}') === 'granted') {
                analytics = true; marketing = true;
            }
        }
    } catch (e) {}

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('consent', 'default', {
        'analytics_storage':   analytics ? 'granted' : 'denied',
        'ad_storage':          marketing ? 'granted' : 'denied',
        'ad_user_data':        marketing ? 'granted' : 'denied',
        'ad_personalization':  marketing ? 'granted' : 'denied',
        'wait_for_update': 2000
    });
})();
`;

/** Trimite starea curentă către Google Consent Mode. */
export function syncGoogleConsent(choice: ConsentChoice): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
        analytics_storage: choice.analytics ? 'granted' : 'denied',
        ad_storage: choice.marketing ? 'granted' : 'denied',
        ad_user_data: choice.marketing ? 'granted' : 'denied',
        ad_personalization: choice.marketing ? 'granted' : 'denied',
    });
}
