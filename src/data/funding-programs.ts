// ============================================================
// BAZA DE CUNOȘTINȚE APIA / AFIR / MEDIU
// Date oficiale PAC 2023-2027 — actualizate manual din Admin
// Nu există API public AFIR/APIA — datele sunt verificate manual
// ============================================================

export type FundingAgency = 'AFIR' | 'APIA' | 'MEDIU';
export type ProgramStatus = 'active' | 'suspended' | 'upcoming';

export interface FundingProgram {
    code: string;           // ex: 'DR-17'
    title: string;
    agency: FundingAgency;
    sector: string;         // sectoare eligibile
    maxGrant: string;       // ex: '1.5M EUR'
    deadline: string;       // ex: 'Mar 2026' sau 'TBD'
    status: ProgramStatus;
    lastVerified: string;   // ISO date — actualizat manual din Admin
    sourceUrl: string;      // link oficial pentru verificare
    details: string;        // descriere eligibilitate, condiții cheie
    notes?: string;         // observații admin (ex: "Sesiunea deschisă din 02.02.2026")
}

export const FUNDING_PROGRAMS: Record<string, FundingProgram[]> = {

    'pregatire-sol': [
        {
            code: 'GAEC 6',
            title: 'Eco-Schema Acoperire Sol (GAEC 6)',
            agency: 'APIA',
            sector: 'Toate culturile arabile — pregătire sol conservativă',
            maxGrant: '50-80 EUR/ha/an',
            deadline: 'Cerere unică APIA — anual',
            status: 'suspended',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.apia.org.ro/ro/campania-2026',
            details: 'Obligatoriu: acoperirea solului în perioada 15 iunie – 15 octombrie. Resturile vegetale trebuie menținute la suprafață, fără îngropare. Utilajele de tip Chain Disc / grape cu lanțuri sunt soluția ideală de conformitate. Nerespectarea GAEC 6 atrage penalități de -3% din plățile directe.',
            notes: 'Campania 2026 s-a închis — termenul de depunere 5 Iun 2026 a expirat. Campanie nouă din Mar 2027.'
        },
        {
            code: 'DR-12',
            title: 'Investiții în exploatații agricole tinere/nou-înființate',
            agency: 'AFIR',
            sector: 'Cultură mare, legumicol, pomicol',
            maxGrant: '200.000 EUR (simplu) / 2M EUR (complex)',
            deadline: '15 Sep 2026 (lansare confirmată)',
            status: 'upcoming',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-12',
            details: 'Finanțare utilaje și echipamente agricole pentru fermieri tineri (sub 41 ani) și exploatații nou-înființate. Intensitatea ajutorului: 65-80%. Include utilaje pregătire sol, semănat, recoltare.',
            notes: 'Ghid finalizat, a trecut de consultarea publică — lansare confirmată pentru 15 Sep 2026 (dată amânată din cauza situației de la Cadastru și perioadei de concedii din august). Portalul de sesiuni AFIR confirmă că nu e încă deschisă.'
        }
    ],

    'semanat-fertilizat': [
        {
            code: 'PD-04',
            title: 'Eco-Schema Agricultură Conservativă (PD-04)',
            agency: 'APIA',
            sector: 'Cultură mare — semănat direct / mini-till',
            maxGrant: '56 EUR/ha/an',
            deadline: 'Cerere unică APIA — anual',
            status: 'suspended',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.apia.org.ro/ro/campania-2026/eco-scheme',
            details: 'Eligibil pentru fermieri care practică No-Till sau Mini-Till. Semănătoarea directă trebuie să nu inverseze solul. Semănătorile Avers-Agro Multisem ADS îndeplinesc toate cerințele tehnice. Plata este per hectar, indiferent de dimensiunea fermei.',
            notes: 'Campania 2026 s-a închis — termenul de depunere 5 Iun 2026 a expirat. Campanie nouă din Mar 2027.'
        },
        {
            code: 'DR-12',
            title: 'Investiții în exploatații agricole tinere/nou-înființate',
            agency: 'AFIR',
            sector: 'Cultură mare, legumicol',
            maxGrant: '200.000 EUR (simplu) / 2M EUR (complex)',
            deadline: '15 Sep 2026 (lansare confirmată)',
            status: 'upcoming',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-12',
            details: 'Include utilaje de semănat și fertilizat ca investiții eligibile. Intensitatea ajutorului: 65-80%.',
            notes: 'Ghid finalizat — lansare confirmată pentru 15 Sep 2026'
        }
    ],

    'recoltare-logistica': [
        {
            code: 'DR-12',
            title: 'Investiții în exploatații agricole tinere/nou-înființate',
            agency: 'AFIR',
            sector: 'Cultură mare, legumicol, viticol',
            maxGrant: '200.000 EUR (simplu) / 2M EUR (complex)',
            deadline: '15 Sep 2026 (lansare confirmată)',
            status: 'upcoming',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-12',
            details: 'Remorcile de transbordare cereale, echipamente de logistică agricolă sunt eligibile ca investiții în utilaje. Fermieri sub 41 ani, exploatații noi.',
            notes: 'Ghid finalizat — lansare confirmată pentru 15 Sep 2026'
        },
        {
            code: 'DR-23',
            title: 'Investiții în procesare și comercializare produse agricole',
            agency: 'AFIR',
            sector: 'Procesare și logistică produse vegetale',
            maxGrant: '3M EUR (general) / 10M EUR (panificație)',
            deadline: 'Feb 2026 (sesiune închisă)',
            status: 'suspended',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-23',
            details: 'Include echipamente de transport, stocare și procesare primară a produselor agricole. Relevant pentru remorcile de transbordare cu capacitate mare.',
            notes: 'Sesiunea 01/2026 s-a închis pe 16 Feb 2026 — 149 cereri depuse (124.7M EUR vs alocare 165M EUR). Sesiune nouă neconfirmată — portalul AFIR de sesiuni active nu arată nimic deschis.'
        }
    ],

    'viticol': [
        {
            code: 'IS-V-02',
            title: 'Investiții în active corporale și necorporale — Viticultură',
            agency: 'APIA',
            sector: 'Viticultură — vin, struguri de masă',
            maxGrant: '1.5M EUR (complex) / 400.000 EUR (simplu)',
            deadline: '17 Aug – 19 Oct 2026 (sesiune activă)',
            status: 'active',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.apia.org.ro/ro/interventii-sectoriale/sectorul-vitivinicol',
            details: 'Finanțare pentru utilaje specifice viticulturii: tratoare viticole, echipamente de lucrul solului în vie, sisteme de irigare, utilaje de recoltare. Intensitate ajutor: 40-50%.',
            notes: 'Sesiune de depunere confirmată 17 Aug – 19 Oct 2026, alocare 9,35M EUR pentru IS-V-02. Se închide mai devreme dacă valoarea cererilor atinge 120% din limita bugetară. Verifică apia.org.ro/vie.investitii@apia.org.ro'
        },
        {
            code: 'IS-V-07',
            title: 'Investiții pentru creșterea durabilității producției de vin',
            agency: 'APIA',
            sector: 'Viticultură — durabilitate și eco-inovare',
            maxGrant: '650.000 EUR (complex) / 250.000 EUR (simplu)',
            deadline: '17 Aug – 19 Oct 2026 (sesiune activă)',
            status: 'active',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.apia.org.ro/ro/interventii-sectoriale/sectorul-vitivinicol',
            details: 'Specific pentru investiții care reduc amprenta de carbon: utilaje electrice sau hibride în vie, sisteme de precizie, senzori, echipamente pentru reducerea pesticidelor.',
            notes: 'Sesiune de depunere confirmată 17 Aug – 19 Oct 2026, alocare 1,7M EUR pentru IS-V-07. Se închide mai devreme dacă valoarea cererilor atinge 120% din limita bugetară.'
        },
        {
            code: 'DR-17',
            title: 'Investiții în sectorul struguri de masă',
            agency: 'AFIR',
            sector: 'Viticultură — struguri de masă',
            maxGrant: '1.5M EUR per proiect',
            deadline: 'Neconfirmat — urmărește afir.ro',
            status: 'upcoming',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-17',
            details: 'Alocare 40M EUR. Include înființare și modernizare plantații, utilaje specifice pentru struguri de masă, sisteme de irigare, echipamente de sortare și ambalare. Fermieri individuali și forme asociative.',
            notes: 'Ghid consultativ publicat ian 2026 — sesiunea de depunere tot nu s-a deschis (calendarul estimativ AFIR indica inițial Feb/Mar 2026, acum depășit cu ~5 luni); portalul de sesiuni active al AFIR confirmă că nu e deschisă, urmărește afir.ro'
        }
    ],

    'legumicol': [
        {
            code: 'DR-16',
            title: 'Investiții în sectorul legume și/sau cartofi',
            agency: 'AFIR',
            sector: 'Legumicultură, cartofi, spații protejate',
            maxGrant: '2M EUR (complex) / 300.000 EUR (simplu, față de cartofi: 700.000 EUR)',
            deadline: 'Mar 2026 (sesiune închisă)',
            status: 'suspended',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-16',
            details: 'Alocare 151M EUR. Investiții în: înființare și modernizare ferme legumicole, spații protejate (sere, solarii), echipamente de irigare, utilaje de lucrul solului în legumicultură, sisteme de avertizare. Intensitate ajutor: 50-65%.',
            notes: 'Sesiunea 01/2026 (19 Ian – 20 Mar 2026) s-a închis anticipat — componentele Legume/Cartofi individuale s-au epuizat în 5 zile (cereri 358M EUR vs alocare 151M EUR); componenta Forme Asociate a rămas deschisă până la termenul de 20 Mar 2026. Toate componentele sunt acum închise. Sesiune nouă neconfirmată.'
        }
    ],

    'protectia-plantelor': [
        {
            code: 'DR-19',
            title: 'Investiții neproductive în exploatații agricole',
            agency: 'AFIR',
            sector: 'Agricultură ecologică, managementul pesticidelor',
            maxGrant: '200.000 EUR',
            deadline: '30 Iun 2026 (sesiune închisă)',
            status: 'suspended',
            lastVerified: '2026-08-31',
            sourceUrl: 'https://www.afir.ro/dr-19',
            details: 'Include echipamente de protecție a plantelor care reduc utilizarea pesticidelor: sprayer-e cu precizie, sisteme GPS pentru aplicare variabilă. Intensitate: 100% (non-productiv).',
            notes: 'Sesiunea (3 Mar – 30 Iun 2026, termen prelungit de la 30 Apr) s-a închis conform calendarului — 8 proiecte depuse (680.419 EUR) din alocarea de 11.76M EUR. Sesiune nouă neconfirmată.'
        }
    ],
};

/** Slug categorie produs (ex. viticultura, viticol) → cheie în FUNDING_PROGRAMS */
function resolveFundingCategoryKey(category: unknown): string {
    const raw = String(category ?? '').trim();
    if (!raw) return '';
    const s = raw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    if (s === 'viticol' || s.startsWith('viticol-') || s.includes('viticult')) {
        return 'viticol';
    }
    return raw;
}

/** Programe active pentru categorie — aliniază viticultura/viticol la lista viticol. */
export function getActiveProgramsForCategory(category: unknown): FundingProgram[] {
    const key = resolveFundingCategoryKey(category);
    return (FUNDING_PROGRAMS[key] || []).filter((p) => p.status === 'active');
}

// Helper: toate programele (pentru Admin)
export function getAllPrograms(): FundingProgram[] {
    return Object.values(FUNDING_PROGRAMS).flat();
}
