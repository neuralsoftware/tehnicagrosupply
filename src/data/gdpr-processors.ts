/**
 * Registrul împuterniciților (furnizorii care ating date personale în numele nostru).
 *
 * Sursă unică pentru:
 *   · tabelul din Politica de confidențialitate,
 *   · Registrul activităților de prelucrare (GDPR art. 30),
 *   · pagina de administrare, unde se urmărește starea fiecărui contract (art. 28).
 *
 * `dpaUrl` este adresa oficială a acordului de prelucrare. `dpaAction` spune exact ce
 * trebuie apăsat ca acordul să fie valabil — la unii furnizori e inclus automat în termeni,
 * la alții trebuie acceptat manual din cont.
 */

export type ProcessorCategory = 'infrastructura' | 'analiza' | 'marketing' | 'comunicare';

export type Processor = {
    name: string;
    /** Entitatea juridică cu care se încheie contractul. */
    entity: string;
    category: ProcessorCategory;
    /** La ce ne folosește, în cuvinte pe înțelesul oricui. */
    role: string;
    /** Ce date ajung acolo. */
    dataTypes: string;
    /** Unde stau fizic datele. */
    location: string;
    /** Temeiul transferului, dacă datele ies din Spațiul Economic European. */
    transferBasis: string | null;
    dpaUrl: string;
    /**
     * `automat` — acordul e deja în vigoare prin simpla folosire a serviciului;
     * `de_confirmat` — cineva trebuie să apese explicit accept în contul furnizorului.
     */
    acceptance: 'automat' | 'de_confirmat';
    /** De ce e automat, sau ce anume trebuie apăsat. Citat din contract acolo unde e cazul. */
    dpaAction: string;
    /** Activ doar dacă vizitatorul acceptă categoria respectivă de cookie-uri. */
    consentGated: boolean;
    /** Copie arhivată local, în `docs/gdpr/dpa/`, la data auditului. */
    archive: string;
};

export const PROCESSORS: Processor[] = [
    {
        name: 'Vercel',
        entity: 'Vercel Inc. (SUA)',
        category: 'infrastructura',
        role: 'Găzduiește site-ul și rulează formularele',
        dataTypes: 'Datele din formulare, în tranzit; jurnale tehnice de acces',
        location: 'Regiune de execuție în Uniunea Europeană; societatea-mamă în SUA',
        transferBasis: 'Clauze contractuale standard (SCC)',
        dpaUrl: 'https://vercel.com/legal/dpa',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: contractul spune „By entering into the Agreement, Data Exporter is deemed to have signed these Standard Contractual Clauses”. Nu există buton de acceptat.',
        consentGated: false,
        archive: 'vercel-dpa.html',
    },
    {
        name: 'Supabase',
        entity: 'Supabase Inc. (SUA), infrastructură AWS Europa',
        category: 'infrastructura',
        role: 'Baza de date a site-ului și a CRM-ului',
        dataTypes: 'Toate datele din formulare, registrul de consimțăminte',
        location: 'Stockholm, Suedia (eu-north-1) — în Uniunea Europeană',
        transferBasis: null,
        dpaUrl: 'https://supabase.com/legal/customer-resources/data-processing-addendum',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: DPA-ul „forms part of the Supabase Terms of Service”, iar „acceptance of the Agreement shall have the same effect as signing the SCCs”.',
        consentGated: false,
        archive: 'supabase-dpa.html',
    },
    {
        name: 'Cloudflare R2',
        entity: 'Cloudflare, Inc. (SUA)',
        category: 'infrastructura',
        role: 'Livrează clipurile video de prezentare',
        dataTypes: 'Adresă IP, jurnale de livrare a fișierelor',
        location: 'Rețea globală, cu preferință pentru noduri europene',
        transferBasis: 'Clauze contractuale standard (SCC)',
        dpaUrl: 'https://www.cloudflare.com/cloudflare-customer-dpa/',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: DPA-ul „forms part of the Main Agreement” și e „deemed executed upon execution of the DPA”.',
        consentGated: false,
        archive: 'cloudflare-dpa.html',
    },
    {
        name: 'Google Analytics',
        entity: 'Google Ireland Limited',
        category: 'analiza',
        role: 'Statistici despre traficul pe site',
        dataTypes: 'Adresă IP, dispozitiv, pagini vizitate, durata vizitei',
        location: 'Uniunea Europeană și SUA',
        transferBasis: 'EU–US Data Privacy Framework + clauze contractuale standard',
        dpaUrl: 'https://business.safety.google/adsprocessorterms/',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: firma e stabilită în România, deci în SEE. Google cere acceptare explicită doar clienților din afara SEE. Opțional, în Admin → Account details poți completa contactul de notificare.',
        consentGated: true,
        archive: 'google-ads-processor-terms.html',
    },
    {
        name: 'Microsoft Clarity',
        entity: 'Microsoft Ireland Operations Limited',
        category: 'analiza',
        role: 'Hărți de atenție și înregistrări anonime ale sesiunilor',
        dataTypes: 'Adresă IP, interacțiuni cu pagina, dispozitiv',
        location: 'Uniunea Europeană și SUA',
        transferBasis: 'EU–US Data Privacy Framework + clauze contractuale standard',
        dpaUrl: 'https://clarity.microsoft.com/terms',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: inclus în Microsoft Products and Services DPA, acceptat odată cu crearea contului.',
        consentGated: true,
        archive: 'microsoft-clarity-terms.html',
    },
    {
        name: 'Google Ads',
        entity: 'Google Ireland Limited',
        category: 'marketing',
        role: 'Măsoară conversiile din reclame și afișează anunțuri',
        dataTypes: 'Identificator de click (gclid), conversii, dispozitiv',
        location: 'Uniunea Europeană și SUA',
        transferBasis: 'EU–US Data Privacy Framework + clauze contractuale standard',
        dpaUrl: 'https://business.safety.google/adsprocessorterms/',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: firma e stabilită în SEE. Acceptarea explicită din Account Settings e cerută doar clienților din afara SEE, Marii Britanii sau Elveției.',
        consentGated: true,
        archive: 'google-ads-processor-terms.html',
    },
    {
        name: 'Meta Pixel',
        entity: 'Meta Platforms Ireland Limited',
        category: 'marketing',
        role: 'Măsoară rezultatele campaniilor de pe Facebook și Instagram',
        dataTypes: 'Evenimente de navigare, identificatori de dispozitiv',
        location: 'Uniunea Europeană și SUA',
        transferBasis: 'EU–US Data Privacy Framework + clauze contractuale standard',
        dpaUrl: 'https://www.facebook.com/legal/terms/dataprocessing',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: inclus în Condițiile pentru instrumentele de business Meta, acceptate la configurarea pixelului.',
        consentGated: true,
        archive: 'meta-data-processing.html',
    },
    {
        name: 'YouTube',
        entity: 'Google Ireland Limited',
        category: 'marketing',
        role: 'Redă clipurile de prezentare a utilajelor',
        dataTypes: 'Adresă IP, date despre redare',
        location: 'Uniunea Europeană și SUA',
        transferBasis: 'EU–US Data Privacy Framework + clauze contractuale standard',
        dpaUrl: 'https://business.safety.google/adsprocessorterms/',
        acceptance: 'automat',
        dpaAction: 'Acoperit de acordul Google. Clipurile rulează pe youtube-nocookie.com și pornesc doar cu acordul vizitatorului.',
        consentGated: true,
        archive: 'google-ads-processor-terms.html',
    },
    {
        name: 'Google Workspace (Gmail)',
        entity: 'Google Ireland Limited',
        category: 'comunicare',
        role: 'Trimite rapoartele și ofertele pe email',
        dataTypes: 'Nume, adresă de email, conținutul mesajului',
        location: 'Uniunea Europeană și SUA',
        transferBasis: 'EU–US Data Privacy Framework + clauze contractuale standard',
        dpaUrl: 'https://cloud.google.com/terms/data-processing-addendum/',
        acceptance: 'automat',
        dpaAction: 'În vigoare automat: Cloud Data Processing Addendum „is incorporated into the Agreement(s) between Google and Customer”.',
        consentGated: false,
        archive: 'google-cloud-workspace-dpa.html',
    },
];

export const PROCESSOR_CATEGORY_LABEL: Record<ProcessorCategory, string> = {
    infrastructura: 'Infrastructură',
    analiza: 'Analiză',
    marketing: 'Marketing',
    comunicare: 'Comunicare',
};
