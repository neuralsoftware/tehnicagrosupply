# 🚀 Instrucțiuni Deploy - TehnicAgro Funnel

Acest proiect folosește o arhitectură securizată cu Supabase RLS (Row Level Security).
Pentru ca **Admin Panel** să funcționeze corect, este CRITIC să setezi variabila de mediu `SUPABASE_SERVICE_ROLE_KEY` pe Vercel.

## 🔑 Variabile de Mediu Necesare

În Vercel Dashboard -> Settings -> Environment Variables, asigură-te că ai următoarele:

| Variabilă | Descriere | Sursă |
|-----------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL-ul proiectului Supabase | Supabase -> Settings -> API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cheia publică (anon) | Supabase -> Settings -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | **CRITIC:** Cheia secretă pentru Admin | Supabase -> Settings -> API (Reveal service_role) |
| `ADMIN_PASSWORD` | Parola pentru acces Admin | Tu o alegi (ex: tehnicagro2026) |
| `NODEMAILER_USER` | Email trimitere rapoarte | Gmail |
| `NODEMAILER_PASS` | Parolă aplicație Gmail | Gmail -> App Passwords |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | Google Analytics |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | Facebook Pixel ID | Facebook Business Manager |

## ⚠️ Cum se adaugă manual SUPABASE_SERVICE_ROLE_KEY

Această cheie NU este în `.env.local` implicit din motive de securitate sau poate fi uitată la deploy.

1. Mergi pe [Supabase Dashboard](https://supabase.com/dashboard) -> Select Project -> Settings -> API.
2. La "Project API keys", găsește `service_role` și apasă "Reveal". Copiază cheia (începe cu `ey...`).
3. Mergi pe [Vercel Dashboard](https://vercel.com/dashboard) -> Select Project -> Settings -> Environment Variables.
4. Adaugă o nouă variabilă:
   - **Key:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** [lipește cheia copiată]
   - Bifează: Production, Preview, Development.
5. **REDEPLOY** proiectul în Vercel (Deployments -> Redeploy) pentru ca modificarea să aibă efect!

## 📱 Validare Pixel & Analytics

- **WhatsApp Click:** Declansează evenimentul `Contact` pe FB Pixel și `whatsapp_click` pe GA4.
- **Formular Lead:** Declansează `Lead` pe FB Pixel și `generate_lead` pe GA4.

Aceste evenimente sunt active automat dacă `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` și `NEXT_PUBLIC_GA_ID` sunt setate.
