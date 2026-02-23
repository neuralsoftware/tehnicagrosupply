import { PRODUCTS } from '@/data/products';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { notFound } from 'next/navigation';

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
        <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-16 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        {categoryName}
                    </h1>
                    <p className="text-zinc-400 max-w-2xl text-lg">
                        Descoperă utilajele din categoria <span className="text-ea-green-500">{categoryName}</span>, optimizate pentru eficiență și conformitate cu normele europene.
                    </p>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col md:flex-row group"
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
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                            {product.name}
                                        </h2>
                                        <p className="text-zinc-400 text-sm line-clamp-3">
                                            {product.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {product.specs.slice(0, 3).map((spec, i) => (
                                                <li key={i} className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                                    <Check className="w-3 h-3 text-ea-green-500" />
                                                    {spec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href={`/utilaje/${product.category}/${product.slug}`}
                                        className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl transition-all uppercase tracking-widest text-xs"
                                    >
                                        Vezi Detalii Tehnice
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-zinc-900 rounded-3xl border border-zinc-800 border-dashed">
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
