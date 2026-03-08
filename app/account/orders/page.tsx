'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Receipt,
    Package,
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
} from 'lucide-react'

interface Order {
    id: string
    status: string
    orderType: string
    amountTotal: string
    currency: string
    productName: string | null
    createdAt: string
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
    paid: { icon: CheckCircle, color: 'text-green-600', label: 'Paid' },
    fulfilled: { icon: CheckCircle, color: 'text-green-600', label: 'Completed' },
    payment_pending: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
    checkout_created: { icon: Clock, color: 'text-gray-500', label: 'Incomplete' },
    failed: { icon: XCircle, color: 'text-red-600', label: 'Failed' },
    refunded: { icon: RefreshCw, color: 'text-blue-600', label: 'Refunded' },
    canceled: { icon: XCircle, color: 'text-gray-500', label: 'Canceled' },
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/account/orders')
            const data = await res.json()
            if (data.ok) {
                setOrders(data.data.orders || [])
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <h1 className="font-heading text-2xl font-bold text-text-primary">Order History</h1>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="clay-card p-6 animate-pulse">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="h-5 w-48 bg-gray-200 rounded" />
                                <div className="h-4 w-32 bg-gray-100 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="font-heading text-2xl font-bold text-text-primary">Order History</h1>

            {orders.length === 0 ? (
                <div className="clay-card p-12 text-center">
                    <Receipt className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                        No orders yet
                    </h3>
                    <p className="text-text-muted mb-6">
                        Browse our teaching packs and make your first purchase.
                    </p>
                    <Link href="/shop" className="clay-button-cta cursor-pointer inline-flex items-center gap-2">
                        Browse Shop <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.checkout_created
                        const StatusIcon = status.icon
                        return (
                            <div key={order.id} className="clay-card p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-text-primary truncate">
                                                {order.productName || `Order ${order.id.slice(0, 12)}...`}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted mt-1">
                                                <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}</span>
                                                <span className="text-text-primary/30">•</span>
                                                <span className="capitalize">{order.orderType.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                                        <div className={`flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {status.label}
                                        </div>
                                        <span className="font-semibold text-text-primary">
                                            {order.amountTotal}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
