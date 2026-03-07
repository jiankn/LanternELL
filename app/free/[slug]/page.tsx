import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query, queryOne } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { EmailCapture } from '@/components/ui/email-capture'
import { Download, ArrowRight, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resource = await queryOne<{ title: string; seo_title: string; seo_description: string; description: string }>(
    "SELECT title, seo_title, seo_description, description FROM resources WHERE slug = ? AND free_or_paid = 'free'",
    [slug]
  )
  if (!resource) return { title: 'Free Resource' }
  return {
    title: resource.seo_title || `Free ${resource.title}`,
    description: resource.seo_description || resource.description,
    alternates: { canonical: `${BASE_URL}/free/${slug}` },
    openGraph: {
      title: resource.seo_title || `Free ${resource.title}`,
      description: resource.seo_description || resource.description,
      url: `${BASE_URL}/free/${slug}`,
    },
  }
}

export default async function FreeResourcePage({ params }: Props) {
  const { slug } = await params

  const resource = await queryOne<{
    id: string; slug: string; title: string; description: string
    pack_type: string; topic: string; age_band: string; language_pair: string
    sample_pdf_url: string | null; seo_title: string; seo_description: string
  }>(
    "SELECT * FROM resources WHERE slug = ? AND free_or_paid = 'free'",
    [slug]
  )

  if (!resource) notFound()

  // Find related paid products
  const related = await query<{ id: string; slug: string; name: string; price_cents: number }>(
    `SELECT p.id, p.slug, p.name, p.price_cents FROM products p
     JOIN product_resources pr ON p.id = pr.product_id
     JOIN resources r ON r.id = pr.resource_id
     WHERE r.pack_type = ? AND p.active = 1
     LIMIT 3`,
    [resource.pack_type]
  )

  const langLabels: Record<string, string> = {
    'en-es': 'English-Spanish', 'en-zh': 'English-Chinese', 'en-ar': 'English-Arabic',
    'en-vi': 'English-Vietnamese', 'en-fr': 'English-French', 'en-pt': 'English-Portuguese',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: resource.title,
    description: resource.description,
    url: `${BASE_URL}/free/${slug}`,
    publisher: { '@type': 'Organization', name: 'LanternELL' },
    inLanguage: 'en',
    isAccessibleForFree: true,
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar links={[
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/ell-worksheets', label: 'ELL Worksheets' },
      ]} />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="clay-card p-8 sm:p-12">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-4">
              Free Download
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              {resource.title}
            </h1>
            <p className="text-lg text-text-primary/70 mb-6">{resource.description}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{resource.age_band}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{langLabels[resource.language_pair] || resource.language_pair}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{resource.pack_type.replace(/_/g, ' ')}</span>
            </div>

            <div className="bg-background rounded-xl p-6 mb-8">
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Get this free resource — enter your email
              </h2>
              <EmailCapture />
              <p className="text-xs text-text-muted mt-3">
                We will send the download link to your email. No spam, unsubscribe anytime.
              </p>
            </div>

            <div className="space-y-3">
              {['Print-ready PDF format', 'Bilingual content included', 'Teacher guide with tips', 'No account required'].map(f => (
                <div key={f} className="flex items-center gap-3 text-sm text-text-primary/80">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related paid products */}
      {related.length > 0 && (
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
              Want more? Check out these packs
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="clay-card-sm p-5 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <h3 className="font-heading text-sm font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-primary">${(p.price_cents / 100).toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4 text-cta" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
