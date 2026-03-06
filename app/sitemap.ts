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

        // Add free resource pages
        const resources = await query<{ slug: string; created_at: string }>(
            "SELECT slug, created_at FROM resources WHERE free_or_paid = 'free' ORDER BY created_at DESC"
        )

        for (const resource of resources) {
            entries.push({
                url: `${BASE_URL}/resources/${resource.slug}`,
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
