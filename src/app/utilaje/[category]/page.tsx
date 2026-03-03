import { PRODUCTS } from '@/data/products';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

const CATEGORY_NAMES: Record<string, string> = {
    'pregatire-sol': 'Pregătire Sol',
    'semanat-fertilizat': 'Semănat & Fertilizat',
    'protectia-plantelor': 'Protecția Plantelor',
    'recoltare-logistica': 'Recoltare & Logistică',
};

const CATEGORY_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
    'pregatire-sol': {
        title: 'Utilaje Pregătire Sol Agricol | Grape, Chain Disc | TehnicAgro Supply',
        description: 'Utilaje pentru pregătirea solului conform GAEC 6, no-till și minitill. Fliegl Chain Disc KSE 680 — 6.8m lățime, 12 ha/oră, eligibil DR-12. Prețuri și oferte personalizate.',
        keywords: ['utilaje pregatire sol', 'grapa cu lanturi', 'fliegl chain disc', 'grape agricole pret', 'gaec 6 utilaje', 'disc chain no-till', 'pregatire sol conservativa'],
    },
    'semanat-fertilizat': {
        title: 'Semănătoare No-Till & Fertilizat | Avers-Agro | TehnicAgro Supply',
        description: 'Semănători directe No-Till eligibile APIA PD-04. Avers-Agro Green Plains ADS — 190 kg presiune brăzdar, suspensie paralelogram. Calculează subvenția fermei tale.',
        keywords: ['semanatoare no-till', 'semanatoare directa', 'avers agro green plains', 'semanatoare apia pd-04', 'semanatoare no-till pret', 'semanatoare directa romania'],
    },
    'protectia-plantelor': {
        title: 'Utilaje Protecția Plantelor Agricole | TehnicAgro Supply',
        description: 'Soluții complete pentru protecția plantelor: erbicide aplicate, fertilizare foliară, pesticide. Utilaje eligibile DR-12 PNDR 2026. Solicită ofertă.',
        keywords: ['utilaje protectia plantelor', 'masini aplicat pesticide', 'sprayer agricol romania', 'atomizor agricol pret'],
    },
    'recoltare-logistica': {
        title: 'Remorci & Utilaje Logistică Agricolă | K-Factor | TehnicAgro Supply',
        description: 'Remorci de transbordare cereale K-Factor Powerbank & Booster. Eficientizează recoltarea, reduce pierderile și costurile de transport. Eligibile DR-12.',
        keywords: ['remorca transbordare cereale', 'k-factor powerbank', 'remorca agricola cereale', 'logistica recoltare romania', 'remorca cereale pret'],
    },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const seo = CATEGORY_SEO[category];
    if (!seo) return {};
    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: {
            canonical: `https://tehnicagrosupply.ro/utilaje/${category}`,
        },
        openGraph: {
            title: seo.title,
            description: seo.description,
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

export async function generateStaticParams() {
    return Object.keys(CATEGORY_NAMES).map((category) => ({
        category,
    }));
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;
    const filteredProducts = PRODUCTS.filter(p => p.category === category);
    const categoryName = CATEGORY_NAMES[category];

    if (!categoryName) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-zinc-900 uppercase tracking-tighter">
                        {categoryName}
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-lg">
                        Descoperiă utilajele din categoria <span className="text-ea-green-600">{categoryName}</span>, optimizate pentru eficiență și conformitate cu normele europene.
                    </p>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-3xl overflow-hidden border border-zinc-200 flex flex-col md:flex-row group shadow-sm hover:shadow-lg transition-all"
                            >
                                {/* Image */}
                                <div className="md:w-2/5 aspect-[4/5] md:aspect-auto relative overflow-hidden">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                                    />
                                    {product.badge && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-ea-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                                                {product.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">
                                            {product.name}
                                        </h2>
                                        <p className="text-zinc-500 text-sm line-clamp-3">
                                            {product.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {product.specs.slice(0, 3).map((spec, i) => (
                                                <li key={i} className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                                    <Check className="w-3 h-3 text-ea-green-600" />
                                                    {spec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href={`/utilaje/${product.category}/${product.slug}`}
                                        className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-ea-green-600 hover:bg-ea-green-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-xs"
                                    >
                                        Vezi Detalii Tehnice
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-zinc-50 rounded-3xl border border-zinc-200 border-dashed">
                        <p className="text-zinc-500 uppercase font-black tracking-widest text-sm">
                            Momentan nu există utilaje adăugate în această categorie.
                        </p>
                        <Link href="/#contact" className="mt-6 inline-block text-ea-green-500 font-bold uppercase hover:underline">
                            Contactează-ne pentru cereri speciale
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
