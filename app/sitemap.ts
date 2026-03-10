import { query } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'https://lanternell.com'

interface SitemapEntry {
    url: string
    lastModified: Date
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
}

export default async function sitemap(): Promise<SitemapEntry[]> {
    const entries: SitemapEntry[] = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/teaching-tips`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/ell-worksheets`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/bilingual-classroom-labels`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/english-spanish-printables`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/esl-worksheets-beginners`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/visual-supports-ell`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/newcomer-activities`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]

    try {
        // Add product pages
        const products = await query<{ slug: string; created_at: string }>(
            'SELECT slug, created_at FROM products WHERE active = 1 ORDER BY created_at DESC'
        )

        for (const product of products) {
            entries.push({
                url: `${BASE_URL}/shop/${product.slug}`,
                lastModified: new Date(product.created_at),
                changeFrequency: 'weekly',
                priority: 0.8,
            })
        }

        // Add teaching tips posts
        const blogPosts = await query<{ slug: string; published_at: string }>(
            "SELECT slug, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC"
        )

        for (const post of blogPosts) {
            entries.push({
                url: `${BASE_URL}/teaching-tips/${post.slug}`,
                lastModified: new Date(post.published_at),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }

        // Add free resource pages
        const resources = await query<{ slug: string; created_at: string }>(
            "SELECT slug, created_at FROM resources WHERE free_or_paid = 'free' ORDER BY created_at DESC"
        )

        for (const resource of resources) {
            entries.push({
                url: `${BASE_URL}/free/${resource.slug}`,
                lastModified: new Date(resource.created_at),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }
    } catch {
        // Database may not be available during build
    }

    return entries
}
