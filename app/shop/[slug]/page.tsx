import { notFound } from 'next/navigation'
import Link from 'next/link'
import { queryOne, query } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import {
  Sparkles,
  BookOpen,
  Globe,
  Heart,
  Star,
  Download,
  CheckCircle,
  FileText,
  Printer,
  Users,
  Package,
  Eye,
  ClipboardCheck
} from 'lucide-react'
import type { Metadata } from 'next'
import { ProductPurchaseButton } from '@/components/ui/product-purchase-button'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

interface Resource {
  id: string
  title: string
  slug: string
  pack_type: string
  topic: string
  age_band: string
  language_pair: string
  description: string
}

interface Product {
  id: string
  slug: string
  name: string
  description: string
  type: string
  price_cents: number
  stripe_price_id: string | null
}

const packTypeIcons: Record<string, React.ReactNode> = {
  vocabulary_pack: <Sparkles className="w-6 h-6" />,
  sentence_frames: <BookOpen className="w-6 h-6" />,
  classroom_labels: <Globe className="w-6 h-6" />,
  parent_communication: <Heart className="w-6 h-6" />,
  visual_supports: <Eye className="w-6 h-6" />,
  assessment_tools: <ClipboardCheck className="w-6 h-6" />,
}

const packTypeLabels: Record<string, string> = {
  vocabulary_pack: 'Vocabulary Pack',
  sentence_frames: 'Sentence Frames',
  classroom_labels: 'Classroom Labels',
  parent_communication: 'Parent Communication',
  visual_supports: 'Visual Supports',
  assessment_tools: 'Assessment Tools',
}

const features = [
  { icon: <Printer className="w-5 h-5" />, text: 'Print-ready PDF format' },
  { icon: <Globe className="w-5 h-5" />, text: '6 language pairs available' },
  { icon: <Users className="w-5 h-5" />, text: 'Pre-K–8 ELL, SPED & bilingual' },
  { icon: <Download className="w-5 h-5" />, text: 'Instant digital download' },
]

async function getProduct(slug: string) {
  const product = await queryOne<Product>(
    'SELECT id, slug, name, description, type, price_cents, stripe_price_id FROM products WHERE slug = ? AND active = 1',
    [slug]
  )
  if (!product) return null

  const resources = await query<Resource>(
    `SELECT r.id, r.title, r.slug, r.pack_type, r.topic, r.age_band, r.language_pair, r.description
     FROM resources r
     JOIN product_resources pr ON pr.resource_id = r.id
     WHERE pr.product_id = ?`,
    [product.id]
  )

  return { ...product, resources }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }

  const title = `${product.name} — Printable ELL Teaching Pack`
  const description = product.description || `Download ${product.name} — a print-ready multilingual teaching pack for Pre-K–8 ELL, bilingual, and SPED students.`

  return {
    title,
    description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/shop/${slug}`,
      type: 'website',
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const mainPackType = product.resources?.[0]?.pack_type || 'vocabulary_pack'
  const priceFormatted = product.type === 'membership'
    ? `$${(product.price_cents / 100).toFixed(0)}`
    : `$${(product.price_cents / 100).toFixed(2)}`

  // JSON-LD Product
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Printable ELL teaching pack for Pre-K–8 students.`,
    url: `${BASE_URL}/shop/${slug}`,
    brand: { '@type': 'Brand', name: 'LanternELL' },
    offers: {
      '@type': 'Offer',
      price: (product.price_cents / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/shop/${slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  }

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}/shop/${slug}` },
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar links={[
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/account/library', label: 'My Library' },
      ]} />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Product Info */}
            <div className="lg:col-span-3 space-y-8">
              {/* Product Cover */}
              <div className="clay-card p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-clay-sm text-primary shrink-0">
                    {packTypeIcons[mainPackType] || <Package className="w-10 h-10" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        product.type === 'bundle' ? 'bg-purple-100 text-purple-700'
                        : product.type === 'membership' ? 'bg-cta/10 text-cta'
                        : 'bg-primary/10 text-primary'
                      }`}>
                        {product.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-text-muted">
                        {packTypeLabels[mainPackType] || 'Teaching Pack'}
                      </span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                      {product.name}
                    </h1>
                    <p className="text-text-primary/70 leading-relaxed">
                      {product.description || 'A comprehensive printable teaching pack designed for Pre-K–8 ELL, bilingual, and SPED students.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              {product.resources?.length > 0 && (
                <div className="clay-card p-6">
                  <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">What's Included</h2>
                  <div className="space-y-3">
                    {product.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center gap-3 p-3 bg-background rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <div>
                          <p className="font-medium text-text-primary">{resource.title}</p>
                          <p className="text-sm text-text-muted">
                            {packTypeLabels[resource.pack_type] || resource.pack_type} • {(resource.language_pair || 'en-es').toUpperCase()} • {resource.age_band || 'K-2'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="clay-card p-6">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                        {feature.icon}
                      </div>
                      <span className="text-sm text-text-primary">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfect For + internal links */}
              <div className="clay-card p-6">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">Perfect For</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['ELL Newcomers', 'Bilingual Classrooms', 'Pre-K–8 Students', 'ESL Teachers', 'SPED Classrooms', 'Homeschool Families'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-background rounded-full text-sm text-text-primary font-medium">{tag}</span>
                  ))}
                </div>
                <p className="text-sm text-text-primary/70">
                  Browse more <Link href="/shop" className="text-primary hover:underline">printable ELL teaching packs</Link> or read our <Link href="/teaching-tips" className="text-primary hover:underline">teaching tips</Link> for classroom strategies.
                </p>
              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:col-span-2">
              <div className="clay-card p-6 lg:sticky lg:top-24">
                <div className="text-center mb-6">
                  {product.type === 'membership' ? (
                    <div>
                      <span className="font-heading text-4xl font-bold text-cta">{priceFormatted}</span>
                      <span className="text-lg text-text-muted">/month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-heading text-4xl font-bold text-primary">{priceFormatted}</span>
                      <p className="text-sm text-text-muted mt-1">One-time purchase</p>
                    </div>
                  )}
                </div>

                <ProductPurchaseButton
                  productId={product.id}
                  productSlug={product.slug}
                  productType={product.type}
                />

                <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-6">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free samples available before you buy
                </div>

                <div className="border-t border-text-primary/10 pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-primary">Instant download after purchase</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-primary">US Letter & A4 compatible</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-primary">AI generated + human reviewed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-primary">Single teacher / classroom use</span>
                  </div>
                </div>

                <div className="border-t border-text-primary/10 pt-6 mt-6">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-center text-sm text-text-muted">Trusted by 10,000+ teachers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer minimal />
    </main>
  )
}
