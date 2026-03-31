/**
 * Conținut pagină 2 produs — aceleași reguli ca în PDF catalog (buildPDF / materiale).
 */

/**
 * Plan imagini pentru pagina de produs pe **site** (nu PDF).
 * - Niciodată nu repetăm imaginea principală (hero) în sloturile din secțiunea de detaliu.
 * - Două sloturi max. în layout-ul zig-zag (stânga/dreapta); restul intră în blocul „Galerie”.
 * - Ordonare: mai întâi `gallery`, apoi `extraPool`, fără duplicate.
 */
export function getWebProductDetailImagePlan(
    mainImageSrc: string,
    gallery?: string[] | null,
    extraPool?: string[] | null
): { slotLeft: string | null; slotRight: string | null; overflow: string[] } {
    const main = (mainImageSrc || '').trim();
    const norm = (u: string) => String(u || '').trim();
    const seen = new Set<string>();
    const ordered: string[] = [];
    const push = (u: string) => {
        const x = norm(u);
        if (!x || x === main || seen.has(x)) return;
        seen.add(x);
        ordered.push(x);
    };
    for (const u of Array.isArray(gallery) ? gallery : []) push(u);
    for (const u of Array.isArray(extraPool) ? extraPool : []) push(u);
    return {
        slotLeft: ordered[0] ?? null,
        slotRight: ordered[1] ?? null,
        overflow: ordered.slice(2),
    };
}

/**
 * Coloana stângă pag. 2: până la 2 imagini, ca în PDF (moodboard).
 * - Întâi `gallery` (fără imaginea principală).
 * - Completează din `extraPool` (ex. poze din blocuri detaliu sau galerie deduplicată pe site).
 * - Ca în PDF: 0 în galerie → două casete cu imaginea principală; 1 poză suplimentară → [extra, main].
 */
export function buildDetailMoodboardUrls(
    mainImageSrc: string,
    gallery?: string[] | null,
    extraPool?: string[] | null
): string[] {
    const main = (mainImageSrc || '').trim();
    const norm = (u: string) => String(u || '').trim();
    const out: string[] = [];
    const seen = new Set<string>();

    const pushUnique = (u: string) => {
        const x = norm(u);
        if (!x || seen.has(x)) return;
        seen.add(x);
        out.push(x);
    };

    for (const u of Array.isArray(gallery) ? gallery : []) {
        if (out.length >= 2) break;
        const x = norm(u);
        if (x && x !== main) pushUnique(x);
    }

    if (out.length < 2) {
        for (const u of Array.isArray(extraPool) ? extraPool : []) {
            if (out.length >= 2) break;
            const x = norm(u);
            if (x && x !== main) pushUnique(x);
        }
    }

    if (!main) {
        return out.slice(0, 2);
    }
    if (out.length === 0) {
        return [main, main];
    }
    if (out.length === 1) {
        return [out[0], main];
    }
    return out.slice(0, 2);
}

/** Paragraful principal sub „Prezentare tehnică” (getProfessionalProductLead). */
export function getBrochureDetailPageBody(
    slug: string | undefined,
    description: string,
    longDescription?: string
): string {
    if (slug === 'multisem-ads') {
        return 'Avers-Agro Multisem ADS este o semănătoare proiectată pentru lucrări conservative, cu utilizare posibilă în semănat direct, mini-till sau convențional, în funcție de configurația echipată. Ansamblul de brăzdare cu dublu disc, presiunea ridicată pe brăzdar și suspensia paralelogram urmăresc pătrunderea constantă în rest vegetal și menținerea unei adâncimi de semănat stabile.';
    }
    const long = (longDescription || '').trim();
    const short = (description || '').trim();
    return long || short || 'Prezentare tehnică în curs de actualizare.';
}

/** Bullet-uri standard sub prezentare (getProfessionalIntroBullets). */
export function getBrochureIntroBullets(slug: string | undefined): string[] {
    if (slug === 'multisem-ads') {
        return [
            'Configurația se alege în funcție de lățimea de lucru, numărul de rânduri, puterea tractorului și nivelul de rest vegetal din câmp.',
            'Stabilitatea la adâncime, copierea terenului și contactul sămânță-sol sunt criteriile principale urmărite în exploatare.',
            'Parametrii de lucru, echiparea și eligibilitatea pentru scheme de sprijin se confirmă separat, pe modelul ofertat.',
        ];
    }
    return [
        'Configurația finală se stabilește în raport cu lățimea de lucru, puterea tractorului și condițiile de exploatare.',
        'Datele tehnice complete, opționalele și cerințele de utilizare se validează pe modelul ofertat.',
    ];
}
