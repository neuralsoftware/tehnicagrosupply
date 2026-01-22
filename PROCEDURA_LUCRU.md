# PROCEDURĂ DE LUCRU - TEHNIC AGRO FUNNEL

Acest document servește drept ghid unic de adevăr pentru toți agenții și dezvoltatorii care lucrează la acest proiect.

## 1. Locația Proiectului (Sursa de Adevăr)

Proiectul se află local la calea:
`/Users/comandaniel/TEHNICAGRO SUPPLY/tehnic-agro-funnel`

> [!IMPORTANT]
> Toate modificările trebuie făcute în acest director. Nu lucrați în directoare temporare.

## 2. Structura Proiectului

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Componente Cheie**:
  - `src/components/Hero.tsx`: Prima impresie, CTAs.
  - `src/components/RoiCalculator.tsx`: Lead Magnet principal (Calculator Profit).
  - `src/components/TrustSignals.tsx`: Elemente de încredere (Garanție, Service).
  - `src/components/LegalProof.tsx`: Validare și conformitate.

## 3. Flux de Dezvoltare (Workflow)

1. **Analiză**: Înainte de orice modificare, citiți `task.md` și `implementation_plan.md` din `brain/`.
2. **Implementare**: Modificați codul în `src/`.
3. **Testare**: Rulați `npm run dev` (dacă este posibil) sau verificați logic codul.
4. **Commit**: Salvați modificările în git local.

   ```bash
   git add .
   git commit -m "Descriere modificări"
   ```

## 4. Procedura de Deploy (Vercel)

Există două metode de a urca modificările pe Vercel:

### Metoda A: Git Push (Recomandată)

Dacă proiectul este legat de un repository GitHub:

```bash
git push origin main
```

Vercel va prelua automat modificările și va face deploy.

### Metoda B: Vercel CLI (Manual)

Dacă nu există legătură Git, se folosește CLI-ul:

```bash
npx vercel --prod
```

*Notă: Necesită autentificare.*

## 5. Contact & Resurse

- **Client**: Avers-Agro & Fliegl
- **Obiectiv**: Generare lead-uri pentru utilaje agricole (Subvenție APIA).
