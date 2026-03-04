import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ChevronRight, Wrench, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Piese Schimb Semănătoare Kurt ALP Romania | Tub, Brăzdar, Disc, Distribuitor | TehnicAgro",
    description: "Piese de schimb OEM și aftermarket pentru semănătoarele Kurt ALP România — tub semănat, distribuitor complet, brăzdar disc, disc seminci, roată presoare. Livrare rapidă 24-48h în toată România.",
    keywords: [
        'piese semanatoare kurt', 'piese kurt alp romania', 'tub semanatoare kurt',
        'distribuitor complect semanatoare kurt', 'brazdar disc semanatoare kurt',
        'disc seminte semanatoare kurt', 'roata presoare semanatoare kurt',
        'piese semanatoare paioase kurt', 'piese semanatoare universale kurt',
        'piese alp romania', 'semanatoare kurt alp piese schimb',
        'piese schimb semanatoare cereale', 'piese semanatoare porumb', 'piese schimb utilaje agricole',
    ],
    alternates: {
        canonical: 'https://tehnicagrosupply.ro/piese-schimb/kurt',
    },
};

const PRODUCTS = [
    {
        name: 'Tub Semănat Kurt',
        desc: 'Tub de conducere semințe din material rezistent la abraziune, compatibil cu gama de semănători paioase și universale Kurt.',
        tags: ['OEM', 'Aftermarket'],
    },
    {
        name: 'Distribuitor Complet Semănătoare',
        desc: 'Distribuitor volumetric complet pentru semănători Kurt (paioase și universale) — piesa de uzură numărul 1 la semănat.',
        tags: ['OEM'],
    },
    {
        name: 'Brăzdar Disc Semănătoare',
        desc: 'Brăzdar disc simplu sau dublu pentru semănătoarele Kurt în funcție de model — asigură deschiderea uniformă a brazului.',
        tags: ['OEM', 'Aftermarket'],
    },
    {
        name: 'Disc Seminci (disc semănat)',
        desc: 'Discuri calibrate pe culturi (grâu, orz, rapiță, porumb) — compatibile cu cutia de semănat Kurt.',
        tags: ['OEM', 'Aftermarket'],
    },
    {
        name: 'Roată Tasatoare / Presoare',
        desc: 'Roată cauciuc sau plastic pentru tasarea solului după brăzdar — asigură contactul seminței cu solul.',
        tags: ['Aftermarket'],
    },
    {
        name: 'Cuțit Disc de Tăiere',
        desc: 'Cuțit disc pentru tăierea miriștei înaintea brăzdarului — uzură intensă la No-Till pe miriste mari.',
        tags: ['Aftermarket'],
    },
];

const MODELS = [
    'Kurt Universal 13 rânduri',
    'Kurt Universal 17 rânduri',
    'Kurt Paioase 19 rânduri (ALP)',
    'Kurt Paioase 21 rânduri (ALP)',
    'ALP – seria 300 / 400 cm lățime',
];

export default function PieseKurtPage() {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Piese de Schimb Semănătoare Kurt ALP Romania",
        "description": "Furnizare piese de schimb OEM și aftermarket pentru semănătoarele Kurt ALP în România — tub semănat, distribuitor complet, brăzdar disc, disc seminci, roată presoare, cuțit disc.",
        "provider": {
            "@type": "Organization",
            "name": "TehnicAgro Supply",
            "url": "https://tehnicagrosupply.ro"
        },
        "areaServed": "RO",
        "serviceType": "Piese Schimb Semănătoare Kurt ALP",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Ce modele de semănători Kurt ALP puteți furniza piese?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Putem furniza piese de schimb pentru gama completă Kurt ALP disponibilă în România: semănători paioase 19 și 21 rânduri, semănători universale 13 și 17 rânduri și seria ALP cu lățimi de 300 și 400 cm. Contactați-ne cu modelul exact și numărul de serie."
                }
            },
            {
                "@type": "Question",
                "name": "Cât durează livrarea pieselor pentru semănătoarea Kurt?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Piesele Kurt disponibile în stocul nostru sau prin Kramp se livrează în 24-48 ore în România. Piesele OEM la comandă directă de la producător au un termen de 5-10 zile lucrătoare, în funcție de model și stocul fabricii."
                }
            },
            {
                "@type": "Question",
                "name": "Pot comanda piese pentru semănătoarea Kurt fără numărul de referință?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Da. Dacă nu aveți numărul de referință al piesei, puteți trimite modelul semănătoarei, numărul de serie și, dacă este posibil, o fotografie a piesei uzate. Tehnicianul nostru vă va identifica exact componenta și vă va transmite disponibilitate și preț."
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
                    <span className="text-zinc-700">Kurt ALP</span>
                </nav>

                {/* Header */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-ea-green-600 bg-ea-green-100 rounded-full px-4 py-1.5">Semănătoare Cereale & Universale</span>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                            Piese de Schimb<br />
                            <span className="text-ea-green-600">Kurt ALP</span>
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-lg">
                            Furnizăm piese de schimb OEM și aftermarket pentru toată gama de semănători <strong className="text-zinc-900">Kurt ALP</strong> disponibilă în România — identificare rapidă, livrare în 24-48h.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> OEM & Aftermarket
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Identificare după serie
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-ea-green-500" /> Livrare 24-48h
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[<Wrench key="w" className="w-8 h-8 text-ea-green-500" />, <Truck key="t" className="w-8 h-8 text-ea-green-500" />, <ShieldCheck key="s" className="w-8 h-8 text-ea-green-500" />].map((icon, i) => {
                            const stats = [
                                { val: '500K+', sub: 'articole Kramp stoc' },
                                { val: '24-48h', sub: 'livrare România' },
                                { val: 'OEM', sub: 'piese originale' },
                            ];
                            return (
                                <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 text-center space-y-2">
                                    <div className="flex justify-center">{icon}</div>
                                    <p className="text-2xl font-black text-zinc-900">{stats[i].val}</p>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wide">{stats[i].sub}</p>
                                </div>
                            );
                        })}
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
                                    <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-tight">{p.name}</h3>
                                    <div className="flex gap-1 flex-shrink-0">
                                        {p.tags.map(t => (
                                            <span key={t} className="text-[10px] font-bold uppercase bg-ea-green-100 text-ea-green-700 rounded-full px-2 py-0.5">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-xs leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compatible models */}
                <div className="bg-zinc-900 rounded-3xl p-10 mb-20">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
                        Modele <span className="text-ea-green-400">Compatibile</span> Kurt ALP
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
                        Nu găsiți modelul dvs.? Contactați-ne — furnizăm piese pentru toată gama Kurt, inclusiv modele mai vechi sau mai puțin comune.
                    </p>
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">
                            Solicită o <span className="text-ea-green-600">ofertă rapidă</span>
                        </h2>
                        <p className="text-zinc-500 text-lg">
                            Trimiteți-ne modelul semănătoarei Kurt, piesa necesară sau numărul de serie. Îți răspundem în maxim 2 ore cu preț și termen de livrare.
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
