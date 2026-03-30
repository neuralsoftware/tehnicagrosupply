/**
 * Parsare nume / cod model pentru hero-ul paginii de produs — aceeași logică ca în PDF broșură.
 */

export type WebHeroTitleParts =
    | { mode: 'split'; machineName: string; modelLine: string }
    | { mode: 'stack'; lines: string[] };

export function getNameRestWithoutBrand(fullTitle: string, brand?: string): string {
    const b = (brand || '').trim();
    let rest = (fullTitle || '').trim() || 'UTILAJ';
    if (b && rest.toLowerCase().startsWith(`${b.toLowerCase()} `)) {
        rest = rest.slice(b.length).trim();
    }
    return rest;
}

/**
 * Extrage codul de model de la sfârșit (ex. „Desfrunzitor LB 260”, „Preutăietor MP 122”, „… SRBH 22”).
 * Evită falsurile în care un cuvânt lung (desfrunzitor, pretăietor) e tratat drept cod.
 */
export function tryExtractTrailingModelCode(rest: string): { descriptive: string; code: string } | null {
    const t = rest.trim();
    if (t.length < 3) return null;
    const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;
    const tokens = t.split(/\s+/).filter(Boolean);

    // „… + SCURT + CIFRE” (LB 260, MP 122, LR 350, VSE 430) — minim o denumire înainte
    if (tokens.length >= 3) {
        const last = tokens[tokens.length - 1];
        const prev = tokens[tokens.length - 2];
        if (
            last &&
            prev &&
            /^\d{2,4}$/.test(last) &&
            /^[A-Za-zĂÂÎȘȚăâîșț]{1,5}$/.test(prev)
        ) {
            const descriptive = tokens.slice(0, -2).join(' ').trim();
            if (descriptive.length >= 3) {
                return { descriptive, code: `${prev} ${last}`.trim() };
            }
        }
    }

    // Două cuvinte: „Plivitor SRB22” (cod lipit)
    if (tokens.length === 2) {
        const [a, b] = tokens;
        if (
            a.length >= 3 &&
            b &&
            /^[A-Za-z]{1,5}\d{2,4}[A-Za-z0-9]*$/i.test(b)
        ) {
            return { descriptive: a, code: b };
        }
    }

    const mLettersDigits = t.match(/^(.+?)\s+([A-Za-zĂÂÎȘȚăâîșț]{2,12})\s+(\d{1,4}[A-Za-z0-9./\-]*)\s*$/);
    if (mLettersDigits) {
        const descriptive = mLettersDigits[1].trim();
        if (wordCount(descriptive) >= 2 && descriptive.length >= 4) {
            return { descriptive, code: `${mLettersDigits[2]} ${mLettersDigits[3]}`.trim() };
        }
    }
    const mFused = t.match(/^(.+?)\s+([A-Za-z]{1,5}\d{2,4}[A-Za-z0-9]*)\s*$/);
    if (mFused && mFused[1].includes(' ') && wordCount(mFused[1].trim()) >= 2) {
        return { descriptive: mFused[1].trim(), code: mFused[2] };
    }
    const mShortAlpha = t.match(/^(.+?)\s+([A-Z]{2,5})\s*$/);
    if (mShortAlpha) {
        const descriptive = mShortAlpha[1].trim();
        if (wordCount(descriptive) >= 4 && /^[A-Z]{2,5}$/.test(mShortAlpha[2])) {
            return { descriptive, code: mShortAlpha[2] };
        }
    }
    return null;
}

function chunkDescriptiveTitleLines(descriptive: string): string[] {
    const parts = descriptive.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return [descriptive.toUpperCase()];
    const upper = parts.map((p) => p.toUpperCase());
    if (upper.length >= 4) {
        const mid = Math.ceil(upper.length / 2);
        return [upper.slice(0, mid).join(' '), upper.slice(mid).join(' ')];
    }
    if (upper.length === 3) {
        return [upper.slice(0, 2).join(' '), upper[2]];
    }
    if (upper.length === 2) {
        return [upper.join(' ')];
    }
    return [upper[0]];
}

function getHeroGiantLinesFromRest(rest: string, slug?: string): string[] {
    if (slug === 'multisem-ads') return ['MULTISEM', 'ADS'];
    const parts = rest.split(/\s+/).filter(Boolean);
    if (parts.length >= 3) {
        const mid = Math.ceil(parts.length / 2);
        return [parts.slice(0, mid).join(' ').toUpperCase(), parts.slice(mid).join(' ').toUpperCase()];
    }
    if (parts.length === 2) {
        return [parts[0].toUpperCase(), parts[1].toUpperCase()];
    }
    return [rest.toUpperCase()];
}

/** Titluri pentru coloana stânga hero: nume mașină + model (cod) evidențiat. */
export function getWebHeroTitleParts(fullTitle: string, brand?: string, slug?: string): WebHeroTitleParts {
    if (slug === 'multisem-ads') {
        return { mode: 'split', machineName: 'MULTISEM', modelLine: 'ADS' };
    }
    const rest = getNameRestWithoutBrand(fullTitle, brand);
    const extracted = tryExtractTrailingModelCode(rest);
    if (extracted && extracted.descriptive.trim().length > 0) {
        const lines = chunkDescriptiveTitleLines(extracted.descriptive);
        return {
            mode: 'split',
            machineName: lines.join(' '),
            modelLine: extracted.code.toUpperCase(),
        };
    }
    const stack = getHeroGiantLinesFromRest(rest, slug);
    if (stack.length >= 2) {
        return {
            mode: 'split',
            machineName: stack[0],
            modelLine: stack.slice(1).join(' '),
        };
    }
    return { mode: 'stack', lines: stack };
}

/**
 * Linia mare tip „cod model” (broșură) — doar pentru denumiri scurte, tip cod.
 * Dacă numele e lipit de o descriere lungă sau modelul e propoziție, folosim același
 * nivel ca titlul principală ca să nu apară totul uriaș.
 */
export function shouldUseGiantModelLine(modelLine: string): boolean {
    const t = (modelLine || '').trim();
    if (t.length < 2) return false;
    if (t.length > 18) return false;
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length > 2) return false;
    if (words.some((w) => w.length > 12)) return false;
    if (words.length === 1) {
        const w = words[0];
        if (w.length > 14) return false;
        if (/\d/.test(w)) return true;
        // Un cuvânt doar litere, lung: tip utilaj (desfrunzitor, pretăietor), nu cod ADS/ST120
        if (w.length > 8) return false;
        return /^[A-Za-zĂÂÎȘȚăâîșț]{2,8}$/.test(w);
    }
    return true;
}
