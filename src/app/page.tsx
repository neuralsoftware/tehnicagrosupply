import { Hero } from '@/components/Hero';
import { ProductSection } from '@/components/ProductSection';
import { Contact } from '@/components/Contact';
import { LegalProof } from '@/components/LegalProof';
import { RoiCalculator } from '@/components/RoiCalculator';
import { TrustSignals } from '@/components/TrustSignals';

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-ea-green-500 selection:text-white">
            <Hero />

            {/* Strategie Nouă: Validare Legală înainte de Produs */}
            <LegalProof />

            <TrustSignals />

            {/* Calculatorul trebuie să fie "Hook-ul" principal */}
            <RoiCalculator />

            <div className="relative">
                <div className="absolute inset-0 bg-zinc-900/50 skew-y-3 transform origin-bottom-right -z-10 h-full mt-20"></div>
                <ProductSection
                    id="oferta"
                    title="Avers-Agro Green Plains ADS"
                    badge="ELIGIBIL APIA PD-04"
                    description="Sistemul de suspensie paralelogram asigură o copiere perfectă a solului, iar presiunea de 190 kg/brăzdar garantează penetrarea în orice miriște. Singura soluție reală pentru încasarea subvenției de 56 EUR/ha fără compromisuri la răsărire."
                    imageSrc="/products/avers-green-plains.jpg"
                    specs={[
                        'Presiune Brăzdar: 190 kg (reglabilă)',
                        'Adâncime: 1 - 9 cm (precizie 0.5 cm)',
                        'Sistem Suspensie: Paralelogram Independent',
                        'Disc Despicător: Oțel rezistent, unghi 10°'
                    ]}
                    ctaLabel="Vezi Specificații Complete"
                    detailedSpecs={{
                        Generale: {
                            'Model': 'Multisem ADS',
                            'Tip': 'Semănătoare Directă Mecanică',
                            'Tehnologie': 'No-Till / Mini-Till / Convențional',
                            'Distanță rânduri': '18.75 cm',
                            'Adâncime semănat': '1 - 9 cm (ajustabilă 0.5 cm)',
                            'Viteză lucru': '8 - 12 km/h'
                        },
                        Performanta_si_Dimensiuni: [
                            { Model: 'ADS 3', Latime: '3.0 m', Buncar: '2400 L', Brăzdare: '16', Putere: '90-110 CP' },
                            { Model: 'ADS 4', Latime: '4.1 m', Buncar: '2400 L', Brăzdare: '22', Putere: '150-170 CP' },
                            { Model: 'ADS 6', Latime: '6.3 m', Buncar: '4000 L', Brăzdare: '36', Putere: '180-200 CP' }
                        ],
                        Sistem_Semant: {
                            'Brăzdar': 'Dublu disc decalat',
                            'Presiune': 'Până la 190 kg',
                            'Suspensie': 'Paralelogram Independent',
                            'Roată tasare': 'Reglabilă, 3 poziții unghi atac'
                        }
                    }}
                />
            </div>

            <ProductSection
                title="Fliegl Chain Disc KSE 680"
                reversed={true}
                badge="SOLUȚIE GAEC 6 - 2026"
                description="Grapa cu lanțuri (6.8m) care nu îngroapă resturile vegetale, ci le presează plat, formând stratul de protecție obligatoriu prin GAEC 6. Viteza de 18 km/h îți permite să lucrezi 100ha într-o singură zi cu un consum minim."
                imageSrc="/products/fliegl-kse-680.jpg"
                specs={[
                    'Lățime de lucru: 6.8 m',
                    'Randament: ~12 ha/oră (Viteză 10-18 km/h)',
                    'Greutate Variabilă: 120 - 148 kg/m',
                    'Efect: Mărunțire agresivă fără îngropare'
                ]}
                ctaLabel="Vezi Specificații Complete"
                detailedSpecs={{
                    Date_Tehnice: {
                        'Lățime de lucru': 'aprox. 6.8 m',
                        'Randament': 'până la 12 ha/oră',
                        'Viteză de lucru': '10 - 18 km/h',
                        'Putere necesară': '150 - 250 CP',
                        'Greutate': '5700 kg',
                        'Lungime': '10.8 m'
                    },
                    Constructie: {
                        'Diametru discuri': '350 mm (Oțel călit)',
                        'Distanță discuri': '130 mm',
                        'Cadru': 'Cruce, 4 părți deschise',
                        'Pliere': 'Hidraulică'
                    },
                    Echipare_Standard: {
                        'Prindere': 'Tirant inferior Cat II / III',
                        'Hidraulică': '3 conexiuni dublu efect',
                        'Frânare': 'Sistem pneumatic inclus'
                    }
                }}
            />

            <Contact />

            <footer className="py-12 bg-black border-t border-zinc-900 text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Tehnicagro Supply</h3>
                <p className="text-zinc-500 text-sm mb-4">Smart Efficiency Partner for Romanian Farmers.</p>
                <a href="mailto:tehnicagro.supply@gmail.com" className="text-ea-green-600 hover:text-ea-green-500 text-sm font-medium transition-colors">
                    tehnicagro.supply@gmail.com
                </a>
                <p className="text-zinc-700 text-xs mt-8">&copy; 2026 Toate drepturile rezervate.</p>
            </footer>
        </main>
    );
}
