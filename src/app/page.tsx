import { Hero } from '@/components/Hero';
import { ProductSection } from '@/components/ProductSection';
import { Contact } from '@/components/Contact';
import { LegalProof } from '@/components/LegalProof';
import { RoiCalculator } from '@/components/RoiCalculator';
import { TrustSignals } from '@/components/TrustSignals';
import { ExpertAuthority } from '@/components/ExpertAuthority';
import { VideoGallery } from '@/components/VideoGallery';
import Image from 'next/image';

export default function Home() {
    // Schema.org JSON-LD for SEO Rich Results
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TehnicAgro Supply",
        "url": "https://tehnic-agro-funnel.vercel.app",
        "logo": "https://tehnic-agro-funnel.vercel.app/logos/tehnicagro_logo_v1_1769155922952.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+40-723-380-022",
            "contactType": "Sales",
            "areaServed": "RO",
            "availableLanguage": "Romanian"
        },
        "description": "Furnizor de utilaje agricole No-Till și soluții pentru agricultura conservativă în România.",
        "sameAs": [
            "https://wa.me/40723380022"
        ]
    };

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Avers-Agro Green Plains ADS",
        "description": "Semănătoare directă No-Till pentru agricultura conservativă, eligibilă pentru subvenții APIA PD-04",
        "image": "https://tehnic-agro-funnel.vercel.app/products/avers-green-plains.jpg",
        "brand": {
            "@type": "Brand",
            "name": "Avers-Agro"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "RON",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "TehnicAgro Supply"
            }
        }
    };

    const productSchema2 = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Fliegl Chain Disc KSE 680",
        "description": "Grapă cu lanțuri 6.8m pentru conformitate GAEC 6, mărunțire resturi vegetale fără îngropare",
        "image": "https://tehnic-agro-funnel.vercel.app/products/fliegl-kse-680.jpg",
        "brand": {
            "@type": "Brand",
            "name": "Fliegl"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "RON",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "TehnicAgro Supply"
            }
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Ce este subvenția APIA PD-04 și cum o pot accesa?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Eco-schema PD-04 oferă 56 EUR/ha pentru agricultura conservativă (No-Till, Mini-Till). Pentru a fi eligibil, trebuie să folosești utilaje care nu inversează solul și să menții resturile vegetale la suprafață. Semănătoarea Avers-Agro Green Plains îndeplinește toate cerințele."
                }
            },
            {
                "@type": "Question",
                "name": "Ce înseamnă GAEC 6 și de ce este important?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "GAEC 6 impune acoperirea solului pe teren arabil în perioada 15 iunie - 15 octombrie. Trebuie să lași resturile vegetale la suprafață sau să cultivi culturi intermediare. Grapa Fliegl Chain Disc mărunțește resturile fără să le îngropă, asigurând conformitatea."
                }
            },
            {
                "@type": "Question",
                "name": "Cât economisesc cu tehnologia No-Till?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "În medie, fermierii economisesc 320 RON/ha la motorină prin reducerea numărului de treceri. La 100 hectare, aceasta înseamnă 32.000 RON/an economie, plus subvenția de 28.140 RON (56 EUR x 100 ha x 5 RON/EUR)."
                }
            },
            {
                "@type": "Question",
                "name": "Care este perioada de amortizare a utilajelor?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cu economiile la motorină și subvențiile APIA, investiția se amortizează în 8-12 luni pentru exploatații de peste 100 hectare. Echipa TehnicAgro oferă calcul personalizat gratuit pentru situația ta specifică."
                }
            },
            {
                "@type": "Question",
                "name": "Oferiți finanțare sau suport pentru proiecte DR-12?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da, oferim consultanță pentru accesarea finanțării DR-12 (până la 200.000€, nerambursabil 80%). Utilajele noastre sunt eligibile pentru această măsură, iar echipa noastră te poate ghida prin procesul de aplicare."
                }
            }
        ]
    };

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "TehnicAgro Supply",
        "description": "Distribuitor de utilaje agricole No-Till: Avers-Agro și Fliegl în România",
        "url": "https://tehnic-agro-funnel.vercel.app",
        "telephone": "+40-723-380-022",
        "email": "tehnicagro.supply@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RO"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "18:00"
        },
        "priceRange": "$$"
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-ea-green-500 selection:text-white">
            {/* Schema.org JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema2) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />

            <Hero />

            {/* Strategie Nouă: Validare Legală înainte de Produs */}
            <LegalProof />

            <TrustSignals />

            {/* Calculatorul trebuie să fie "Hook-ul" principal */}
            <RoiCalculator />

            {/* Video Demo - Dovezi Reale */}
            <VideoGallery />

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
                    expertVerdict="O soluție tehnică remarcabilă care menține adâncimea de semănat constantă chiar și în soluri extrem de compactate, asigurând răsărirea uniformă esențială pentru conformarea cu eco-schema PD-04."
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
                expertVerdict="Esențială pentru fermierii care vor să respecte GAEC 6 fără să investească în utilaje complexe de prelucrare. Chain Disc-ul Fliegl transformă resturile vegetale într-o barieră termică pentru sol, păstrând umiditatea critică."
            />

            <ExpertAuthority />

            {/* Partner Logos Section */}
            <section className="py-12 bg-zinc-950 border-y border-zinc-900">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-center text-zinc-600 text-sm uppercase tracking-widest font-bold mb-8">
                        Parteneri Tehnologici de Încredere
                    </p>
                    <div className="flex items-center justify-center gap-12 flex-wrap opacity-60 hover:opacity-100 transition-opacity">
                        <div className="text-2xl font-black text-zinc-400 uppercase tracking-tight">Avers-Agro</div>
                        <div className="text-2xl font-black text-zinc-400 uppercase tracking-tight">Fliegl</div>
                        <div className="text-2xl font-black text-zinc-400 uppercase tracking-tight">APIA RO</div>
                    </div>
                </div>
            </section>

            <Contact />

            <footer className="py-12 bg-black border-t border-zinc-900">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">
                                Tehnic<span className="text-ea-green-500">Agro</span> Supply
                            </h3>
                            <p className="text-zinc-500 text-sm mt-2">Smart Efficiency Partner for Romanian Farmers.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="mailto:tehnicagro.supply@gmail.com" className="text-ea-green-600 hover:text-ea-green-500 text-sm font-medium transition-colors">
                                tehnicagro.supply@gmail.com
                            </a>
                            <a href="tel:+40723380022" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                                +40 723 380 022
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-zinc-700 text-xs">&copy; 2026 TehnicAgro Supply. Toate drepturile rezervate.</p>
                        <div className="flex items-center gap-4 text-xs text-zinc-600">
                            <a href="/privacy-policy" className="hover:text-zinc-400 transition-colors">Politica de Confidențialitate</a>
                            <span>•</span>
                            <span>GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
