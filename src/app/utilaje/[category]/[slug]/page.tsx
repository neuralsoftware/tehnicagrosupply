import { PRODUCTS } from '@/data/products';
import { getPublishedPosts } from '@/data/blog';
import { notFound } from 'next/navigation';
import { ProductSection } from '@/components/ProductSection';
import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ExpertAuthority } from '@/components/ExpertAuthority';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
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

    const allPosts = getPublishedPosts();
    // Găsește 3 articole care includ numele sau brandul utilajului în conținut sau titlu. 
    // Dacă nu găsim, afișăm pur și simplu cele mai noi 3 articole.
    const exactMatches = allPosts.filter(post =>
        post.content.toLowerCase().includes(product.name.toLowerCase()) ||
        post.content.toLowerCase().includes(product.brand.toLowerCase()) ||
        post.title.toLowerCase().includes(product.name.toLowerCase())
    );
    const postsToShow = exactMatches.length > 0 ? exactMatches.slice(0, 3) : allPosts.slice(0, 3);

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

            <div className="max-w-7xl mx-auto px-4 py-16 border-t border-zinc-100">
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

            {postsToShow.length > 0 && (
                <section className="py-24 bg-zinc-50 border-t border-zinc-200">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 bg-ea-green-100 rounded-2xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-ea-green-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase text-zinc-900 tracking-tight">
                                    Resurse & Articole Relevante
                                </h2>
                                <p className="text-zinc-500 text-sm mt-1">
                                    Informații tehnice, ghiduri APIA și studii de caz pentru {product.brand}.
                                </p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {postsToShow.map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-ea-green-300 transition-all duration-300">
                                    <div className="mb-6 flex-grow">
                                        <span className="text-[10px] font-black uppercase text-ea-green-600 tracking-widest bg-ea-green-50 px-4 py-1.5 rounded-full inline-block mb-4">
                                            {post.category.replace('-', ' ')}
                                        </span>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-ea-green-600 transition-colors line-clamp-2 leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-zinc-100 flex items-center text-xs font-black text-ea-green-600 uppercase tracking-widest group-hover:translate-x-2 transition-transform mt-auto">
                                        Citește Articolul <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <ExpertAuthority />
        </main>
    );
}
