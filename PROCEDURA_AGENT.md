# 📘 Manual de Procedură și Predare Proiect - TehnicAgro Funnel

Acest document este ghidul tehnic complet pentru dezvoltatorii/agenții care preiau administrarea sau dezvoltarea acestui proiect.

---

## 1. 🏗️ Arhitectura Proiectului

Platforma este un Sales Funnel de conversie ridicată pentru utilaje agricole, construit pe o arhitectură modernă "Serverless":

- **Frontend:** Next.js (React) - găzduit pe Vercel.
- **Backend/DB:** Supabase (PostgreSQL) - pentru stocarea lead-urilor.
- **Styling:** Tailwind CSS.
- **Analytics:** Google Analytics 4 + Facebook Pixel (Meta Dataset).

### ⚠️ IMPORTANT: Securitate Duală

Sistemul folosește două niveluri de acces la baza de date:

1. **Client Public (Anon):** Folosit de browser. Are acces LIMITAT prin RLS (Row Level Security). Poate doar să *scrie* (INSERT) lead-uri noi, dar NU poate citi nimic.
2. **Client Admin (Service Role):** Folosit doar de server (`src/lib/supabaseAdmin.ts`). Are acces DEPLIN (Bypass RLS). Este folosit exclusiv pentru Admin Panel.

---

## 2. 🔑 Gestionarea Variabilelor de Mediu (CRITIC!)

Dacă proiectul este mutat sau clonat, următoarele variabile sunt OBLIGATORII. Fără ele, Admin Panel-ul va da eroare 500, sau formularele nu vor merge.

### Lista Variabilelor (.env.local / Vercel Env)

| Variabilă | Rol | Sursă (Unde o găsești) |
|-----------|-----|------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Conectare DB | Supabase -> Settings -> API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cheie Publică | Supabase -> Settings -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | **ACCES ADMIN (CRITIC)** | Supabase -> Settings -> API -> **SERVICE_ROLE (Secret!)** |
| `ADMIN_PASSWORD` | Parolă Admin Panel | Stabilită de tine (ex: tehnicagro2026) |
| `NODEMAILER_USER` | Email Notificări | Cont Gmail (<tehnicagro.supply@gmail.com>) |
| `NODEMAILER_PASS` | Parolă Aplicație Gmail | Google Account -> Security -> App Passwords |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | Tracking Conversii | Facebook Events Manager |

> **🚨 NOTĂ CRITICĂ:** `SUPABASE_SERVICE_ROLE_KEY` nu trebuie să ajungă niciodată în codul public (GitHub). Pe Vercel, se adaugă manual în Settings -> Environment Variables.

---

## 3. 📦 Procedura de Transfer / Instalare

Dacă vrei să muți proiectul pe un alt calculator sau cont Vercel:

### A. Instalare Locală

1. Clonează repository-ul: `git clone [url-repo]`
2. Instalează dependențele: `npm install`
3. Creează fișierul `.env.local` și populează-l cu cheile de mai sus.
4. Rulează: `npm run dev`

### B. Deploy pe Vercel (Producție)

1. Conectează contul Vercel la repository-ul GitHub.
2. Importă proiectul ca "Next.js".
3. **ÎNAINTE DE DEPLOY:** Mergi la "Environment Variables" și adaugă toate cheile din tabelul de la pct. 2.
4. Apasă **Deploy**.

---

## 4. 🛠️ Fluxul de Lucru și Modificări Frecvente

- **Modificare Prețuri/Produse:** Se face direct în cod (`src/components/RoiCalculator.tsx` sau `src/components/ProductSection.tsx`). Necesită redeploy.
- **Email Marketing:** Proiectul include un script Google Apps Script (`trimiteEmailuriSmart`) care rulează independent în Google Sheets pentru follow-up.

## 5. 🐛 Depanare Rapidă

**Simptom:** Admin Panel nu arată lead-urile (listă goală sau eroare).
**Cauză:** Lipsește `SUPABASE_SERVICE_ROLE_KEY` din Vercel sau RLS blochează accesul.
**Soluție:** Verifică variabilele în Vercel și asigură-te că folosești clientul `supabaseAdmin` în rutele API, nu clientul standard.

**Simptom:** Butonul WhatsApp nu trak-uiește.
**Cauză:** Lipsește `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`.
**Soluție:** Adaugă ID-ul numeric în Vercel Env Vars.

---
*Generat automat de Agent AI - Ianuarie 2026*
