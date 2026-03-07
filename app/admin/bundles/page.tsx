'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Plus, Package, Trash2, Save } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  type: string
  price_cents: number
  active: number
}

export default function AdminBundlesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', productIds: [] as string[] })

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products?all=true')
      const data = await res.json()
      if (data.ok) setProducts(data.data.products || [])
    } catch { /* */ } finally { setLoading(false) }
  }

  const singles = products.filter(p => p.type === 'single')
  const bundles = products.filter(p => p.type === 'bundle')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
          description: form.description,
          price_cents: Math.round(parseFloat(form.price) * 100),
          product_ids: form.productIds,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        alert('Bundle created!')
        setForm({ name: '', slug: '', description: '', price: '', productIds: [] })
        fetchProducts()
      } else {
        alert(data.error?.message || 'Failed to create bundle')
      }
    } catch { alert('Failed') } finally { setCreating(false) }
  }

  const toggleProduct = (id: string) => {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter(p => p !== id)
        : [...prev.productIds, id]
    }))
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">Bundle Management</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create Bundle */}
        <div className="clay-card p-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
            <Plus className="w-5 h-5 inline-block mr-2" />Create Bundle
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Bundle Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="clay-input w-full" placeholder="e.g., Complete K-2 Bundle" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="clay-input w-full" rows={3} placeholder="Bundle description..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Price (USD)</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="clay-input w-full" placeholder="19.99" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Include Products</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {singles.map(p => (
                  <label key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background cursor-pointer">
                    <input type="checkbox" checked={form.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} className="rounded" />
                    <span className="text-sm text-text-primary">{p.name}</span>
                    <span className="text-xs text-text-muted ml-auto">${(p.price_cents / 100).toFixed(2)}</span>
                  </label>
                ))}
                {singles.length === 0 && <p className="text-sm text-text-muted">No single products yet</p>}
              </div>
            </div>

            <button type="submit" disabled={creating} className="clay-button-cta w-full flex items-center justify-center gap-2 cursor-pointer">
              {creating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {creating ? 'Creating...' : 'Create Bundle'}
            </button>
          </form>
        </div>

        {/* Existing Bundles */}
        <div className="clay-card p-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
            <Package className="w-5 h-5 inline-block mr-2" />Existing Bundles
          </h2>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-background rounded-lg" />)}
            </div>
          ) : bundles.length === 0 ? (
            <p className="text-text-muted text-center py-8">No bundles created yet</p>
          ) : (
            <div className="space-y-3">
              {bundles.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">{b.name}</p>
                    <p className="text-sm text-text-muted">${(b.price_cents / 100).toFixed(2)} • {b.active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {b.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
