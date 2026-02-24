/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://tehnicagrosupply.ro',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api/']
            }
        ],
        additionalSitemaps: []
    },
    exclude: ['/admin', '/api/*'],
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: path === '/' ? 'daily' : 'weekly',
            priority: path === '/' ? 1.0 : 0.8,
            lastmod: new Date().toISOString(),
        }
    }
}
