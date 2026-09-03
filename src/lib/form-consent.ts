/**
 * Textele exacte afișate în formulare și forma în care se transmit la server.
 *
 * Regula de aur: textul pe care îl vede vizitatorul se salvează cuvânt cu cuvânt lângă
 * bifă. Peste doi ani, când cineva întreabă „la ce mi-am dat acordul?”, răspunsul trebuie
 * să fie textul de atunci, nu cel de acum. De asta constantele de mai jos nu se editează
 * niciodată în loc — se adaugă o versiune nouă și se incrementează `FORM_CONSENT_VERSION`.
 */

export const FORM_CONSENT_VERSION = '2026-09-03';

/**
 * Confirmare de informare, nu consimțământ.
 *
 * Ca să răspundem unei cereri de ofertă nu avem nevoie de acordul persoanei: temeiul este
 * executarea unor demersuri precontractuale, la cererea ei (GDPR art. 6 alin. 1 lit. b).
 * Bifa aceasta dovedește doar că informarea i-a fost pusă în față înainte de trimitere.
 */
export const NOTICE_TEXT =
    'Am citit Politica de confidențialitate și am înțeles că datele de mai sus sunt folosite ' +
    'pentru a-mi întocmi și transmite oferta solicitată.';

/**
 * Consimțământ propriu-zis, opțional (GDPR art. 6 alin. 1 lit. a + Legea 506/2004 art. 12).
 * Refuzul nu împiedică trimiterea formularului — altfel consimțământul nu ar fi liber.
 */
export const MARKETING_TEXT =
    'Vreau să primesc pe email sau telefon oferte, noutăți despre utilaje și invitații la ' +
    'demonstrații în câmp. Îmi pot retrage acordul oricând, printr-un simplu mesaj.';

export type LeadConsent = {
    policyVersion: string;
    /** Bifa obligatorie de informare. */
    noticeAcknowledged: boolean;
    noticeText: string;
    /** Bifa opțională de marketing. */
    marketingGranted: boolean;
    marketingText: string;
    /** Momentul exact al bifării, din browserul persoanei. */
    givenAt: string;
};

/** Construiește dovada care pleacă odată cu datele din formular. */
export function buildLeadConsent(noticeAcknowledged: boolean, marketingGranted: boolean): LeadConsent {
    return {
        policyVersion: FORM_CONSENT_VERSION,
        noticeAcknowledged,
        noticeText: NOTICE_TEXT,
        marketingGranted,
        marketingText: MARKETING_TEXT,
        givenAt: new Date().toISOString(),
    };
}
