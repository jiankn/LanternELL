'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  Users,
  DollarSign,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { AdminLayout } from '@/components/ui/admin-layout'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalResources: number
  recentOrders: Array<{
    id: string
    customer_email: string
    amount_total_cents: number
    status: string
    created_at: string
  }>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      const data = await res.json()
      if (data.ok) setStats(data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally { setLoading(false) }
  }

  const statCards = stats ? [
    { label: 'Products', value: stats.totalProducts, icon: <Package className="w-6 h-6" />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Orders', value: stats.totalOrders, icon: <DollarSign className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Users', value: stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'text-cta', bg: 'bg-cta/10' },
    { label: 'Resources', value: stats.totalResources, icon: <FileText className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ] : []

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold text-text-primary mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="clay-card p-6">
              <Skeleton className="w-12 h-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : (
          statCards.map((card) => (
            <div key={card.label} className="clay-card p-6">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <div className="font-heading text-3xl font-bold text-text-primary">{card.value}</div>
              <div className="text-sm text-text-muted">{card.label}</div>
            </div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold text-text-primary">Recent Orders</h2>
            <TrendingUp className="w-5 h-5 text-text-muted" />
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
          ) : stats?.recentOrders.length === 0 ? (
            <p className="text-text-muted text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-background rounded-xl">
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary truncate">{order.customer_email || 'Unknown'}</p>
                    <p className="text-sm text-text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-heading font-bold text-primary">${(order.amount_total_cents / 100).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'paid' || order.status === 'fulfilled' ? 'bg-green-100 text-green-700' : order.status === 'failed' || order.status === 'refunded' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="clay-card p-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { href: '/admin/content', label: 'Generate Content', icon: <FileText className="w-5 h-5 text-primary" /> },
              { href: '/admin/products', label: 'Manage Products', icon: <Package className="w-5 h-5 text-cta" /> },
              { href: '/admin/orders', label: 'View Orders', icon: <DollarSign className="w-5 h-5 text-green-600" /> },
              { href: '/shop', label: 'View Shop', icon: <TrendingUp className="w-5 h-5 text-purple-600" /> },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center justify-between p-4 bg-background rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  {a.icon}
                  <span className="font-medium text-text-primary">{a.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
