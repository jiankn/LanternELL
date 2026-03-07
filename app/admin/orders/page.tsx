'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Skeleton } from '@/components/ui/skeleton'

interface Order {
  id: string; user_email: string | null; customer_email: string | null
  order_type: string; status: string; amount_total_cents: number
  currency: string; created_at: string
}

const statusFilters = ['all', 'paid', 'fulfilled', 'refunded', 'failed', 'checkout_created']
const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700', fulfilled: 'bg-blue-100 text-blue-700',
  refunded: 'bg-red-100 text-red-700', failed: 'bg-red-100 text-red-700',
  checkout_created: 'bg-gray-100 text-gray-600', canceled: 'bg-gray-100 text-gray-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchOrders() }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.ok) setOrders(data.data.orders)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${filter === s ? 'bg-primary text-white shadow-clay-button' : 'bg-white text-text-primary hover:bg-primary/10'}`}>
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="clay-card p-12 text-center text-text-muted">No orders found</div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="clay-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-text-primary">{o.user_email || o.customer_email || 'Guest'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                  <span className="text-xs text-text-muted">{o.order_type}</span>
                </div>
                <p className="text-sm text-text-muted">{o.id} · {new Date(o.created_at).toLocaleString()}</p>
              </div>
              <div className="font-heading text-lg font-bold text-primary shrink-0">
                ${(o.amount_total_cents / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
