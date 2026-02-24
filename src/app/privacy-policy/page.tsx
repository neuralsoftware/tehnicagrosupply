import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-zinc-600 py-24 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="text-green-500 hover:text-green-400 transition-colors inline-flex items-center gap-2 mb-8">
                    ← Înapoi la Pagina Principală
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Politică de Confidențialitate</h1>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Informații Generale</h2>
                    <p>
                        TehnicAgro Supply respectă confidențialitatea datelor dumneavoastră. Această politică explică modul în care colectăm, utilizăm și protejăm informațiile cu caracter personal atunci când utilizați platforma noastră.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Temeiul Legal al Prelucrării</h2>
                    <p>
                        Prelucrăm datele dumneavoastră pe baza următoarelor temeiuri legale:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>Consimțământul dumneavoastră:</strong> Exprimat prin bifarea căsuței de accept în formularele de contact.</li>
                        <li><strong>Interesul legitim:</strong> Pentru a vă răspunde la solicitări și pentru a îmbunătăți produsele și serviciile noastre (B2B marketing).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. Date Colectate</h2>
                    <p>
                        Colectăm următoarele tipuri de date pentru a vă oferi rapoarte de audit și oferte personalizate:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li>Nume și Prenume / Nume Fermă</li>
                        <li>Număr de Telefon (pentru contactare și asistență)</li>
                        <li>Adresă de Email (pentru trimiterea ofertelor și blog-ului)</li>
                        <li>Date Tehnice despre Fermă (suprafață, județ, culturi)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Perioada de Retenție a Datelor</h2>
                    <p>
                        Păstrăm datele dumneavoastră cu caracter personal atât timp cât este necesar pentru a îndeplini scopurile pentru care au fost colectate (ex: pe durata valabilității ofertei tehnice sau până la retragerea consimțământului). În general, datele clienților potențiali sunt păstrate pentru o perioadă de 36 de luni de la ultima interacțiune.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Drepturile Dumneavoastră</h2>
                    <p>
                        Conform GDPR, aveți dreptul de a solicita accesul la datele dumneavoastră, rectificarea acestora, ștergerea (dreptul de a fi uitat), restricționarea prelucrării sau retragerea consimțământului în orice moment.
                    </p>
                    <p>
                        De asemenea, aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) dacă considerați că drepturile v-au fost încălcate.
                    </p>
                    <p>
                        Pentru orice solicitare privind datele personale, ne puteți contacta la: <span className="text-ea-green-500 font-bold">tehnicagro.supply@gmail.com</span>
                    </p>
                </section>

                <footer className="pt-12 text-sm text-zinc-500 border-t border-zinc-800">
                    Ultima actualizare: 23 Februarie 2026
                </footer>
            </div>
        </div>
    );
}
