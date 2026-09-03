# Procedura în caz de breșă de securitate a datelor personale

**TEHNICAGRO SUPPLY S.R.L.** · CUI RO52736574 · Reg. Com. J2025080370001
Versiunea 1.0 — 3 septembrie 2026
Temei: art. 33 și art. 34 din Regulamentul (UE) 2016/679

---

## De ce există documentul acesta

Obligația de a notifica o breșă în 72 de ore nu depinde de mărimea firmei și nici de faptul
că serviciile folosite sunt pe plan gratuit. Ce se schimbă în funcție de mijloace este *cât
de repede afli* — nu *ce faci după*. Documentul de față stabilește ce faci după, ca să nu se
improvizeze în ziua în care se întâmplă.

Un control ANSPDCP cere această procedură scrisă. Absența ei este în sine o problemă;
existența ei, chiar simplă, arată că firma și-a organizat răspunsul.

---

## 1. Ce înseamnă „breșă de securitate”

Orice incident care duce, accidental sau ilegal, la:

- **distrugerea sau pierderea** datelor (baza de date ștearsă, cont pierdut definitiv),
- **modificarea neautorizată** a datelor,
- **divulgarea sau accesul neautorizat** (cont spart, chei de acces publicate din greșeală,
  email cu date trimis persoanei greșite, laptop furat cu acces salvat la CRM).

Nu contează câte persoane sunt afectate. Un singur email trimis greșit, cu datele unui
client, este o breșă.

---

## 2. Cum poți afla că s-a întâmplat ceva

Aici sunt mijloacele reale, toate disponibile pe planurile gratuite:

| Sursa | Ce urmărești | Unde |
| --- | --- | --- |
| Notificare de la furnizor | Supabase, Vercel, Google și Meta sunt obligați contractual să te anunțe | Email-ul contului |
| Alertă de securitate a contului | Autentificare din locație nouă, schimbare de parolă | Google, GitHub, Vercel |
| Jurnalele Supabase | Interogări neobișnuite, acces din afara aplicației | Dashboard → Logs |
| Jurnalele Vercel | Vârfuri de trafic pe rutele API, erori 500 în serie | Dashboard → Logs |
| Sesizare din exterior | Un client spune că a primit datele altcuiva | Email, telefon |
| Constatare proprie | Observi date lipsă sau modificate în CRM | Uz zilnic |

**Măsură minimă recomandată:** activează autentificarea în doi pași pe conturile Google,
GitHub, Vercel și Supabase. Este gratuită și elimină cea mai frecventă cauză de breșă la
firmele mici — contul de email compromis.

---

## 3. Ce faci, în ordine

### Ora 0 — Oprește sângerarea

1. Schimbă parola și cheile de acces afectate (`SUPABASE_SERVICE_ROLE_KEY`,
   `ADMIN_PASSWORD`, parola de email).
2. Deconectează sesiunile active din conturile implicate.
3. **Nu șterge nimic.** Jurnalele și urmele sunt necesare pentru evaluare.

### Primele 24 de ore — Stabilește ce s-a întâmplat

Notează în scris, pe măsură ce afli:

- când a început și când a fost descoperit incidentul;
- ce categorii de date au fost expuse (nume, telefon, email, date fiscale?);
- câte persoane sunt afectate, aproximativ;
- cauza probabilă;
- ce ai făcut deja pentru a limita efectele.

### Până la 72 de ore — Decide dacă notifici autoritatea

Notifici ANSPDCP **dacă există un risc pentru drepturile persoanelor**. În practică:

| Situație | Notifici ANSPDCP? |
| --- | --- |
| S-au expus nume, telefon, email, date despre fermă | **Da** |
| S-au expus date fiscale sau financiare | **Da** |
| Date pierdute fără copie de rezervă | **Da** |
| Un email trimis greșit, către un singur destinatar care confirmă ștergerea | Documentezi intern, de regulă fără notificare |
| Date criptate, cheia rămasă în siguranță | De regulă nu, dar documentezi motivul |

**Când ai dubii, notifici.** O notificare în plus nu se sancționează; una lipsă, da.

**Cum notifici:** formularul electronic de pe [www.dataprotection.ro](https://www.dataprotection.ro),
secțiunea dedicată notificărilor de încălcare a securității datelor.
Termenul de 72 de ore curge din momentul în care ai *luat cunoștință*, nu din momentul
incidentului. Dacă depășești termenul, notifici oricum și explici întârzierea.

### Dacă riscul e ridicat — Anunță și persoanele

Când breșa poate duce la fraudă, furt de identitate sau prejudiciu material, persoanele
afectate trebuie anunțate direct, în cuvinte simple: ce s-a întâmplat, ce date sunt
implicate, ce faci tu și ce pot face ele.

---

## 4. Ce ții la dosar, indiferent de decizie

Chiar dacă *nu* notifici, art. 33 alin. (5) cere să documentezi orice breșă. Pentru fiecare
incident păstrezi: data descoperirii, descrierea, datele afectate, evaluarea riscului,
decizia luată și motivul ei, măsurile aplicate.

Registrul se ține în `docs/gdpr/incidente/`, un fișier pe incident.

---

## 5. Cine face ce

| Rol | Persoana | Responsabilitate |
| --- | --- | --- |
| Decizie de notificare | Administratorul societății | Evaluează riscul, semnează notificarea |
| Măsuri tehnice | Persoana care administrează site-ul și CRM-ul | Rotește cheile, verifică jurnalele, documentează |
| Comunicare cu persoanele afectate | Administratorul societății | Redactează și trimite informarea |

---

## 6. Prevenție — ce reduce cel mai mult riscul

1. Autentificare în doi pași pe toate conturile (gratuit).
2. Cheile de acces nu se pun niciodată în cod și nu se trimit pe email sau WhatsApp.
3. `ADMIN_PASSWORD` schimbat cel puțin o dată pe an.
4. Copie de rezervă a bazei CRM — Supabase o face automat; verifică o dată pe trimestru că
   există și că se poate restaura.
5. Ștergerea datelor expirate la termen: ce nu mai există nu se poate scurge. Panoul GDPR
   din administrare arată ce a depășit termenul.
