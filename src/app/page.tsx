import { Hero } from '@/components/Hero';
import { FeaturedMachinery } from '@/components/FeaturedMachinery';
import { Contact } from '@/components/Contact';
import { VideoGallery } from '@/components/VideoGallery';
import { HOME_SHOWCASE_STORAGE } from '@/lib/site-video-paths';
import { getTehnicagroStoragePublicUrl } from '@/lib/storage-video-public';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { HomeViticultureSeason } from '@/components/HomeViticultureSeason';
import { HomeBlogTeaser } from '@/components/HomeBlogTeaser';
import { HomeAuditContextBand } from '@/components/HomeAuditContextBand';
import { HomePromiseBand } from '@/components/HomePromiseBand';
import { getPublishedPosts } from '@/data/blog';
import { getProducts, productMatchesCategorySlug, isProductVisibleOnSite } from '@/lib/products-store';

/** Home citește catalogul la fiecare request pentru secțiunile dependente de produse din Supabase. */
export const dynamic = 'force-dynamic';

export default async function Home({
    searchParams,
}: {
    searchParams?: Promise<{ ref?: string | string[] }>;
}) {
    const resolvedSearchParams = await searchParams;
    const refSource = Array.isArray(resolvedSearchParams?.ref)
        ? resolvedSearchParams?.ref[0]
        : resolvedSearchParams?.ref;
    const recentBlogPosts = [...getPublishedPosts()]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const catalogProducts = await getProducts();
    const videoSrcAds = getTehnicagroStoragePublicUrl(HOME_SHOWCASE_STORAGE.aversAds);
    const videoSrcKse = getTehnicagroStoragePublicUrl(HOME_SHOWCASE_STORAGE.flieglKseTeren);
    const hasHarvestProducts = catalogProducts.some(
        (p) => isProductVisibleOnSite(p.status) && productMatchesCategorySlug(p.category, 'recoltare-logistica')
    );
    const harvestCatalogHref = hasHarvestProducts ? '/utilaje/recoltare-logistica' : '/utilaje';
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Ce este subvenția APIA PD-04 și cum o pot accesa în 2027?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Eco-schema PD-04 oferă 56 EUR/ha pentru agricultura conservativă (No-Till, Mini-Till). Campania 2026 s-a închis pe 5 Iunie 2026. Fermierii care achiziționează utilaje acum se pot înscrie la cererea unică APIA din campania 2027 (depunere Mar–Iun 2027). Semănătoarea Avers-Agro Multisem ADS îndeplinește toate cerințele tehnice de eligibilitate.',
                },
            },
            {
                '@type': 'Question',
                name: 'Ce înseamnă GAEC 6 și de ce este important?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'GAEC 6 impune acoperirea solului pe teren arabil în perioada 15 iunie - 15 octombrie. Trebuie să lași resturile vegetale la suprafață sau să cultivi culturi intermediare. Grapa Fliegl Chain Disc mărunțește resturile fără să le îngropă, asigurând conformitatea.',
                },
            },
            {
                '@type': 'Question',
                name: 'Cât economisesc cu tehnologia No-Till?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'În medie, fermierii economisesc 320 RON/ha la motorină prin reducerea numărului de treceri. La 100 hectare, aceasta înseamnă 32.000 RON/an economie. Adăugând subvenția PD-04 din campania 2027 (56 EUR x 100 ha x 5 RON/EUR = 28.000 RON), beneficiul total depășește 60.000 RON/an.',
                },
            },
        ],
    };

    return (
        <main className="min-h-screen bg-white pt-16 font-sans text-zinc-900 selection:bg-ea-green-500 selection:text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <Hero refSource={refSource} />

            <HomeViticultureSeason catalogHref={harvestCatalogHref} />

            <HomeAuditContextBand />

            <HomePromiseBand />

            <FeaturedMachinery products={catalogProducts} />

            <VideoGallery videoSrcAds={videoSrcAds} videoSrcKse={videoSrcKse} />

            <Contact variant="homeSplit" />

            <HomeBlogTeaser posts={recentBlogPosts} />

            <WhatsAppButton />
            <ExitIntentPopup />
        </main>
    );
}
