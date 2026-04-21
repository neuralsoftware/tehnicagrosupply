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
            status: 'active',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.apia.org.ro/ro/campania-2026',
            details: 'Obligatoriu: acoperirea solului în perioada 15 iunie – 15 octombrie. Resturile vegetale trebuie menținute la suprafață, fără îngropare. Utilajele de tip Chain Disc / grape cu lanțuri sunt soluția ideală de conformitate. Nerespectarea GAEC 6 atrage penalități de -3% din plățile directe.',
            notes: 'Campania 2026 — cerere unică în curs de depunere'
        },
        {
            code: 'DR-12',
            title: 'Investiții în exploatații agricole tinere/nou-înființate',
            agency: 'AFIR',
            sector: 'Cultură mare, legumicol, pomicol',
            maxGrant: '300.000 EUR (simplu) / 2M EUR (complex)',
            deadline: 'Estimat T3 2026',
            status: 'upcoming',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.afir.ro/dr-12',
            details: 'Finanțare utilaje și echipamente agricole pentru fermieri tineri (sub 40 ani) și exploatații nou-înființate. Intensitatea ajutorului: 50% (standard) sau 65% (zone defavorizate). Include utilaje pregătire sol, semănat, recoltare.',
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
            status: 'active',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.apia.org.ro/ro/campania-2026/eco-scheme',
            details: 'Eligibil pentru fermieri care practică No-Till sau Mini-Till. Semănătoarea directă trebuie să nu inverseze solul. Semănătorile Avers-Agro Multisem ADS îndeplinesc toate cerințele tehnice. Plata este per hectar, indiferent de dimensiunea fermei.',
            notes: 'Activ — cerere 2026 în curs'
        },
        {
            code: 'DR-12',
            title: 'Investiții în exploatații agricole tinere/nou-înființate',
            agency: 'AFIR',
            sector: 'Cultură mare, legumicol',
            maxGrant: '300.000 EUR (simplu) / 2M EUR (complex)',
            deadline: 'Estimat T3 2026',
            status: 'upcoming',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.afir.ro/dr-12',
            details: 'Include utilaje de semănat și fertilizat ca investiții eligibile. Intensitatea ajutorului: 50-65%.'
        }
    ],

    'recoltare-logistica': [
        {
            code: 'DR-12',
            title: 'Investiții în exploatații agricole tinere/nou-înființate',
            agency: 'AFIR',
            sector: 'Cultură mare, legumicol, viticol',
            maxGrant: '300.000 EUR (simplu) / 2M EUR (complex)',
            deadline: 'Estimat T3 2026',
            status: 'upcoming',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.afir.ro/dr-12',
            details: 'Remorcile de transbordare cereale, echipamente de logistică agricolă sunt eligibile ca investiții în utilaje. Fermieri sub 40 ani, exploatații noi.'
        },
        {
            code: 'DR-23',
            title: 'Investiții în procesare și comercializare produse agricole',
            agency: 'AFIR',
            sector: 'Procesare și logistică produse vegetale',
            maxGrant: '10M EUR per beneficiar',
            deadline: 'Sesiunea 01/2026 ÎNCHISĂ — 16 Feb 2026',
            status: 'suspended',
            lastVerified: '2026-04-21',
            sourceUrl: 'https://www.afir.ro/domenii-de-interventie/detalii-si-anexe-dr-23/',
            details: 'Include echipamente de transport, stocare și procesare primară a produselor agricole. Relevant pentru remorcile de transbordare cu capacitate mare. Alocare totală: 164.9M EUR (82.4M înființare + 82.4M modernizare).',
            notes: 'Sesiunea 01/2026 s-a ÎNCHIS pe 16 feb 2026. Monitorizează afir.ro pentru sesiune nouă.'
        }
    ],

    'viticol': [
        {
            code: 'IS-V-02',
            title: 'Investiții în active corporale și necorporale — Viticultură',
            agency: 'APIA',
            sector: 'Viticultură — vin, struguri de masă',
            maxGrant: '1.5M EUR (complex) / 400.000 EUR (simplu)',
            deadline: 'Sesiuni anuale APIA',
            status: 'active',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.apia.org.ro/ro/interventii-sectoriale/sectorul-vitivinicol',
            details: 'Finanțare pentru utilaje specifice viticulturii: tratoare viticole, echipamente de lucrul solului în vie, sisteme de irigare, utilaje de recoltare. Intensitate ajutor: 40-50%.',
            notes: 'Program activ — verifică pe APIA sesiunea curentă'
        },
        {
            code: 'IS-V-07',
            title: 'Investiții pentru creșterea durabilității producției de vin',
            agency: 'APIA',
            sector: 'Viticultură — durabilitate și eco-inovare',
            maxGrant: '650.000 EUR (complex) / 250.000 EUR (simplu)',
            deadline: 'Sesiuni anuale APIA',
            status: 'active',
            lastVerified: '2026-03-24',
            sourceUrl: 'https://www.apia.org.ro/ro/interventii-sectoriale/sectorul-vitivinicol',
            details: 'Specific pentru investiții care reduc amprenta de carbon: utilaje electrice sau hibride în vie, sisteme de precizie, senzori, echipamente pentru reducerea pesticidelor.'
        },
        {
            code: 'DR-17',
            title: 'Investiții în sectorul hamei și/sau struguri de masă',
            agency: 'AFIR',
            sector: 'Viticultură — struguri de masă, hamei',
            maxGrant: '1.5M EUR per proiect',
            deadline: 'Estimat lansare sesiune 2026 — TBD',
            status: 'upcoming',
            lastVerified: '2026-04-21',
            sourceUrl: 'https://www.afir.ro/comunicate/consultare-publica-lansata-de-afir-pentru-investitiile-in-struguri-de-masa/',
            details: 'Alocare 45M EUR. Include înființare și modernizare plantații, utilaje specifice pentru struguri de masă și hamei, sisteme de irigare, echipamente de sortare și ambalare. Beneficiari eligibili: fermieri (nu persoane fizice), cooperative agricole, grupuri de producători.',
            notes: 'Consultare publică ghid publicată ian 2026. Sesiunea de depunere nu a fost deschisă încă — urmărește afir.ro.'
        }
    ],

    'legumicol': [
        {
            code: 'DR-16',
            title: 'Investiții în sectorul legume și/sau cartofi',
            agency: 'AFIR',
            sector: 'Legumicultură, cartofi, spații protejate',
            maxGrant: '2M EUR (complex) / 300.000 EUR (simplu) / 700.000 EUR (cartofi)',
            deadline: 'Sesiunea 01/2026 ÎNCHISĂ — 20 Mar 2026',
            status: 'suspended',
            lastVerified: '2026-04-21',
            sourceUrl: 'https://www.afir.ro/domenii-de-interventie/detalii-si-anexe-dr-16/',
            details: 'Alocare 151.3M EUR (70.4M legume ferme individuale + 51M cartofi + 30M forme asociative). Investiții în: înființare și modernizare ferme legumicole, spații protejate (sere, solarii), echipamente de irigare, utilaje de lucrul solului în legumicultură, sisteme de avertizare. Intensitate ajutor: 50-65%.',
            notes: 'Sesiunea 01/2026 s-a ÎNCHIS pe 20 mar 2026 (deschisă 19 ian 2026). Urmărește afir.ro pentru sesiune nouă.'
        }
    ],

    'protectia-plantelor': [
        {
            code: 'DR-19',
            title: 'Investiții neproductive în exploatații agricole',
            agency: 'AFIR',
            sector: 'Agricultură ecologică, managementul pesticidelor',
            maxGrant: '200.000 EUR',
            deadline: '30 Apr 2026 (sesiune activă)',
            status: 'active',
            lastVerified: '2026-04-21',
            sourceUrl: 'https://www.afir.ro/domenii-de-interventie/detalii-si-anexe-dr-19',
            details: 'Include echipamente de protecție a plantelor care reduc utilizarea pesticidelor: sprayer-e cu precizie, sisteme GPS pentru aplicare variabilă. Intensitate: 100% (non-productiv). Alocare: 11.76M EUR.',
            notes: 'ACTIV — sesiune deschisă 9 mar 2026, deadline 30 apr 2026. Depunere online pe afir.ro.'
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
