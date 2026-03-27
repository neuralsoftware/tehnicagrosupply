import type { MetadataRoute } from 'next';
import { getSiteBaseUrl } from '@/lib/site-base-url';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteBaseUrl();
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
