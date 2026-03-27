import {
    getProducts,
    getCategories,
    normalizeCategorySlugParam,
    isProductVisibleOnSite,
    productMatchesCategorySlug,
    isViticultureCategoryField,
} from '@/lib/products-store';
import { formatCategoryTitle } from '@/lib/category-display-titles';
import {
    collectCategoryHeroMp4Urls,
    CATEGORY_HERO_PROVITIS_MP4,
} from '@/lib/category-hero-videos';
import { getCategoryBannerMp4PublicUrl } from '@/lib/category-storage-banner';
import { CategoryHeroBanner } from '@/components/CategoryHeroBanner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

/** SEO comun pentru orice slug viticol (viticol, viticultura, …). */
const CATEGORY_SEO_VITICULTURE: { title: string; description: string; keywords: string[] } = {
    title: 'Utilaje pentru Viticultură | TehnicAgro Supply',
    description:
        'Soluții pentru viticultură: maști și echipamente Provitis, consultanță și finanțare. TehnicAgro Supply — partener pentru plantația ta.',
    keywords: [
        'utilaje viticultura',
        'utilaje viticole',
        'provitis',
        'vie',
        'echipamente viticultura',
        'tehnicagro viticol',
    ],
};

const CATEGORY_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
    'pregatire-sol': {
        title: 'Utilaje Pregătire Sol Agricol | Grape, Chain Disc | TehnicAgro Supply',
        description: 'Utilaje pentru pregătirea solului conform GAEC 6, no-till și minitill. Fliegl Chain Disc KSE 680 — 6.8m lățime, 12 ha/oră, eligibil DR-12. Prețuri și oferte personalizate.',
        keywords: ['utilaje pregatire sol', 'grapa cu lanturi', 'fliegl chain disc', 'grape agricole pret', 'gaec 6 utilaje', 'disc chain no-till', 'pregatire sol conservativa'],
    },
    'semanat-fertilizat': {
        title: 'Semănătoare No-Till & Fertilizat | Avers-Agro | TehnicAgro Supply',
        description: 'Semănători directe No-Till eligibile APIA PD-04. Avers-Agro Multisem ADS — 190 kg presiune brăzdar, suspensie paralelogram. Calculează subvenția fermei tale.',
        keywords: ['semanatoare no-till', 'semanatoare directa', 'avers agro multisem ads', 'semanatoare apia pd-04', 'semanatoare no-till pret', 'semanatoare directa romania'],
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

/** Pagini viticole: slug din URL poate fi viticol, viticultura etc. */
function isViticultureCategoryUrl(categoryParam: string, normalizedKey: string): boolean {
    const raw = categoryParam.toLowerCase();
    const key = normalizedKey.toLowerCase();
    return raw.includes('viti') || key.includes('viti');
}

function truncateHeroSubtitle(text: string, maxLen: number): string {
    const t = text.trim();
    if (t.length <= maxLen) return t;
    return t.slice(0, maxLen).trimEnd() + '…';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const categoryKey = normalizeCategorySlugParam(category);
    const categories = await getCategories();
    const cat = categories.find((c) => normalizeCategorySlugParam(c.slug) === categoryKey);
    if (!cat) return {};
    const seo = isViticultureCategoryField(cat.slug) ? CATEGORY_SEO_VITICULTURE : CATEGORY_SEO[cat.slug];
    const title =
        seo?.title ?? `Utilaje ${cat.name} Agricole | TehnicAgro Supply`;
    const description =
        seo?.description ??
        (cat.description?.trim() ||
            `Utilaje și echipamente pentru ${cat.name}. Oferte și finanțare DR-12 — TehnicAgro Supply.`);
    const keywords = seo?.keywords ?? ['utilaje agricole', cat.name.toLowerCase(), 'tehnicagro'];
    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `https://tehnicagrosupply.ro/utilaje/${cat.slug}`,
        },
        openGraph: {
            title,
            description,
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;
    const categoryKey = normalizeCategorySlugParam(category);
    const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);
    let catMeta = categories.find((c) => normalizeCategorySlugParam(c.slug) === categoryKey);
    if (
        !catMeta &&
        (categoryKey === 'viticol' || isViticultureCategoryUrl(category, categoryKey))
    ) {
        catMeta = categories.find((c) => isViticultureCategoryField(c.slug));
    }
    if (!catMeta) {
        notFound();
    }
    if (category !== catMeta.slug) {
        permanentRedirect(`/utilaje/${catMeta.slug}`);
    }
    const categoryTitle = formatCategoryTitle(catMeta.slug, catMeta.name);
    const filteredProducts = allProducts.filter(
        (p) =>
            isProductVisibleOnSite(p.status) && productMatchesCategorySlug(p.category, categoryKey)
    );

    const storageBannerUrl = await getCategoryBannerMp4PublicUrl(catMeta.slug);
    let categoryHeroMp4s: string[];
    if (storageBannerUrl) {
        /** Admin: `tehnicagro/video/{slug}/banner-*.mp4` — înlocuiește fundalul verde și lista din produse pentru hero. */
        categoryHeroMp4s = [storageBannerUrl];
    } else {
        categoryHeroMp4s = collectCategoryHeroMp4Urls(filteredProducts);
        if (
            categoryHeroMp4s.length === 0 &&
            isViticultureCategoryUrl(category, categoryKey)
        ) {
            categoryHeroMp4s = [CATEGORY_HERO_PROVITIS_MP4];
        }
    }

    const isViti = isViticultureCategoryUrl(category, categoryKey);
    const seo = isViticultureCategoryField(catMeta.slug) ? CATEGORY_SEO_VITICULTURE : CATEGORY_SEO[catMeta.slug];
    const subtitleSource = isViti
        ? 'Soluții premium pentru vie și plantație — utilaje Provitis și consultanță TehnicAgro.'
        : catMeta.description?.trim() ||
          seo?.description ||
          `Descoperă utilajele din categoria ${categoryTitle}, optimizate pentru eficiență și conformitate europeană.`;
    const heroSubtitle = truncateHeroSubtitle(subtitleSource, 260);

    return (
        <main className="min-h-screen bg-white text-zinc-900 pt-16 pb-24">
            <CategoryHeroBanner
                categoryTitle={categoryTitle}
                subtitle={heroSubtitle}
                videoUrls={categoryHeroMp4s}
            />

            <div className="max-w-7xl mx-auto px-4">
                {filteredProducts.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-12">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-3xl overflow-hidden border border-zinc-200 flex flex-col md:flex-row group shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="md:w-2/5 aspect-[4/5] md:aspect-auto relative overflow-hidden md:min-h-[280px]">
                                    <Image
                                        src={product.imageSrc}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 280px"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                                    />
                                    {product.badge && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-ea-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg">
                                                {product.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="md:w-3/5 p-8 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">
                                            {product.name}
                                        </h2>
                                        <p className="text-zinc-500 text-sm line-clamp-3">{product.description}</p>
                                        <ul className="space-y-2">
                                            {product.specs.slice(0, 3).map((spec, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider"
                                                >
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
                        <Link
                            href="/contact"
                            className="mt-6 inline-block text-ea-green-500 font-bold uppercase hover:underline"
                        >
                            Contactează-ne pentru cereri speciale
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
