import Link from 'next/link';

export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-white text-zinc-600 py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <Link href="/" className="text-ea-green-500 hover:text-ea-green-400 transition-colors inline-flex items-center gap-2 mb-4">
                        ← Înapoi la Pagina Principală
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Politică de Cookie-uri</h1>
                    <p className="text-zinc-500 text-sm">Ultima actualizare: 23 Februarie 2026</p>
                </div>

                <section className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">1. Ce sunt Cookie-urile?</h2>
                        <p>
                            Cookie-urile sunt fișiere text mici, stocate pe dispozitivul dvs. (computer, tabletă sau telefon) atunci când vizitați un site web. Ele sunt utilizate pe scară largă pentru a face site-urile să funcționeze mai eficient și pentru a oferi informații proprietarilor site-ului.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">2. Cum utilizăm Cookie-urile?</h2>
                        <p>TehnicAgro Supply utilizează următoarele tipuri de cookie-uri:</p>
                        <ul className="list-disc pl-6 space-y-4 text-sm">
                            <li>
                                <strong className="text-white">Cookie-uri Strict Necesare:</strong> Acestea sunt esențiale pentru funcționarea site-ului (ex: navigarea pe pagini). Site-ul nu poate funcționa corect fără acestea.
                            </li>
                            <li>
                                <strong className="text-white">Cookie-uri de Statistică (Analitice):</strong> Utilizăm Google Analytics 4 și Microsoft Clarity pentru a înțelege modul în care vizitatorii interacționează cu site-ul nostru, ajutându-ne să îmbunătățim structura și conținutul acestuia. Toate datele sunt colectate anonim.
                            </li>
                            <li>
                                <strong className="text-white">Cookie-uri de Marketing:</strong> Utilizăm Facebook Pixel pentru a evalua eficiența campaniilor noastre publicitare și pentru a afișa mesaje relevante utilizatorilor care au vizitat site-ul nostru.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">3. Cum poți controla Cookie-urile?</h2>
                        <p>
                            Majoritatea browserelor permit refuzarea sau acceptarea cookie-urilor prin setările proprii. Vă rugăm să rețineți că blocarea cookie-urilor poate afecta funcționalitatea anumitor părți ale acestui site.
                        </p>
                        <p className="text-sm">
                            De asemenea, puteți folosi bannerul de consimțământ de pe site-ul nostru pentru a vă exprima preferințele inițiale.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">4. Mai multe informații</h2>
                        <p>
                            Dacă doriți să aflați mai multe despre cum protejăm datele dvs. personale, vă rugăm să consultați{' '}
                            <Link href="/privacy-policy" className="text-ea-green-500 hover:underline">
                                Politica de Confidențialitate
                            </Link>.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
