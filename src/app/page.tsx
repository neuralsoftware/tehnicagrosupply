import { Hero } from '@/components/Hero';
import { FeaturedMachinery } from '@/components/FeaturedMachinery';
import { Contact } from '@/components/Contact';
import { VideoGallery } from '@/components/VideoGallery';
import { HOME_SHOWCASE_STORAGE } from '@/lib/site-video-paths';
import { getTehnicagroStoragePublicUrl } from '@/lib/storage-video-public';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { HomeViticultureSeason } from '@/components/HomeViticultureSeason';
import { HomeViticultureProducts } from '@/components/HomeViticultureProducts';
import { HomeBlogTeaser } from '@/components/HomeBlogTeaser';
import { HomeAuditContextBand } from '@/components/HomeAuditContextBand';
import { HomePromiseBand } from '@/components/HomePromiseBand';
import { getPublishedPosts } from '@/data/blog';
import {
    getProducts,
    getViticultureCategoryCatalogPath,
    productMatchesCategorySlug,
    isProductVisibleOnSite,
} from '@/lib/products-store';

/** Catalog viticol de pe home trebuie citit la fiecare request (altfel rămâne gol sau vechi de la build static). */
export const dynamic = 'force-dynamic';

export default async function Home() {
    const recentBlogPosts = [...getPublishedPosts()]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const [catalogProducts, viticultureCatalogHref] = await Promise.all([
        getProducts(),
        getViticultureCategoryCatalogPath(),
    ]);
    const videoSrcAds = getTehnicagroStoragePublicUrl(HOME_SHOWCASE_STORAGE.aversAds);
    const videoSrcKse = getTehnicagroStoragePublicUrl(HOME_SHOWCASE_STORAGE.flieglKseTeren);
    const viticolHomePreview = catalogProducts
        .filter(
            (p) =>
                isProductVisibleOnSite(p.status) && productMatchesCategorySlug(p.category, 'viticol')
        )
        .slice(0, 2);
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Ce este subvenția APIA PD-04 și cum o pot accesa?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Eco-schema PD-04 oferă 56 EUR/ha pentru agricultura conservativă (No-Till, Mini-Till). Pentru a fi eligibil, trebuie să folosești utilaje care nu inversează solul și să menții resturile vegetale la suprafață. Semănătoarea Avers-Agro Multisem ADS îndeplinește toate cerințele.',
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
                    text: 'În medie, fermierii economisesc 320 RON/ha la motorină prin reducerea numărului de treceri. La 100 hectare, aceasta înseamnă 32.000 RON/an economie, plus subvenția de 28.140 RON (56 EUR x 100 ha x 5 RON/EUR).',
                },
            },
        ],
    };

    return (
        <main className="min-h-screen bg-white pt-16 font-sans text-zinc-900 selection:bg-ea-green-500 selection:text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <Hero />

            <HomeViticultureSeason catalogHref={viticultureCatalogHref} />

            <HomeViticultureProducts products={viticolHomePreview} catalogHref={viticultureCatalogHref} />

            <HomeAuditContextBand />

            <HomePromiseBand />

            <FeaturedMachinery />

            <VideoGallery videoSrcAds={videoSrcAds} videoSrcKse={videoSrcKse} />

            <Contact variant="homeSplit" />

            <HomeBlogTeaser posts={recentBlogPosts} />

            <WhatsAppButton />
            <ExitIntentPopup />
        </main>
    );
}
