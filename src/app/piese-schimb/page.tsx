import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { Settings, Wrench, ShieldCheck, Droplets, Cog, Filter, Disc3 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Piese de Schimb Utilaje Agricole | Kurt, Bargam, Avers-Agro, Fliegl | TehnicAgro",
    description: "Piese de schimb pentru semănători Kurt ALP, erbicidatoare Bargam Elios, semănători Avers-Agro No-Till și grape Fliegl. Duze, pompă, filtru, brăzdare, discuri — livrare 24-48h prin Kramp.",
    keywords: [
        'piese schimb utilaje agricole',
        'piese semanatoare kurt', 'piese alp kurt romania', 'tub semanatoare kurt',
        'distribuitor complect semanatoare kurt', 'piese semanatoare paioase kurt',
        'piese bargam erbicidator', 'piese bargam elios', 'duze bargam elios bdl',
        'pompa erbicidator bargam', 'piese erbicidator romania',
        'duze erbicidator', 'pompa instalatie erbicidat', 'filtru erbicidator',
        'furtun erbicidator', 'supapa erbicidator',
        'brazdar semanatoare disc', 'disc semanatoare', 'patina brazdar',
        'cutit disc semanatoare', 'roata tasor semanatoare',
        'piese schimb semanatoare no-till', 'piese avers agro',
        'piese fliegl chain disc', 'piese kramp romania',
        'piese john deere', 'piese lemken', 'piese amazone',
        'rulment utilaje agricole', 'lant chain disc agricol',
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
        "description": "Servicii complete de furnizare piese de schimb originale și aftermarket pentru semănători Kurt ALP, erbicidatoare Bargam Elios, Avers-Agro, Fliegl și o gamă largă de mărci internaționale (John Deere, Lemken, Amazone, Horsch, Väderstad).",
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
                        "name": "Piese Semănătoare Kurt ALP – tub semănat, distribuitor complet, brăzdar disc, disc seminci"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Piese Erbicidator Bargam Elios BDL – duze, pompă, filtru, furtun presiune"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Piese Semănătoare No-Till Avers-Agro – brăzdar dublu disc, roată tasatoare, disc despicător"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Piese Grapă Fliegl Chain Disc KSE – discuri lanț 350mm, lagăre, sisteme hidraulice"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Piese Originale (OEM) și Aftermarket multimarcă"
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
                "name": "Furnizați piese de schimb pentru semănătoarea Kurt (ALP Romania)?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Furnizăm piese de schimb OEM și aftermarket pentru semănătoarele Kurt ALP, inclusiv tub de semănat, distribuitor complet, brăzdar disc, disc seminci și roată presoare. Solicitați piesa cu numărul de referință sau modelul exact al semănătoarei."
                }
            },
            {
                "@type": "Question",
                "name": "Puteți aduce piese pentru erbicidatorul Bargam Elios BDL?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Asigurăm piese de schimb pentru erbicidatoarele Bargam Elios BDL 2200, 2700 și 3200, inclusiv duze de pulverizare, pompă, filtru, furtun de presiune și supape. Contactați-ne cu modelul și referința piesei pentru o ofertă rapidă."
                }
            },
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
                "name": "Furnizați piese și pentru alte mărci de utilaje agricole?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Pe lângă piesele pentru utilajele din portofoliu (Avers-Agro, Fliegl, K-Factor, Kurt ALP, Bargam), oferim piese la comandă pentru Amazone, Lemken, Väderstad, Pöttinger, Gaspardo, Horsch, John Deere și alte branduri. Trimiteți-ne modelul utilajului și piesa necesară."
                }
            },
            {
                "@type": "Question",
                "name": "Cât durează livrarea pieselor de schimb?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Piesele disponibile în stocul Kramp se livrează în 24-48 ore în România. Piesele la comandă specială au un termen de 3-10 zile lucrătoare, în funcție de producător. Contactați-ne pentru confirmare disponibilitate."
                }
            }
        ]
    };

    const wearParts = [
        { icon: <Droplets className="w-6 h-6 text-ea-green-500" />, label: 'Duze Erbicidator', desc: 'Duze plat-fan, antidrift, TeeJet, Lechler' },
        { icon: <Cog className="w-6 h-6 text-ea-green-500" />, label: 'Pompă Instalație', desc: 'Pompe Comet, AR, Annovi – erbicidatoare' },
        { icon: <Filter className="w-6 h-6 text-ea-green-500" />, label: 'Filtre & Furtunuri', desc: 'Filtre inline, aspirație, furtun presiune' },
        { icon: <Disc3 className="w-6 h-6 text-ea-green-500" />, label: 'Brăzdare & Discuri', desc: 'Brăzdar disc, disc seminci, cuțit disc, patin' },
    ];

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
                    <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter">
                        Piese de <span className="text-ea-green-500">Schimb</span> & Mentenanță
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Piese OEM și aftermarket pentru semănători Kurt ALP, erbicidatoare Bargam, Avers-Agro, Fliegl și utilaje multimarcă — livrare rapidă prin Kramp.
                    </p>
                </div>

                {/* Service cards */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
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
                            Consultanță tehnică și diagnostic pentru semănători Kurt ALP, Bargam, Avers-Agro, Fliegl și utilaje multiple (John Deere, Case IH, Fendt, New Holland, Claas).
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-4 shadow-sm">
                        <ShieldCheck className="w-12 h-12 text-ea-green-500" />
                        <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Livrare Rapidă</h3>
                        <p className="text-zinc-500 text-sm">
                            Colaborăm cu lideri europeni precum <strong className="text-zinc-900">Kramp</strong> pentru livrarea rapidă din stoc a peste 500.000 de articole — 24-48h în România.
                        </p>
                    </div>
                </div>


                {/* Wear parts section */}
                <div className="bg-zinc-900 text-white rounded-3xl p-10 mb-16">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                            Piese <span className="text-ea-green-400">Uzabile</span> Frecvent Solicitate
                        </h2>
                        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
                            Stoc permanent și livrare rapidă pentru componentele cu uzură ridicată — indiferent de marca utilajului.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {wearParts.map((part) => (
                            <div key={part.label} className="bg-zinc-800 rounded-2xl p-5 space-y-2 border border-zinc-700 hover:border-ea-green-500 transition-colors">
                                {part.icon}
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{part.label}</p>
                                <p className="text-xs text-zinc-400">{part.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Multibrand Section */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-12 mb-24">
                    <div className="max-w-4xl mx-auto space-y-8 text-center">
                        <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">
                            Soluții Complete pentru <span className="text-ea-green-600">Toate Brandurile</span>
                        </h2>
                        <p className="text-zinc-500">
                            Furnizăm piese de schimb OEM și aftermarket pentru o gamă largă de producători de utilaje agricole. Contactați-ne cu modelul și piesa necesară — indiferent de brand.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                            {[
                                { label: 'Kurt ALP', href: '/piese-schimb/kurt' },
                                { label: 'Bargam', href: '/piese-schimb/bargam' },
                                { label: 'Avers-Agro', href: '/piese-schimb/avers-agro' },
                                { label: 'Fliegl', href: '/piese-schimb/fliegl' },
                                { label: 'Amazone', href: '/piese-schimb/amazone' },
                                { label: 'Lemken', href: '/piese-schimb/lemken' },
                                { label: 'Väderstad', href: '/piese-schimb/vaderstad' },
                                { label: 'Pöttinger', href: '/piese-schimb/pottinger' },
                                { label: 'Gaspardo', href: '/piese-schimb/gaspardo' },
                                { label: 'Horsch', href: '/piese-schimb/horsch' },
                                { label: 'Vogel & Noot', href: '/piese-schimb/vogel-noot' },
                                { label: 'John Deere', href: '/piese-schimb/john-deere' },
                                { label: 'Claas', href: '/piese-schimb/claas' },
                                { label: 'Case IH', href: '/piese-schimb/case-ih' },
                                { label: 'Moresil', href: '/piese-schimb/moresil' },
                                { label: 'Capello', href: '/piese-schimb/capello' },
                            ].map((brand) => (
                                <Link
                                    key={brand.href}
                                    href={brand.href}
                                    className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm hover:border-ea-green-500 hover:text-ea-green-700 transition-colors"
                                >
                                    {brand.label}
                                </Link>
                            ))}
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
