/**
 * Texte PDF — Materiale publicitare: ton tehnic, sincer, fără promisiuni nerealiste.
 * Editare centralizată pentru profil, categorii și cadre descriptive.
 */

export type CategoryPdfCopy = {
  paragraphs: string[];
  bullets: string[];
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
    'Lucrăm cu producători recunoscuți la nivel european. Fișele de mai jos nu sunt texte oficiale „copiate” de pe site-uri: sunt sinteze TehnicAgro, pe care le putem completa sau adapta după dialogul cu dumneavoastră și după datele tehnice ale modelului ales.',
};

/** Notă reutilizabilă pe pagina de mărci — fără URL-uri (cerință document comercial) */
export const PDF_BRANDS_SOURCE_NOTE =
  'Pentru documentare internă, echipa folosește și materiale publice ale mărcilor (secțiuni „Despre noi”, fișe PDF tehnice, traduceri). În acest PDF nu listăm adrese web către producători; orice precizare suplimentară o obțineți prin contactul din ultima pagină.';

export const PDF_BRAND_CARDS: { name: string; tagline: string; paragraphs: string[] }[] = [
  {
    name: 'Fliegl Agrartechnik',
    tagline: 'Transport, manipulare recoltă, remorci și logistică după câmp',
    paragraphs: [
      'Fliegl este referință pe piața remorcilor agricole și a soluțiilor de transport: volum util, sisteme de acționare, viteze admise și ergonomie la descărcare variază după linia de model. În selecția noastră orientăm clientul spre combinații tractor–remorcă stabile și conforme uzului din România.',
      'La comandă, verificăm împreună axele, frânele, sistemele hidraulice și compatibilitatea cu masa tractorului dumneavoastră — parametrii „din catalog” trebuie mereu corelați cu fișa de tractare a tractorului.',
    ],
  },
  {
    name: 'Avers-Agro',
    tagline: 'Pregătire sol, lucrări conservative, semănat de precizie',
    paragraphs: [
      'Oferta Avers-Agro acoperă utilaje pentru afânare, tocarea resturilor vegetale și linii de semănat adaptate lucrărilor conservative: semănat direct, mini-till sau strip-till, în funcție de model. Alegerea depinde de structura solului, de nivelul de rest vegetal și de strategia de rotație.',
      'În practică, semănatul direct în miriște cere uniformitate la adâncime, presiune controlată la coute și evitarea compactării locale în urma deschiderii; aceste detalii sunt punctul în care se compară variante între ele, nu doar lățimea de lucru.',
    ],
  },
  {
    name: 'K-Factor Engineering',
    tagline: 'Distribuție îngrășăminte, dozare și control la fertilizare',
    paragraphs: [
      'Soluțiile K-Factor vizează distribuția controlată a îngrășământului și integrarea în lanțul fertilizării de precizie: tipul de material (granule, densitate), lățimea de lucru și debitul trebuie verificate odată cu configurația tractorului.',
      'Combinațiile cu semănători sau cu pregătirea solului se analizează din perspectiva masei totale tractate și a numerelor de hidraulice disponibile pe tractor, astfel încât reglajele să poată fi menținute în toleranțele din manual.',
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
    paragraphs: [
      'Semănatul și fertilizarea de precizie cer uniformitate la sol, dozare controlată și, acolo unde e cazul, corelare cu hărți sau sistem GPS. Produsele din secțiune includ semănători, mașini de împrăștiat îngrășăminte și accesorii aferente.',
      'Semănatul direct în miriște (fără arătură clasică în prealabil) este o tehnică tot mai folosită în cultura mare: reduce pierderile de apă, păstrează structura și sprijină menținerea acoperirii solului conform condiționalităților de mediu, cu condiția respectării normelor de înființare a culturii și a reglajelor utilajului.',
      'Combinația dintre presiune la coute, viteza de mers înainte și calibrarea dozatorului decide uniformitatea în rând; orice compromis se reflectă în ritmul de creștere și poate impune refaceri locale ale rândului.',
    ],
    bullets: [
      'Precizie la dozare și distribuție pe lățimea de lucru',
      'Întreținere și calibrare — conform manualului producătorului',
      'Combinații posibile cu tractoare din clasa de putere recomandată',
      'Compatibilitate tehnică cu lucrările conservative (fără inversarea stratului superficial acolo unde strategia o exclude)',
    ],
    subsections: [
      {
        title: 'Context PAC / eco-scheme și programe naționale (informare generală)',
        paragraphs: [
          'În Uniunea Europeană, Politica Agricolă Comună (PAC) include condiționalități (GAEC) și eco-scheme adresate, printre altele, acoperirii solului și practicilor conservative. În România, plățile aferente se gestionează prin APIA, pe baza cererii unice și a documentației cerute în ghidul campaniei.',
          'Programele cu finanțare nerambursabilă pentru investiții (ex. sesiuni AFIR) se publică ca ghiduri oficiale; tipul de utilaj eligibil, intensitatea ajutorului și termenele depind de sesiune și de categoria de beneficiar. Nu oferim consultanță juridică sau întocmire dosar — putem indica, la cerere, direcția de documentare și corespondența cu fișa tehnică a utilajului din selecția noastră.',
        ],
        bullets: [
          'Eco-schema „agricultură conservativă” (informare PD-04 în datele admin) este relevantă acolo unde practica dumneavoastră îndeplinește condițiile din ghidul APIA — verificare obligatorie înainte de decizie',
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
