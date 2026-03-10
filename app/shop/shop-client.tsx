'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  BookOpen, ArrowRight, Sparkles, Globe, Heart,
  Package, Eye, ClipboardCheck, Search, X,
} from 'lucide-react'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { getProductImage, PLACEHOLDER_IMAGE } from '@/lib/product-images'

interface Product {
  id: string; slug: string; name: string; description: string
  type: string; price_cents: number; price_formatted: string
  resources?: Array<{ id: string; title: string; pack_type: string; age_band: string; language_pair: string }>
}

function ProductImage({ product }: { product: Product }) {
  const [src, setSrc] = useState(() =>
    getProductImage(
      product.type,
      product.resources?.[0]?.pack_type,
      product.resources?.[0]?.age_band,
      product.slug
    )
  )
  return (
    <Image
      src={src}
      alt={product.name}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setSrc(PLACEHOLDER_IMAGE)}
    />
  )
}

const typeFilters = [
  { key: 'all', label: 'All Products' },
  { key: 'single', label: 'Singles' },
  { key: 'bundle', label: 'Bundles' },
  { key: 'membership', label: 'Memberships' },
]

const packTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'vocabulary_pack', label: 'Vocabulary' },
  { value: 'sentence_frames', label: 'Sentence Frames' },
  { value: 'classroom_labels', label: 'Labels' },
  { value: 'parent_communication', label: 'Parent Comm.' },
  { value: 'visual_supports', label: 'Visual Supports' },
  { value: 'assessment_tools', label: 'Assessment' },
]

const languageOptions = [
  { value: '', label: 'All Languages' },
  { value: 'en-es', label: 'English-Spanish' },
  { value: 'en-zh', label: 'English-Chinese' },
  { value: 'en-ar', label: 'English-Arabic' },
  { value: 'en-vi', label: 'English-Vietnamese' },
  { value: 'en-fr', label: 'English-French' },
  { value: 'en-pt', label: 'English-Portuguese' },
]

export function ShopClient() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [packType, setPackType] = useState(searchParams.get('type') || '')
  const [language, setLanguage] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ active: 'true' })
      if (searchQuery) params.set('q', searchQuery)
      if (packType) params.set('pack_type', packType)
      if (language) params.set('language', language)
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      if (data.ok) setProducts(data.data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, packType, language])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true
    if (filter === 'bundle') return p.type === 'bundle'
    if (filter === 'membership') return p.type === 'membership'
    return p.type === 'single'
  })

  const hasActiveFilters = searchQuery || packType || language || filter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setPackType('')
    setLanguage('')
    setFilter('all')
  }

  return (
    <>
      {/* Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-xl mx-auto relative">
          <label htmlFor="shop-search" className="sr-only">Search packs</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            id="shop-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, grade, or language..."
            className="clay-input w-full pl-12 pr-10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" aria-label="Clear search">
              <X className="w-4 h-4 text-text-muted hover:text-text-primary" />
            </button>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${filter === f.key
                  ? 'bg-primary text-white shadow-clay-button'
                  : 'bg-white text-text-primary hover:bg-primary/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <select value={packType} onChange={(e) => setPackType(e.target.value)} className="clay-input py-2 px-4 text-sm cursor-pointer" aria-label="Filter by pack type">
              {packTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="clay-input py-2 px-4 text-sm cursor-pointer" aria-label="Filter by language">
              {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-cta hover:underline cursor-pointer">Clear all filters</button>
            )}
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
              <p className="text-text-muted mb-6">Try a different search or filter.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="clay-button cursor-pointer">Clear All Filters</button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="clay-card overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer group block flex flex-col"
                >
                  <div className="relative h-44 w-full bg-slate-50">
                    <ProductImage product={product} />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${product.type === 'bundle'
                        ? 'bg-purple-100/90 text-purple-700'
                        : product.type === 'membership'
                          ? 'bg-cta/10 text-cta bg-white/90'
                          : 'bg-primary/10 text-primary bg-white/90'
                      }`}>
                        {product.type === 'membership' ? 'Membership' : product.type.toUpperCase()}
                      </span>
                    </div>
                    {product.type === 'bundle' && (
                      <span className="absolute top-3 right-3 text-xs text-white font-medium bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full">Save 30%</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-text-primary/70 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                    {product.resources && product.resources.length > 0 && (
                      <p className="text-xs text-text-muted mb-4">{product.resources.length} printable {product.resources.length === 1 ? 'pack' : 'packs'} included</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-text-primary/10 mt-auto">
                      <div>
                        {product.type === 'membership' ? (
                          <span className="font-heading text-2xl font-bold text-cta">${(product.price_cents / 100).toFixed(0)}<span className="text-sm font-normal text-text-muted">/mo</span></span>
                        ) : (
                          <span className="font-heading text-2xl font-bold text-primary">${(product.price_cents / 100).toFixed(2)}</span>
                        )}
                      </div>
                      <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
