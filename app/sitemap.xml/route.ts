import { query } from '@/lib/db'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getBaseUrl(): string {
  // In Cloudflare Workers, NEXT_PUBLIC_ vars are baked at build time (often localhost).
  // Use the incoming request host to derive the correct origin.
  try {
    const headersList = headers()
    const host = headersList.get('host')
    if (host && !host.includes('localhost')) {
      const proto = headersList.get('x-forwarded-proto') || 'https'
      return `${proto}://${host}`
    }
  } catch {
    // headers() may not be available in all contexts
  }
  // Hardcoded fallback — never fall back to localhost
  return 'https://lanternell.com'
}

/** Convert any date string to W3C Datetime (ISO 8601) for sitemap compliance.
 *  Handles SQLite format "2026-03-08 03:27:39.356" and ISO strings. */
function toW3CDate(raw: string): string {
  if (!raw) return new Date().toISOString()
  // SQLite format: "2026-03-08 03:27:39.356" → replace space with T, append Z
  const trimmed = raw.trim()
  // Already valid ISO
  if (trimmed.includes('T')) return trimmed
  // SQLite datetime with space separator
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(trimmed)) {
    // Strip fractional seconds and append Z
    return trimmed.replace(' ', 'T').replace(/\.\d+$/, '') + 'Z'
  }
  // Date only: "2026-03-08"
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  // Fallback: try Date parse
  try {
    const d = new Date(trimmed)
    if (!isNaN(d.getTime())) return d.toISOString()
  } catch { /* ignore */ }
  return trimmed.split(/[T ]/)[0] || trimmed
}

export async function GET() {
  const BASE_URL = getBaseUrl()
  const staticPages = [
    { url: BASE_URL, changefreq: 'weekly', priority: '1.0' },
    { url: `${BASE_URL}/shop`, changefreq: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/ell-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/bilingual-classroom-labels`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/english-spanish-printables`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/esl-worksheets-beginners`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/visual-supports-ell`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/newcomer-activities`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/teaching-tips`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/pricing`, changefreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.4' },
    { url: `${BASE_URL}/login`, changefreq: 'monthly', priority: '0.3' },
    { url: `${BASE_URL}/terms`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/privacy`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/refund-policy`, changefreq: 'yearly', priority: '0.2' },
  ]

  const now = new Date().toISOString()
  let dynamicEntries = ''

  try {
    const products = await query<{ slug: string; created_at: string }>(
      'SELECT slug, created_at FROM products WHERE active = 1 ORDER BY created_at DESC'
    )
    for (const p of products) {
      dynamicEntries += `<url><loc>${BASE_URL}/shop/${p.slug}</loc><lastmod>${toW3CDate(p.created_at)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`
    }

    const posts = await query<{ slug: string; published_at: string }>(
      "SELECT slug, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC"
    )
    for (const p of posts) {
      dynamicEntries += `<url><loc>${BASE_URL}/teaching-tips/${p.slug}</loc><lastmod>${toW3CDate(p.published_at)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`
    }

    const resources = await query<{ slug: string; created_at: string }>(
      "SELECT slug, created_at FROM resources WHERE free_or_paid = 'free' ORDER BY created_at DESC"
    )
    for (const r of resources) {
      dynamicEntries += `<url><loc>${BASE_URL}/free/${r.slug}</loc><lastmod>${toW3CDate(r.created_at)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`
    }
  } catch {
    // DB may not be available
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `<url><loc>${p.url}</loc><lastmod>${now}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('\n')}
${dynamicEntries}</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'CDN-Cache-Control': 'no-cache',
      'Cloudflare-CDN-Cache-Control': 'no-cache',
    },
  })
}
