'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Library,
    Receipt,
    Crown,
    ArrowRight,
    Package,
    CreditCard,
} from 'lucide-react'
import { useAccount } from './account-context'

export default function AccountDashboard() {
    const { user } = useAccount()
    const [stats, setStats] = useState({ downloads: 0, orders: 0 })
    const [loadingPortal, setLoadingPortal] = useState(false)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [libRes, ordRes] = await Promise.all([
                fetch('/api/account/library'),
                fetch('/api/account/orders'),
            ])
            const [libData, ordData] = await Promise.all([libRes.json(), ordRes.json()])
            setStats({
                downloads: libData.ok ? (libData.data.items?.length || 0) : 0,
                orders: ordData.ok ? (ordData.data.orders?.length || 0) : 0,
            })
        } catch {
            // ignore
        }
    }

    const handleManageSubscription = async () => {
        setLoadingPortal(true)
        try {
            const res = await fetch('/api/account/portal', { method: 'POST' })
            const data = await res.json()
            if (data.ok && data.data.portalUrl) {
                window.location.href = data.data.portalUrl
            } else {
                alert(data.error?.message || 'Could not open subscription portal')
            }
        } catch {
            alert('Failed to open subscription portal')
        } finally {
            setLoadingPortal(false)
        }
    }

    if (!user) return null

    const subscription = user.subscription

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="clay-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-heading text-2xl font-bold text-text-primary truncate">
                            Welcome back, {user.name || 'Teacher'}!
                        </h1>
                        <p className="text-text-muted truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/account/library" className="clay-card p-6 hover:shadow-clay-button transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Library className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-text-primary">{stats.downloads}</span>
                    </div>
                    <p className="text-sm text-text-muted">Downloads Available</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Library <ArrowRight className="w-3 h-3" />
                    </div>
                </Link>

                <Link href="/account/orders" className="clay-card p-6 hover:shadow-clay-button transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-cta/10 rounded-xl flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-cta" />
                        </div>
                        <span className="text-2xl font-bold text-text-primary">{stats.orders}</span>
                    </div>
                    <p className="text-sm text-text-muted">Total Orders</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Orders <ArrowRight className="w-3 h-3" />
                    </div>
                </Link>

                <div className="clay-card p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${subscription?.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                            <Crown className={`w-5 h-5 ${subscription?.status === 'active' ? 'text-green-600' : 'text-gray-400'
                                }`} />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                            {subscription?.status === 'active' ? 'Premium Member' : 'Free'}
                        </span>
                    </div>
                    <p className="text-sm text-text-muted">
                        {subscription?.status === 'active'
                            ? `Renews ${subscription.cancelAtPeriodEnd ? '(canceling)' : ''} ${subscription.currentPeriodEnd
                                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                                : ''
                            }`
                            : 'Upgrade for full access'}
                    </p>
                    {subscription?.status === 'active' ? (
                        <button
                            onClick={handleManageSubscription}
                            disabled={loadingPortal}
                            className="flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline cursor-pointer"
                        >
                            <CreditCard className="w-3 h-3" />
                            {loadingPortal ? 'Opening...' : 'Manage Subscription'}
                        </button>
                    ) : (
                        <Link
                            href="/pricing"
                            className="flex items-center gap-1 text-cta text-sm font-medium mt-2 hover:underline"
                        >
                            View Plans <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="clay-card p-6">
                <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                        href="/shop"
                        className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-medium text-text-primary">Browse Teaching Packs</span>
                    </Link>
                    <Link
                        href="/account/library"
                        className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                        <Library className="w-5 h-5 text-primary" />
                        <span className="font-medium text-text-primary">Download Resources</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
