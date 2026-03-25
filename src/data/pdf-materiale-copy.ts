/**
 * Texte PDF — Materiale publicitare: ton tehnic, sincer, fără promisiuni nerealiste.
 * Editare centralizată pentru profil, categorii și cadre descriptive.
 */

export type CategoryPdfCopy = {
  paragraphs: string[];
  bullets: string[];
  /** Titlu secțiune avantaje (dacă există bullets) */
  advantagesSectionTitle?: string;
  /** Avantaje evidențiate (subliniate în PDF) — ex. semănat în miriște */
  advantageBullets?: string[];
  /** Subsecțiuni opționale — umplu pagina de categorie (ex. tehnica solului + cadrul programe) */
  subsections?: { title: string; paragraphs: string[]; bullets?: string[] }[];
};

export const PDF_COMPANY = {
  title: 'TehnicAgro Supply — partener de selecție tehnică pentru mecanizare agricolă',
  lead:
    'Operăm ca furnizor și integrator de soluții sub marca TehnicAgro Supply: evaluăm contextul dumneavoastră (cultură, sol, flux de lucru, infrastructură), sintetizăm informația tehnică relevantă din catalog și din documentația mărcilor și propunem variante de echipamente operaționale. Lucrăm structurat (telefon, e-mail, documente); parametrii concreți de teren îi stabilim după datele pe care ni le furnizați.',
  p2:
    'Nu întocmim și nu depunem dosare APIA sau AFIR în numele clientului. Putem indica, în linii mari, cadrul public de eligibilitate și sursele oficiale (ghiduri, site-uri APIA/AFIR), astfel încât să vă orientați singur sau cu consultantul dumneavoastră autorizat.',
  p3:
    'Garanție și service se fac conform politicilor mărcii și ale importatorului. Echipa noastră vă sprijină cu informații, oferte și comenzi de piese în programul obișnuit de lucru (luni–vineri, interval orar comunicat la contact), nu ca „urgență 24/7”.',
  bullets: [
    'Fișe tehnice și compararea variantelor, înainte de decizia de achiziție',
    'Portofoliu de mărci consacrate, prezentat exclusiv în forma și tonul TehnicAgro Supply',
    'Transparență: ce rezultă din datele tehnice, ce depinde de teren, norme și practică',
  ],
  closing:
    'Paginile următoare prezintă categoriile și produsele din această selecție. Conținutul este redactat și structurat de TehnicAgro Supply pe baza documentației tehnice și a configurării din catalogul nostru.',
};

export const PDF_BRANDS_INTRO = {
  title: 'Portofoliu mărci — în selecția TehnicAgro Supply',
  lead:
    'Producători incluși în oferta comercială TehnicAgro Supply. Fișele sunt sinteze redactionale pentru acest document; pot fi completate din datele tehnice ale modelului comandat sau din corespondența cu echipa noastră.',
};

/** Notă la finalul broșurii (ultima pagină) — fără URL-uri în PDF */
export const PDF_DOCUMENTATION_NOTE =
  'Documentare și completări: informațiile din broșură pot fi aprofundate din fișe tehnice și materiale publice ale mărcilor. În acest PDF nu sunt listate adrese web ale producătorilor; pentru clarificări, folosiți datele de pe ultima pagină.';

export const PDF_BRAND_CARDS: { name: string; tagline: string; paragraphs: string[] }[] = [
  {
    name: 'Fliegl Agrartechnik',
    tagline: 'Utilaje pentru sol și miriște — grapă lanț-disc, pregătire pat germinativ',
    paragraphs: [
      'Fliegl Agrartechnik este recunoscut la nivel european pentru soluții de mecanizare agricolă. În segmentul de lucrat solul, gama include utilaje cu lanțuri de discuri destinate tocării și nivelării miriștii, refacerii patului germinativ, fragmentării resturilor vegetale și menținerii stratului superficial fără arătură inversă profundă acolo unde strategia agronomică permite. Parametrii operaționali (greutate pe metru liniar, viteză, reglaje hidraulice) se dimensionează în funcție de tipul de sol, umiditate și cantitatea de biomasă rămasă după recoltă.',
      'Pe lângă cultivatoare și grapă lanț-disc, portofoliul Fliegl acoperă și echipamente de transport și logistică în lanțul post-recoltă. În această broșură accentul rămâne pe tehnologia de gestionare a solului și a miriștii (ex. grapă cu lanțuri de discuri / disc chain harrow), aliniată cerințelor de acoperire a solului și practicilor conservative.',
    ],
  },
  {
    name: 'Avers-Agro',
    tagline: 'Pregătire sol, lucrări conservative, semănat de precizie',
    paragraphs: [
      'Avers-Agro oferă utilaje pentru afânare, prelucrarea resturilor vegetale și semănători pentru agricultură conservativă: semănat direct, mini-till sau strip-till, în funcție de configurație. Alegerea tehnică ține de structura solului, de nivelul de rest vegetal și de rotația culturilor.',
      'Semănatul direct în miriște solicită adâncime uniformă, presiune controlată pe brăzdar și evitarea compactării locale în urma deschiderii; aceste criterii diferențiază variantele de echipament mai mult decât simpla lățime de lucru.',
    ],
  },
  {
    name: 'K-Factor',
    tagline: 'Bunkere de câmp — logistică între combina, câmp și transport',
    paragraphs: [
      'K-Factor (Ucraina) produce bunkere de reîncărcare și stocare temporară („BOOSTER”, „POWERBANK” și serii conexe), destinate fluxului combina–câmp–transport: reducerea timpilor morți, menținerea ritmului de recoltă și protejarea calității recoltei. În document se prezintă acest segment logistic, distinct de echipamentele de aplicare a îngrășămintelor.',
      'Volumul util, sistemul de descărcare și compatibilitatea cu tractorul sau cu liniile din fermă se stabilesc din fișa modelului și din masa antrenată — configurația concretă din selecția TehnicAgro Supply se validează la ofertare.',
    ],
  },
];

/** Conținut extins pe slug categorie (cheie = product.category din catalog) */
export const PDF_CATEGORY_COPY: Record<string, CategoryPdfCopy> = {
  'pregatire-sol': {
    paragraphs: [
      'Pregătirea solului influențează structura patului germinativ, tasarea și pierderile de apă. În această secțiune sunt incluse grape, discuri, cultivatoare și alte unelte pentru arat, afânare și lucrări conservative (ex. no-till, strip-till), în funcție de oferta selectată.',
      'Alegerea lățimii de lucru, tipului de organ activ și a tracțiunii necesare se face în raport cu solul, cultura și planul de lucru — nu există un singur „utilaj universal”.',
    ],
    bullets: [
      'Compatibilitate între lățime de lucru, putere tractor și tip de sol',
      'Impact asupra resturilor vegetale (GAEC, acoperire sol) unde este cazul',
      'Consum de combustibil și viteza de lucru — date orientative din documentație',
    ],
  },
  'semanat-fertilizat': {
    advantagesSectionTitle: 'Avantaje — semănat direct în miriște',
    paragraphs: [
      'Semănatul și fertilizarea de precizie cer uniformitate la sol, dozare controlată și, acolo unde este cazul, corelare cu hărți sau GPS. Produsele din secțiune includ semănători, mașini de împrăștiat îngrășăminte și accesorii.',
      'Semănatul direct în miriște (fără arătură clasică în prealabil) se răspândește în cultura mare: limitează pierderile de apă, păstrează structura și sprijină acoperirea solului conform condiționalităților de mediu, cu respectarea normelor de înființare și a reglajelor utilajului.',
      'Uniformitatea în rând depinde în mod decisiv de presiunea pe brăzdar, de viteza înaintării și de calibrarea dozatorului; abaterile se reflectă în ritmul de creștere și pot impune intervenții locale pe rând.',
    ],
    advantageBullets: [
      'Mai puține treceri mecanizate și economie de combustibil față de sistemele cu arat clasic repetat',
      'Conservarea apei și a structurii solului; limitarea erodării și a tasării excesive',
      'Menținerea resturilor vegetale la suprafață — utilă pentru cerințe de mediu și eco-scheme',
      'Trecere progresivă spre un sistem cu mai puțină perturbare a stratului arabil',
      'Potrivire cu semănători și fertilizare de precizie când reglajele sunt menținute în toleranță',
    ],
    bullets: [
      'Precizie la dozare și distribuție pe lățimea de lucru',
      'Întreținere și calibrare — conform manualului producătorului',
      'Combinații posibile cu tractoare din clasa de putere recomandată',
      'Compatibilitate tehnică cu lucrările conservative fără inversarea stratului superficial acolo unde strategia o exclude',
    ],
    subsections: [
      {
        title: 'Context PAC / eco-scheme și programe naționale (informare generală)',
        paragraphs: [
          'În Uniunea Europeană, Politica Agricolă Comună (PAC) include condiționalități (GAEC) și eco-scheme adresate, printre altele, acoperirii solului și practicilor conservative. În România, plățile aferente se gestionează prin APIA, pe baza cererii unice și a documentației cerute în ghidul campaniei.',
          'Programele cu finanțare nerambursabilă pentru investiții (ex. sesiuni AFIR) se publică ca ghiduri oficiale; tipul de utilaj eligibil, intensitatea ajutorului și termenele depind de sesiune și de categoria de beneficiar. Nu oferim consultanță juridică sau întocmire dosar — putem indica, la cerere, direcția de documentare și corespondența cu fișa tehnică a utilajului din selecția noastră.',
        ],
        bullets: [
          'Eco-schema „agricultură conservativă” (informare PD-04 în datele admin) este relevantă acolo unde practica îndeplinește condițiile din ghidul APIA — verificare obligatorie înainte de decizie',
          'Orice sumă sau prag menționat pe o fișă de produs este orientativ; valori definitive doar în actele oficiale ale schemei pentru anul de campanie',
        ],
      },
    ],
  },
  'recoltare-logistica': {
    paragraphs: [
      'După recoltare, transportul și manipularea recoltei influențează pierderile și timpul de întoarcere în câmp. Echipamentele propuse acoperă remorci agricole, sisteme de descărcare și soluții conexe, în funcție de stoc și disponibilitate.',
      'Capacitatea utilă, viteza admisă și compatibilitatea cu tractorul trebuie verificate pentru fiecare combinație tractor–remorcă.',
    ],
    bullets: [
      'Capacitate de încărcare și stabilitate la transport',
      'Timp de descărcare și compatibilitate cu fluxul din fermă',
      'Norme de întreținere pentru osii, frâne și sisteme hidraulice',
    ],
  },
  'protectia-plantelor': {
    paragraphs: [
      'Echipamentele de protecția plantelor trebuie să asigure uniformitate la dozare și respectarea normelor de aplicare. Produsele listate pot include stropitori și accesorii; tipul exact depinde de configurația din catalog.',
    ],
    bullets: [
      'Lățime de lucru și volum rezervoar față de suprafața tratată',
      'Filtrare, duze și calibrare — conform manualului',
      'Respectarea legislației fitosanitare rămâne în sarcina utilizatorului',
    ],
  },
  viticol: {
    paragraphs: [
      'Utilajele pentru viticultură sunt adaptate rândurilor înguste, pantelor și tipului de lucrări (tăieri, tratamente, recoltă unde e cazul). Secțiunea reunește echipamente relevante pentru livrarea selectată.',
    ],
    bullets: [
      'Gabarit și rază de întoarcere adaptate plantației',
      'Tracțiune și stabilitate pe versanți',
    ],
  },
  legumicol: {
    paragraphs: [
      'Pentru legumicultură, lățimi de lucru reduse și protecția solului sunt adesea critice. Produsele incluse vizează lucrări specifice culturilor de legume din oferta curentă.',
    ],
    bullets: [
      'Adaptare la soluri ușoare sau rețele de irigații unde e cazul',
      'Combinații cu tractoare de putere moderată',
    ],
  },
};

export function getCategoryPdfCopy(slug: string): CategoryPdfCopy {
  const known = PDF_CATEGORY_COPY[slug];
  if (known) return known;
  return {
    paragraphs: [
      'Această secțiune grupează produsele din categoria selectată în catalog. Detaliile tehnice și fotografiile corespund datelor salvate pentru fiecare articol.',
      'Pentru întrebări punctuale (compatibilitate, opționale, termen de livrare), folosiți datele de contact din ultima pagină.',
    ],
    bullets: [
      'Verificați fișa fiecărui model înainte de comandă',
      'Specificațiile pot fi actualizate de producător fără notificare prealabilă pe broșură tipărită',
    ],
  };
}
