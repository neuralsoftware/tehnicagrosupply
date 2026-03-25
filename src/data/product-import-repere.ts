/**
 * Repere fixe pentru „import din link” — fără API AI.
 * Ordinea contează: prima regulă care trece toate condițiile setate câștigă.
 *
 * Câmpuri (toate opționale în afară de id, summary, bullets):
 * - hostFragments: cel puțin un fragment trebuie să apară în hostname (fără www.)
 * - hostMustIncludeAll: toate fragmentele trebuie să apară în hostname (ex. avers + agro)
 * - allTextFragments: fiecare fragment trebuie să apară în textul combinat (URL + titlu + descriere + excerpt)
 * - anyTextFragments: cel puțin un fragment trebuie să apară în textul combinat
 *
 * Dacă o regulă nu are hostFragments și nici hostMustIncludeAll, se evaluează doar pe text
 * (util pentru termeni tehnici — pune aceste reguli LA SFÂRȘITUL listei).
 */
export type ImportReperRule = {
    id: string;
    hostFragments?: string[];
    hostMustIncludeAll?: string[];
    allTextFragments?: string[];
    anyTextFragments?: string[];
    summary: string;
    bullets: string[];
};

export const PRODUCT_IMPORT_REPERE: ImportReperRule[] = [
    {
        id: 'fliegl',
        hostFragments: ['fliegl'],
        summary:
            'Fliegl Agrartechnik este un producător recunoscut pentru remorci și soluții de transport în agricultură; gama acoperă încărcare, transport și descărcare recoltă, în funcție de model și țara de folosire.',
        bullets: [
            'Compatibilitatea cu tractorul, cârligul și lucrările tale se verifică pe documentația producătorului și în ofertă.',
            'Parametrii reali (masă, volume, opțiuni) depind de model și echipare — folosiți fișa tehnică oficială.',
            'Programe de finanțare (ex. APIA/AFIR) se sprijină pe condițiile publice la data depunerii; nu presupunem eligibilitate fără analiză.',
        ],
    },
    {
        id: 'avers-agro',
        hostMustIncludeAll: ['avers', 'agro'],
        summary:
            'Avers-Agro oferă echipamente pentru pregătirea solului și lucrări conservative (inclusiv abordări de tip no-till / strip-till, în funcție de model). Parametrii efectivi depind de utilaj, sol și condițiile de lucru.',
        bullets: [
            'Alegerea modelului ține cont de lățime de lucru, necesarul de putere al tractorului și tipul de exploatație.',
            'Consultați datele producătorului pentru adâncime, consum și cerințe de întreținere.',
            'Informare despre fonduri: surse oficiale și consultant fiscal/agricol pentru dosar.',
        ],
    },
    {
        id: 'avers-host-fallback',
        hostFragments: ['avers-agro', 'aversagro'],
        summary:
            'Avers-Agro: echipamente pentru lucrări agricole; detaliile tehnice și opțiunile de echipare variază pe modele — folosiți documentația oficială aferentă paginii sursă.',
        bullets: [
            'Verificați în ofertă lufre, consumuri indicative și piese incluse.',
            'Compatibilitate tractată și hidraulică conform specificațiilor producătorului.',
        ],
    },
    {
        id: 'k-factor',
        hostFragments: ['k-factor', 'kfactoreng', 'kfactor-engineering', 'kfe.ro'],
        summary:
            'K-Factor Engineering propune soluții pentru fertilizare și distribuție controlată; potrivirea cu tractorul, tipul de îngrășământ și schema de lucru se confirmă pe fișa tehnică și în consultanță.',
        bullets: [
            'Verificați volum, dozare, reglaje și cerințe de turăție/hidraulic.',
            'Norme de siguranță și transport conform legislației în vigoare.',
            'Sprijin financiar: condiții din ghidurile programelor la momentul aplicării.',
        ],
    },
    {
        id: 'amazone',
        hostFragments: ['amazone'],
        summary:
            'Amazone produce tehnologie de semănat, îngrășăminte și protecția plantelor; configurația utilajului (lățime, tramă, distribuție) definește performanța în câmp.',
        bullets: [
            'Modelul din URL trebuie corelat cu fișa oficială pentru date numerice exacte.',
            'Integrare ISOBUS/GPS: depinde de echipare — verificați lista de opțiuni.',
        ],
    },
    {
        id: 'lucrari-conservative',
        anyTextFragments: ['no-till', 'no till', 'notill', 'strip-till', 'strip till', 'minimum till', 'minimum tillage'],
        summary:
            'Lucrările conservative vizează reducerea perturbării solului. Alegerea utilajului și regimul de lucru depind de rotație, umiditate, textură și echiparea fermei.',
        bullets: [
            'Presiune pe sol și umiditate: influențează patul germinativ — validare în condițiile tale.',
            'Compatibilitate cu fertilizare și tratamente: planificați în ansamblu operațiunile.',
            'Conformitate GAEC / condiții de programe: verificare pe acte normative la data aplicării.',
        ],
    },
    {
        id: 'recoltare-transport',
        anyTextFragments: ['remorca', 'remorcă', 'auflieger', 'kipper', 'dump trailer', 'transport recolta', 'grain trailer'],
        summary:
            'Echipamente pentru transport și manipulare recoltă; sarcinile utile, dimensiunile și sistemele de descărcare diferă între modele. Siguranța rutieră și tractare depinde de tractor și homologare.',
        bullets: [
            'Masa totală admisibilă și sistem de frânare: conform documentației și reglementărilor.',
            'Volumul compartimentului și tipul de descărcare influențează timpul în câmp.',
        ],
    },
];
