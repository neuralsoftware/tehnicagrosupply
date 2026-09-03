# Registrul activităților de prelucrare a datelor cu caracter personal

**Operator:** TEHNICAGRO SUPPLY S.R.L.
**Sediu social:** Șos. Tulcei nr. 69A, Ap. BIR. 1, Sat Lumina, jud. Constanța, cod 907175
**CUI:** RO52736574 · **Nr. Reg. Comerțului:** J2025080370001
**Contact pentru protecția datelor:** tehnicagro.supply@gmail.com · 0723 380 022

**Versiunea 2026-09-03** · Întocmit conform art. 30 din Regulamentul (UE) 2016/679

> Generat automat din codul aplicației. Nu edita direct acest fișier: modifică
> `src/data/gdpr-registru.ts` sau `src/data/gdpr-processors.ts` și rulează `npm run export-gdpr`.

---

## Mențiuni preliminare

Societatea **nu a desemnat un responsabil cu protecția datelor (DPO)**. Nu se încadrează în
niciunul dintre cazurile prevăzute la art. 37 alin. (1): nu este autoritate publică,
activitatea principală nu constă în monitorizarea sistematică pe scară largă a persoanelor
și nu prelucrează pe scară largă categorii speciale de date.

Societatea **nu efectuează prelucrări care necesită o evaluare a impactului** (art. 35): nu
face profilare cu efecte juridice, nu prelucrează categorii speciale de date pe scară largă
și nu monitorizează sistematic spații accesibile publicului.

Societatea **nu ia decizii automate** în sensul art. 22.

---

## Activitățile de prelucrare


### A1. Cereri de ofertă primite prin site

| | |
| --- | --- |
| **Scopul prelucrării** | Preluarea cererilor trimise din formularele de contact și de pe paginile de produs, întocmirea ofertei și purtarea discuțiilor comerciale premergătoare unui contract. |
| **Temeiul legal** | Art. 6 alin. (1) lit. b — demersuri precontractuale la cererea persoanei vizate |
| **Categorii de persoane vizate** | Fermieri, administratori de exploatații agricole, reprezentanți ai societăților agricole |
| **Categorii de date** | Nume, telefon, email, județ, CUI/CIF, suprafața fermei, culturi, orizont de investiție, conținutul mesajului |
| **Categorii de destinatari** | Personalul propriu de vânzări; Supabase (găzduire bază de date); Vercel (găzduire site) |
| **Transferuri în afara SEE** | Nu se efectuează |
| **Termen de ștergere** | 3 ani de la ultimul contact (art. 2517 Cod civil — termenul general de prescripție) |
| **Măsuri de securitate** | Transmisie criptată HTTPS; acces la baza de date doar cu chei de serviciu păstrate pe server; limitare a numărului de cereri pe adresă IP; jurnalizarea accesului |


### A2. Rapoarte de audit generate din calculatorul ROI

| | |
| --- | --- |
| **Scopul prelucrării** | Calcularea beneficiului estimat pentru ferma solicitantului și transmiterea raportului pe email, la cererea acestuia. |
| **Temeiul legal** | Art. 6 alin. (1) lit. b — demersuri precontractuale la cererea persoanei vizate |
| **Categorii de persoane vizate** | Fermieri care completează calculatorul de pe site |
| **Categorii de date** | Nume, email, telefon, județ, hectare, culturi, valorile economice calculate |
| **Categorii de destinatari** | Personalul propriu; Supabase; Vercel; Google Ireland Limited (Gmail, pentru expediere) |
| **Transferuri în afara SEE** | Google — SUA, în baza clauzelor contractuale standard și a Cadrului transatlantic de confidențialitate a datelor |
| **Termen de ștergere** | 3 ani de la ultimul contact |
| **Măsuri de securitate** | HTTPS; limitare la 3 rapoarte pe oră pe adresă IP; conținutul emailului nu include date sensibile |


### A3. Comunicări comerciale (marketing direct)

| | |
| --- | --- |
| **Scopul prelucrării** | Transmiterea de oferte, noutăți despre utilaje și invitații la demonstrații, exclusiv către persoanele care au bifat acordul separat. |
| **Temeiul legal** | Art. 6 alin. (1) lit. a — consimțământ; art. 12 din Legea 506/2004 |
| **Categorii de persoane vizate** | Persoane care și-au dat acordul explicit prin formularele site-ului |
| **Categorii de date** | Nume, email, telefon |
| **Categorii de destinatari** | Personalul propriu; Google Ireland Limited (Gmail) |
| **Transferuri în afara SEE** | Google — SUA, clauze contractuale standard + EU–US Data Privacy Framework |
| **Termen de ștergere** | Până la retragerea acordului; reconfirmare la maximum 24 de luni. Dovada refuzului sau a retragerii se păstrează 3 ani. |
| **Măsuri de securitate** | Fiecare mesaj conține modalitatea de dezabonare; evidența acordurilor în registru dedicat |


### A4. Măsurarea traficului pe site

| | |
| --- | --- |
| **Scopul prelucrării** | Înțelegerea modului în care este folosit site-ul, pentru îmbunătățirea conținutului și a structurii. |
| **Temeiul legal** | Art. 6 alin. (1) lit. a — consimțământ pentru categoria „Analiză” |
| **Categorii de persoane vizate** | Vizitatorii site-ului care acceptă categoria „Analiză” |
| **Categorii de date** | Adresă IP, tip de browser și dispozitiv, pagini vizitate, durata vizitei |
| **Categorii de destinatari** | Google Ireland Limited (Google Analytics); Microsoft Ireland Operations Limited (Clarity) |
| **Transferuri în afara SEE** | SUA — clauze contractuale standard + EU–US Data Privacy Framework |
| **Termen de ștergere** | Maximum 14 luni în Google Analytics; conform setărilor implicite Clarity |
| **Măsuri de securitate** | Scripturile nu se încarcă înainte de consimțământ; Google Consent Mode v2 pornește cu toate categoriile refuzate |


### A5. Publicitate online și măsurarea conversiilor

| | |
| --- | --- |
| **Scopul prelucrării** | Măsurarea rezultatelor campaniilor plătite și afișarea de anunțuri relevante persoanelor care au vizitat site-ul. |
| **Temeiul legal** | Art. 6 alin. (1) lit. a — consimțământ pentru categoria „Marketing” |
| **Categorii de persoane vizate** | Vizitatorii site-ului care acceptă categoria „Marketing” |
| **Categorii de date** | Identificatori de click (gclid), parametri de campanie (UTM), pagina de proveniență, evenimente de navigare |
| **Categorii de destinatari** | Google Ireland Limited (Google Ads); Meta Platforms Ireland Limited (Meta Pixel) |
| **Transferuri în afara SEE** | SUA — clauze contractuale standard + EU–US Data Privacy Framework |
| **Termen de ștergere** | Maximum 24 de luni |
| **Măsuri de securitate** | Scripturile se injectează doar după consimțământ; clipurile video rulează pe youtube-nocookie.com |


### A6. Registrul dovezilor de consimțământ

| | |
| --- | --- |
| **Scopul prelucrării** | Păstrarea dovezii că o persoană și-a dat sau și-a refuzat acordul, cu textul exact afișat la acel moment. |
| **Temeiul legal** | Art. 7 alin. (1) coroborat cu art. 5 alin. (2) — obligația de a demonstra consimțământul |
| **Categorii de persoane vizate** | Persoanele care completează formularele site-ului |
| **Categorii de date** | Identificatorul clientului sau al lead-ului, email, telefon, scopul, răspunsul (da/nu), textul afișat, versiunea politicii, hash al adresei IP, tipul de browser |
| **Categorii de destinatari** | Personalul propriu; Supabase |
| **Transferuri în afara SEE** | Nu se efectuează |
| **Termen de ștergere** | 3 ani după încetarea prelucrării la care se referă consimțământul |
| **Măsuri de securitate** | Tabel cu acces restricționat, disponibil doar cheii de serviciu; adresa IP se păstrează exclusiv sub formă de hash, niciodată în clar; înregistrările nu se modifică, se adaugă altele noi |


### A7. Securitatea site-ului

| | |
| --- | --- |
| **Scopul prelucrării** | Protejarea formularelor împotriva trimiterilor automate și a tentativelor de abuz asupra interfețelor tehnice. |
| **Temeiul legal** | Art. 6 alin. (1) lit. f — interes legitim în securitatea și disponibilitatea serviciului |
| **Categorii de persoane vizate** | Toți vizitatorii site-ului |
| **Categorii de date** | Adresă IP, momentul cererii |
| **Categorii de destinatari** | Nimeni în afara firmei; datele rămân în memoria serverului |
| **Transferuri în afara SEE** | Nu se efectuează |
| **Termen de ștergere** | 15 minute — fereastra de limitare a cererilor; nu se scriu în baza de date |
| **Măsuri de securitate** | Contorizare în memorie, fără persistare; antete de securitate HTTP (CSP, HSTS) |


### A8. Gestiunea relației cu clienții (CRM)

| | |
| --- | --- |
| **Scopul prelucrării** | Urmărirea discuțiilor comerciale, a sarcinilor și a istoricului de contact pentru fiecare client sau prospect. |
| **Temeiul legal** | Art. 6 alin. (1) lit. b pentru clienți și prospecți activi; art. 6 alin. (1) lit. f pentru evidența internă |
| **Categorii de persoane vizate** | Clienți, prospecți, persoane de contact din societăți agricole |
| **Categorii de date** | Date de identificare și de contact, date fiscale, istoric de interacțiuni, note interne |
| **Categorii de destinatari** | Personalul propriu; Supabase |
| **Transferuri în afara SEE** | Nu se efectuează |
| **Termen de ștergere** | 3 ani de la ultimul contact pentru prospecți neconvertiți; 10 ani pentru clienții cu documente contabile emise |
| **Măsuri de securitate** | Acces pe bază de cont; jurnalizarea acțiunilor; supraveghere automată a termenelor de ștergere |


### A9. Facturare și evidență contabilă

| | |
| --- | --- |
| **Scopul prelucrării** | Emiterea documentelor fiscale și îndeplinirea obligațiilor contabile. |
| **Temeiul legal** | Art. 6 alin. (1) lit. c — obligație legală (Legea contabilității 82/1991, Codul fiscal) |
| **Categorii de persoane vizate** | Clienți și reprezentanții acestora |
| **Categorii de date** | Denumire, CUI, adresă, date de facturare, sume |
| **Categorii de destinatari** | Personalul propriu; furnizorul de servicii de contabilitate; ANAF |
| **Transferuri în afara SEE** | Nu se efectuează |
| **Termen de ștergere** | 10 ani de la închiderea exercițiului financiar (art. 25 din Legea 82/1991) |
| **Măsuri de securitate** | Acces restrâns la persoanele cu atribuții financiare; arhivare conform legii |


---

## Împuterniciții (art. 28)

Toți furnizorii de mai jos prelucrează date exclusiv la instrucțiunea operatorului, în baza
unui acord de prelucrare. Copiile documentelor sunt arhivate în `docs/gdpr/dpa/`, iar
starea fiecărui acord este urmărită în panoul GDPR din administrarea site-ului.

| Furnizor | Entitate contractantă | Categorie | Rol | Locația datelor | Temei transfer |
| --- | --- | --- | --- | --- | --- |
| Vercel | Vercel Inc. (SUA) | Infrastructură | Găzduiește site-ul și rulează formularele | Regiune de execuție în Uniunea Europeană; societatea-mamă în SUA | Clauze contractuale standard (SCC) |
| Supabase | Supabase Inc. (SUA), infrastructură AWS Europa | Infrastructură | Baza de date a site-ului și a CRM-ului | Stockholm, Suedia (eu-north-1) — în Uniunea Europeană | Fără transfer |
| Cloudflare R2 | Cloudflare, Inc. (SUA) | Infrastructură | Livrează clipurile video de prezentare | Rețea globală, cu preferință pentru noduri europene | Clauze contractuale standard (SCC) |
| Google Analytics | Google Ireland Limited | Analiză | Statistici despre traficul pe site | Uniunea Europeană și SUA | EU–US Data Privacy Framework + clauze contractuale standard |
| Microsoft Clarity | Microsoft Ireland Operations Limited | Analiză | Hărți de atenție și înregistrări anonime ale sesiunilor | Uniunea Europeană și SUA | EU–US Data Privacy Framework + clauze contractuale standard |
| Google Ads | Google Ireland Limited | Marketing | Măsoară conversiile din reclame și afișează anunțuri | Uniunea Europeană și SUA | EU–US Data Privacy Framework + clauze contractuale standard |
| Meta Pixel | Meta Platforms Ireland Limited | Marketing | Măsoară rezultatele campaniilor de pe Facebook și Instagram | Uniunea Europeană și SUA | EU–US Data Privacy Framework + clauze contractuale standard |
| YouTube | Google Ireland Limited | Marketing | Redă clipurile de prezentare a utilajelor | Uniunea Europeană și SUA | EU–US Data Privacy Framework + clauze contractuale standard |
| Google Workspace (Gmail) | Google Ireland Limited | Comunicare | Trimite rapoartele și ofertele pe email | Uniunea Europeană și SUA | EU–US Data Privacy Framework + clauze contractuale standard |

---

## Măsuri de securitate aplicate transversal

- Trafic criptat obligatoriu (HTTPS, HSTS cu preîncărcare).
- Politică de securitate a conținutului (CSP) care limitează scripturile la surse cunoscute.
- Chei de acces la baza de date păstrate exclusiv în variabilele de mediu ale serverului.
- Interfața de administrare protejată prin parolă, cu comparație rezistentă la atacuri de sincronizare.
- Limitarea numărului de cereri pe adresă IP pe toate rutele care primesc date personale.
- Adresele IP folosite ca dovadă a consimțământului se păstrează exclusiv sub formă de hash.
- Registrul de consimțăminte este append-only: înregistrările nu se modifică retroactiv.
- Supraveghere automată a termenelor de păstrare, cu avertizare cu 90 de zile înainte.
- Procedură scrisă pentru breșe de securitate, cu notificare în 72 de ore (`docs/gdpr/procedura-bresa-securitate.md`).

---

## Istoricul versiunilor

| Versiune | Data | Modificări |
| --- | --- | --- |
| 2026-09-03 | 3 septembrie 2026 | Întocmire inițială, în urma auditului de conformitate al site-ului |

---

*Întocmit de: ..................................  Semnătura: ..................  Data: ..............*
