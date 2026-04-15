import { getProducts, isProductVisibleOnSite, productMatchesCategorySlug } from '@/lib/products-store';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

/**
 * Server Component — afișează 4 produse pe homepage:
 * 1-2: Multisem ADS (Avers-Agro) + Chain Disc KSE 680 (Fliegl) — utilaje principale
 * 3-4: Produse Fliegl recoltare-logistica (ULW, DK/DDK) — înlocuiesc K-Factor
 */
export async function FeaturedMachinery() {
    const allProducts = await getProducts();
    const active = allProducts.filter((p) => isProductVisibleOnSite(p.status));

    // Produsele principale (Pregătire Sol + Semănat) — ordine fixă pentru brand consistency
    const mainProducts = [
        active.find((p) => p.slug === 'multisem-ads'),
        active.find((p) => p.slug === 'chain-disc-kse-680'),
    ].filter(Boolean) as typeof active;

    // Remorci logistică Fliegl (înlocuiesc K-Factor Powerbank + Booster)
    const logisticaProducts = active
        .filter((p) => productMatchesCategorySlug(p.category, 'recoltare-logistica'))
        .slice(0, 2);

    const showcaseProducts = [...mainProducts, ...logisticaProducts];

    if (showcaseProducts.length === 0) return null;

    return (
        <section id="oferta" className="border-y border-zinc-100 bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
                            Utilaje <span className="text-ea-green-600">performante</span>
                        </h2>
                        <p className="text-zinc-500 max-w-xl text-lg">
                            Tehnologie de ultimă oră pentru agricultura de precizie, optimizată pentru subvențiile 2026.
                        </p>
                    </div>
                    <Link
                        href="/utilaje/pregatire-sol"
                        className="text-ea-green-700 font-medium text-sm md:text-base flex items-center gap-2 hover:gap-3 transition-all shrink-0"
                    >
                        Vezi tot catalogul
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {showcaseProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-ea-green-500/50 hover:shadow-lg transition-all"
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
