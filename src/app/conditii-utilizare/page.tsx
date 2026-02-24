import Link from 'next/link';

export default function TermsOfUse() {
    return (
        <main className="min-h-screen bg-white text-zinc-600 py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <Link href="/" className="text-ea-green-500 hover:text-ea-green-400 transition-colors inline-flex items-center gap-2 mb-4">
                        ← Înapoi la Pagina Principală
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Condiții de Utilizare</h1>
                    <p className="text-zinc-500 text-sm">Ultima actualizare: 23 Februarie 2026</p>
                </div>

                <section className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">1. Acceptarea Termenilor</h2>
                        <p>
                            Prin accesarea și utilizarea site-ului TehnicAgro Supply (tehnicagrosupply.ro), sunteți de acord să respectați acești Termeni și Condiții de Utilizare, toate legile și reglementările aplicabile în România și sunteți responsabil pentru conformitatea cu orice legi locale aplicabile.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">2. Proprietate Intelectuală</h2>
                        <p>
                            Conținutul prezentat pe acest site (texte, specificații tehnice ale utilajelor, articole de blog, imagini și elemente grafice) este proprietatea TehnicAgro Supply sau a partenerilor noștri (Avers-Agro, Fliegl, K-Factor) și este protejat de legile dreptului de autor. Este interzisă copierea sau redistribuirea acestui conținut fără acordul scris prealabil.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">3. Utilizarea Calculatorului ROI</h2>
                        <p>
                            Calculatorul de ROI și beneficii economice prezent pe site are un scop pur informativ și estimativ. Rezultatele sunt calculate pe baza unor algoritmi standard și a datelor introduse de utilizator. TehnicAgro Supply nu garantează obținerea exactă a profiturilor estimate, acestea depinzând de condițiile specifice fiecărei ferme (starea solului, condiții meteo, managementul culturilor).
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">4. Limitarea Răspunderii</h2>
                        <p>
                            TehnicAgro Supply nu va fi responsabilă pentru nicio daună directă, indirectă sau accidentală rezultată din utilizarea sau incapacitatea de a utiliza serviciile și informațiile de pe site. Ne rezervăm dreptul de a modifica prețurile sau specificațiile tehnice ale utilajelor fără o notificare prealabilă, în funcție de disponibilitatea stocurilor și politicile producătorilor.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">5. Legislația Aplicabilă</h2>
                        <p>
                            Orice reclamație referitoare la site-ul TehnicAgro Supply va fi guvernată de legile statului Român, fără a ține cont de conflictele de prevederi legale.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">6. Contact</h2>
                        <p>
                            Pentru întrebări legate de acești termeni, ne puteți contacta la: <br />
                            <span className="text-white font-bold">Email: tehnicagro.supply@gmail.com</span> <br />
                            <span className="text-white font-bold">Telefon: 0723 380 022</span>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
