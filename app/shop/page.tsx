'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
  Globe,
  Heart,
  Package,
  Eye,
  ClipboardCheck
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { ProductGridSkeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  slug: string
  name: string
  description: string
  type: string
  price_cents: number
  price_formatted: string
  resources?: Array<{
    id: string
    title: string
    pack_type: string
  }>
}

const packTypeIcons: Record<string, React.ReactNode> = {
  vocabulary_pack: <Sparkles className="w-6 h-6" />,
  sentence_frames: <BookOpen className="w-6 h-6" />,
  classroom_labels: <Globe className="w-6 h-6" />,
  parent_communication: <Heart className="w-6 h-6" />,
  visual_supports: <Eye className="w-6 h-6" />,
  assessment_tools: <ClipboardCheck className="w-6 h-6" />,
}

const packTypeColors: Record<string, string> = {
  vocabulary_pack: 'bg-amber-100',
  sentence_frames: 'bg-blue-100',
  classroom_labels: 'bg-emerald-100',
  parent_communication: 'bg-rose-100',
  visual_supports: 'bg-violet-100',
  assessment_tools: 'bg-cyan-100',
}

const filters = [
  { key: 'all', label: 'All Products' },
  { key: 'single', label: 'Singles' },
  { key: 'bundle', label: 'Bundles' },
  { key: 'membership', label: 'Memberships' },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?active=true')
      const data = await res.json()
      if (data.ok) setProducts(data.data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true
    if (filter === 'bundle') return p.type === 'bundle'
    if (filter === 'membership') return p.type === 'membership'
    return p.type === 'single'
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        links={[
          { href: '/', label: 'Home' },
          { href: '/shop', label: 'Shop', active: true },
          { href: '/account/library', label: 'My Library' },
        ]}
        showCart
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Teaching Packs & Resources
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
            Ready-to-use printable resources for your Pre-K–8 ELL, bilingual, and SPED classroom.
            Just print and start teaching.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${
                  filter === f.key
                    ? 'bg-primary text-white shadow-clay-button'
                    : 'bg-white text-text-primary hover:bg-primary/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No products found</h3>
              <p className="text-text-muted mb-6">Try a different filter or check back later.</p>
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="clay-button cursor-pointer">
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="clay-card p-6 hover:-translate-y-1 transition-all duration-200 cursor-pointer group block"
                >
                  {/* Product Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      product.type === 'bundle'
                        ? 'bg-purple-100 text-purple-700'
                        : product.type === 'membership'
                        ? 'bg-cta/10 text-cta'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {product.type === 'membership' ? 'Membership' : product.type.toUpperCase()}
                    </span>
                    {product.type === 'bundle' && (
                      <span className="text-xs text-green-600 font-medium">Save 30%</span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary ${
                    packTypeColors[product.resources?.[0]?.pack_type || 'vocabulary_pack']
                  }`}>
                    {product.type === 'membership' ? (
                      <Star className="w-7 h-7" />
                    ) : (
                      packTypeIcons[product.resources?.[0]?.pack_type || 'vocabulary_pack']
                    )}
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-sm text-text-primary/70 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {product.resources && product.resources.length > 0 && (
                    <p className="text-xs text-text-muted mb-4">
                      {product.resources.length} printable {product.resources.length === 1 ? 'pack' : 'packs'} included
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-text-primary/10">
                    <div>
                      {product.type === 'membership' ? (
                        <span className="font-heading text-2xl font-bold text-cta">
                          ${(product.price_cents / 100).toFixed(0)}
                          <span className="text-sm font-normal text-text-muted">/mo</span>
                        </span>
                      ) : (
                        <span className="font-heading text-2xl font-bold text-primary">
                          ${(product.price_cents / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer minimal />
    </main>
  )
}
