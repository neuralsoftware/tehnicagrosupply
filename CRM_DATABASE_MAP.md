# Hartă bază de date CRM (Supabase / PostgREST)

Ultima generare automată: `2026-03-27` (încercare eșuată — vezi mai jos).

## Cum actualizezi harta

1. În `.env.local` (și pe Vercel), setează **`CRM_SUPABASE_URL`** și **`CRM_SUPABASE_SERVICE_ROLE_KEY`** din **același** proiect Supabase CRM (Settings → API → URL + `service_role` **secret**).
2. Rulează: `npm run map-db`
3. La succes, secțiunile de mai jos se vor umple automat cu **toate** tabelele și coloanele din OpenAPI.

> Endpoint apelat de script: `GET {CRM_SUPABASE_URL}/rest/v1/?apikey=…` plus headere `apikey` și `Authorization: Bearer` (service role).

---

## Ultima rulare: eroare HTTP 401

```
{"message":"Invalid API key","hint":"Double check your Supabase `anon` or `service_role` API key."}
```

Până aliniezi cheia cu URL-ul proiectului CRM, **nu există în acest fișier** lista completă din OpenAPI. După remediere, rulează din nou `npm run map-db`.

---

## Anexă: `client_tasks` — câmpuri folosite de site (din `src/app/api/leads/route.ts`)

Site-ul inserează **doar** următoarele coloane la crearea sarcinii după formular. Orice altă coloană din CRM (ex. responsabil, notificări) trebuie citită din harta generată cu succes sau din SQL Editor în Supabase.

| Nume coloană | Cum e setat din API |
| --- | --- |
| `client_id` | ID client nou sau existent (duplicat) |
| `title` | `🚨 LEAD NOU: Cerere ofertă website` |
| `description` | Text compilat (sursă, produs, mesaj, hectare, culturi, urgență, estimări ROI) |
| `due_date` | ISO: acum + 3 zile |
| `status` | `Nou` (string în JSON — verifică în harta reală dacă în DB e tot text sau cod numeric) |
| `resolution` | `EMPTY` |
| `is_completed` | `0` (integer) |

**Nu** trimitem din API încă niciun câmp de tip „responsabil / asignat / owner”. Dacă meniul CRM filtrează după acest câmp, trebuie fie adăugat în payload, fie completat de logică/trigger în baza CRM.

---

## Răspunsuri scurte (în lipsa schemei descărcate aici)

- **Coloana de responsabil pe `client_tasks`:** nu apare în codul site-ului; **nu putem confirma numele exact** (ex. `assigned_to`, `user_id`, `owner_id`) fără ieșire reușită la `npm run map-db` sau o privire în Table Editor pe proiectul CRM. După `map-db` reușit, caută în secțiunea `client_tasks` coloane de tip user FK / UUID / integer care indică agentul.
- **Notificări „Lead nou”:** acest repo **nu** scrie într-o tabelă dedicată de notificări; notificările provin cel mai probabil din **CRM-ul vostru** (trigger, edge function, coadă, sau crearea rândului în `client_tasks` / altă tabelă). Numele exact al tabelei/coloanei nu e în codul TehnicAgro — se vede după harta OpenAPI sau schema SQL din Supabase.

După ce rulezi `npm run map-db` cu chei valide, **înlocuiește** conținutul dinamic generat de script peste acest fișier (sau păstrează anexa de mai sus separat).
