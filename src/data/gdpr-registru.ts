/**
 * Registrul activităților de prelucrare — GDPR art. 30.
 *
 * Documentul pe care o autoritate de supraveghere îl cere primul într-un control. Nu se
 * depune nicăieri și nu se publică: se ține la firmă, actualizat, și se prezintă la cerere.
 *
 * Fiecare intrare acoperă mințiunile obligatorii din art. 30 alin. (1): scopul, categoriile
 * de persoane și de date, destinatarii, transferurile, termenele și măsurile de securitate.
 */

export type ProcessingActivity = {
    id: string;
    name: string;
    /** De ce prelucrăm — formulat concret, nu generic. */
    purpose: string;
    legalBasis: string;
    /** Cine sunt oamenii ale căror date le prelucrăm. */
    subjects: string;
    dataCategories: string;
    recipients: string;
    /** Transfer în afara Spațiului Economic European; null dacă nu există. */
    transfers: string | null;
    retention: string;
    securityMeasures: string;
};

export const REGISTRU_VERSION = '2026-09-03';

export const PROCESSING_ACTIVITIES: ProcessingActivity[] = [
    {
        id: 'A1',
        name: 'Cereri de ofertă primite prin site',
        purpose:
            'Preluarea cererilor trimise din formularele de contact și de pe paginile de produs, întocmirea ofertei și purtarea discuțiilor comerciale premergătoare unui contract.',
        legalBasis: 'Art. 6 alin. (1) lit. b — demersuri precontractuale la cererea persoanei vizate',
        subjects: 'Fermieri, administratori de exploatații agricole, reprezentanți ai societăților agricole',
        dataCategories:
            'Nume, telefon, email, județ, CUI/CIF, suprafața fermei, culturi, orizont de investiție, conținutul mesajului',
        recipients: 'Personalul propriu de vânzări; Supabase (găzduire bază de date); Vercel (găzduire site)',
        transfers: null,
        retention: '3 ani de la ultimul contact (art. 2517 Cod civil — termenul general de prescripție)',
        securityMeasures:
            'Transmisie criptată HTTPS; acces la baza de date doar cu chei de serviciu păstrate pe server; limitare a numărului de cereri pe adresă IP; jurnalizarea accesului',
    },
    {
        id: 'A2',
        name: 'Rapoarte de audit generate din calculatorul ROI',
        purpose:
            'Calcularea beneficiului estimat pentru ferma solicitantului și transmiterea raportului pe email, la cererea acestuia.',
        legalBasis: 'Art. 6 alin. (1) lit. b — demersuri precontractuale la cererea persoanei vizate',
        subjects: 'Fermieri care completează calculatorul de pe site',
        dataCategories: 'Nume, email, telefon, județ, hectare, culturi, valorile economice calculate',
        recipients: 'Personalul propriu; Supabase; Vercel; Google Ireland Limited (Gmail, pentru expediere)',
        transfers:
            'Google — SUA, în baza clauzelor contractuale standard și a Cadrului transatlantic de confidențialitate a datelor',
        retention: '3 ani de la ultimul contact',
        securityMeasures:
            'HTTPS; limitare la 3 rapoarte pe oră pe adresă IP; conținutul emailului nu include date sensibile',
    },
    {
        id: 'A3',
        name: 'Comunicări comerciale (marketing direct)',
        purpose:
            'Transmiterea de oferte, noutăți despre utilaje și invitații la demonstrații, exclusiv către persoanele care au bifat acordul separat.',
        legalBasis: 'Art. 6 alin. (1) lit. a — consimțământ; art. 12 din Legea 506/2004',
        subjects: 'Persoane care și-au dat acordul explicit prin formularele site-ului',
        dataCategories: 'Nume, email, telefon',
        recipients: 'Personalul propriu; Google Ireland Limited (Gmail)',
        transfers: 'Google — SUA, clauze contractuale standard + EU–US Data Privacy Framework',
        retention:
            'Până la retragerea acordului; reconfirmare la maximum 24 de luni. Dovada refuzului sau a retragerii se păstrează 3 ani.',
        securityMeasures: 'Fiecare mesaj conține modalitatea de dezabonare; evidența acordurilor în registru dedicat',
    },
    {
        id: 'A4',
        name: 'Măsurarea traficului pe site',
        purpose: 'Înțelegerea modului în care este folosit site-ul, pentru îmbunătățirea conținutului și a structurii.',
        legalBasis: 'Art. 6 alin. (1) lit. a — consimțământ pentru categoria „Analiză”',
        subjects: 'Vizitatorii site-ului care acceptă categoria „Analiză”',
        dataCategories: 'Adresă IP, tip de browser și dispozitiv, pagini vizitate, durata vizitei',
        recipients: 'Google Ireland Limited (Google Analytics); Microsoft Ireland Operations Limited (Clarity)',
        transfers: 'SUA — clauze contractuale standard + EU–US Data Privacy Framework',
        retention: 'Maximum 14 luni în Google Analytics; conform setărilor implicite Clarity',
        securityMeasures:
            'Scripturile nu se încarcă înainte de consimțământ; Google Consent Mode v2 pornește cu toate categoriile refuzate',
    },
    {
        id: 'A5',
        name: 'Publicitate online și măsurarea conversiilor',
        purpose:
            'Măsurarea rezultatelor campaniilor plătite și afișarea de anunțuri relevante persoanelor care au vizitat site-ul.',
        legalBasis: 'Art. 6 alin. (1) lit. a — consimțământ pentru categoria „Marketing”',
        subjects: 'Vizitatorii site-ului care acceptă categoria „Marketing”',
        dataCategories: 'Identificatori de click (gclid), parametri de campanie (UTM), pagina de proveniență, evenimente de navigare',
        recipients: 'Google Ireland Limited (Google Ads); Meta Platforms Ireland Limited (Meta Pixel)',
        transfers: 'SUA — clauze contractuale standard + EU–US Data Privacy Framework',
        retention: 'Maximum 24 de luni',
        securityMeasures: 'Scripturile se injectează doar după consimțământ; clipurile video rulează pe youtube-nocookie.com',
    },
    {
        id: 'A6',
        name: 'Registrul dovezilor de consimțământ',
        purpose:
            'Păstrarea dovezii că o persoană și-a dat sau și-a refuzat acordul, cu textul exact afișat la acel moment.',
        legalBasis: 'Art. 7 alin. (1) coroborat cu art. 5 alin. (2) — obligația de a demonstra consimțământul',
        subjects: 'Persoanele care completează formularele site-ului',
        dataCategories:
            'Identificatorul clientului sau al lead-ului, email, telefon, scopul, răspunsul (da/nu), textul afișat, versiunea politicii, hash al adresei IP, tipul de browser',
        recipients: 'Personalul propriu; Supabase',
        transfers: null,
        retention: '3 ani după încetarea prelucrării la care se referă consimțământul',
        securityMeasures:
            'Tabel cu acces restricționat, disponibil doar cheii de serviciu; adresa IP se păstrează exclusiv sub formă de hash, niciodată în clar; înregistrările nu se modifică, se adaugă altele noi',
    },
    {
        id: 'A7',
        name: 'Securitatea site-ului',
        purpose:
            'Protejarea formularelor împotriva trimiterilor automate și a tentativelor de abuz asupra interfețelor tehnice.',
        legalBasis: 'Art. 6 alin. (1) lit. f — interes legitim în securitatea și disponibilitatea serviciului',
        subjects: 'Toți vizitatorii site-ului',
        dataCategories: 'Adresă IP, momentul cererii',
        recipients: 'Nimeni în afara firmei; datele rămân în memoria serverului',
        transfers: null,
        retention: '15 minute — fereastra de limitare a cererilor; nu se scriu în baza de date',
        securityMeasures: 'Contorizare în memorie, fără persistare; antete de securitate HTTP (CSP, HSTS)',
    },
    {
        id: 'A8',
        name: 'Gestiunea relației cu clienții (CRM)',
        purpose:
            'Urmărirea discuțiilor comerciale, a sarcinilor și a istoricului de contact pentru fiecare client sau prospect.',
        legalBasis:
            'Art. 6 alin. (1) lit. b pentru clienți și prospecți activi; art. 6 alin. (1) lit. f pentru evidența internă',
        subjects: 'Clienți, prospecți, persoane de contact din societăți agricole',
        dataCategories: 'Date de identificare și de contact, date fiscale, istoric de interacțiuni, note interne',
        recipients: 'Personalul propriu; Supabase',
        transfers: null,
        retention:
            '3 ani de la ultimul contact pentru prospecți neconvertiți; 10 ani pentru clienții cu documente contabile emise',
        securityMeasures: 'Acces pe bază de cont; jurnalizarea acțiunilor; supraveghere automată a termenelor de ștergere',
    },
    {
        id: 'A9',
        name: 'Facturare și evidență contabilă',
        purpose: 'Emiterea documentelor fiscale și îndeplinirea obligațiilor contabile.',
        legalBasis: 'Art. 6 alin. (1) lit. c — obligație legală (Legea contabilității 82/1991, Codul fiscal)',
        subjects: 'Clienți și reprezentanții acestora',
        dataCategories: 'Denumire, CUI, adresă, date de facturare, sume',
        recipients: 'Personalul propriu; furnizorul de servicii de contabilitate; ANAF',
        transfers: null,
        retention: '10 ani de la închiderea exercițiului financiar (art. 25 din Legea 82/1991)',
        securityMeasures: 'Acces restrâns la persoanele cu atribuții financiare; arhivare conform legii',
    },
];
