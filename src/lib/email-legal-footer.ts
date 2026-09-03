import { SITE_CONTACT } from './site-contact';

/**
 * Subsolul obligatoriu al oricărui email plecat de pe site.
 *
 * Legea 365/2002 art. 5 cere ca destinatarul să poată identifica imediat firma care i-a
 * scris. Legea 506/2004 art. 12 cere ca orice comunicare comercială să spună de ce a
 * primit-o și cum poate opri următoarele. Un email care răspunde unei cereri nu e
 * comunicare comercială, dar identificarea și calea de renunțare se pun oricum: costă
 * nimic și scot din discuție orice reclamație.
 */

export type EmailFooterOptions = {
    /** De ce a primit persoana acest mesaj — se afișează ca atare. */
    reason: string;
    /** Adaugă rândul de dezabonare. Se pune la orice mesaj de marketing. */
    withOptOut?: boolean;
};

export function emailLegalFooterHtml({ reason, withOptOut = true }: EmailFooterOptions): string {
    const optOut = withOptOut
        ? `<p style="margin: 0 0 6px 0;">
               Nu mai vrei mesaje de la noi? Răspunde la acest email cu textul
               <strong>DEZABONARE</strong> sau scrie la
               <a href="mailto:${SITE_CONTACT.email}?subject=DEZABONARE" style="color: #059669;">${SITE_CONTACT.email}</a>.
               Te scoatem din listă imediat, fără să te întrebăm de ce.
           </p>`
        : '';

    return `
        <div style="background: #f3f4f6; color: #6b7280; padding: 24px; font-size: 11px; line-height: 1.6; font-family: sans-serif;">
            <p style="margin: 0 0 10px 0;">${reason}</p>
            ${optOut}
            <p style="margin: 10px 0 6px 0; color: #4b5563;">
                <strong>${SITE_CONTACT.legalName}</strong><br>
                ${SITE_CONTACT.addressFull}<br>
                CUI ${SITE_CONTACT.cui} &middot; Reg. Com. ${SITE_CONTACT.regCom}<br>
                ${SITE_CONTACT.email} &middot; ${SITE_CONTACT.phoneDisplay}
            </p>
            <p style="margin: 0;">
                Suntem operator de date cu caracter personal.
                <a href="https://tehnicagrosupply.ro/privacy-policy" style="color: #059669;">Politica de confidențialitate</a>
                &middot;
                <a href="https://tehnicagrosupply.ro/drepturile-mele" style="color: #059669;">Drepturile tale</a>
            </p>
        </div>
    `;
}
