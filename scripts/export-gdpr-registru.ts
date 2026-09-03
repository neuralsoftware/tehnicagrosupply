/**
 * Generează Registrul activităților de prelucrare (GDPR art. 30) ca fișier Markdown,
 * pornind de la datele din `src/data/`. Sursa unică rămâne codul: dacă apare un scop nou
 * sau un furnizor nou, se editează acolo și se rulează din nou scriptul.
 *
 *   npm run export-gdpr
 *
 * Fișierul rezultat se tipărește, se semnează de administrator și se ține la firmă.
 * Nu se depune nicăieri și nu se publică.
 */

import fs from 'fs';
import path from 'path';
import { PROCESSING_ACTIVITIES, REGISTRU_VERSION } from '../src/data/gdpr-registru';
import { PROCESSORS, PROCESSOR_CATEGORY_LABEL } from '../src/data/gdpr-processors';
import { SITE_CONTACT } from '../src/lib/site-contact';

const OUT = path.join(process.cwd(), 'docs', 'gdpr', 'registru-activitati-prelucrare.md');

function activitySection(): string {
    return PROCESSING_ACTIVITIES.map(
        (a) => `
### ${a.id}. ${a.name}

| | |
| --- | --- |
| **Scopul prelucrării** | ${a.purpose} |
| **Temeiul legal** | ${a.legalBasis} |
| **Categorii de persoane vizate** | ${a.subjects} |
| **Categorii de date** | ${a.dataCategories} |
| **Categorii de destinatari** | ${a.recipients} |
| **Transferuri în afara SEE** | ${a.transfers ?? 'Nu se efectuează'} |
| **Termen de ștergere** | ${a.retention} |
| **Măsuri de securitate** | ${a.securityMeasures} |
`
    ).join('\n');
}

function processorSection(): string {
    const rows = PROCESSORS.map(
        (p) =>
            `| ${p.name} | ${p.entity} | ${PROCESSOR_CATEGORY_LABEL[p.category]} | ${p.role} | ${p.location} | ${
                p.transferBasis ?? 'Fără transfer'
            } |`
    ).join('\n');

    return `| Furnizor | Entitate contractantă | Categorie | Rol | Locația datelor | Temei transfer |
| --- | --- | --- | --- | --- | --- |
${rows}`;
}

const content = `# Registrul activităților de prelucrare a datelor cu caracter personal

**Operator:** ${SITE_CONTACT.legalName}
**Sediu social:** ${SITE_CONTACT.addressFull}
**CUI:** ${SITE_CONTACT.cui} · **Nr. Reg. Comerțului:** ${SITE_CONTACT.regCom}
**Contact pentru protecția datelor:** ${SITE_CONTACT.email} · ${SITE_CONTACT.phoneDisplay}

**Versiunea ${REGISTRU_VERSION}** · Întocmit conform art. 30 din Regulamentul (UE) 2016/679

> Generat automat din codul aplicației. Nu edita direct acest fișier: modifică
> \`src/data/gdpr-registru.ts\` sau \`src/data/gdpr-processors.ts\` și rulează \`npm run export-gdpr\`.

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

${activitySection()}

---

## Împuterniciții (art. 28)

Toți furnizorii de mai jos prelucrează date exclusiv la instrucțiunea operatorului, în baza
unui acord de prelucrare. Copiile documentelor sunt arhivate în \`docs/gdpr/dpa/\`, iar
starea fiecărui acord este urmărită în panoul GDPR din administrarea site-ului.

${processorSection()}

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
- Procedură scrisă pentru breșe de securitate, cu notificare în 72 de ore (\`docs/gdpr/procedura-bresa-securitate.md\`).

---

## Istoricul versiunilor

| Versiune | Data | Modificări |
| --- | --- | --- |
| ${REGISTRU_VERSION} | 3 septembrie 2026 | Întocmire inițială, în urma auditului de conformitate al site-ului |

---

*Întocmit de: ..................................  Semnătura: ..................  Data: ..............*
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, content, 'utf8');
console.log(`Registru generat: ${path.relative(process.cwd(), OUT)} (${PROCESSING_ACTIVITIES.length} activități, ${PROCESSORS.length} împuterniciți)`);
