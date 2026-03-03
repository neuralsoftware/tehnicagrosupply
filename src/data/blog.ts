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
    id: 'dosar-apia-pd04-pas-cu-pas',
    slug: 'cum-depui-dosarul-apia-pd04-2026',
    title: 'Cum Depui Dosarul APIA PD-04 în 2026: Ghid Pas cu Pas pentru Fermieri',
    excerpt: 'Sesiunea APIA se deschide pe 16 Martie 2026. Află exact ce documente îți trebuie, ce erori te pot costa subvenția și cum utilajele No-Till te scutesc de birocrație inutilă.',
    content: `
      <h2>Sesiunea APIA PD-04 2026 — Ce trebuie să știi înainte de 16 Martie</h2>
      <p>Eco-schema PD-04, dedicată agriculturii conservative, este disponibilă între <strong>16 Martie și 5 Iunie 2026</strong>. Cu 56 EUR/ha disponibili, un fermier cu 200 ha poate încasa peste <strong>56.000 RON</strong> suplimentar față de subvenția de bază.</p>

      <h3>Documente necesare pentru dosarul PD-04</h3>
      <ul>
        <li><strong>Cererea unică de plată</strong> (completată online în aplicația APIA)</li>
        <li><strong>Documente de proprietate/arendă</strong> pentru fiecare parcelă</li>
        <li><strong>Declarație pe proprie răspundere</strong> privind tehnologia utilizată (No-Till, Mini-Till sau Strip-Till)</li>
        <li><strong>Fotografii georeferențiate</strong> ale parcelelor înscrise (recomandat, nu obligatoriu)</li>
        <li><strong>Factură utilaj</strong> sau contract de închiriere utilaj No-Till (pune în dosar legitimitatea tehnologiei)</li>
      </ul>

      <h3>Condiția tehnică esențială: ce utilaje sunt acceptate?</h3>
      <p>PD-04 acceptă exclusiv tehnologii care <strong>nu întorc brazda</strong>. Concret, trebuie să poți demonstra că ai cultivat cu:</p>
      <ul>
        <li>Semănătoare directă (No-Till) — ex. <a href="/utilaje/semanat-fertilizat/green-plains-ads">Avers-Agro Green Plains ADS</a></li>
        <li>Semănătoare cu prelucrare minimă (Mini-Till sau Strip-Till)</li>
      </ul>
      <p>Utilajele de tip grăpat cu discuri clasice (cu arat) <strong>nu îndeplinesc</strong> condiția. Asigură-te că utilajul tău este corect documentat.</p>

      <h3>Cele mai frecvente motive de respingere a dosarului</h3>
      <ol>
        <li>Parcelele nu sunt declarate complet în IPA Online</li>
        <li>Suprapunerea geometrică cu alt fermier (contestare prin satelit)</li>
        <li>Lipsa documentelor de arendă actualizate pentru campania 2026</li>
        <li>Utilizarea unui utilaj neeligibil (cu arat clasic) pe parcelele declarate</li>
      </ol>

      <h3>Cum îți simplificăm noi procesul</h3>
      <p>TehnicAgro Supply oferă consultanță tehnică gratuită pentru documentarea utilajului în dosar. <a href="/#contact">Contactează-ne</a> și îți pregătim un raport tehnic al <a href="/utilaje/semanat-fertilizat/green-plains-ads">semănătorii Avers-Agro</a> valabil ca dovadă pentru inspectorii APIA.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-03-10',
    imageSrc: '/blog/apia-pd04.png',
    category: 'fonduri-europene'
  },
  {
    id: 'no-till-vs-conventional',
    slug: 'semanatoare-no-till-vs-semanatoare-clasica-comparatie',
    title: 'Semănătoare No-Till vs. Semănătoare Clasică: Comparație Reală pentru Fermieri Români',
    excerpt: 'Costuri, consum motorină, randament, eligibilitate APIA — totul comparat obiectiv. Află dacă investiția în No-Till se justifică pentru ferma ta.',
    content: `
      <h2>No-Till vs. Convențional: Întrebarea reală e cât costă fiecare pe hectar</h2>
      <p>Mulți fermieri ezită la tranziția No-Till din cauza costului inițial al utilajului. Dar calculul complet arată o altă realitate.</p>

      <h3>Comparație cost/hectar pe structură tipică (200 ha, grâu)</h3>
      <table>
        <thead><tr><th>Element</th><th>Convențional (arat + discuit + semănat)</th><th>No-Till (o singură trecere)</th></tr></thead>
        <tbody>
          <tr><td>Motorină (L/ha)</td><td>70-90 L</td><td>28-35 L</td></tr>
          <tr><td>Treceri utilaje</td><td>4-5 treceri</td><td>1 trecere</td></tr>
          <tr><td>Uzură utilaje (RON/ha)</td><td>180-220 RON</td><td>60-80 RON</td></tr>
          <tr><td>Forță de muncă</td><td>Ridicată</td><td>Redusă</td></tr>
          <tr><td>Subvenție PD-04</td><td>❌ Neeligibil</td><td>✅ +56 EUR/ha</td></tr>
        </tbody>
      </table>

      <h3>Semănătoarea Avers-Agro Green Plains ADS — specificații tehnice</h3>
      <p>Cea mai versatilă soluție de pe piața românească: <a href="/utilaje/semanat-fertilizat/green-plains-ads">Avers-Agro Green Plains ADS</a> funcționează în No-Till, Mini-Till și convențional — deci tranziția este progresivă, nu bruscă.</p>
      <ul>
        <li>Presiune brăzdar reglabilă până la 190 kg — penetrează orice miriște</li>
        <li>Suspensie paralelogram independent — adâncime constantă indiferent de relief</li>
        <li>Disponibilă în 3 lățimi: 3m (16 brăzdare), 4.1m (22), 6.3m (36)</li>
      </ul>

      <h3>Concluzia practică</h3>
      <p>La 200 ha, trecerea la No-Till generează o economie de 40-50 L motorină/ha (<strong>~32.000-40.000 RON/an</strong>) plus subvenția PD-04 de <strong>~56.000 RON</strong>. Totalul depășește 90.000 RON anual — amortizarea unui utilaj nou în 2-3 ani.</p>
      <p>Calculează exact cât câștigă ferma ta cu <a href="/#audit">calculatorul nostru ROI</a> sau <a href="/#contact">solicită o ofertă</a>.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-03-17',
    imageSrc: '/blog/gaec6-sol.png',
    category: 'tehnologie'
  },
  {
    id: 'dr12-ghid-complet-utilaje',
    slug: 'dr12-ghid-finantare-utilaje-agricole-80-la-suta',
    title: 'DR-12 în 2026: Cum Obții 80% Finanțare Nerambursabilă pentru Utilaje Agricole',
    excerpt: 'Intervenția DR-12 din PNDR oferă până la 200.000 EUR per proiect. Află cine este eligibil, ce utilaje se finanțează și cum evitați erorile care duc la respingere.',
    content: `
      <h2>Ce este Intervenția DR-12?</h2>
      <p>DR-12 (Investiții în Exploatații Agricole) este instrumentul principal de finanțare europeană pentru achiziția de utilaje agricole în România, parte din PNDR 2023-2027. Rata de cofinanțare ajunge la <strong>80%</strong> (65% bază + 15% bonus tineri fermieri sau zone defavorizate).</p>

      <h3>Condiții de eligibilitate — checklist rapid</h3>
      <ul>
        <li>✅ Fermă cu minimum <strong>12.000 EUR producție standard</strong> (calculat pe baza culturilor)</li>
        <li>✅ Activitate agricolă înregistrată (PFA, SRL, SA, asociație)</li>
        <li>✅ Investiție minimă: 5.000 EUR / maximă: <strong>200.000 EUR</strong></li>
        <li>✅ Planul de afaceri demonstrează creșterea viabilității fermei</li>
        <li>❌ Nu se finanțează utilaje second-hand</li>
      </ul>

      <h3>Utilaje eligibile din portofoliul TehnicAgro</h3>
      <ul>
        <li><strong><a href="/utilaje/semanat-fertilizat/green-plains-ads">Semănătoarea Avers-Agro Green Plains ADS</a></strong> — eligibilă categoria „Semănători"</li>
        <li><strong><a href="/utilaje/pregatire-sol/chain-disc-kse-680">Fliegl Chain Disc KSE 680</a></strong> — eligibilă categoria „Utilaje pregătire sol"</li>
        <li><strong><a href="/utilaje/recoltare-logistica/powerbank">K-Factor Powerbank</a></strong> — eligibilă categoria „Remorci agricole"</li>
      </ul>

      <h3>Procesul de aplicare în 5 pași</h3>
      <ol>
        <li>Înregistrare beneficiar pe platforma AFIR</li>
        <li>Redactare Plan de Afaceri (obligatoriu pentru sume >50.000 EUR)</li>
        <li>Obținerea ofertelor de preț (minim 3 comparabile)</li>
        <li>Depunere dosar online pe mysmis.ro</li>
        <li>Achiziție utilaj și decontare după aprobare</li>
      </ol>

      <p>TehnicAgro emite oferta de preț oficială necesară pentru dosarul DR-12. <a href="/#contact">Solicită documentația</a> și te ghidăm prin întregul proces.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-03-24',
    imageSrc: '/blog/fonduri-europene-2026.png',
    category: 'fonduri-europene'
  },
  {
    id: 'greseli-apia-2026',
    slug: 'top-5-greseli-fermieri-apia-2026',
    title: 'Top 5 Greșeli ale Fermierilor la APIA 2026 (și Cum le Eviți)',
    excerpt: 'Aceste 5 erori au costat fermieri români mii de euro în subvenții reduse sau pierdute complet. Verifică dacă ești la risc înainte de sesiunea din Martie.',
    content: `
      <h2>Greșeli costisitoare la APIA 2026 — evită-le înainte de 16 Martie</h2>
      <p>Inspectorii APIA au identificat tipare repetitive de erori în dosarele 2024-2025. Iată cele mai frecvente și cum le eviți.</p>

      <h3>Greșeala #1: Parcelele nu sunt actualizate în IPA Online</h3>
      <p>Dacă ai schimbat terenuri (arendă nouă, cumpărare, modificare suprafață), acestea trebuie actualizate în IPA Online <strong>înainte de depunerea cererii</strong>. Parcelele neactualizate sunt automat respinse la verificarea satelitară.</p>

      <h3>Greșeala #2: Declararea suprafețelor mai mari decât cele reale</h3>
      <p>Sistemul LPIS (satelitar) măsoară suprafețele cu precizie de ±2%. O declarare cu 5% mai mare decât suprafața reală atrage <strong>sancțiuni proporționale</strong> care pot elimina bonus-ul eco-schemei.</p>

      <h3>Greșeala #3: Utilizarea unui utilaj neeligibil pe parcelele PD-04</h3>
      <p>PD-04 impune tehnologie care nu întoarce brazda. Dacă folosești ogorul convențional pe o parcelă declarată No-Till, pierzi integral subvenția PD-04 pentru acea suprafață și riști penalizarea la celelalte subvenții.</p>
      <p><strong>Soluție:</strong> <a href="/utilaje/semanat-fertilizat/green-plains-ads">Semănătoarea Avers-Agro Green Plains ADS</a> este certificată pentru No-Till — poți folosi factura ca dovadă tehnică în dosar.</p>

      <h3>Greșeala #4: Ignorarea standardului GAEC 6</h3>
      <p>GAEC 6 impune acoperirea a 80% din suprafața arabilă în intervalul 15 Iunie – 30 Septembrie. Solul „negru" (neacoperit) în această perioadă duce la <strong>reducerea subvenției de bază</strong>, nu doar a eco-schemelor.</p>
      <p><a href="/utilaje/pregatire-sol/chain-disc-kse-680">Grapa Fliegl Chain Disc KSE 680</a> asigură conformitatea GAEC 6 prin menținerea resturilor vegetale la suprafață.</p>

      <h3>Greșeala #5: Nu depui la timp (sau nu în sesiunea corectă)</h3>
      <p>Sesiunea 2026 se închide pe <strong>5 Iunie 2026</strong>. Depunerile după această dată nu sunt acceptate. Depune înainte de 15 Mai pentru a evita aglomerația sistemelor APIA.</p>

      <p>Ai întrebări despre eligibilitatea fermei tale? <a href="/#contact">Contactează-ne</a> — îți răspundem în 24 de ore.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-04-01',
    imageSrc: '/blog/apia-pd04.png',
    category: 'fonduri-europene'
  },
  {
    id: 'fliegl-kse-680-review',
    slug: 'fliegl-chain-disc-kse-680-review-test-romania',
    title: 'Fliegl Chain Disc KSE 680: Review Tehnic — Ce Face Diferit față de Grapele Clasice',
    excerpt: 'Ce face Chain Disc-ul Fliegl unic față de o grapă cu discuri obișnuită? Analizăm în detaliu specificațiile tehnice, avantajele pentru GAEC 6 și pentru ce tip de fermă este potrivit.',
    content: `
      <h2>Fliegl Chain Disc KSE 680 — de ce nu e o grapă cu discuri obișnuită</h2>
      <p>Denumirea poate induce în eroare: <strong>Chain Disc-ul nu lucrează ca o grapă cu discuri</strong>. Principiul de funcționare este fundamental diferit și acesta este motivul pentru care este eligibil GAEC 6 și celelalte nu sunt.</p>

      <h3>Principiul de funcționare</h3>
      <p>Discurile cu lanțuri (350 mm diametru, oțel călit) <strong>nu intră în sol</strong> — ele mărunțesc resturile vegetale la suprafață și le presează plat, formând un strat continuu de protecție (mulci). Adâncimea de penetrare este zero.</p>
      <p>Comparativ, o grapă cu discuri clasică intră 8-12 cm în sol, răstoarnă parțial brazda și distruge stratul de protecție — exact ceea ce interzice GAEC 6.</p>

      <h3>Specificații tehnice complete</h3>
      <ul>
        <li>Lățime de lucru: <strong>6.8 m</strong></li>
        <li>Randament: până la <strong>12 ha/oră</strong> (la 15-18 km/h)</li>
        <li>Putere necesară: 150-250 CP</li>
        <li>Greutate: 5.700 kg (120-148 kg/m — presiune reglabilă)</li>
        <li>Pliere hidraulică — transport pe drum 3 m lățime</li>
        <li>Prindere: Tirant inferior Cat II/III</li>
      </ul>

      <h3>Pentru ce tip de fermă este optim?</h3>
      <ul>
        <li>✅ Ferme de <strong>peste 100 ha</strong> cu producție de cereale (grâu, floarea-soarelui, porumb)</li>
        <li>✅ Fermieri care vor conformitate GAEC 6 <strong>fără reducerea numărului de treceri</strong></li>
        <li>✅ Combinat cu semănătoarea No-Till Avers-Agro pentru un sistem complet de agricultura conservativă</li>
        <li>❌ Nu este recomandat pentru suprafețe sub 50 ha (costul nu se amortizează rapid)</li>
      </ul>

      <h3>Potrivire cu sistemul TehnicAgro</h3>
      <p>Combinația <a href="/utilaje/pregatire-sol/chain-disc-kse-680">Fliegl KSE 680</a> + <a href="/utilaje/semanat-fertilizat/green-plains-ads">Avers-Agro Green Plains ADS</a> formează un sistem complet de agricultură conservativă: Chain Disc-ul pregătește resturile, semănătoarea No-Till seamănă direct — două treceri în loc de cinci.</p>
      <p><a href="/#contact">Solicită o demonstrație tehnică</a> sau <a href="/#audit">calculează ROI-ul</a> pentru ferma ta.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-04-15',
    imageSrc: '/blog/gaec6-sol.png',
    category: 'tehnologie'
  },
  {
    id: 'economii-motorina-no-till',
    slug: 'economii-motorina-no-till-calcul-real-100-hectare',
    title: 'Economii Motorină cu No-Till: Calcul Real pe 100 Hectare (Cu Cifre Verificabile)',
    excerpt: 'Nu cifre de marketing — calcul real, pe culturi specifice, la prețul actual al motorinei. Cât economisești concret dacă renunți la asolament convențional.',
    content: `
      <h2>Câtă motorină consumă fermierii fără No-Till?</h2>
      <p>Sistemul convențional (plugărit + discuit + semănat) implică 4-5 treceri pe teren. La prețul actual al motorinei agricole (~5.5 RON/litru), diferența față de No-Till este semnificativă.</p>

      <h3>Consumuri reale per cultură (date medii validate agronomic)</h3>
      <table>
        <thead>
          <tr><th>Cultură</th><th>Convențional (L/ha)</th><th>No-Till (L/ha)</th><th>Economie (L/ha)</th><th>Economie la 100 ha (RON)</th></tr>
        </thead>
        <tbody>
          <tr><td>Grâu de toamnă</td><td>75 L</td><td>30 L</td><td>45 L</td><td>24.750 RON</td></tr>
          <tr><td>Floarea-soarelui</td><td>80 L</td><td>32 L</td><td>48 L</td><td>26.400 RON</td></tr>
          <tr><td>Porumb</td><td>90 L</td><td>35 L</td><td>55 L</td><td>30.250 RON</td></tr>
          <tr><td>Rapiță</td><td>70 L</td><td>28 L</td><td>42 L</td><td>23.100 RON</td></tr>
        </tbody>
      </table>
      <p><em>Calcul la 5.5 RON/litru motorină agricolă (media 2025-2026)</em></p>

      <h3>Beneficiul total la 100 ha cu structură mixtă (grâu 50% + floarea-soarelui 50%)</h3>
      <ul>
        <li>Economie motorină: <strong>~25.500 RON/an</strong></li>
        <li>Reducere forță de muncă (mai puțini angajați sezonieri): <strong>~8.000 RON/an</strong></li>
        <li>Subvenție APIA PD-04: <strong>~28.140 RON/an</strong> (56 EUR x 100 ha x 5.025 RON/EUR)</li>
        <li>Reducere uzură tractor (mai puține ore motor): <strong>~5.000 RON/an</strong></li>
      </ul>
      <p><strong>Total beneficiu anual estimat: 66.640 RON / 100 ha</strong></p>

      <h3>Utilizajul recomandat pentru aceste economii</h3>
      <p><a href="/utilaje/semanat-fertilizat/green-plains-ads">Semănătoarea Avers-Agro Green Plains ADS</a> este soluția care face posibil acest scenariu. Sistemul de suspensie paralelogram asigură adâncimea constantă chiar și în soluri dificile — condiție esențială pentru răsărirea uniformă în No-Till.</p>
      <p>Calculează exact pentru ferma ta cu <a href="/#audit">Calculatorul ROI TehnicAgro</a>.</p>
    `,
    author: 'Echipa TehnicAgro',
    date: '2026-05-01',
    imageSrc: '/blog/fonduri-europene-2026.png',
    category: 'tehnologie'
  },

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

/**
 * Returnează doar articolele cu data publicării <= azi.
 * Folosește ACEASTĂ funcție în paginile publice, nu BLOG_POSTS direct.
 * Paginile cu revalidate=3600 vor afișa articolele automat la data programată.
 */
export function getPublishedPosts(): BlogPost[] {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Include toată ziua curentă
  return BLOG_POSTS.filter(post => new Date(post.date) <= today);
}

