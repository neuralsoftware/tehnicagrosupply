import { createHash } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { LeadConsent } from './form-consent';

/**
 * Scrie dovezile de consimțământ în `public.gdpr_consents` (proiectul CRM).
 *
 * Tabelul e append-only: la fiecare trimitere de formular se adaugă rânduri noi, nu se
 * actualizează cele vechi. Așa rămâne vizibil istoricul complet — inclusiv momentul în
 * care cineva și-a retras acordul (GDPR art. 7 alin. 1 și art. 5 alin. 2).
 */

/** Cât timp rămâne valabil un consimțământ de marketing înainte de a fi reconfirmat. */
const MARKETING_CONSENT_MONTHS = 24;

/**
 * Adresa IP e o dovadă utilă, dar păstrarea ei în clar ar însemna să colectăm mai mult
 * decât ne trebuie. Salvăm un hash: putem confirma că o anumită adresă se potrivește,
 * fără să ținem adresa în bază.
 */
function hashIp(ip: string): string {
    const salt = process.env.GDPR_IP_SALT?.trim() || 'tehnicagro-consent';
    return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

function addMonths(from: Date, months: number): Date {
    const d = new Date(from);
    d.setMonth(d.getMonth() + months);
    return d;
}

export type ConsentSubject = {
    clientId?: string | number | null;
    leadId?: string | null;
    email?: string;
    phone?: string;
};

export type ConsentContext = {
    ip: string;
    userAgent: string;
    source: string;
    attribution?: Record<string, string | undefined>;
};

type ConsentRow = {
    client_id: number | null;
    lead_id: string | null;
    email: string | null;
    phone: string | null;
    purpose: string;
    granted: boolean;
    consent_text: string;
    policy_version: string;
    source: string;
    evidence: Record<string, unknown>;
    expires_at: string | null;
};

function toIntegerOrNull(id: string | number | null | undefined): number | null {
    if (id == null) return null;
    const n = typeof id === 'number' ? Math.trunc(id) : parseInt(String(id), 10);
    return Number.isFinite(n) ? n : null;
}

/**
 * Nu aruncă niciodată: o eroare la scrierea dovezii nu trebuie să facă lead-ul să se piardă.
 * Eșecul se logează, ca să fie vizibil în logurile serverului.
 */
export async function logLeadConsent(
    crm: SupabaseClient,
    consent: LeadConsent,
    subject: ConsentSubject,
    context: ConsentContext
): Promise<void> {
    const now = new Date();
    const evidence = {
        ip_hash: hashIp(context.ip),
        user_agent: context.userAgent.slice(0, 500),
        given_at_client: consent.givenAt,
        logged_at_server: now.toISOString(),
        attribution: context.attribution ?? {},
    };

    const base = {
        client_id: toIntegerOrNull(subject.clientId),
        lead_id: subject.leadId ?? null,
        email: subject.email?.trim() || null,
        phone: subject.phone?.trim() || null,
        policy_version: consent.policyVersion,
        source: context.source.slice(0, 200),
        evidence,
    };

    const rows: ConsentRow[] = [
        {
            ...base,
            purpose: 'ofertare',
            granted: consent.noticeAcknowledged,
            consent_text: consent.noticeText,
            // Informarea pentru ofertare nu „expiră” — ține de temeiul precontractual.
            expires_at: null,
        },
    ];

    // Rândul de marketing se scrie și când răspunsul e „nu”: refuzul e la fel de
    // important de dovedit ca acceptul, dacă persoana reclamă că a primit mesaje.
    rows.push({
        ...base,
        purpose: 'marketing',
        granted: consent.marketingGranted,
        consent_text: consent.marketingText,
        expires_at: consent.marketingGranted
            ? addMonths(now, MARKETING_CONSENT_MONTHS).toISOString()
            : null,
    });

    const { error } = await crm.from('gdpr_consents').insert(rows);
    if (error) {
        console.error('[gdpr] Nu s-a putut scrie dovada consimțământului:', error.code, error.message);
    }
}
