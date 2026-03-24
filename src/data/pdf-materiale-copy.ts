/**
 * Texte PDF — Materiale publicitare: ton tehnic, sincer, fără promisiuni nerealiste.
 * Editare centralizată pentru profil, categorii și cadre descriptive.
 */

export const PDF_COMPANY = {
  title: 'TehnicAgro Supply — echipamente agricole, pe bază de date tehnice',
  lead:
    'Selectăm și propunem utilaje în funcție de cerințele dumneavoastră, de documentația producătorilor și de bunele practici din mecanizarea agricolă. Comunicarea este, în principal, la distanță (telefon, e-mail); detaliile de teren le stabilim pe baza informațiilor pe care ni le transmiteți și a specificațiilor tehnice.',
  p2:
    'Nu întocmim și nu depunem dosare APIA sau AFIR în numele clientului. Putem indica, în linii mari, cadrul public de eligibilitate și sursele oficiale (ghiduri, site-uri APIA/AFIR), astfel încât să vă orientați singur sau cu consultantul dumneavoastră autorizat.',
  p3:
    'Intervențiile în garanție și service-ul în rețea se fac conform procedurilor producătorului. Echipa noastră vă sprijină cu informații, oferte și comenzi de piese în programul obișnuit de lucru (luni–vineri, în intervalul orar comunicat la contact), nu ca „urgență 24/7”.',
  bullets: [
    'Fișe tehnice, compararea variantelor de echipament și clarificări înainte de achiziție',
    'Legături cu producători recunoscuți și acces la documentație actualizată',
    'Transparență asupra limitelor: ce știm din catalog, ce depinde de teren și de reglementări',
  ],
  closing:
    'Paginile următoare prezintă categoriile și produsele incluse în acest catalog; specificațiile provin din datele introduse în sistem și din documentația producătorului.',
};

export const PDF_BRANDS_INTRO = {
  title: 'Producători din portofoliu',
  lead:
    'Colaborăm cu mărci cu istoric în mecanizare agricolă. Descrierile de mai jos sintetizează domeniul principal al fiecărei mărci; detaliile concrete (modele, opționale, garanție) sunt pe fișa fiecărui produs.',
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
