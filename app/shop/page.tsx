'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Download, 
  Star, 
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Globe,
  Heart,
  Package
} from 'lucide-react'

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
  parent_communication: <Heart className="w-6 h-6" />
}

const packTypeColors: Record<string, string> = {
  vocabulary_pack: 'bg-amber-100',
  sentence_frames: 'bg-blue-100',
  classroom_labels: 'bg-emerald-100',
  parent_communication: 'bg-rose-100'
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?active=true')
      const data = await res.json()
      if (data.ok) {
        setProducts(data.data.products)
      }
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
              <Link href="/shop" className="text-primary font-medium">Shop</Link>
              <Link href="/account/library" className="text-text-primary hover:text-primary transition-colors">My Library</Link>
              <Link href="/cart" className="text-text-primary hover:text-primary transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Teaching Packs & Resources
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
            Ready-to-use printable resources for your K-2 ELL and bilingual classroom. 
            Just print and start teaching.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['all', 'single', 'bundle', 'membership'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === f 
                    ? 'bg-primary text-white shadow-clay-button' 
                    : 'bg-white text-text-primary hover:bg-primary/10'
                }`}
              >
                {f === 'all' ? 'All Products' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-text-muted">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No products found</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="clay-card p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer group"
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

                  {/* Resources Count */}
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
                    <Link 
                      href={`/shop/${product.slug}`}
                      className="clay-button text-sm flex items-center gap-1"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
