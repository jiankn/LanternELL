'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    Receipt,
    Package,
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    Download,
    FileText,
    Filter,
    Search,
    X,
    ChevronDown,
    ChevronUp,
    CreditCard,
    Calendar,
    DollarSign,
    TrendingUp,
} from 'lucide-react'
import { useAccount } from '../use-account'

interface Order {
    id: string
    status: string
    orderType: string
    amountTotal: string
    currency: string
    productName: string | null
    createdAt: string
    stripeInvoiceUrl?: string
    items?: Array<{
        name: string
        quantity: number
        price: string
    }>
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
    paid: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Paid' },
    fulfilled: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
    payment_pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
    checkout_created: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Incomplete' },
    failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Failed' },
    refunded: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Refunded' },
    canceled: { icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Canceled' },
}

const statusFilterOptions = [
    { value: '', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'fulfilled', label: 'Completed' },
    { value: 'payment_pending', label: 'Pending' },
    { value: 'refunded', label: 'Refunded' },
]

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount_high', label: 'Amount: High to Low' },
    { value: 'amount_low', label: 'Amount: Low to High' },
]

export default function OrdersPage() {
    const { user } = useAccount()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [showFilters, setShowFilters] = useState(false)
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

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

    const filteredAndSortedOrders = useMemo(() => {
        let result = [...orders]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (o) =>
                    o.productName?.toLowerCase().includes(query) ||
                    o.id.toLowerCase().includes(query)
            )
        }

        if (statusFilter) {
            result = result.filter((o) => o.status === statusFilter)
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                case 'amount_high':
                    return parseFloat(b.amountTotal.replace(/[^0-9.]/g, '')) - parseFloat(a.amountTotal.replace(/[^0-9.]/g, ''))
                case 'amount_low':
                    return parseFloat(a.amountTotal.replace(/[^0-9.]/g, '')) - parseFloat(b.amountTotal.replace(/[^0-9.]/g, ''))
                default:
                    return 0
            }
        })

        return result
    }, [orders, searchQuery, statusFilter, sortBy])

    const stats = useMemo(() => {
        const total = orders.length
        const completed = orders.filter((o) => o.status === 'paid' || o.status === 'fulfilled').length
        const pending = orders.filter((o) => o.status === 'payment_pending').length
        const totalSpent = orders
            .filter((o) => o.status === 'paid' || o.status === 'fulfilled')
            .reduce((sum, o) => sum + parseFloat(o.amountTotal.replace(/[^0-9.]/g, '') || '0'), 0)

        return { total, completed, pending, totalSpent }
    }, [orders])

    const hasActiveFilters = searchQuery || statusFilter

    const clearFilters = () => {
        setSearchQuery('')
        setStatusFilter('')
    }

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
    }

    if (!user) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">Order History</h1>
                    <p className="text-text-muted mt-1">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
                    </p>
                </div>
                <Link
                    href="/shop"
                    className="clay-button-secondary cursor-pointer inline-flex items-center gap-2 text-sm"
                >
                    <Package className="w-4 h-4" />
                    Browse Shop
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="clay-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                            <p className="text-xs text-text-muted">Total Orders</p>
                        </div>
                    </div>
                </div>
                <div className="clay-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.completed}</p>
                            <p className="text-xs text-text-muted">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="clay-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">{stats.pending}</p>
                            <p className="text-xs text-text-muted">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="clay-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cta/10 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-cta" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">${stats.totalSpent.toFixed(0)}</p>
                            <p className="text-xs text-text-muted">Total Spent</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clay-card p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders..."
                            className="clay-input w-full pl-10 pr-10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                aria-label="Clear search"
                            >
                                <X className="w-4 h-4 text-text-muted hover:text-text-primary" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors cursor-pointer ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary/50 text-text-primary'}`}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-cta" />
                        )}
                    </button>
                </div>

                {showFilters && (
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="clay-input text-sm py-2"
                        >
                            {statusFilterOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="clay-input text-sm py-2"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-text-muted hover:text-primary cursor-pointer"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="clay-card p-5 animate-pulse">
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
            ) : filteredAndSortedOrders.length === 0 ? (
                <div className="clay-card p-12 text-center">
                    {orders.length === 0 ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                                No matching orders
                            </h3>
                            <p className="text-text-muted mb-4">
                                Try adjusting your search or filters.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="text-primary hover:underline cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAndSortedOrders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.checkout_created
                        const StatusIcon = status.icon
                        const isExpanded = expandedOrderId === order.id

                        return (
                            <div key={order.id} className="clay-card overflow-hidden">
                                <div
                                    className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => toggleExpand(order.id)}
                                >
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
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric', month: 'short', day: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-text-primary/30">•</span>
                                                    <span className="capitalize">{order.orderType.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 sm:text-right">
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {status.label}
                                            </div>
                                            <span className="font-semibold text-text-primary text-lg">
                                                {order.amountTotal}
                                            </span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Order ID</p>
                                                <p className="text-sm text-text-primary font-mono">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Payment Method</p>
                                                <p className="text-sm text-text-primary flex items-center gap-1.5">
                                                    <CreditCard className="w-4 h-4 text-text-muted" />
                                                    Credit Card (Stripe)
                                                </p>
                                            </div>
                                        </div>

                                        {order.items && order.items.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Items</p>
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm">
                                                            <span className="text-text-primary">{item.name}</span>
                                                            <span className="text-text-muted">{item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                            {(order.status === 'paid' || order.status === 'fulfilled') && (
                                                <Link
                                                    href="/account/library"
                                                    className="clay-button-secondary cursor-pointer inline-flex items-center gap-2 text-sm"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download Resources
                                                </Link>
                                            )}
                                            {order.stripeInvoiceUrl && (
                                                <a
                                                    href={order.stripeInvoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="clay-button-secondary cursor-pointer inline-flex items-center gap-2 text-sm"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    View Invoice
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
