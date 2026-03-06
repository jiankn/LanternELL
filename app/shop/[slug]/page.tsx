'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Sparkles,
  BookOpen,
  Globe,
  Heart,
  Star,
  Download,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
  FileText,
  Printer,
  Users,
  Package
} from 'lucide-react'

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
  price_formatted: string
  stripe_price_id: string | null
  resources: Resource[]
}

const packTypeIcons: Record<string, React.ReactNode> = {
  vocabulary_pack: <Sparkles className="w-6 h-6" />,
  sentence_frames: <BookOpen className="w-6 h-6" />,
  classroom_labels: <Globe className="w-6 h-6" />,
  parent_communication: <Heart className="w-6 h-6" />
}

const packTypeLabels: Record<string, string> = {
  vocabulary_pack: 'Vocabulary Pack',
  sentence_frames: 'Sentence Frames',
  classroom_labels: 'Classroom Labels',
  parent_communication: 'Parent Communication'
}

const features = [
  { icon: <Printer className="w-5 h-5" />, text: 'Print-ready PDF format' },
  { icon: <FileText className="w-5 h-5" />, text: 'Bilingual English-Spanish' },
  { icon: <Users className="w-5 h-5" />, text: 'Designed for K-2 ELL students' },
  { icon: <Download className="w-5 h-5" />, text: 'Instant digital download' },
]

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${slug}`)
      const data = await res.json()
      if (data.ok) {
        setProduct(data.data.product)
      } else {
        setError(data.error?.message || 'Product not found')
      }
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!product) return
    setPurchasing(true)

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          successPath: '/checkout/success',
          cancelPath: `/shop/${product.slug}`,
        })
      })
      const data = await res.json()

      if (data.ok && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      } else {
        alert(data.error?.message || 'Checkout failed')
      }
    } catch (err) {
      alert('Checkout failed')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto pt-32 px-4 text-center">
          <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">
            Product Not Found
          </h1>
          <p className="text-text-muted mb-6">{error || 'This product does not exist.'}</p>
          <Link href="/shop" className="clay-button">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  const mainPackType = product.resources?.[0]?.pack_type || 'vocabulary_pack'

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-text-primary hover:text-primary transition-colors">Home</Link>
              <Link href="/shop" className="text-text-primary hover:text-primary transition-colors">Shop</Link>
              <Link href="/account/library" className="text-text-primary hover:text-primary transition-colors">My Library</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Product Info */}
            <div className="lg:col-span-3">
              {/* Product Cover */}
              <div className="clay-card p-8 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-clay-sm text-primary shrink-0">
                    {packTypeIcons[mainPackType] || <Package className="w-10 h-10" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        product.type === 'bundle'
                          ? 'bg-purple-100 text-purple-700'
                          : product.type === 'membership'
                          ? 'bg-cta/10 text-cta'
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
                      {product.description || `A comprehensive printable teaching pack designed for K-2 ELL and newcomer students.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              {product.resources && product.resources.length > 0 && (
                <div className="clay-card p-6 mb-8">
                  <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                    What's Included
                  </h2>
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
              <div className="clay-card p-6 mb-8">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                  Features
                </h2>
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

              {/* Use Cases */}
              <div className="clay-card p-6">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                  Perfect For
                </h2>
                <div className="flex flex-wrap gap-3">
                  {['ELL Newcomers', 'Bilingual Classrooms', 'K-2 Students', 'ESL Teachers', 'Homeschool', 'Parent Support'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-background rounded-full text-sm text-text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:col-span-2">
              <div className="clay-card p-6 sticky top-24">
                {/* Price */}
                <div className="text-center mb-6">
                  {product.type === 'membership' ? (
                    <div>
                      <span className="font-heading text-4xl font-bold text-cta">
                        ${(product.price_cents / 100).toFixed(0)}
                      </span>
                      <span className="text-lg text-text-muted">/month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-heading text-4xl font-bold text-primary">
                        ${(product.price_cents / 100).toFixed(2)}
                      </span>
                      <p className="text-sm text-text-muted mt-1">One-time purchase</p>
                    </div>
                  )}
                </div>

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="clay-button-cta w-full text-lg py-4 flex items-center justify-center gap-2 mb-4"
                >
                  {purchasing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {purchasing ? 'Processing...' : product.type === 'membership' ? 'Subscribe Now' : 'Buy Now'}
                </button>

                {/* Guarantee */}
                <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-6">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  30-day money-back guarantee
                </div>

                {/* Trust Signals */}
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

                {/* Rating */}
                <div className="border-t border-text-primary/10 pt-6 mt-6">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-center text-sm text-text-muted">
                    Trusted by 10,000+ teachers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-white/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-text-muted">
          © 2026 LanternELL. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
