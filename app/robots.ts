export default function robots() {
    const baseUrl = 'https://lanternell.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin',
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
