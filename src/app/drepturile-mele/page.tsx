import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_CONTACT } from '@/lib/site-contact';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';

export const metadata: Metadata = {
    title: 'Drepturile mele (GDPR) | TEHNICAGRO SUPPLY',
    description:
        'Cum ceri accesul, corectarea sau ștergerea datelor tale personale de la TehnicAgro Supply: ce scrii în cerere, unde o trimiți și în cât timp primești răspuns.',
    alternates: { canonical: 'https://tehnicagrosupply.ro/drepturile-mele' },
};

const REQUEST_TEMPLATE = `Către: TEHNICAGRO SUPPLY S.R.L.
Subiect: Cerere privind datele mele personale

Nume și prenume: ...........................................
Email folosit în relația cu dumneavoastră: .................
Telefon (dacă l-am folosit): ...............................

Solicit, în temeiul Regulamentului (UE) 2016/679:
[ ] să îmi comunicați ce date personale dețineți despre mine (art. 15)
[ ] să corectați următoarele date inexacte: .................
[ ] să ștergeți datele mele (art. 17)
[ ] să îmi trimiteți datele într-un fișier portabil (art. 20)
[ ] să încetați să îmi mai trimiteți comunicări comerciale (art. 21)
[ ] să restricționați prelucrarea, pentru motivul: ..........

Data: ............   Semnătura: ............`;

const STEPS = [
    {
        n: '1',
        title: 'Scrie-ne un email',
        body: (
            <>
                Trimite cererea la{' '}
                <a href={`mailto:${SITE_CONTACT.email}`} className="font-semibold text-emerald-700 hover:underline">
                    {SITE_CONTACT.email}
                </a>
                , de preferință de pe adresa pe care ai folosit-o în relația cu noi. Poți folosi modelul de mai jos
                sau poți scrie cu cuvintele tale — nu există o formă obligatorie.
            </>
        ),
    },
    {
        n: '2',
        title: 'Îți confirmăm primirea',
        body: <>Îți răspundem că am primit cererea și îți spunem dacă mai avem nevoie de vreo lămurire.</>,
    },
    {
        n: '3',
        title: 'Verificăm că ești chiar tu',
        body: (
            <>
                Dacă din cerere nu reiese clar cine ești, îți putem cere o informație suplimentară pe care doar tu o
                ai (de exemplu numărul de telefon cu care ne-ai contactat).{' '}
                <strong>Nu îți cerem niciodată copie după buletin, CNP sau date de card.</strong>
            </>
        ),
    },
    {
        n: '4',
        title: 'Primești răspunsul',
        body: (
            <>
                În cel mult <strong>o lună</strong> de la primirea cererii. Dacă e complicată, termenul poate fi
                prelungit cu încă două luni, dar te anunțăm din prima lună și îți explicăm de ce. Totul e{' '}
                <strong>gratuit</strong>.
            </>
        ),
    },
] as const;

export default function MyRights() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
                <h1 className="mb-3 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
                    Drepturile mele
                </h1>
                <p className="mb-8 text-lg text-slate-600">
                    Datele tale rămân ale tale. Pagina aceasta îți arată exact ce poți cere de la noi și cum, fără
                    formulare complicate și fără costuri.
                </p>

                <h2 className="mt-10 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">
                    Ce poți cere
                </h2>
                <ul className="mb-6 list-disc space-y-2 pl-6 text-slate-600">
                    <li>
                        <strong>Să vezi ce avem despre tine</strong> — îți trimitem o copie a tuturor datelor.
                    </li>
                    <li>
                        <strong>Să corectăm ce e greșit</strong> — un nume scris eronat, un telefon vechi.
                    </li>
                    <li>
                        <strong>Să ștergem tot</strong> — o facem, dacă nu avem o obligație legală să păstrăm ceva
                        (de exemplu o factură deja emisă).
                    </li>
                    <li>
                        <strong>Să nu îți mai scriem</strong> — te scoatem imediat din lista de comunicări
                        comerciale.
                    </li>
                    <li>
                        <strong>Să primești datele într-un fișier</strong> pe care îl poți duce oriunde.
                    </li>
                    <li>
                        <strong>Să te opui</strong> unei prelucrări pe care o facem pe temeiul interesului legitim.
                    </li>
                </ul>

                <h2 className="mt-10 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">
                    Cum decurge, pas cu pas
                </h2>
                <ol className="mb-6 space-y-4">
                    {STEPS.map((s) => (
                        <li key={s.n} className="flex gap-4">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                                {s.n}
                            </span>
                            <div className="pt-0.5">
                                <p className="font-bold text-slate-900">{s.title}</p>
                                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <h2 className="mt-10 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">
                    Model de cerere
                </h2>
                <p className="mb-3 text-slate-600">
                    Copiază textul de mai jos în email, bifează ce te interesează și completează punctele.
                </p>
                <pre className="mb-6 overflow-x-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-5 font-mono text-xs leading-relaxed text-slate-700">
                    {REQUEST_TEMPLATE}
                </pre>

                <h2 className="mt-10 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">
                    Cookie-uri: le schimbi singur, pe loc
                </h2>
                <p className="mb-4 text-slate-600">
                    Pentru cookie-uri nu e nevoie să ne scrii. Alegerea ta se schimbă instantaneu, de aici sau din
                    subsolul oricărei pagini:
                </p>
                <div className="mb-6">
                    <CookieSettingsButton label="Schimbă setările de cookie-uri" />
                </div>

                <h2 className="mt-10 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">
                    Dacă nu ești mulțumit de răspuns
                </h2>
                <p className="mb-4 text-slate-600">
                    Ai dreptul să te plângi autorității de supraveghere sau să te adresezi direct instanței. Datele
                    autorității:
                </p>
                <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50 p-6 text-sm text-slate-700">
                    <strong>
                        Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
                    </strong>
                    <br />
                    B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, București, cod 010336
                    <br />
                    Telefon: +40.318.059.211 · Email: anspdcp@dataprotection.ro
                    <br />
                    <a
                        href="https://www.dataprotection.ro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                    >
                        www.dataprotection.ro
                    </a>
                </div>

                <h2 className="mt-10 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">
                    Cui te adresezi
                </h2>
                <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-6 text-sm text-slate-700">
                    <strong>{SITE_CONTACT.legalName}</strong>
                    <br />
                    {SITE_CONTACT.addressFull}
                    <br />
                    CUI: {SITE_CONTACT.cui} · Reg. Com.: {SITE_CONTACT.regCom}
                    <br />
                    Email:{' '}
                    <a href={`mailto:${SITE_CONTACT.email}`} className="text-emerald-600 hover:underline">
                        {SITE_CONTACT.email}
                    </a>
                    <br />
                    Telefon: {SITE_CONTACT.phoneDisplay} ({SITE_CONTACT.officeHours})
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-8">
                    <Link href="/" className="font-medium text-emerald-600 hover:underline">
                        &larr; Înapoi la pagina principală
                    </Link>
                    <Link href="/privacy-policy" className="text-sm font-medium text-slate-500 hover:underline">
                        Politica de confidențialitate
                    </Link>
                </div>
            </div>
        </div>
    );
}
