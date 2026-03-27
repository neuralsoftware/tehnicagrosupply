# 📘 Manual de Procedură și Predare Proiect - TehnicAgro Funnel

Acest document este ghidul tehnic complet pentru dezvoltatorii/agenții care preiau administrarea sau dezvoltarea acestui proiect.

---

## 1. 🏗️ Arhitectura Proiectului

Platforma este un Sales Funnel de conversie ridicată pentru utilaje agricole, construit pe o arhitectură modernă "Serverless":

- **Frontend:** Next.js (React) - găzduit pe Vercel.
- **Backend/DB:** Două proiecte Supabase separate: **Marketing** (catalog, produse, Storage PDF) și **CRM** (lead-uri, formulare, tabel `clients`).
- **Styling:** Tailwind CSS.
- **Analytics:** Google Analytics 4 + Facebook Pixel (Meta Dataset).

### ⚠️ IMPORTANT: Securitate Duală

Sistemul folosește două niveluri de acces la baza de date:

1. **Marketing — Client Public (Anon):** `NEXT_PUBLIC_SUPABASE_*` — catalog site, fișiere în Storage.
2. **Marketing — Service Role:** `src/lib/supabaseAdmin.ts` (`SUPABASE_SERVICE_ROLE_KEY`) — operații admin pe același proiect (ex. sincron catalog). **Nu** scrie lead-uri aici.
3. **CRM — Service Role:** `src/lib/supabaseCrmAdmin.ts` (`CRM_SUPABASE_URL`, `CRM_SUPABASE_SERVICE_ROLE_KEY`) — **exclusiv** `/api/leads`, `LeadsService`, tabel `clients` în proiectul CRM.

---

## 2. 🔑 Gestionarea Variabilelor de Mediu (CRITIC!)

Dacă proiectul este mutat sau clonat, următoarele variabile sunt OBLIGATORII. Fără ele, Admin Panel-ul va da eroare 500, sau formularele nu vor merge.

### Lista Variabilelor (.env.local / Vercel Env)

| Variabilă | Rol | Sursă (Unde o găsești) |
|-----------|-----|------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Proiect **Marketing** — URL | Supabase (Tehnicagro Marketing) → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Marketing — cheie publică | Idem |
| `SUPABASE_SERVICE_ROLE_KEY` | Marketing — service role (Storage/catalog admin) | Idem → **service_role** |
| `CRM_SUPABASE_URL` | Proiect **CRM** — URL | Supabase (Tehnicagri CRM) → Settings → API |
| `CRM_SUPABASE_SERVICE_ROLE_KEY` | CRM — service role (lead-uri `clients`) | Idem → **service_role** |
| `ADMIN_PASSWORD` | Parolă Admin Panel | Stabilită de tine (ex: tehnicagro2026) |
| `NODEMAILER_USER` | Email Notificări | Cont Gmail (<tehnicagro.supply@gmail.com>) |
| `NODEMAILER_PASS` | Parolă Aplicație Gmail | Google Account -> Security -> App Passwords |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | Tracking Conversii | Facebook Events Manager |

> **🚨 NOTĂ CRITICĂ:** `SUPABASE_SERVICE_ROLE_KEY` și `CRM_SUPABASE_SERVICE_ROLE_KEY` nu apar în codul public. Pe Vercel: Environment Variables pentru **ambele** proiecte Supabase. Fără variabilele `CRM_*`, formularele returnează 503.

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

**Simptom:** Formulare / lead-uri — eroare sau 503.
**Cauză:** Lipsește `CRM_SUPABASE_URL` sau `CRM_SUPABASE_SERVICE_ROLE_KEY`, sau tabelul `clients` lipsește în proiectul CRM.
**Soluție:** Setează variabilele CRM pe Vercel (proiectul Tehnicagri CRM, nu marketing). Rutele `/api/leads` folosesc `supabaseCrmAdmin`, nu `supabaseAdmin`.

**Simptom:** Butonul WhatsApp nu trak-uiește.
**Cauză:** Lipsește `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`.
**Soluție:** Adaugă ID-ul numeric în Vercel Env Vars.

---
*Generat automat de Agent AI - Ianuarie 2026*
