import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { Settings, Wrench, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Piese de Schimb Utilaje Agricole | John Deere, Lemken, Amazone | TehnicAgro",
    description: "Căutați piese de schimb pentru utilaje agricole? Oferim piese originale și aftermarket pentru John Deere, Case IH, Lemken, Amazone și multe altele. Livrare rapidă prin Kramp.",
    keywords: ["piese schimb utilaje agricole", "piese john deere", "piese lemken", "piese amazone", "piese kramp romania", "mentenanta utilaje agricole", "piese tractor", "piese semanatoare"],
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

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(sparePartsSchema) }}
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
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
                        <Settings className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Piese Originale & Aftermarket</h3>
                        <p className="text-zinc-500 text-sm">
                            Oferim componente <strong className="text-zinc-300">Originale (OEM)</strong> pentru utilajele noastre și piese <strong className="text-zinc-300">Aftermarket</strong> de înaltă calitate pentru o gamă vastă de mărci internaționale.
                        </p>
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
                        <Wrench className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Suport Tehnic Multimarcă</h3>
                        <p className="text-zinc-500 text-sm">
                            Consultanță tehnică și diagnostic pentru majoritatea utilajelor agricole (John Deere, Case IH, Fendt, New Holland, Claas).
                        </p>
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
                        <ShieldCheck className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Livrare Rapidă</h3>
                        <p className="text-zinc-500 text-sm">
                            Colaborăm cu lideri europeni precum <strong className="text-zinc-300">Kramp</strong> pentru livrarea rapidă din stoc a peste 500.000 de articole.
                        </p>
                    </div>
                </div>

                {/* Multibrand Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 mb-24">
                    <div className="max-w-4xl mx-auto space-y-8 text-center">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                            Soluții Complete pentru <span className="text-ea-green-500">Toate Brandurile</span>
                        </h2>
                        <p className="text-zinc-400">
                            Pe lângă piesele dedicate utilajelor din portofoliul nostru (<strong className="text-zinc-300">Avers-Agro, Fliegl, K-Factor</strong>), suntem parteneri de încredere pentru soluții multimarcă. Putem aduce la comandă piese pentru:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Amazone</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Lemken</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Väderstad</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Pöttinger</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Gaspardo</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Vogel & Noot</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Horsch</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Moresil</span>
                            <span className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">Capello</span>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                            Ai nevoie de o <span className="text-ea-green-500">piesă specifică?</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Dacă nu găsești brandul sau piesa dorită printre serviciile prezentate mai sus, completează formularul cu modelul utilajului și piesa necesară. Te vom contacta în maxim 2 ore cu o ofertă de preț și termen de livrare.
                        </p>
                        <div className="pt-8">
                            <TrustSignals />
                        </div>
                    </div>
                    <div className="bg-zinc-900 p-2 rounded-3xl border border-zinc-800">
                        <Contact />
                    </div>
                </div>
            </div>
        </main>
    );
}
