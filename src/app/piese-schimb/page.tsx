import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { Settings, Wrench, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Piese de Schimb Utilaje Agricole | Brăzdare, Discuri, El. Semănătoare | TehnicAgro",
    description: "Piese de schimb pentru semănători No-Till Avers-Agro, grape Fliegl și utilaje multimarcă (John Deere, Lemken, Amazone). Brăzdare, discuri, rulmenți, lanțuri — livrare rapidă prin Kramp.",
    keywords: [
        'piese schimb semanatoare no-till', 'brazdar semanatoare directa', 'disc semanatoare',
        'piese fliegl chain disc', 'piese avers agro', 'lant chain disc agricol',
        'piese schimb utilaje agricole', 'piese john deere', 'piese lemken', 'piese amazone',
        'piese kramp romania', 'mentenanta utilaje agricole', 'disc despicator semanatoare',
        'rulment utilaje agricole', 'piese schimb grapa'
    ],
    alternates: {
        canonical: 'https://tehnicagrosupply.ro/piese-schimb',
    },
};

export default function PieseSchimbPage() {
    const sparePartsSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Furnizare Piese de Schimb și Mentenanță Utilaje Agricole",
        "description": "Servicii complete de furnizare piese de schimb originale și aftermarket pentru o gamă largă de utilaje agricole (John Deere, Case IH, Fendt, Lemken, Amazone).",
        "provider": {
            "@type": "Organization",
            "name": "TehnicAgro Supply",
            "url": "https://tehnicagrosupply.ro"
        },
        "areaServed": "RO",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Catalog Piese de Schimb",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Piese Originale (OEM)"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Piese Aftermarket"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Suport Tehnic și Mentenanță"
                    }
                }
            ]
        }
    };

    // FAQ Schema pentru Rich Results în Google
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Furnizați brăzdare și discuri pentru semănătoarea Avers-Agro Green Plains?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Furnizăm piese de schimb OEM și aftermarket pentru semănătoarea Avers-Agro Green Plains ADS, inclusiv brăzdare duble disc, discuri despicătoare, roți tasatoare și elemente de suspensie paralelogram. Solicitați piesa cu referința tehnică sau numărul de serie al utilajului."
                }
            },
            {
                "@type": "Question",
                "name": "Puteți aduce piese pentru grapa Fliegl Chain Disc KSE 680?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Asigurăm piese de schimb pentru Fliegl KSE 680, inclusiv discuri cu lanțuri (350mm oțel călit), lagăre, elemente de cadru și sisteme hidraulice. Livrare prin rețeaua Kramp în 24-48 ore."
                }
            },
            {
                "@type": "Question",
                "name": "Cât durează livrarea pieselor de schimb?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Piesele disponibile în stocul Kramp se livrează în 24-48 ore în România. Piesele la comandă specială au un termen de 3-10 zile lucrătoare, în funcție de producător. Contactați-ne pentru confirmare disponibilitate."
                }
            },
            {
                "@type": "Question",
                "name": "Furnizați piese și pentru alte mărci de utilaje agricole?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Pe lângă piesele pentru utilajele din portofoliu (Avers-Agro, Fliegl, K-Factor), oferim piese la comandă pentru Amazone, Lemken, Väderstad, Pöttinger, Gaspardo, Horsch, John Deere și alte branduri. Trimiteți-ne modelul utilajului și piesa necesară."
                }
            }
        ]
    };



    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-32 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(sparePartsSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Piese de <span className="text-ea-green-500">Schimb</span> & Mentenanță
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Asigurăm suport tehnic complet și piese de origine pentru toate utilajele din portofoliul TehnicAgro.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-24">
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                        <Settings className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Piese Originale & Aftermarket</h3>
                        <p className="text-zinc-500 text-sm">
                            Oferim componente <strong className="text-zinc-900">Originale (OEM)</strong> pentru utilajele noastre și piese <strong className="text-zinc-900">Aftermarket</strong> de înaltă calitate pentru o gamă vastă de mărci internaționale.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                        <Wrench className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Suport Tehnic Multimarcă</h3>
                        <p className="text-zinc-500 text-sm">
                            Consultanță tehnică și diagnostic pentru majoritatea utilajelor agricole (John Deere, Case IH, Fendt, New Holland, Claas).
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                        <ShieldCheck className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Livrare Rapidă</h3>
                        <p className="text-zinc-500 text-sm">
                            Colaborăm cu lideri europeni precum <strong className="text-zinc-900">Kramp</strong> pentru livrarea rapidă din stoc a peste 500.000 de articole.
                        </p>
                    </div>
                </div>

                {/* Multibrand Section */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-12 mb-24">
                    <div className="max-w-4xl mx-auto space-y-8 text-center">
                        <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">
                            Soluții Complete pentru <span className="text-ea-green-600">Toate Brandurile</span>
                        </h2>
                        <p className="text-zinc-500">
                            Pe lângă piesele dedicate utilajelor din portofoliul nostru (<strong className="text-zinc-900">Avers-Agro, Fliegl, K-Factor</strong>), suntem parteneri de încredere pentru soluții multimarcă. Putem aduce la comandă piese pentru:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Amazone</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Lemken</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Väderstad</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Pöttinger</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Gaspardo</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Vogel & Noot</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Horsch</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Moresil</span>
                            <span className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">Capello</span>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">
                            Ai nevoie de o <span className="text-ea-green-600">piesă specifică?</span>
                        </h2>
                        <p className="text-zinc-500 text-lg">
                            Dacă nu găsești brandul sau piesa dorită printre serviciile prezentate mai sus, completează formularul cu modelul utilajului și piesa necesară. Te vom contacta în maxim 2 ore cu o ofertă de preț și termen de livrare.
                        </p>
                        <div className="pt-8">
                            <TrustSignals />
                        </div>
                    </div>
                    <div className="bg-zinc-50 p-2 rounded-3xl border border-zinc-200">
                        <Contact />
                    </div>
                </div>
            </div>
        </main>
    );
}
