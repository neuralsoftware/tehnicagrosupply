/**
 * Texte PDF — Materiale publicitare: ton tehnic, sincer, fără promisiuni nerealiste.
 * Editare centralizată pentru profil, categorii și cadre descriptive.
 */

export const PDF_COMPANY = {
  title: 'TehnicAgro Supply — selecție tehnică și documentație pentru mecanizare agricolă',
  lead:
    'Lucrăm sub marca TehnicAgro Supply: analizăm nevoile dumneavoastră, sintetizăm informațiile tehnice relevante și propunem echipamente aliniate la exploatație și la reglementările în vigoare. Comunicarea este în principal la distanță (telefon, e-mail); parametrii de teren îi clarificăm pe baza datelor pe care ni le transmiteți.',
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
    'Mărcile enumerate mai jos sunt prezente în oferta noastră. Descrierile sunt sintetizate de echipa TehnicAgro Supply după domeniul lor principal; nu reprezintă site-uri oficiale ale producătorilor.',
};

/** Conținut extins pe slug categorie (cheie = product.category din catalog) */
export const PDF_CATEGORY_COPY: Record<
  string,
  { paragraphs: string[]; bullets: string[] }
> = {
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
      'Setările (densitate, distanțe între rânduri, tip fertilizant) depind de cultură și de normele tehnice ale campaniei.',
    ],
    bullets: [
      'Precizie la dozare și distribuție pe lățimea de lucru',
      'Întreținere și calibrare — conform manualului producătorului',
      'Combinații posibile cu tractoare din clasa de putere recomandată',
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

export function getCategoryPdfCopy(slug: string): { paragraphs: string[]; bullets: string[] } {
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
