'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

interface Product {
  id: string; slug: string; name: string; description: string; type: string
  price_cents: number; active: number; stripe_price_id: string | null
  resource_count: number; created_at: string
}

const typeOptions = ['single', 'bundle', 'membership', 'license']

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', type: 'single', priceCents: 0, stripePriceId: '', stripeProductId: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.ok) setProducts(data.data.products)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await fetch(`/api/admin/products/${editId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/admin/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setShowForm(false); setEditId(null)
      setForm({ name: '', description: '', type: 'single', priceCents: 0, stripePriceId: '', stripeProductId: '' })
      fetchProducts()
    } catch { alert('Save failed') } finally { setSaving(false) }
  }

  const handleEdit = (p: Product) => {
    setEditId(p.id)
    setForm({ name: p.name, description: p.description || '', type: p.type, priceCents: p.price_cents, stripePriceId: p.stripe_price_id || '', stripeProductId: '' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  const handleToggle = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    })
    fetchProducts()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Products</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', type: 'single', priceCents: 0, stripePriceId: '', stripeProductId: '' }) }} className="clay-button text-sm flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      {showForm && (
        <div className="clay-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-text-primary">{editId ? 'Edit' : 'New'} Product</h2>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-primary/10 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="clay-input w-full" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="clay-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="clay-input w-full">
                {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Price (cents)</label>
              <input type="number" value={form.priceCents} onChange={e => setForm({ ...form, priceCents: parseInt(e.target.value) || 0 })} className="clay-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Stripe Price ID</label>
              <input value={form.stripePriceId} onChange={e => setForm({ ...form, stripePriceId: e.target.value })} placeholder="price_..." className="clay-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Stripe Product ID</label>
              <input value={form.stripeProductId} onChange={e => setForm({ ...form, stripeProductId: e.target.value })} placeholder="prod_..." className="clay-input w-full" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="clay-button-cta cursor-pointer">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : products.length === 0 ? (
        <div className="clay-card p-12 text-center text-text-muted">No products yet</div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="clay-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text-primary">{p.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.type}</span>
                </div>
                <p className="text-sm text-text-muted">${(p.price_cents / 100).toFixed(2)} · {p.resource_count} resources · {p.stripe_price_id ? 'Stripe linked' : 'No Stripe'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggle(p)} className="text-xs px-3 py-1.5 rounded-lg bg-white border border-text-primary/10 hover:bg-primary/5 cursor-pointer">{p.active ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => handleEdit(p)} className="p-2 hover:bg-primary/10 rounded-lg cursor-pointer"><Pencil className="w-4 h-4 text-text-primary" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
