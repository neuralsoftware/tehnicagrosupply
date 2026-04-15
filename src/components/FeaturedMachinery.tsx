import { getProducts, isProductVisibleOnSite, productMatchesCategorySlug } from '@/lib/products-store';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Truck } from 'lucide-react';

/** Server Component — fetch dinamic produse Fliegl din categoria Recoltare & Logistică */
export async function FeaturedMachinery() {
    const allProducts = await getProducts();

    // Filtrăm produsele active din categoria recoltare-logistica
    const logisticaProducts = allProducts
        .filter(
            (p) =>
                isProductVisibleOnSite(p.status) &&
                productMatchesCategorySlug(p.category, 'recoltare-logistica')
        )
        .slice(0, 2);

    if (logisticaProducts.length === 0) {
        return null;
    }

    return (
        <section id="oferta" className="border-y border-zinc-100 bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ea-green-600">
                            <Truck className="w-4 h-4" />
                            <span>Logistică & Recoltare</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
                            Remorci <span className="text-ea-green-600">Fliegl</span> pentru randament maxim
                        </h2>
                        <p className="text-zinc-500 max-w-xl text-lg">
                            Soluții de transport și logistică agricolă din gama Fliegl — eficiență dovedită în câmp.
                        </p>
                    </div>
                    <Link
                        href="/utilaje/recoltare-logistica"
                        className="text-ea-green-700 font-medium text-sm md:text-base flex items-center gap-2 hover:gap-3 transition-all shrink-0"
                    >
                        Vezi toate remorcile
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {logisticaProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-ea-green-500/50 hover:shadow-lg transition-all"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="aspect-[16/9] overflow-hidden relative shrink-0">
                                <Image
                                    src={product.imageSrc}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover group-hover:scale-105 transition-all duration-700"
                                />
                                {product.badge ? (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-ea-green-600 text-white text-xs font-medium px-3 py-1 rounded-md shadow-md">
                                            {product.badge}
                                        </span>
                                    </div>
                                ) : null}
                                {/* Fliegl brand badge */}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
                                        Fliegl
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1 min-h-0">
                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight mb-2 group-hover:text-ea-green-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-zinc-500 text-sm line-clamp-2">{product.description}</p>

                                    <div className="grid grid-cols-2 gap-2 mt-6">
                                        {product.specs.slice(0, 2).map((spec, i) => (
                                            <div key={i} className="flex items-center gap-2 text-zinc-600 text-xs font-medium">
                                                <Check className="w-3.5 h-3.5 text-ea-green-600 shrink-0" />
                                                {spec.split(':')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-6">
                                    <Link
                                        href={`/utilaje/${product.category}/${product.slug}`}
                                        className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-ea-green-600 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Vezi detalii tehnice
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
