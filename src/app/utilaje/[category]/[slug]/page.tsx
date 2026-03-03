import { PRODUCTS } from '@/data/products';
import { notFound } from 'next/navigation';
import { ProductSection } from '@/components/ProductSection';
import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ExpertAuthority } from '@/components/ExpertAuthority';
import { Metadata } from 'next';

// Keyword sets per product slug — targetate pe intenție de cumpărare
const PRODUCT_KEYWORDS: Record<string, string[]> = {
    'chain-disc-kse-680': [
        'fliegl chain disc kse 680', 'grapa cu lanturi', 'grapa fliegl pret romania',
        'utilaje pregatire sol gaec 6', 'disc chain fliegl', 'grapa discuri no-till',
        'conform gaec 6 2026', 'utilaje agricole fliegl'
    ],
    'green-plains-ads': [
        'avers agro green plains ads', 'semanatoare no-till', 'semanatoare directa pret',
        'semanatoare no-till romania', 'avers agro pret', 'semanatoare apia pd-04',
        'semanat direct miristeа', 'semanatoare conservativa'
    ],
    'powerbank': [
        'k-factor powerbank', 'remorca transbordare cereale', 'k factor trailer romania',
        'remorca agricola cereale', 'remorca cereale pret'
    ],
    'booster': [
        'k-factor booster', 'remorca booster agricola', 'k factor booster pret',
        'remorca transport cereale romania'
    ],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category, slug } = await params;
    const product = PRODUCTS.find(p => p.slug === slug && p.category === category);

    if (!product) return {};

    const keywords = PRODUCT_KEYWORDS[slug] || [
        product.brand.toLowerCase(), product.name.toLowerCase(), 'utilaje agricole romania',
        'tehnicagro supply'
    ];

    const seoTitle = `${product.brand} ${product.name} — Pret & Detalii Tehnice | TehnicAgro Supply`;
    const seoDesc = `${product.description} Eligibil finanțare DR-12 și eco-scheme APIA. Solicită ofertă personalizată de la TehnicAgro Supply.`;
    const absImage = `https://tehnicagrosupply.ro${product.imageSrc}`;

    return {
        title: seoTitle,
        description: seoDesc,
        keywords,
        alternates: {
            canonical: `https://tehnicagrosupply.ro/utilaje/${category}/${slug}`,
        },
        openGraph: {
            title: `${product.brand} ${product.name} - ${product.badge || 'Utilaj Agricol'} | TehnicAgro`,
            description: seoDesc,
            images: [{ url: absImage, width: 1200, height: 630, alt: product.name }],
            type: 'website',
            locale: 'ro_RO',
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDesc,
            images: [absImage],
        }
    };
}

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
        "image": `https://tehnicagrosupply.ro${product.imageSrc}`,
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
        <main className="min-h-screen bg-white text-zinc-900 pt-20">
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
                ctaLabel="Solicită Ofertă Tehnică"
            />

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black uppercase tracking-tight text-zinc-900">
                            Solicită o ofertă pentru <span className="text-ea-green-600">{product.name}</span>
                        </h3>
                        <p className="text-zinc-500">
                            Completează formularul și un consultant TehnicAgro te va contacta pentru a discuta configurația ideală pentru ferma ta și opțiunile de finanțare disponibile.
                        </p>
                        <TrustSignals />
                    </div>
                    <Contact />
                </div>
            </div>

            <ExpertAuthority />
        </main>
    );
}
