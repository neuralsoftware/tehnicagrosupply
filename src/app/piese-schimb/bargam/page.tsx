import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ChevronRight, Droplets, Filter, Cog, Gauge, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Piese Schimb Bargam Elios BDL Romania | Duze, Pompă, Filtru, Furtun | TehnicAgro",
    description: "Piese de schimb pentru erbicidatoarele Bargam Elios BDL 2200, 2700 și 3200 — duze pulverizare, pompă instalație, filtru, furtun presiune, supape. Livrare rapidă 24-48h în România.",
    keywords: [
        'piese bargam elios', 'piese schimb bargam bdl', 'piese erbicidator bargam',
        'piese bargam elios bdl 2200', 'piese bargam elios bdl 2700', 'piese bargam elios bdl 3200',
        'duze erbicidator bargam', 'pompa bargam erbicidator', 'filtru bargam elios',
        'furtun presiune erbicidator bargam', 'supapa erbicidator bargam',
        'duze pulverizare erbicidator romania', 'piese erbicidator romania',
        'duze erbicidator', 'pompa instalatie erbicidat', 'filtru erbicidator',
        'piese schimb erbicidator purtat', 'piese schimb utilaje agricole',
    ],
    alternates: {
        canonical: 'https://tehnicagrosupply.ro/piese-schimb/bargam',
    },
};

const PRODUCTS = [
    {
        icon: <Droplets className="w-6 h-6 text-ea-green-500" />,
        name: 'Duze de Pulverizare',
        desc: 'Duze plat-fan, antidrift și de înaltă presiune compatibile cu rampele Bargam Elios — TeeJet, Lechler, Albuz.',
        tags: ['Aftermarket', 'Premium'],
    },
    {
        icon: <Cog className="w-6 h-6 text-ea-green-500" />,
        name: 'Pompă Instalație Erbicidat',
        desc: 'Pompe centrifugale și cu diafragmă (Comet, AR) compatibile cu Bargam Elios BDL — înlocuire directă, cu sau fără kit montaj.',
        tags: ['OEM', 'Aftermarket'],
    },
    {
        icon: <Filter className="w-6 h-6 text-ea-green-500" />,
        name: 'Filtre Erbicidator',
        desc: 'Filtre de aspirație, linie și corp duzā — filtre mari și mici pentru rampa Bargam, diverse deschideri de plasă.',
        tags: ['OEM', 'Aftermarket'],
    },
    {
        icon: <Gauge className="w-6 h-6 text-ea-green-500" />,
        name: 'Furtun Presiune & Aspirație',
        desc: 'Furtun erbicidator armat (la metru sau pe lungimi standard) — compatibil cu conexiunile instalației Bargam Elios.',
        tags: ['Aftermarket'],
    },
    {
        icon: <Cog className="w-6 h-6 text-ea-green-500" />,
        name: 'Supape & Regulatoare Presiune',
        desc: 'Supape de sens unic, regulatoare de presiune electronice și mecanice pentru instalația de stropire Bargam.',
        tags: ['OEM', 'Aftermarket'],
    },
    {
        icon: <Droplets className="w-6 h-6 text-ea-green-500" />,
        name: 'Corp Duzā & Membranā Rampa',
        desc: 'Corporation duzā (portduzā) cu membrană anti-picurare — piesa cu cea mai rapidă uzură pe rampele de stropire.',
        tags: ['Aftermarket'],
    },
];

const MODELS = [
    'Bargam Elios BDL 2200',
    'Bargam Elios BDL 2700',
    'Bargam Elios BDL 3200',
    'Bargam Elios BDL 3200 – 24m rampa',
    'Bargam – modele purtat & semipurtat',
];

export default function PieseBargamPage() {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Piese de Schimb Erbicidator Bargam Elios BDL Romania",
        "description": "Furnizare piese de schimb OEM și aftermarket pentru erbicidatoarele Bargam Elios BDL 2200, 2700 și 3200 în România — duze pulverizare, pompă, filtru, furtun presiune, supape.",
        "provider": {
            "@type": "Organization",
            "name": "TehnicAgro Supply",
            "url": "https://tehnicagrosupply.ro"
        },
        "areaServed": "RO",
        "serviceType": "Piese Schimb Erbicidator Bargam",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Pentru ce modele Bargam furnizați piese de schimb?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Furnizăm piese de schimb pentru toată gama Bargam Elios BDL — modelele 2200, 2700 și 3200, atât variantele purtate cât și semipurtate. Contactați-ne cu numărul de model și volumul rezervorului pentru identificare exactă."
                }
            },
            {
                "@type": "Question",
                "name": "Ce tip de duze folosesc erbicidatoarele Bargam Elios?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rampele Bargam Elios folosesc corpuri de duzā standard ISO 110° cu membrană anti-picurare. Duzele sunt compatibile cu toate mărcile standard TeeJet, Lechler și Albuz — puteți opta pentru duze clasice plat-fan, antidrift sau cu jet îngust în funcție de cultură."
                }
            },
            {
                "@type": "Question",
                "name": "Puteți identifica piesa Bargam după fotografie?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Trimiteți-ne o fotografie a piesei defecte și modelul erbicidatorului Bargam pe WhatsApp sau email și vă transmitem referința, disponibilitatea și prețul în maxim 2 ore."
                }
            },
        ]
    };

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-32 pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest font-bold mb-12">
                    <Link href="/piese-schimb" className="hover:text-ea-green-600 transition-colors">Piese de Schimb</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-zinc-700">Bargam Elios</span>
                </nav>

                {/* Header */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-ea-green-600 bg-ea-green-100 rounded-full px-4 py-1.5">Erbicidatoare & Instalații de Stropire</span>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                            Piese de Schimb<br />
                            <span className="text-ea-green-600">Bargam Elios</span>
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-lg">
                            Furnizăm piese de schimb OEM și aftermarket pentru erbicidatoarele <strong className="text-zinc-900">Bargam Elios BDL</strong> 2200 / 2700 / 3200 — duze, pompă, filtru, furtun și supape.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Duze TeeJet / Lechler
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Pompă Comet / AR
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Livrare 24-48h
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-zinc-900 rounded-3xl p-8 grid grid-cols-2 gap-4">
                        {[
                            { val: 'BDL 2200', sub: 'Model entry-level' },
                            { val: 'BDL 2700', sub: 'Model mid-range' },
                            { val: 'BDL 3200', sub: 'Model top — 24m' },
                            { val: '24-48h', sub: 'Livrare România' },
                        ].map(s => (
                            <div key={s.val} className="bg-zinc-800 rounded-2xl p-4 text-center">
                                <p className="text-xl font-black text-white">{s.val}</p>
                                <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-8">
                        Piese <span className="text-ea-green-600">Disponibile</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {PRODUCTS.map((p) => (
                            <div key={p.name} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-3 hover:border-ea-green-400 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        {p.icon}
                                        <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-tight">{p.name}</h3>
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-xs leading-relaxed">{p.desc}</p>
                                <div className="flex gap-1">
                                    {p.tags.map(t => (
                                        <span key={t} className="text-[10px] font-bold uppercase bg-ea-green-100 text-ea-green-700 rounded-full px-2 py-0.5">{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compatible models */}
                <div className="bg-zinc-900 rounded-3xl p-10 mb-20">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
                        Modele <span className="text-ea-green-400">Bargam</span> Acoperite
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {MODELS.map(m => (
                            <div key={m} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-400 flex-shrink-0" />
                                <span className="text-sm text-zinc-300 font-medium">{m}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-zinc-500 text-sm mt-5">
                        Aveți un model Bargam care nu apare în listă? Contactați-ne — putem aduce piese pentru toată gama Bargam, inclusiv modele mai vechi.
                    </p>
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">
                            Solicită o <span className="text-ea-green-600">ofertă rapidă</span>
                        </h2>
                        <p className="text-zinc-500 text-lg">
                            Trimiteți-ne modelul erbicidatorului Bargam, piesa sau referința necesară. Vă răspundem în maxim 2 ore cu preț și disponibilitate.
                        </p>
                        <TrustSignals />
                    </div>
                    <div className="bg-zinc-50 p-2 rounded-3xl border border-zinc-200">
                        <Contact />
                    </div>
                </div>
            </div>
        </main>
    );
}
