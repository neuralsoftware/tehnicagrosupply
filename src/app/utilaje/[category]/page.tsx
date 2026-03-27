import {
    getProducts,
    getCategories,
    normalizeCategorySlugParam,
    isProductVisibleOnSite,
    productMatchesCategorySlug,
    isViticultureCategoryField,
} from '@/lib/products-store';
import {
    collectCategoryHeroMp4Urls,
    CATEGORY_HERO_PROVITIS_MP4,
} from '@/lib/category-hero-videos';
import { CategoryHeroBanner } from '@/components/CategoryHeroBanner';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

/** Titlu afișat fără MAJUSCULE FORȚATE; diacritice corecte pentru slug-uri cunoscute. */
const CATEGORY_DISPLAY_TITLE: Record<string, string> = {
    viticol: 'Viticultură',
    'pregatire-sol': 'Pregătire sol',
    'semanat-fertilizat': 'Semănat și fertilizat',
    'recoltare-logistica': 'Recoltare și logistică',
    'protectia-plantelor': 'Protecția plantelor',
    legumicol: 'Legumicol',
};

function formatCategoryTitle(slug: string, rawName: string): string {
    const mapped = CATEGORY_DISPLAY_TITLE[slug];
    if (mapped) return mapped;
    const t = rawName.trim();
    if (!t) return t;
    const allShouty = t === t.toUpperCase() && /[A-ZĂÂÎȘȚ]/.test(t);
    if (allShouty) {
        const lower = t.toLocaleLowerCase('ro-RO');
        return lower.charAt(0).toLocaleUpperCase('ro-RO') + lower.slice(1);
    }
    return t;
}

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

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
    viticol: {
        title: 'Utilaje Viticole Premium | Provitis | TehnicAgro Supply',
        description:
            'Soluții pentru viticultură: maști și echipamente Provitis, consultanță și finanțare. TehnicAgro Supply — partener pentru plantația ta.',
        keywords: ['utilaje viticole', 'provitis', 'vie', 'echipamente viticultura', 'tehnicagro viticol'],
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
    const seo = CATEGORY_SEO[cat.slug];
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

    let categoryHeroMp4s = collectCategoryHeroMp4Urls(filteredProducts);
    if (
        categoryHeroMp4s.length === 0 &&
        isViticultureCategoryUrl(category, categoryKey)
    ) {
        categoryHeroMp4s = [CATEGORY_HERO_PROVITIS_MP4];
    }

    const isViti = isViticultureCategoryUrl(category, categoryKey);
    const seo = CATEGORY_SEO[catMeta.slug];
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
                            href="/#contact"
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
