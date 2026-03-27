import type { MetadataRoute } from 'next';
import { getProducts, getActiveCategories, isProductVisibleOnSite } from '@/lib/products-store';
import { getPublishedPosts } from '@/data/blog';
import { getSiteBaseUrl } from '@/lib/site-base-url';

/** Regenerare periodică — aliniat la catalog / blog. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteBaseUrl();
    const now = new Date();

    const staticPaths = [
        '',
        '/contact',
        '/utilaje',
        '/blog',
        '/piese-schimb',
        '/conditii-utilizare',
        '/privacy-policy',
        '/politica-cookie',
    ];

    const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.8,
    }));

    let categoryEntries: MetadataRoute.Sitemap = [];
    let productEntries: MetadataRoute.Sitemap = [];

    try {
        const [categories, products] = await Promise.all([getActiveCategories(), getProducts()]);

        categoryEntries = categories.map((c) => ({
            url: `${baseUrl}/utilaje/${c.slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }));

        productEntries = products
            .filter((p) => isProductVisibleOnSite(p.status))
            .map((p) => ({
                url: `${baseUrl}/utilaje/${p.category}/${p.slug}`,
                lastModified:
                    typeof p.updatedAt === 'string' ? new Date(p.updatedAt) : now,
                changeFrequency: 'weekly' as const,
                priority: 0.75,
            }));
    } catch {
        /* catalog indisponibil — sitemap rămâne cu rute statice */
    }

    const posts = getPublishedPosts();
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticEntries, ...categoryEntries, ...productEntries, ...blogPosts];
}
