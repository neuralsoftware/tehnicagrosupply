/**
 * Generează CRM_DATABASE_MAP.md din schema OpenAPI expusă de PostgREST (Supabase CRM).
 * Încarcă `.env` apoi `.env.local` (local suprascrie). Variabile: CRM_SUPABASE_URL, CRM_SUPABASE_SERVICE_ROLE_KEY.
 *
 * PostgREST poate livra tabele în `definitions` (Swagger 2) sau numai prin `$ref` din `paths`.
 */

import { config } from 'dotenv';
import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const pathEnv = resolve(root, '.env');
const pathEnvLocal = resolve(root, '.env.local');

const loadedEnvFiles: string[] = [];
if (existsSync(pathEnv)) {
    config({ path: pathEnv });
    loadedEnvFiles.push('.env');
}
if (existsSync(pathEnvLocal)) {
    config({ path: pathEnvLocal, override: true });
    loadedEnvFiles.push('.env.local');
}

/** Elimină ghilimele sau spații din valorile copiate din unele editoare .env */
function normalizeEnvValue(v: string | undefined): string {
    if (v === undefined) return '';
    let s = v.trim();
    if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
    ) {
        s = s.slice(1, -1).trim();
    }
    return s;
}

/**
 * Cheia JWT uneori e lipită din JSON / markdown cu [ ] sau ghilimele în plus — altfel PostgREST răspunde 401.
 */
function normalizeServiceRoleKey(v: string | undefined): string {
    let s = normalizeEnvValue(v);
    s = s.replace(/^\s*\[\s*["']?/, '').replace(/["']?\s*\]\s*$/, '');
    s = normalizeEnvValue(s);
    return s;
}

const rawUrl = normalizeEnvValue(process.env.CRM_SUPABASE_URL);
const apikeyRaw = normalizeServiceRoleKey(process.env.CRM_SUPABASE_SERVICE_ROLE_KEY);

if (!rawUrl || !apikeyRaw) {
    console.error('Eroare: CRM_SUPABASE_URL sau CRM_SUPABASE_SERVICE_ROLE_KEY lipsesc după încărcarea variabilelor.');
    console.error(`Director de lucru: ${root}`);
    console.error(`  .env        — ${existsSync(pathEnv) ? 'găsit' : 'LIPSEȘTE'}`);
    console.error(`  .env.local  — ${existsSync(pathEnvLocal) ? 'găsit' : 'LIPSEȘTE'}`);
    console.error(
        `Fișiere încărcate de dotenv: ${loadedEnvFiles.length ? loadedEnvFiles.join(' → ') : 'niciunul (ambele lipsesc?)'}`
    );
    process.exit(1);
}

const baseUrl = rawUrl.replace(/\/+$/, '');
const apikey = apikeyRaw;

console.log(
    '[map-db] Fișiere env:',
    loadedEnvFiles.length ? loadedEnvFiles.join(' → ') : '(nici .env, nici .env.local)'
);
console.log('[map-db] CRM_SUPABASE_URL:', baseUrl);
console.log('[map-db] Cheie găsită (primele 10 caractere):', `${apikey.slice(0, 10)}...`);

interface JsonSchemaLike {
    type?: string;
    format?: string;
    description?: string;
    nullable?: boolean;
    items?: JsonSchemaLike;
    properties?: Record<string, JsonSchemaLike>;
    oneOf?: JsonSchemaLike[];
    anyOf?: JsonSchemaLike[];
    allOf?: JsonSchemaLike[];
    $ref?: string;
}

type SwaggerDoc = {
    swagger?: string;
    openapi?: string;
    definitions?: Record<string, JsonSchemaLike>;
    paths?: Record<string, Record<string, unknown>>;
    components?: { schemas?: Record<string, JsonSchemaLike> };
};

function typeLabel(prop: JsonSchemaLike): string {
    if (prop.$ref) return prop.$ref;
    if (prop.oneOf?.length) return prop.oneOf.map((p) => typeLabel(p)).join(' | ');
    if (prop.anyOf?.length) return prop.anyOf.map((p) => typeLabel(p)).join(' | ');
    let t = prop.type ?? '(nedefinit)';
    if (prop.type === 'array' && prop.items) {
        t = `array<${typeLabel(prop.items)}>`;
    }
    if (prop.type === 'object' && prop.properties) {
        t = 'object';
    }
    return t;
}

function formatLabel(prop: JsonSchemaLike): string {
    return (prop.format ?? '—').toString();
}

function isRequired(
    requiredList: string[] | undefined,
    key: string,
    prop: JsonSchemaLike
): string {
    const inRequired = requiredList?.includes(key) ?? false;
    if (prop.nullable === true) return 'Nu';
    return inRequired ? 'Da (NOT NULL)' : 'Nu';
}

/** Colectează scheme din paths prin $ref (când `definitions` există dar trebuie legate de resurse). */
function collectSchemasFromPathRefs(doc: SwaggerDoc): Record<string, JsonSchemaLike> {
    const out: Record<string, JsonSchemaLike> = {};
    const defs = { ...doc.definitions, ...doc.components?.schemas };
    const paths = doc.paths;
    if (!paths) return out;

    const visitSchema = (schema: unknown) => {
        if (!schema || typeof schema !== 'object') return;
        const s = schema as { $ref?: string };
        if (typeof s.$ref === 'string') {
            if (s.$ref.startsWith('#/definitions/')) {
                const name = s.$ref.replace('#/definitions/', '');
                if (defs[name]) out[name] = defs[name];
            }
            if (s.$ref.startsWith('#/components/schemas/')) {
                const name = s.$ref.replace('#/components/schemas/', '');
                if (doc.components?.schemas?.[name]) {
                    out[name] = doc.components.schemas[name];
                }
            }
        }
    };

    for (const [pathKey, methods] of Object.entries(paths)) {
        if (pathKey === '/' || pathKey.includes('rpc/')) continue;
        if (!methods || typeof methods !== 'object') continue;
        for (const op of Object.values(methods)) {
            if (!op || typeof op !== 'object') continue;
            const opObj = op as Record<string, unknown>;
            const responses = opObj.responses as Record<string, unknown> | undefined;
            for (const res of Object.values(responses || {})) {
                if (!res || typeof res !== 'object') continue;
                visitSchema((res as { schema?: unknown }).schema);
            }
            const params = opObj.parameters as unknown[] | undefined;
            for (const p of params || []) {
                if (!p || typeof p !== 'object') continue;
                visitSchema((p as { schema?: unknown }).schema);
            }
            const requestBody = opObj.requestBody as Record<string, unknown> | undefined;
            if (requestBody?.content && typeof requestBody.content === 'object') {
                for (const c of Object.values(requestBody.content as Record<string, { schema?: unknown }>)) {
                    visitSchema(c?.schema);
                }
            }
        }
    }
    return out;
}

function extractAllTableSchemas(doc: SwaggerDoc): Record<string, JsonSchemaLike> {
    const merged: Record<string, JsonSchemaLike> = {};
    if (doc.definitions) {
        for (const [k, v] of Object.entries(doc.definitions)) {
            merged[k] = v;
        }
    }
    if (doc.components?.schemas) {
        for (const [k, v] of Object.entries(doc.components.schemas)) {
            merged[k] = v;
        }
    }
    const fromPaths = collectSchemasFromPathRefs(doc);
    for (const [k, v] of Object.entries(fromPaths)) {
        if (!merged[k]) merged[k] = v;
    }
    return merged;
}

function shouldSkipSchemaName(name: string): boolean {
    const n = name.toLowerCase();
    if (n === 'error') return true;
    return false;
}

function renderTableMarkdown(
    tableName: string,
    schema: JsonSchemaLike,
    lines: string[]
): void {
    if (!schema.properties || schema.type !== 'object') {
        lines.push(`## ${tableName}`);
        lines.push('');
        lines.push(
            '*Schema fără `properties` la nivel obiect — poate fi doar `$ref` sau tip nestandard.*'
        );
        lines.push('');
        return;
    }
    const required = Array.isArray((schema as { required?: string[] }).required)
        ? (schema as { required: string[] }).required
        : undefined;
    lines.push(`## ${tableName}`);
    lines.push('');
    lines.push('| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |');
    lines.push('| --- | --- | --- | --- |');
    const propKeys = Object.keys(schema.properties).sort((a, b) => a.localeCompare(b, 'ro'));
    for (const col of propKeys) {
        const prop = schema.properties[col];
        lines.push(
            `| \`${col}\` | ${typeLabel(prop)} | ${formatLabel(prop)} | ${isRequired(required, col, prop)} |`
        );
    }
    lines.push('');
}

async function main() {
    const specUrl = `${baseUrl}/rest/v1/?apikey=${encodeURIComponent(apikey)}`;

    const res = await fetch(specUrl, {
        headers: {
            Accept: 'application/openapi+json, application/json',
            // Obligatoriu Supabase PostgREST: aceeași cheie service_role ca în .env
            apikey,
            Authorization: `Bearer ${apikey}`,
        },
    });

    const lines: string[] = [];
    lines.push('# Hartă bază de date CRM (Supabase / PostgREST)');
    lines.push('');
    lines.push(`Generat: \`${new Date().toISOString()}\``);
    lines.push(
        `Endpoint: \`${baseUrl}/rest/v1/\` (GET; \`apikey\` în query + headere \`apikey\` / \`Authorization: Bearer\` — cheia **nu** se pune în acest fișier).`
    );
    lines.push('');
    lines.push(
        '> Dacă lista de tabele e goală: verifică că `CRM_SUPABASE_URL` și `CRM_SUPABASE_SERVICE_ROLE_KEY` sunt din **același** proiect Supabase CRM și că tabelele sunt în schema `public` expusă la API.'
    );
    lines.push('');

    if (!res.ok) {
        const body = await res.text();
        console.error(`Eșec HTTP ${res.status} la descărcarea OpenAPI CRM.`);
        console.error(body.slice(0, 2000));
        console.error(
            '\nVerifică în `.env` / `.env.local` că URL-ul și service_role sunt din **același** proiect Supabase CRM (Settings → API).'
        );
        console.error('CRM_DATABASE_MAP.md nu a fost suprascris.');
        process.exit(1);
    }

    const doc = (await res.json()) as SwaggerDoc & { info?: { title?: string; version?: string } };

    if (doc.info?.title) {
        lines.push(`**API:** ${doc.info.title}${doc.info.version ? ` (v${doc.info.version})` : ''}`);
        lines.push('');
    }

    const schemas = extractAllTableSchemas(doc);
    const tableNames = Object.keys(schemas)
        .filter((k) => !shouldSkipSchemaName(k))
        .sort((a, b) => a.localeCompare(b, 'ro'));

    lines.push('## Tabele (resurse din OpenAPI)');
    lines.push('');
    if (tableNames.length === 0) {
        lines.push(
            '*Nu s-au găsit definiții de tabele în document. Proiectul poate să nu expună încă tabele prin PostgREST sau documentul e minimal (doar introspecție).*'
        );
        lines.push('');
    } else {
        for (const t of tableNames) {
            lines.push(`- **${t}**`);
        }
        lines.push('');
        lines.push('---');
        lines.push('');
        for (const tableName of tableNames) {
            renderTableMarkdown(tableName, schemas[tableName], lines);
        }
    }

    lines.push('---');
    lines.push('');
    lines.push('## Anexă: coloane setate de site la `client_tasks`');
    lines.push('');
    lines.push(
        'Surse: `src/app/api/leads/route.ts`. Orice altă coloană (ex. responsabil, notificări) lipsește din site și se completează în CRM sau prin trigger.'
    );
    lines.push('');
    lines.push('| Nume coloană | Setare din API |');
    lines.push('| --- | --- |');
    lines.push('| `client_id` | ID client creat / găsit la duplicat |');
    lines.push('| `title` | `🚨 LEAD NOU: Cerere ofertă website` |');
    lines.push(
        '| `description` | Text compilat: sursă, produs, mesaj, hectare, culturi, urgență, estimări ROI |'
    );
    lines.push(
        '| `due_date` | `Date.now()` + 3 zile, ISO string (`toISOString()`) |'
    );
    lines.push("| `status` | `'Nou'` |");
    lines.push("| `resolution` | `'EMPTY'` |");
    lines.push('| `is_completed` | `0` (integer, nu boolean) |');
    lines.push('');

    const outPath = resolve(process.cwd(), 'CRM_DATABASE_MAP.md');
    writeFileSync(outPath, lines.join('\n'), 'utf-8');
    console.log(`S-a scris ${outPath} (${tableNames.length} tabele).`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
