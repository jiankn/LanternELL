export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'https://lanternell.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/account/',
                    '/checkout/',
                    '/login',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
