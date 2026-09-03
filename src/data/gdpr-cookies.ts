/**
 * Inventarul complet a tot ce site-ul salvează pe dispozitivul vizitatorului.
 *
 * Include și cookie-uri, și date salvate în memoria browserului (localStorage /
 * sessionStorage): Legea 506/2004 art. 4 alin. (5) nu vorbește despre „cookie-uri”, ci
 * despre orice stocare pe echipamentul terminal al utilizatorului. Dacă ceva se scrie
 * acolo, apare aici.
 *
 * Duratele sunt cele declarate de furnizori și pot fi modificate de aceștia.
 */

export type CookieCategory = 'necesare' | 'analiza' | 'marketing';

export type CookieEntry = {
    name: string;
    provider: string;
    /** 'cookie' | 'localStorage' | 'sessionStorage' */
    kind: string;
    purpose: string;
    duration: string;
};

export const COOKIE_CATEGORIES: {
    key: CookieCategory;
    title: string;
    summary: string;
    entries: CookieEntry[];
}[] = [
    {
        key: 'necesare',
        title: 'Strict necesare',
        summary:
            'Fac site-ul să funcționeze și rețin alegerile tale. Nu pot fi oprite, pentru că fără ele site-ul nu poate face ce i-ai cerut. Nu sunt folosite pentru urmărire și nu ajung la nimeni din afară.',
        entries: [
            {
                name: 'tehnicagro_consent',
                provider: 'tehnicagrosupply.ro',
                kind: 'localStorage',
                purpose:
                    'Reține ce categorii de cookie-uri ai acceptat sau ai refuzat, împreună cu momentul alegerii și versiunea politicii. Fără el, bannerul ți-ar apărea la fiecare pagină.',
                duration: '6 luni, apoi ești întrebat din nou',
            },
            {
                name: 'tehnicagro_lead_submitted',
                provider: 'tehnicagrosupply.ro',
                kind: 'localStorage',
                purpose:
                    'Ține minte că ai trimis deja un formular, ca să nu îți mai apară fereastra care te invită să calculezi beneficiul.',
                duration: 'Până ștergi datele site-ului din browser',
            },
            {
                name: 'exitPopupShown',
                provider: 'tehnicagrosupply.ro',
                kind: 'sessionStorage',
                purpose: 'Împiedică reafișarea aceleiași ferestre de mai multe ori în aceeași vizită.',
                duration: 'Se șterge când închizi fila',
            },
        ],
    },
    {
        key: 'analiza',
        title: 'Analiză',
        summary:
            'Ne arată câți oameni intră pe site, ce pagini citesc și unde se blochează, ca să știm ce să reparăm. Se activează numai dacă bifezi categoria „Analiză”.',
        entries: [
            {
                name: '_ga',
                provider: 'Google Analytics (Google Ireland Limited)',
                kind: 'cookie',
                purpose: 'Deosebește vizitatorii unul de altul, fără a-i identifica după nume.',
                duration: '2 ani',
            },
            {
                name: '_ga_KR6928Z45R',
                provider: 'Google Analytics (Google Ireland Limited)',
                kind: 'cookie',
                purpose: 'Reține starea sesiunii pentru proprietatea noastră de Analytics.',
                duration: '2 ani',
            },
            {
                name: '_clck',
                provider: 'Microsoft Clarity (Microsoft Ireland Operations Limited)',
                kind: 'cookie',
                purpose: 'Leagă între ele vizitele aceluiași browser, pentru statistici de utilizare.',
                duration: '1 an',
            },
            {
                name: '_clsk',
                provider: 'Microsoft Clarity (Microsoft Ireland Operations Limited)',
                kind: 'cookie',
                purpose: 'Grupează paginile vizitate într-o singură sesiune.',
                duration: '1 zi',
            },
            {
                name: 'CLID · MUID',
                provider: 'Microsoft (clarity.ms)',
                kind: 'cookie',
                purpose: 'Identifică browserul pe durata analizei, la nivelul serviciului Microsoft.',
                duration: 'Până la 13 luni',
            },
        ],
    },
    {
        key: 'marketing',
        title: 'Marketing',
        summary:
            'Ne arată ce reclamă te-a adus pe site, ne ajută să nu plătim de două ori pentru același rezultat și permit redarea clipurilor găzduite pe YouTube. Se activează numai dacă bifezi categoria „Marketing”.',
        entries: [
            {
                name: '_gcl_au',
                provider: 'Google Ads (Google Ireland Limited)',
                kind: 'cookie',
                purpose: 'Leagă un click pe reclamă de o cerere de ofertă, ca să știm ce campanie a funcționat.',
                duration: '90 de zile',
            },
            {
                name: 'IDE · test_cookie',
                provider: 'Google (doubleclick.net)',
                kind: 'cookie',
                purpose: 'Măsoară afișările de anunțuri și verifică dacă browserul acceptă cookie-uri.',
                duration: 'IDE: 13 luni · test_cookie: 15 minute',
            },
            {
                name: '_fbp',
                provider: 'Meta Platforms Ireland Limited',
                kind: 'cookie',
                purpose: 'Măsoară rezultatele campaniilor de pe Facebook și Instagram.',
                duration: '90 de zile',
            },
            {
                name: 'fr',
                provider: 'Meta (facebook.com)',
                kind: 'cookie',
                purpose: 'Livrează și măsoară publicitatea în rețeaua Meta.',
                duration: '90 de zile',
            },
            {
                name: 'VISITOR_INFO1_LIVE · YSC',
                provider: 'YouTube (Google Ireland Limited)',
                kind: 'cookie',
                purpose:
                    'Rețin preferințele de redare și numărul de vizualizări. Se setează numai dacă pornești efectiv un clip; folosim varianta youtube-nocookie.com, care nu scrie nimic până la redare.',
                duration: 'VISITOR_INFO1_LIVE: 6 luni · YSC: durata sesiunii',
            },
        ],
    },
];
