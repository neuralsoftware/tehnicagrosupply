export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageSrc: string;
  category: 'fonduri-europene' | 'tehnologie' | 'noutati';
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'subventia-apia-pd-04',
    slug: 'subventia-apia-pd-04-ghid-complet',
    title: 'Subvenția APIA PD-04: Cum primești 56 EUR/ha pentru No-Till',
    excerpt: 'Află cerințele tehnice pentru eco-schema PD-04 și cum poți transforma ferma ta într-o exploatație profitabilă și sustenabilă.',
    content: `
      <h2>Ce este Eco-schema PD-04?</h2>
      <p>Eco-schema PD-04 (Practici agricole benefice pentru mediu aplicabile pe terenul arabil) este una dintre cele mai atractive forme de sprijin pentru fermierii români care adoptă agricultura conservativă.</p>
      
      <h3>Cerințe principale:</h3>
      <ul>
        <li>Utilizarea tehnologiilor No-Till, Mini-Till sau Strip-Till.</li>
        <li>Menținerea resturilor vegetale la suprafața solului.</li>
        <li>Interdicția arăturii clasice cu răsturnarea brazdei.</li>
      </ul>

      <p>Utilajele precum semănătoarea <strong>Avers-Agro Green Plains</strong> sunt special concepute pentru a îndeplini aceste criterii, asigurând în același timp o răsărire uniformă.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-02-15',
    imageSrc: '/blog/apia-pd04.png',
    category: 'fonduri-europene'
  },
  {
    id: 'gaec-6-protectia-solului-2026',
    slug: 'gaec-6-ghid-protectia-solului-tehnologie-no-till',
    title: 'GAEC 6 în 2026: Ghidul Fermierului pentru Protecția Solului și Subvenții Maxime',
    excerpt: 'Află cum să îndeplinești noul standard GAEC 6 privind acoperirea minimă a solului de 80% și cum tehnologia No-Till te salvează de sancțiunile APIA.',
    content: `
      <h2>Ce reprezintă standardul GAEC 6?</h2>
      <p>Standardul GAEC 6 (Condiții Agricole și de Mediu Bune) impune protejarea solurilor în perioadele cele mai sensibile ale anului. Pentru campania 2026, cerința principală este menținerea unei <strong>acoperiri minime a solului de cel puțin 80%</strong> din suprafața arabilă a fermei în intervalul 15 iunie – 30 septembrie.</p>
      
      <h3>De ce este critică această perioadă?</h3>
      <p>Intervalul de vară este marcat de temperaturi extreme și deficit de precipitații. Solul neacoperit ("negru") pierde rapid umiditatea și este expus eroziunii eoliene. Menținerea miriștii și a resturilor vegetale funcționează ca un scut termic, reducând temperatura la nivelul solului cu până la 10-15 grade Celsius.</p>

      <h3>Cum te ajută tehnologia TehnicAgro să te conformezi?</h3>
      <ul>
        <li><strong>Semănătoarele Avers-Agro Green Plains:</strong> Permit înființarea culturilor direct în miriște (No-Till), fără a deranja stratul protector de resturi vegetale.</li>
        <li><strong>Fliegl Chain Disc:</strong> Ideal pentru gestionarea resturilor vegetale și a culturilor verzi prin tăiere și zdrobire superficială, fără a răsturna brazda – practică permisă sub normele GAEC 6.</li>
      </ul>

      <h3>Avantaje financiare directe</h3>
      <p>Pe lângă evitarea sancțiunilor APIA (care pot reduce subvenția de bază), fermierii care adoptă aceste tehnologii pot accesa <strong>Eco-schema PD-04</strong>, primind plăți suplimentare de aproximativ 60 EUR/ha pentru practici de agricultură conservativă.</p>

      <p>Tranziția către No-Till nu este doar o obligație legală, ci o strategie de reziliență în fața schimbărilor climatice.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-02-23',
    imageSrc: '/blog/gaec6-sol.png',
    category: 'tehnologie'
  },
  {
    id: 'fonduri-europene-utilaje-agricole-2026',
    slug: 'fonduri-europene-utilaje-agricole-2026',
    title: 'Fonduri Europene pentru Utilaje Agricole 2026: Ghid Complet DR-12 și Eco-Scheme',
    excerpt: '501 milioane EUR disponibile pentru fermierii români în 2026. Află cum accesezi finanțarea de până la 80% pentru achiziția de utilaje agricole prin DR-12 și eco-schemele APIA.',
    content: `
      <h2>Finanțări Record pentru Agricultură în 2026</h2>
      <p>Anul 2026 aduce oportunități fără precedent pentru fermierii români. Conform datelor oficiale MADR, valoarea totală a fondurilor europene pentru investiții în agricultură depășește <strong>501 milioane EUR</strong> doar în primele două luni ale anului.</p>

      <h3>1. Intervenția DR-12: Investiții în Exploatații Agricole</h3>
      <p>DR-12 este principalul instrument de finanțare pentru achiziția de utilaje agricole:</p>
      <ul>
        <li><strong>Rata de finanțare:</strong> Până la 80% din valoarea investiției (65% rată de bază + 15% bonus pentru tineri fermieri sau zone defavorizate)</li>
        <li><strong>Valoare maximă grant:</strong> 200.000 EUR per proiect</li>
        <li><strong>Eligibil:</strong> Tractoare, semănătoare, grape, remorci, sisteme de recoltare</li>
        <li><strong>Condiție cheie:</strong> Ferma trebuie să aibă minimum 12.000 EUR producție standard</li>
      </ul>

      <h3>2. Eco-Schema PD-04: Subvenție Anuală de 56 EUR/ha</h3>
      <p>Independent de DR-12, fermierii care adoptă practici No-Till pot încasa anual:</p>
      <ul>
        <li><strong>56,28 EUR/ha</strong> (cuantum confirmat 2026, maxim posibil 73 EUR/ha)</li>
        <li>Termen depunere: <strong>16 Martie – 5 Iunie 2026</strong></li>
        <li>Condiții: Semănat direct, menținerea resturilor vegetale</li>
      </ul>

      <h3>3. GAEC 6: Obligații și Beneficii</h3>
      <p>Standardul GAEC 6 impune acoperirea a 80% din teren în iunie-septembrie. Utilajele care nu răstoarnă brazda (grape cu lanțuri, semănătoare directe) asigură conformitatea automată.</p>

      <h3>Cum Te Ajută TehnicAgro</h3>
      <p>Portofoliul nostru include utilaje eligibile pentru toate programele menționate:</p>
      <ul>
        <li><strong>Avers-Agro Green Plains ADS:</strong> Semănătoare No-Till eligibilă PD-04 și DR-12</li>
        <li><strong>Fliegl Chain Disc KSE 680:</strong> Soluție GAEC 6 eligibilă DR-12</li>
        <li><strong>K-Factor Powerbank & Booster:</strong> Remorci de transbordare pentru eficientizarea recoltării</li>
      </ul>

      <p>Contactează-ne pentru a primi un <strong>raport personalizat</strong> cu calculul subvențiilor și economiilor pentru ferma ta.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-02-24',
    imageSrc: '/blog/fonduri-europene-2026.png',
    category: 'fonduri-europene'
  }
];
