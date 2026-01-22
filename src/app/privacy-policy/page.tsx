import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 py-24 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="text-green-500 hover:text-green-400 transition-colors inline-flex items-center gap-2 mb-8">
                    ← Înapoi la Pagina Principală
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Politică de Confidențialitate</h1>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Informații Generale</h2>
                    <p>
                        TehnicAgro Supply respectă confidențialitatea datelor dumneavoastră. Această politică explică modul în care colectăm, utilizăm și protejăm informațiile cu caracter personal atunci când utilizați platforma noastră pentru audit și asistență tehnică.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Date Colectate</h2>
                    <p>
                        Colectăm următoarele tipuri de date pentru a vă oferi rapoarte de audit și oferte personalizate:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Nume și Prenume / Nume Fermă</li>
                        <li>Număr de Telefon (pentru contactare și asistență)</li>
                        <li>Adresă de Email (pentru trimiterea rapoartelor și ofertelor)</li>
                        <li>Date Tehnice despre Fermă (suprafață, județ, culturi)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. Scopul Prelucrării</h2>
                    <p>
                        Datele dumneavoastră sunt prelucrate exclusiv pentru:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Generarea raportului gratuit de audit tehnic.</li>
                        <li>Calcularea beneficiilor financiare și economice (ROI).</li>
                        <li>Trimiterea ofertelor comerciale solicitate.</li>
                        <li>Contactare telefonică pentru clarificări tehnice.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Drepturile Dumneavoastră</h2>
                    <p>
                        Conform GDPR, aveți dreptul de a solicita accesul la datele dumneavoastră, rectificarea acestora, ștergerea (dreptul de a fi uitat) sau retragerea consimțământului în orice moment.
                    </p>
                    <p>
                        Pentru orice solicitare privind datele personale, ne puteți contacta la: <span className="text-white">office@tehnicagro.ro</span>
                    </p>
                </section>

                <footer className="pt-12 text-sm text-zinc-500 border-t border-zinc-800">
                    Ultima actualizare: 22 Ianuarie 2026
                </footer>
            </div>
        </div>
    );
}
