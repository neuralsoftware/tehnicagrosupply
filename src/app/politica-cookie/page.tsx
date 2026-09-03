import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_CONTACT } from '@/lib/site-contact';
import { FORM_CONSENT_VERSION } from '@/lib/form-consent';
import { COOKIE_CATEGORIES } from '@/data/gdpr-cookies';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';

export const metadata: Metadata = {
    title: 'Politica de utilizare a Cookie-urilor | TEHNICAGRO SUPPLY',
    description:
        'Lista completă a cookie-urilor folosite pe tehnicagrosupply.ro: nume, furnizor, scop și durată, plus cum îți schimbi alegerea oricând.',
    alternates: { canonical: 'https://tehnicagrosupply.ro/politica-cookie' },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mt-12 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold text-emerald-700">{children}</h2>
    );
}

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
                <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
                    Politica de utilizare a Cookie-urilor
                </h1>
                <p className="mb-8 text-sm text-slate-500">
                    Versiunea {FORM_CONSENT_VERSION} · în vigoare de la 3 septembrie 2026
                </p>

                <p className="mb-6 text-lg text-slate-600">
                    Mai jos găsești tot ce salvează acest site pe dispozitivul tău: ce anume, cine îl pune acolo, la
                    ce folosește și cât rămâne. Nimic din ce nu e strict necesar nu pornește înainte să apeși tu.
                </p>

                <SectionTitle>1. Ce sunt, pe scurt</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Un cookie e un fișier text mic pe care un site îl lasă în browserul tău ca să te „recunoască” la
                    următoarea pagină. Browserele mai au și alte spații de stocare, numite localStorage și
                    sessionStorage, care fac cam același lucru. Legea le tratează la fel, așa că le-am trecut pe
                    toate în tabelele de mai jos — nu doar cookie-urile propriu-zise.
                </p>

                <SectionTitle>2. Ce te întrebăm și când</SectionTitle>
                <p className="mb-4 text-slate-600">
                    La prima vizită îți apare un banner cu trei butoane de aceeași mărime:{' '}
                    <strong>„Acceptă toate”</strong>, <strong>„Refuz”</strong> și{' '}
                    <strong>„Personalizează”</strong>. Refuzul e la fel de ușor ca acceptul — un singur click, fără
                    meniuri ascunse. Până când alegi, pe dispozitivul tău nu ajunge nimic în afară de strictul
                    necesar.
                </p>
                <p className="mb-4 text-slate-600">
                    Alegerea ta rămâne valabilă <strong>6 luni</strong>, apoi te întrebăm din nou. Dacă browserul tău
                    trimite semnalul de confidențialitate <em>Global Privacy Control</em>, îl respectăm automat ca
                    refuz și nici nu îți mai afișăm bannerul.
                </p>

                <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                    <p className="mb-3 text-sm font-semibold text-slate-800">
                        Vrei să schimbi alegerea chiar acum?
                    </p>
                    <CookieSettingsButton />
                    <p className="mt-3 text-xs text-slate-600">
                        Același buton îl găsești permanent în subsolul fiecărei pagini, sub numele „Setări
                        cookie-uri”. Retragerea acordului e la fel de simplă ca acordarea lui.
                    </p>
                </div>

                <SectionTitle>3. Lista completă</SectionTitle>
                {COOKIE_CATEGORIES.map((cat) => (
                    <div key={cat.key} className="mb-10">
                        <h3 className="mb-2 text-lg font-bold text-slate-900">{cat.title}</h3>
                        <p className="mb-4 text-sm text-slate-600">{cat.summary}</p>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                        <th className="py-2 pr-4 font-bold">Nume</th>
                                        <th className="py-2 pr-4 font-bold">Furnizor</th>
                                        <th className="py-2 pr-4 font-bold">Tip</th>
                                        <th className="py-2 pr-4 font-bold">La ce folosește</th>
                                        <th className="py-2 font-bold">Durată</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cat.entries.map((e) => (
                                        <tr key={e.name} className="border-b border-slate-100 align-top">
                                            <td className="py-3 pr-4 font-mono text-xs font-medium text-slate-800">
                                                {e.name}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-600">{e.provider}</td>
                                            <td className="py-3 pr-4 text-slate-500">{e.kind}</td>
                                            <td className="py-3 pr-4 text-slate-600">{e.purpose}</td>
                                            <td className="py-3 font-medium text-slate-700">{e.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                <SectionTitle>4. Ce înseamnă „date anonime” aici</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Ca să fim exacți: datele din cookie-urile de analiză și marketing{' '}
                    <strong>nu sunt anonime</strong>. Sunt pseudonimizate — nu conțin numele tău, dar conțin
                    identificatori care te pot distinge de alt vizitator. De aceea sunt tratate ca date cu caracter
                    personal și de aceea îți cerem acordul înainte să le folosim.
                </p>

                <SectionTitle>5. Unde ajung datele</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Cookie-urile de analiză și marketing trimit date către Google, Meta și Microsoft, companii cu
                    prelucrare inclusiv în Statele Unite. Transferurile se fac în baza clauzelor contractuale
                    standard aprobate de Comisia Europeană și a Cadrului transatlantic de confidențialitate a
                    datelor. Dacă refuzi aceste categorii, transferurile nu au loc deloc. Detalii complete despre
                    fiecare furnizor sunt în{' '}
                    <Link href="/privacy-policy" className="text-emerald-600 hover:underline">
                        Politica de confidențialitate
                    </Link>
                    .
                </p>

                <SectionTitle>6. Ce se întâmplă dacă retragi acordul</SectionTitle>
                <p className="mb-4 text-slate-600">
                    Din momentul retragerii nu mai pornim scripturile respective. Cele deja încărcate în pagina
                    deschisă rămân active până reîncarci pagina — la următoarea încărcare dispar complet.
                    Cookie-urile deja plasate le poți șterge oricând din setările browserului, de obicei din
                    secțiunea „Confidențialitate și securitate”.
                </p>

                <SectionTitle>7. Contact</SectionTitle>
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
                </div>

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
