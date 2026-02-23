import { PRODUCTS } from '@/data/products';
import { notFound } from 'next/navigation';
import { ProductSection } from '@/components/ProductSection';
import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ExpertAuthority } from '@/components/ExpertAuthority';

interface PageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        category: product.category,
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: PageProps) {
    const { category, slug } = await params;
    const product = PRODUCTS.find(p => p.slug === slug && p.category === category);

    if (!product) {
        notFound();
    }

    // Schema.org Product Metadata
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": `https://tehnic-agro-funnel.vercel.app${product.imageSrc}`,
        "brand": {
            "@type": "Brand",
            "name": product.brand
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

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <ProductSection
                title={product.name}
                badge={product.badge}
                description={product.description}
                imageSrc={product.imageSrc}
                specs={product.specs}
                detailedSpecs={product.detailedSpecs}
                expertVerdict={product.expertVerdict}
                ctaLabel="Descarcă Fișa Tehnică"
            />

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black uppercase tracking-tight text-white">
                            Solicită o ofertă pentru <span className="text-ea-green-500">{product.name}</span>
                        </h3>
                        <p className="text-zinc-400">
                            Completează formularul și un consultant TehnicAgro te va contacta pentru a discuta configurația ideală pentru ferma ta și opțiunile de finanțare disponibile.
                        </p>
                        <TrustSignals />
                    </div>
                    <Contact />
                </div>
            </div>

            <ExpertAuthority />

            <footer className="py-12 bg-black border-t border-zinc-900">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-zinc-700 text-xs">&copy; 2026 TehnicAgro Supply. Toate drepturile rezervate.</p>
                </div>
            </footer>
        </main>
    );
}
