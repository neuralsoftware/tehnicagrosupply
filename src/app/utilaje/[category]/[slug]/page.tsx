import {
    getProducts,
    getCategories,
    productMatchesCategorySlug,
    normalizeLegacyProductSlug,
    normalizeCategorySlugParam,
} from '@/lib/products-store';
import { formatCategoryTitle } from '@/lib/category-display-titles';
import { Breadcrumb } from '@/components/Breadcrumb';
import { formatProductSeoDisplayName } from '@/lib/product-seo-display-name';
import { getPublishedPosts } from '@/data/blog';
import { notFound, permanentRedirect } from 'next/navigation';
import { ProductSection } from '@/components/ProductSection';
import { Contact } from '@/components/Contact';
import { TrustSignals } from '@/components/TrustSignals';
import { ExpertAuthority } from '@/components/ExpertAuthority';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, BadgeCheck, ExternalLink } from 'lucide-react';
import { getActiveProgramsForCategory } from '@/data/funding-programs';
import { resolveProductDemoVideo } from '@/lib/product-demo-video';

/**
 * ISR în loc de force-dynamic: pagina e servită din cache și regenerată la max. 5 minute.
 * TTFB scade de la ~1s la ~0,1s (LCP mobil) și reduce citirile din Supabase.
 * `force-static` e necesar pentru că citirile din Storage (no-store / list) ar forța
 * altfel randare la fiecare cerere. Compromis: modificările din admin apar în max. 5 min.
 */
export const dynamic = 'force-static';
export const revalidate = 300;

interface PageProps {
    params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category, slug } = await params;
    const resolvedSlug = normalizeLegacyProductSlug(slug);
    const products = await getProducts();
    const product = products.find(
        (p) => p.slug === resolvedSlug && productMatchesCategorySlug(p.category, category)
    );
    if (!product) return {};

    const displayName = formatProductSeoDisplayName(product);
    const seoTitle =
        product.metaTitle || `${displayName} — Preț & Detalii Tehnice | TehnicAgro Supply`;
    const seoDesc = product.metaDescription || `${product.description} Eligibil finanțare DR-12 și eco-scheme APIA. Solicită ofertă personalizată.`;
    const absImage = `https://tehnicagrosupply.ro${product.imageSrc}`;

    return {
        title: seoTitle,
        description: seoDesc,
        alternates: {
            canonical: `https://tehnicagrosupply.ro/utilaje/${product.category}/${resolvedSlug}`,
        },
        openGraph: {
            title: `${displayName} | TehnicAgro`,
            description: seoDesc,
            images: [{ url: absImage, width: 1200, height: 630, alt: product.name }],
            type: 'website',
            locale: 'ro_RO',
        },
        twitter: { card: 'summary_large_image', title: seoTitle, description: seoDesc, images: [absImage] },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { category, slug } = await params;
    const resolvedSlug = normalizeLegacyProductSlug(slug);
    const products = await getProducts();
    const product = products.find(
        (p) => p.slug === resolvedSlug && productMatchesCategorySlug(p.category, category)
    );

    if (!product || product.status === 'draft') notFound();

    if (category !== product.category || slug !== resolvedSlug) {
        permanentRedirect(`/utilaje/${product.category}/${resolvedSlug}`);
    }

    const allPosts = getPublishedPosts();
    const exactMatches = allPosts.filter(post =>
        post.content.toLowerCase().includes(product.name.toLowerCase()) ||
        post.content.toLowerCase().includes(product.brand.toLowerCase()) ||
        post.title.toLowerCase().includes(product.name.toLowerCase())
    );
    const postsToShow = exactMatches.length > 0 ? exactMatches.slice(0, 3) : allPosts.slice(0, 3);

    const fundingPrograms = getActiveProgramsForCategory(product.category);

    const categories = await getCategories();
    const catRow = categories.find(
        (c) => normalizeCategorySlugParam(c.slug) === normalizeCategorySlugParam(product.category)
    );
    const categoryLabel = formatCategoryTitle(
        catRow?.slug ?? String(product.category),
        catRow?.name ?? ''
    );

    const mainImage = (product.imageSrc || '').trim();
    /** Doar galeria produsului — imaginile din „blocuri broșură dedicată” sunt exclusiv pentru PDF, nu apar pe site. */
    const fromGallery = (product.gallery || []).filter(
        (u) => u && String(u).trim() && String(u).trim() !== mainImage
    );
    const secondaryImages = [...fromGallery].filter((u, i, arr) => arr.indexOf(u) === i);
    const demoVideo = resolveProductDemoVideo(product.videoUrl);

    const breadcrumbItems = [
        { label: 'Acasă', href: '/' },
        { label: 'Utilaje', href: '/utilaje' },
        { label: categoryLabel, href: `/utilaje/${product.category}` },
        { label: product.name },
    ];

    const productSchema = {
        '@context': 'https://schema.org', '@type': 'Product',
        name: product.name, description: product.description,
        image: `https://tehnicagrosupply.ro${product.imageSrc}`,
        brand: { '@type': 'Brand', name: product.brand },
        offers: { '@type': 'Offer', priceCurrency: 'RON', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: 'TehnicAgro Supply' } },
    };

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-20">
            <Breadcrumb items={breadcrumbItems} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

            <ProductSection
                title={product.name}
                slug={product.slug}
                badge={product.badge}
                brand={product.brand}
                categoryLabel={categoryLabel}
                description={product.description}
                longDescription={product.longDescription}
                imageSrc={product.imageSrc}
                specs={product.specs}
                detailedSpecs={product.detailedSpecs}
                expertVerdict={product.expertVerdict}
                gallery={product.gallery}
                secondaryImages={secondaryImages}
                ctaLabel="Solicită Ofertă Tehnică"
            />

            {demoVideo && (
                <section className="max-w-4xl mx-auto px-4 pb-12">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-6">Demo Video</h2>
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                        {demoVideo.kind === 'video' ? (
                            <video
                                className="h-full w-full bg-zinc-950 object-contain"
                                controls
                                playsInline
                                preload="metadata"
                                title={`Demo ${product.name}`}
                            >
                                <source src={demoVideo.src} type={demoVideo.mimeType} />
                            </video>
                        ) : (
                            <iframe
                                src={demoVideo.src}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                title={`Demo ${product.name}`}
                            />
                        )}
                    </div>
                </section>
            )}

            {fundingPrograms.length > 0 && (
                <section className="py-12 bg-ea-green-50 border-y border-ea-green-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-ea-green-100 rounded-xl flex items-center justify-center">
                                <BadgeCheck className="w-5 h-5 text-ea-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase text-zinc-900 tracking-tight">Programe de Finanțare Eligibile</h2>
                                <p className="text-zinc-500 text-sm mt-0.5">Acest utilaj poate fi achiziționat prin finanțare europeană</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fundingPrograms.map(prog => (
                                <div key={prog.code} className="bg-white rounded-2xl p-6 border border-ea-green-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-black bg-ea-green-600 text-white px-2 py-1 rounded uppercase tracking-widest">{prog.code}</span>
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase">{prog.agency}</span>
                                    </div>
                                    <h3 className="font-bold text-zinc-900 text-sm mb-2">{prog.title}</h3>
                                    <p className="text-xs text-zinc-500 mb-3 line-clamp-3">{prog.details}</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-black text-ea-green-700">Max: {prog.maxGrant}</span>
                                        <a href={prog.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-ea-green-600 hover:underline font-bold">
                                            Detalii <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    {prog.deadline !== 'TBD' && <p className="text-[10px] text-zinc-400 mt-2">Termen: {prog.deadline}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="max-w-7xl mx-auto px-4 py-16 border-t border-zinc-100">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black uppercase tracking-tight text-zinc-900">
                            Solicită o ofertă pentru <span className="text-ea-green-600">{product.name}</span>
                        </h3>
                        <p className="text-zinc-500">Completează formularul și un consultant TehnicAgro te va contacta pentru configurația ideală și opțiunile de finanțare disponibile.</p>
                        <TrustSignals />
                    </div>
                    <Contact productName={product.name} />
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
                                <h2 className="text-3xl font-black uppercase text-zinc-900 tracking-tight">Resurse & Articole Relevante</h2>
                                <p className="text-zinc-500 text-sm mt-1">Informații tehnice, ghiduri APIA și studii de caz pentru {product.brand}.</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {postsToShow.map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-ea-green-300 transition-all duration-300">
                                    <div className="mb-6 flex-grow">
                                        <span className="text-[10px] font-black uppercase text-ea-green-600 tracking-widest bg-ea-green-50 px-4 py-1.5 rounded-full inline-block mb-4">{post.category.replace('-', ' ')}</span>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-ea-green-600 transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                                        <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">{post.excerpt}</p>
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
