import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_CONTACT } from '@/lib/site-contact';
import { FORM_CONSENT_VERSION } from '@/lib/form-consent';
import { PROCESSORS } from '@/data/gdpr-processors';

export const metadata: Metadata = {
    title: 'Politica de Confidențialitate | TEHNICAGRO SUPPLY',
    description:
        'Ce date personale colectăm prin tehnicagrosupply.ro, în ce scop, pe ce temei legal, cui le transmitem, cât le păstrăm și ce drepturi ai asupra lor.',
    alternates: { canonical: 'https://tehnicagrosupply.ro/privacy-policy' },
};

/** Scop → temei legal → date → durată. Structura cerută de art. 13 alin. (1)–(2) GDPR. */
const PURPOSES = [
    {
        scop: 'Îți răspundem la cererea de ofertă sau la mesajul trimis prin formular',
        temei: 'Demersuri precontractuale, la cererea ta — art. 6 alin. (1) lit. b',
        date: 'Nume, telefon, email, județ, CUI/CIF, suprafață, culturi, orizont de investiție, mesajul scris',
        durata: '3 ani de la ultimul contact',
    },
    {
        scop: 'Îți generăm și trimitem raportul de audit din calculatorul ROI',
        temei: 'Demersuri precontractuale, la cererea ta — art. 6 alin. (1) lit. b',
        date: 'Nume, email, județ, hectare, culturi, valorile calculate',
        durata: '3 ani de la ultimul contact',
    },
    {
        scop: 'Îți trimitem oferte, noutăți și invitații la demonstrații, dacă ai bifat asta',
        temei: 'Consimțământ — art. 6 alin. (1) lit. a GDPR și art. 12 din Legea 506/2004',
        date: 'Nume, email, telefon',
        durata: 'Până la retragerea acordului sau maximum 24 de luni de la ultima confirmare',
    },
    {
        scop: 'Măsurăm cum e folosit site-ul, ca să știm ce să îmbunătățim',
        temei: 'Consimțământ pentru categoria „Analiză” — art. 6 alin. (1) lit. a',
        date: 'Adresă IP, tip de browser și dispozitiv, pagini vizitate, durata vizitei',
        durata: 'Maximum 14 luni în Google Analytics',
    },
    {
        scop: 'Măsurăm ce reclamă te-a adus pe site și îți afișăm anunțuri relevante',
        temei: 'Consimțământ pentru categoria „Marketing” — art. 6 alin. (1) lit. a',
        date: 'Identificatori de click (gclid), parametri de campanie (UTM), pagina de proveniență',
        durata: 'Maximum 24 de luni',
    },
    {
        scop: 'Protejăm formularele împotriva trimiterilor automate și a abuzurilor',
        temei: 'Interes legitim — securitatea serviciului, art. 6 alin. (1) lit. f',
        date: 'Adresă IP (ținută temporar în memoria serverului, nu în baza de date)',
        durata: '15 minute',
    },
    {
        scop: 'Păstrăm dovada acordurilor pe care le-ai dat sau le-ai refuzat',
        temei: 'Obligație legală de a demonstra consimțământul — art. 7 alin. (1) și art. 5 alin. (2)',
        date: 'Textul exact bifat, momentul, versiunea politicii, un hash al adresei IP',
        durata: '3 ani după încetarea prelucrării la care se referă',
    },
    {
        scop: 'Emitem și arhivăm facturi și documente contabile, dacă devii client',
        temei: 'Obligație legală — art. 6 alin. (1) lit. c, cu Legea 82/1991',
        date: 'Denumire, CUI, adresă, date de facturare',
        durata: '10 ani de la închiderea exercițiului financiar',
    },
] as const;

const RIGHTS = [
    ['Acces', 'Să afli ce date avem despre tine și să primești o copie.'],
    ['Rectificare', 'Să corectăm datele greșite sau să completăm ce lipsește.'],
    ['Ștergere', 'Să ștergem datele, când nu mai avem un motiv legal să le păstrăm.'],
    ['Restricționare', 'Să „înghețăm” prelucrarea cât timp verificăm o contestație de-a ta.'],
    ['Portabilitate', 'Să primești datele într-un fișier pe care îl poți duce în altă parte.'],
    ['Opoziție', 'Să te opui prelucrării întemeiate pe interes legitim, inclusiv marketingului direct.'],
    ['Retragerea acordului', 'Să retragi oricând un acord dat. Retragerea nu afectează ce s-a făcut legal până atunci.'],
    ['Plângere', 'Să sesizezi autoritatea de supraveghere sau instanța, dacă nu ești mulțumit de răspunsul nostru.'],
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mt-12 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">{children}</h2>
    );
}

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
                <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
                    Politica de Confidențialitate
                </h1>
                <p className="mb-8 text-sm text-slate-500">
                    Versiunea {FORM_CONSENT_VERSION} · în vigoare de la 3 septembrie 2026
                </p>

                <p className="mb-6 text-lg text-slate-600">
                    Documentul acesta spune, în cuvinte simple, ce date personale colectăm prin site-ul
                    tehnicagrosupply.ro, de ce le colectăm, cui ajung, cât le ținem și ce poți cere de la noi în
                    legătură cu ele.
                </p>

                <SectionTitle>1. Cine răspunde de datele tale</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Operatorul datelor tale cu caracter personal, adică firma care decide de ce și cum sunt
                    prelucrate, este:
                </p>
                <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-6 text-sm text-slate-700">
                    <strong>{SITE_CONTACT.legalName}</strong>
                    <br />
                    Sediu social: {SITE_CONTACT.addressFull}
                    <br />
                    CUI: {SITE_CONTACT.cui} · Nr. Reg. Comerțului: {SITE_CONTACT.regCom}
                    <br />
                    Email:{' '}
                    <a href={`mailto:${SITE_CONTACT.email}`} className="text-emerald-600 hover:underline">
                        {SITE_CONTACT.email}
                    </a>
                    <br />
                    Telefon: {SITE_CONTACT.phoneDisplay}
                </div>
                <p className="mb-4 text-slate-600">
                    Nu avem obligația legală de a numi un responsabil cu protecția datelor (DPO), pentru că
                    activitatea noastră principală nu constă în monitorizarea pe scară largă a persoanelor. Pentru
                    orice chestiune legată de date, scrie la adresa de email de mai sus.
                </p>

                <SectionTitle>2. Ce date colectăm și de unde</SectionTitle>
                <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-600">
                    <li>
                        <strong>Date pe care ni le dai tu:</strong> când completezi un formular de contact, ceri o
                        ofertă sau folosești calculatorul ROI — nume, telefon, email, județ, CUI/CIF, suprafața
                        fermei, culturile, orizontul de investiție și mesajul scris de tine.
                    </li>
                    <li>
                        <strong>Date despre acordurile tale:</strong> ce ai bifat sau ai refuzat, textul exact care
                        îți era afișat atunci, momentul și versiunea politicii în vigoare.
                    </li>
                    <li>
                        <strong>Date colectate automat, doar cu acordul tău:</strong> prin cookie-uri și tehnologii
                        similare — adresă IP, tip de browser și dispozitiv, pagini vizitate, durata vizitei.
                    </li>
                    <li>
                        <strong>Date despre cum ai ajuns la noi, doar cu acordul tău pentru marketing:</strong>
                        {' '}pagina de proveniență, parametrii campaniei (UTM) și identificatorul de click din
                        reclamele Google (gclid). Acestea sunt legate de cererea ta în evidența noastră internă.
                    </li>
                </ul>
                <p className="mb-4 text-slate-600">
                    Nu colectăm categorii speciale de date (sănătate, convingeri, date biometrice) și nu cerem
                    niciodată CNP-ul sau date de card prin site.
                </p>

                <SectionTitle>3. De ce prelucrăm datele și pe ce temei</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Fiecare prelucrare are un scop și un temei legal distinct. Iată toate scopurile, fără excepție:
                </p>
                <div className="mb-4 overflow-x-auto">
                    <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                <th className="py-2 pr-4 font-bold">Scopul</th>
                                <th className="py-2 pr-4 font-bold">Temeiul legal</th>
                                <th className="py-2 pr-4 font-bold">Datele folosite</th>
                                <th className="py-2 font-bold">Cât păstrăm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PURPOSES.map((p) => (
                                <tr key={p.scop} className="border-b border-slate-100 align-top">
                                    <td className="py-3 pr-4 font-medium text-slate-800">{p.scop}</td>
                                    <td className="py-3 pr-4 text-slate-600">{p.temei}</td>
                                    <td className="py-3 pr-4 text-slate-600">{p.date}</td>
                                    <td className="py-3 font-medium text-slate-700">{p.durata}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mb-4 text-slate-600">
                    <strong>Nu luăm decizii automate</strong> care să producă efecte juridice asupra ta și nu facem
                    profilare în sensul art. 22 GDPR. Scorul intern al unui prospect, dacă există, este doar un
                    ajutor pentru echipa de vânzări; orice decizie o ia un om.
                </p>

                <SectionTitle>4. Ești obligat să ne dai aceste date?</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Nu. Nicio dată nu îți este cerută prin lege sau prin contract. Dar dacă nu ne dai numele și cel
                    puțin o modalitate de contact, nu avem cum să îți întocmim oferta — asta e singura consecință a
                    refuzului. Bifa pentru marketing este complet opțională: dacă nu o bifezi, primești oferta la
                    fel, doar că nu îți mai scriem după aceea.
                </p>

                <SectionTitle>5. Cui ajung datele tale</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Nu vindem și nu închiriem datele nimănui. Le folosim doar noi și furnizorii care ne țin site-ul
                    și uneltele în funcțiune. Aceștia sunt împuterniciți: prelucrează datele exclusiv la instrucțiunea
                    noastră, în baza unui contract.
                </p>
                <div className="mb-4 overflow-x-auto">
                    <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                <th className="py-2 pr-4 font-bold">Furnizor</th>
                                <th className="py-2 pr-4 font-bold">La ce ne folosește</th>
                                <th className="py-2 font-bold">Unde stau datele</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROCESSORS.map((p) => (
                                <tr key={p.name} className="border-b border-slate-100 align-top">
                                    <td className="py-3 pr-4 font-medium text-slate-800">{p.name}</td>
                                    <td className="py-3 pr-4 text-slate-600">{p.role}</td>
                                    <td className="py-3 text-slate-600">{p.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mb-4 text-slate-600">
                    Mai putem transmite date către contabilitate, avocați sau autorități, atunci când legea ne obligă
                    sau când trebuie să ne apărăm un drept în instanță.
                </p>

                <SectionTitle>6. Transferuri în afara Uniunii Europene</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Datele din formulare — deci tot ce ne trimiți tu direct — sunt stocate pe servere din{' '}
                    <strong>Uniunea Europeană (Stockholm, Suedia)</strong> și nu părăsesc spațiul european.
                </p>
                <p className="mb-4 text-slate-600">
                    Datele din cookie-urile de analiză și marketing, pe care le colectăm doar cu acordul tău, ajung
                    la furnizori din Statele Unite (Google, Meta, Microsoft). Aceste transferuri se fac pe baza{' '}
                    <strong>clauzelor contractuale standard</strong> aprobate de Comisia Europeană și, acolo unde
                    furnizorul este certificat, în baza <strong>Cadrului transatlantic de confidențialitate a
                    datelor (EU–US Data Privacy Framework)</strong>. Poți cere o copie a acestor garanții scriindu-ne
                    pe email. Dacă refuzi cookie-urile, aceste transferuri nu au loc deloc.
                </p>

                <SectionTitle>7. Cât păstrăm datele</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Termenele exacte sunt în tabelul de la punctul 3. Pe scurt, logica din spatele lor:
                </p>
                <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-600">
                    <li>
                        <strong>3 ani de la ultimul contact</strong> pentru cererile de ofertă care nu s-au
                        concretizat. Este termenul general de prescripție din art. 2517 din Codul civil, adică
                        perioada în care o dispută legată de discuțiile noastre ar mai putea ajunge în instanță.
                    </li>
                    <li>
                        <strong>10 ani</strong> pentru documentele contabile, dacă ajungem să lucrăm împreună. Aici
                        nu avem libertate de alegere: termenul e impus de art. 25 din Legea contabilității 82/1991.
                    </li>
                    <li>
                        <strong>Până la retragere</strong> pentru acordul de marketing, cu o reconfirmare la cel mult
                        24 de luni.
                    </li>
                </ul>
                <p className="mb-4 text-slate-600">
                    După expirarea termenului, datele sunt șterse. Sistemul nostru intern semnalează automat
                    înregistrările care se apropie de termen, cu 90 de zile înainte.
                </p>

                <SectionTitle>8. Drepturile tale</SectionTitle>
                <div className="mb-4 space-y-3">
                    {RIGHTS.map(([title, desc]) => (
                        <div key={title} className="flex flex-col gap-1 border-l-2 border-emerald-200 pl-4">
                            <span className="font-bold text-slate-800">{title}</span>
                            <span className="text-sm text-slate-600">{desc}</span>
                        </div>
                    ))}
                </div>
                <p className="mb-4 text-slate-600">
                    Îți poți exercita oricare dintre aceste drepturi gratuit, scriindu-ne la{' '}
                    <a href={`mailto:${SITE_CONTACT.email}`} className="text-emerald-600 hover:underline">
                        {SITE_CONTACT.email}
                    </a>
                    . Îți răspundem în cel mult <strong>o lună</strong> de la primirea cererii. Pașii concreți sunt
                    explicați pe pagina{' '}
                    <Link href="/drepturile-mele" className="text-emerald-600 hover:underline">
                        Drepturile mele
                    </Link>
                    .
                </p>
                <p className="mb-4 text-slate-600">
                    Dacă nu ești mulțumit de răspunsul nostru, poți depune o plângere la{' '}
                    <strong>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal</strong>{' '}
                    — B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, București, cod 010336, email
                    anspdcp@dataprotection.ro,{' '}
                    <a
                        href="https://www.dataprotection.ro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                    >
                        www.dataprotection.ro
                    </a>
                    . Te poți adresa și direct instanței de judecată.
                </p>

                <SectionTitle>9. Cookie-uri</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Cookie-urile de analiză și marketing se activează numai după ce le accepți în bannerul afișat la
                    prima vizită. Poți schimba alegerea oricând, din butonul{' '}
                    <strong>„Setări cookie-uri”</strong> aflat în subsolul fiecărei pagini. Lista completă, cu nume,
                    furnizor, scop și durată, este în{' '}
                    <Link href="/politica-cookie" className="text-emerald-600 hover:underline">
                        Politica de cookie-uri
                    </Link>
                    .
                </p>

                <SectionTitle>10. Cum protejăm datele</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Traficul către site este criptat (HTTPS obligatoriu). Baza de date este găzduită în Uniunea
                    Europeană, cu acces limitat la persoanele care au nevoie de el. Formularele sunt protejate
                    împotriva trimiterilor automate. Adresele IP folosite ca dovadă a acordurilor sunt păstrate sub
                    formă de hash, nu în clar. Avem o procedură scrisă pentru cazul unei breșe de securitate, care
                    prevede notificarea autorității în cel mult 72 de ore și, dacă riscul e ridicat, informarea
                    directă a persoanelor afectate.
                </p>

                <SectionTitle>11. Minori</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Site-ul se adresează fermierilor și firmelor, nu copiilor. Nu colectăm cu bună știință date de la
                    persoane sub 16 ani. Dacă afli că un copil ne-a trimis date, scrie-ne și le ștergem imediat.
                </p>

                <SectionTitle>12. Modificări ale acestei politici</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Când schimbăm ceva important — un scop nou, un furnizor nou — publicăm o versiune nouă, cu dată
                    nouă, iar bannerul de cookie-uri îți cere din nou acordul. Versiunile vechi rămân la noi, ca să
                    putem arăta oricând ce era valabil la momentul în care ai bifat.
                </p>

                <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                    <Link href="/" className="font-medium text-emerald-600 hover:underline">
                        &larr; Înapoi la pagina principală
                    </Link>
                    <span className="text-sm font-bold text-slate-400">Versiunea {FORM_CONSENT_VERSION}</span>
                </div>
            </div>
        </div>
    );
}
