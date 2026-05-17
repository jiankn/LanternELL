import { query } from '@/lib/db'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE_URL = 'https://lanternell.com'

interface SitemapEntry {
  url: string
  lastmod: string
  changefreq: string
  priority: string
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const now = new Date().toISOString()
  const entries = new Map<string, SitemapEntry>()

  const addEntry = (entry: SitemapEntry) => {
    entries.set(entry.url, entry)
  }

  const staticPages: Array<Omit<SitemapEntry, 'lastmod'>> = [
    { url: BASE_URL, changefreq: 'weekly', priority: '1.0' },
    { url: `${BASE_URL}/shop`, changefreq: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/free-samples`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/ell-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/bilingual-classroom-labels`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/bilingual-flashcards`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/dual-language-classroom`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/english-spanish-printables`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/esl-activities-kindergarten`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/esl-reading-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/esl-vocabulary-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/esl-worksheets-beginners`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/esl-writing-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/kindergarten-esl-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/spanish-english-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/spanish-flashcards`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/visual-supports-ell`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/newcomer-activities`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/vocabulary-worksheets`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/teaching-tips`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/pricing`, changefreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.4' },
    { url: `${BASE_URL}/terms`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/privacy`, changefreq: 'yearly', priority: '0.2' },
    { url: `${BASE_URL}/refund-policy`, changefreq: 'yearly', priority: '0.2' },
  ]

  for (const page of staticPages) {
    addEntry({ ...page, lastmod: now })
  }

  try {
    const products = await query<{ slug: string; created_at: string }>(
      'SELECT slug, created_at FROM products WHERE active = 1 ORDER BY created_at DESC'
    )
    for (const p of products) {
      addEntry({
        url: `${BASE_URL}/shop/${p.slug}`,
        lastmod: toW3CDate(p.created_at),
        changefreq: 'weekly',
        priority: '0.8',
      })
    }
  } catch {
    // DB may not be available during local builds; keep static and file-backed entries.
  }

  const posts = getAllPosts()
  for (const p of posts) {
    addEntry({
      url: `${BASE_URL}/teaching-tips/${p.slug}`,
      lastmod: toW3CDate(p.publishedAt),
      changefreq: 'monthly',
      priority: '0.7',
    })
  }

  try {
    const resources = await query<{ slug: string; created_at: string }>(
      "SELECT slug, created_at FROM resources WHERE free_or_paid = 'free' ORDER BY created_at DESC"
    )
    for (const r of resources) {
      addEntry({
        url: `${BASE_URL}/free/${r.slug}`,
        lastmod: toW3CDate(r.created_at),
        changefreq: 'monthly',
        priority: '0.7',
      })
    }
  } catch {
    // DB may not be available
  }

  const urlEntries = Array.from(entries.values())
    .map((entry) => (
      `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${escapeXml(entry.lastmod)}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
    ))
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'CDN-Cache-Control': 'no-cache',
      'Cloudflare-CDN-Cache-Control': 'no-cache',
    },
  })
}
