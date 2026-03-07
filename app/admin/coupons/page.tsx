'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Plus, Tag, Trash2 } from 'lucide-react'

interface Coupon {
  id: string
  code: string
  percent_off: number | null
  amount_off: number | null
  currency: string
  active: boolean
  times_redeemed: number
  max_redemptions: number | null
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', maxRedemptions: '' })

  useEffect(() => { fetchCoupons() }, [])

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons')
      const data = await res.json()
      if (data.ok) setCoupons(data.data.coupons || [])
    } catch { /* */ } finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: parseFloat(form.value),
          maxRedemptions: form.maxRedemptions ? parseInt(form.maxRedemptions) : null,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        alert('Coupon created in Stripe!')
        setForm({ code: '', type: 'percent', value: '', maxRedemptions: '' })
        fetchCoupons()
      } else {
        alert(data.error?.message || 'Failed')
      }
    } catch { alert('Failed') } finally { setCreating(false) }
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">Coupon Management</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="clay-card p-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
            <Plus className="w-5 h-5 inline-block mr-2" />Create Coupon
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Promo Code</label>
              <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required className="clay-input w-full" placeholder="e.g., WELCOME20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Discount Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="clay-input w-full">
                  <option value="percent">Percentage Off</option>
                  <option value="amount">Fixed Amount Off</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {form.type === 'percent' ? 'Percent Off (%)' : 'Amount Off (USD)'}
                </label>
                <input type="number" step={form.type === 'percent' ? '1' : '0.01'} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required className="clay-input w-full" placeholder={form.type === 'percent' ? '20' : '5.00'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Max Redemptions (optional)</label>
              <input type="number" value={form.maxRedemptions} onChange={e => setForm({ ...form, maxRedemptions: e.target.value })} className="clay-input w-full" placeholder="Leave empty for unlimited" />
            </div>
            <button type="submit" disabled={creating} className="clay-button-cta w-full cursor-pointer">
              {creating ? 'Creating...' : 'Create Coupon in Stripe'}
            </button>
          </form>
        </div>

        <div className="clay-card p-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">
            <Tag className="w-5 h-5 inline-block mr-2" />Active Coupons
          </h2>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => <div key={i} className="h-16 bg-background rounded-lg" />)}
            </div>
          ) : coupons.length === 0 ? (
            <p className="text-text-muted text-center py-8">No coupons yet</p>
          ) : (
            <div className="space-y-3">
              {coupons.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-mono font-medium text-text-primary">{c.code || c.id}</p>
                    <p className="text-sm text-text-muted">
                      {c.percent_off ? `${c.percent_off}% off` : `$${((c.amount_off || 0) / 100).toFixed(2)} off`}
                      {' • '}{c.times_redeemed} used
                      {c.max_redemptions ? ` / ${c.max_redemptions} max` : ''}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {c.active ? 'Active' : 'Inactive'}
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
