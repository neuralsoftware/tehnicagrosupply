# Raport Audit — TehnicAgro Supply
**Data:** 7 Aprilie 2026  
**Proiect:** `tehnicagro_supply` — Site prezentare utilaje agricole + Admin + Generare brochuri  
**Tehnologie:** Next.js 16, React 19, Supabase, Vercel  
**GitHub:** github.com/neuralsoftware/tehnicagrosupply (public)

---

## 1. Ce este acest proiect

Un site web complet pentru firma TehnicAgro, cu 3 componente principale:
- **Site public** — prezentare utilaje, piese schimb, blog, contact
- **Panou admin** — gestionare produse, categorii, programe finantare
- **Generator brochuri** — creare PDF-uri de prezentare pentru utilaje

Formularele de contact si cererile de oferta de pe site se trimit automat intr-un CRM separat (proiectul `crm_imm_web`).

---

## 2. Harta site-ului

```
Pagini publice:
├── / (Acasa) — hero, utilaje featured, calculator ROI, contact
├── /utilaje — catalog cu filtrare pe categorii
│   ├── /utilaje/[categorie] — pagina categorie (ex: pregatire-sol)
│   └── /utilaje/[categorie]/[produs] — pagina produs individual
├── /piese-schimb — piese Bargam, Kurt + alte marci
├── /blog — articole (ex: APIA, AFIR, No-Till)
├── /contact — formular contact direct
└── Pagini legale: /privacy-policy, /politica-cookie, /conditii-utilizare

Admin (protejat cu parola):
└── /admin
    ├── Catalog Utilaje — adauga/editeaza/sterge produse
    ├── Date Brosura — informatii detaliate per produs pentru PDF
    ├── Categorii — gestionare categorii (active/draft)
    ├── Programe Finantare — APIA/AFIR cu date actualizate
    └── Materiale Publicitare — generare PDF brochuri (max 6 produse)
```

---

## 3. Conexiuni externe

| Serviciu | Status | Ce face |
|----------|--------|---------|
| **Vercel** | ✅ Conectat | Gazduieste site-ul live, 20+ deploy-uri anterioare |
| **GitHub** | ✅ Conectat (public) | Pastreaza codul, deploy automat la push |
| **Supabase Marketing** | ✅ Configurat | Stocheaza produse, imagini, categorii, brochuri |
| **Supabase CRM** | ✅ Configurat | Primeste lead-urile de pe site |
| **Email (Nodemailer)** | ❌ BROKEN | Credentialele lipsesc — trimiterile email nu functioneaza |
| **Google Analytics 4** | ⚠️ Partial | ID-ul e hardcodat in cod (ar trebui in variabile mediu) |
| **Facebook Pixel** | ⚠️ Partial | ID-ul lipseste din configurare |

---

## 4. Probleme de Securitate

### 🔴 CRITICA — Parola admin expusa

**Problema:** Parola de admin (`tehnicagro2026`) este salvata in browser-ul vizitatorilor intr-un loc accesibil oricarui script malitios de pe pagina. Daca cineva ar injecta cod strain pe site (reclame, extensii), ar putea fura parola.

**Ce trebuie facut:**
- Schimba parola din `tehnicagro2026` cu una mai complexa in setarile Vercel
- Implementez un sistem de autentificare mai sigur (cookie de sesiune)

### 🔴 CRITICA — Email complet nefunctional

**Problema:** Sistemul de trimitere email (rapoarte audit, oferte personalizate) nu are credentialele configurate. Orice apasare pe butonul de "Trimite oferta" sau "Trimite raport" va esua in liniste.

**Ce trebuie facut:**
- Adauga in Vercel 2 variabile: `NODEMAILER_USER` (adresa Gmail) si `NODEMAILER_PASS` (parola aplicatie Gmail)

### 🟡 MEDIE — Rate limiting fragil

**Problema:** Sistemul care limiteaza numarul de mesaje trimise (anti-spam) se reseteaza la fiecare re-deploy al site-ului, pentru ca e stocat in memorie, nu intr-o baza de date persistenta.

**Impact practic:** Cineva poate trimite spam dupa fiecare deploy. Nu e critic acum, dar devine problema la trafic mare.

### 🟡 MEDIE — Ruta de email fara protectie anti-spam

**Problema:** Formularul "Trimite oferta" (`/api/send-offer`) nu are nicio limita de trimiteri, spre deosebire de celelalte formulare.

---

## 5. Starea codului

### Ce e bine
- ✅ Cod TypeScript strict — reduce erorile de programare
- ✅ Validare date pe formulare (nu poti trimite date invalide)
- ✅ Structura clara, fiecare sectiune in folderul ei
- ✅ SEO configurat corect (sitemap, robots, metadata, schema.org)
- ✅ GDPR: banner cookie functional, Analytics pornit doar cu consimtamant
- ✅ Optimizare imagini automata (Next.js)
- ✅ Fara cod mort — tot ce e scris e folosit

### Ce trebuie imbunatatit
- ⚠️ Pagina principala se re-incarca la fiecare vizit (din Supabase) — ar trebui cache de 1h
- ⚠️ Generatorul PDF este un pachet mare care incarca site-ul — ar putea fi optimizat
- ⚠️ 40 de mesaje de debug in consolele serverului — normale pentru dev, dar ideal sa fie curatate

---

## 6. Dependinte (pachete software)

| Pachet | Versiune | Status |
|--------|----------|--------|
| Next.js | 16.2.1 | ✅ Recent |
| React | 19.2.3 | ✅ Ultima versiune |
| Supabase JS | 2.100.1 | ✅ Recent |
| Zod (validare) | 4.3.5 | ✅ OK |
| Framer Motion | 12.27.5 | ✅ Recent |
| PDF Renderer | 4.3.2 | ✅ OK |
| Nodemailer | 8.0.4 | ✅ Recent |
| **tar** | 7.5.11 | ✅ Patch securitate aplicat |

Nicio vulnerabilitate critica in dependinte.

---

## 7. Calitatea SEO

- ✅ Sitemap.xml generat automat
- ✅ Robots.txt configurat (/admin blocat crawlere)
- ✅ Open Graph (previzualizare link pe social media)
- ✅ Schema.org FAQ si Organization
- ✅ URL-uri curate si descriptive
- ⚠️ GitHub-ul este PUBLIC — codul sursa poate fi vazut de oricine

---

## 8. Plan de actiune prioritizat

### Imediat (aceasta saptamana)
1. **Schimba parola admin** pe Vercel (Settings → Environment Variables → ADMIN_PASSWORD)
2. **Configureaza email** pe Vercel: adauga NODEMAILER_USER si NODEMAILER_PASS
3. **Seteaza Facebook Pixel ID** pe Vercel: NEXT_PUBLIC_FACEBOOK_PIXEL_ID

### Curand (luna aceasta)
4. Treci GitHub-ul la **private** (daca nu vrei codul public)
5. Implementeaza **autentificare admin mai sigura** (cookie de sesiune in loc de localStorage)
6. Adauga **rate limiting** pe ruta `/api/send-offer`
7. Optimizeaza homepage cu **cache de 1h** in loc de incarcare la fiecare vizit

### Pe termen mediu
8. Configurare **Redis** pentru rate limiting persistent
9. Curatare console.error din cod
10. Evaluare mutare generator PDF pe un server dedicat (lambda function)

---

## 9. Scor general

| Categorie | Scor | Observatie |
|-----------|------|-----------|
| Functionalitate | 8/10 | Solid, email broken |
| Securitate | 5/10 | Parola admin vulnerabila, email broken |
| Cod | 8/10 | Curat, structurat, TypeScript strict |
| SEO | 9/10 | Excelent configurat |
| Performanta | 7/10 | Homepage force-dynamic, PDF heavy |
| **TOTAL** | **7.4/10** | Bun, cu vulnerabilitati de adresat urgent |

---

*Raport generat automat de Claude Code | Audit realizat prin analiza codului, conexiuni GitHub/Vercel/Supabase*
