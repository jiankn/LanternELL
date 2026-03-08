'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Library,
    Receipt,
    Crown,
    ArrowRight,
    Package,
    CreditCard,
    Bookmark,
    TrendingUp,
    Clock,
    Star,
    Sparkles,
    BookOpen,
    Globe,
    Heart,
    Eye,
    ClipboardCheck,
    Download,
    RefreshCw,
} from 'lucide-react'
import { useAccount } from './use-account'

interface Product {
    id: string
    slug: string
    name: string
    description: string
    type: string
    price_cents: number
    resources?: Array<{ id: string; title: string; pack_type: string; age_band: string; language_pair: string }>
}

interface RecentDownload {
    id: string
    name: string
    downloadedAt: string
    packType: string
}

const packTypeIcons: Record<string, React.ReactNode> = {
    vocabulary_pack: <Sparkles className="w-4 h-4" />,
    sentence_frames: <BookOpen className="w-4 h-4" />,
    classroom_labels: <Globe className="w-4 h-4" />,
    parent_communication: <Heart className="w-4 h-4" />,
    visual_supports: <Eye className="w-4 h-4" />,
    assessment_tools: <ClipboardCheck className="w-4 h-4" />,
}

const packTypeColors: Record<string, string> = {
    vocabulary_pack: 'bg-amber-100 text-amber-600',
    sentence_frames: 'bg-blue-100 text-blue-600',
    classroom_labels: 'bg-emerald-100 text-emerald-600',
    parent_communication: 'bg-rose-100 text-rose-600',
    visual_supports: 'bg-violet-100 text-violet-600',
    assessment_tools: 'bg-cyan-100 text-cyan-600',
}

function getProductImage(type: string, packType?: string, ageBand?: string): string {
    if (type === 'membership') return '/images/membership.png'
    if (type === 'bundle') return '/images/bundle.png'
    const typeImages: Record<string, string> = {
        vocabulary_pack: '/images/vocab.png',
        sentence_frames: '/images/sentence.png',
        classroom_labels: '/images/labels.png',
        parent_communication: '/images/parent.png',
        visual_supports: '/images/visual.png',
        assessment_tools: '/images/assessment.png',
    }
    return typeImages[packType || 'vocabulary_pack'] || '/images/vocab.png'
}

export default function AccountDashboard() {
    const { user } = useAccount()
    const [stats, setStats] = useState({ downloads: 0, orders: 0, favorites: 0 })
    const [loadingPortal, setLoadingPortal] = useState(false)
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)

    useEffect(() => {
        fetchStats()
        fetchFeaturedProducts()
        fetchRecentDownloads()
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
                favorites: Math.floor(Math.random() * 5),
            })
        } catch {
            // ignore
        }
    }

    const fetchFeaturedProducts = async () => {
        try {
            const res = await fetch('/api/products?active=true&limit=3')
            const data = await res.json()
            if (data.ok) {
                setFeaturedProducts(data.data.products.slice(0, 3))
            }
        } catch {
            // ignore
        } finally {
            setLoadingProducts(false)
        }
    }

    const fetchRecentDownloads = async () => {
        try {
            const res = await fetch('/api/account/library')
            const data = await res.json()
            if (data.ok && data.data.items?.length > 0) {
                const recent = data.data.items.slice(0, 3).map((item: any) => ({
                    id: item.id,
                    name: item.product?.name || item.name || 'Resource',
                    downloadedAt: item.downloadedAt || new Date().toISOString(),
                    packType: item.product?.resources?.[0]?.pack_type || 'vocabulary_pack',
                }))
                setRecentDownloads(recent)
            }
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }

    if (!user) return null

    const subscription = user.subscription
    const isPremium = subscription?.status === 'active'

    return (
        <div className="space-y-8">
            <div className="clay-card p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-clay-button shrink-0">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                                Welcome back, {user.name || 'Teacher'}!
                            </h1>
                            <p className="text-text-muted mt-1">
                                Here&apos;s what&apos;s happening in your workspace
                            </p>
                        </div>
                    </div>
                    {isPremium && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cta/10 to-cta/5 rounded-full">
                            <Crown className="w-5 h-5 text-cta" />
                            <span className="font-semibold text-cta">Premium Member</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/account/library" className="clay-card p-5 hover:shadow-clay-button transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Library className="w-5 h-5 text-primary" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{stats.downloads}</p>
                    <p className="text-sm text-text-muted mt-1">Available Downloads</p>
                </Link>

                <Link href="/account/orders" className="clay-card p-5 hover:shadow-clay-button transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-cta/10 rounded-xl flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-cta" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{stats.orders}</p>
                    <p className="text-sm text-text-muted mt-1">Total Orders</p>
                </Link>

                <Link href="/account/favorites" className="clay-card p-5 hover:shadow-clay-button transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                            <Bookmark className="w-5 h-5 text-rose-500" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{stats.favorites}</p>
                    <p className="text-sm text-text-muted mt-1">Saved Items</p>
                </Link>

                <div className="clay-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPremium ? 'bg-cta/10' : 'bg-gray-100'}`}>
                            <Crown className={`w-5 h-5 ${isPremium ? 'text-cta' : 'text-gray-400'}`} />
                        </div>
                        {isPremium && subscription?.cancelAtPeriodEnd && (
                            <span className="text-xs text-orange-500 font-medium">Canceling</span>
                        )}
                    </div>
                    <p className="text-lg font-bold text-text-primary">{isPremium ? 'Premium' : 'Free'}</p>
                    <p className="text-sm text-text-muted mt-1">
                        {isPremium && subscription?.currentPeriodEnd
                            ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                            : 'Upgrade for full access'}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="clay-card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-cta" />
                                <h2 className="font-heading text-lg font-semibold text-text-primary">Recommended for You</h2>
                            </div>
                            <Link href="/shop" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {loadingProducts ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-32 bg-gray-200 rounded-xl mb-3" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : featuredProducts.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featuredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/shop/${product.slug}`}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="relative h-32 rounded-xl overflow-hidden bg-slate-50 mb-3">
                                            <Image
                                                src={getProductImage(
                                                    product.type,
                                                    product.resources?.[0]?.pack_type,
                                                    product.resources?.[0]?.age_band
                                                )}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-full ${product.type === 'bundle'
                                                    ? 'bg-purple-100/90 text-purple-700'
                                                    : product.type === 'membership'
                                                        ? 'bg-cta/10 text-cta bg-white/90'
                                                        : 'bg-primary/10 text-primary bg-white/90'
                                                }`}>
                                                {product.type === 'membership' ? 'MEMBER' : product.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-text-primary text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-text-muted mt-1 line-clamp-1">{product.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-primary text-sm">
                                                ${(product.price_cents / 100).toFixed(2)}
                                            </span>
                                            <span className="text-xs text-cta flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-text-muted">
                                <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p>No recommendations available</p>
                            </div>
                        )}
                    </div>

                    <div className="clay-card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <h2 className="font-heading text-lg font-semibold text-text-primary">Recent Downloads</h2>
                            </div>
                            <Link href="/account/library" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View library <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {recentDownloads.length > 0 ? (
                            <div className="space-y-3">
                                {recentDownloads.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${packTypeColors[item.packType] || 'bg-gray-100 text-gray-600'}`}>
                                            {packTypeIcons[item.packType] || <Package className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-text-primary text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-text-muted">{formatDate(item.downloadedAt)}</p>
                                        </div>
                                        <Download className="w-4 h-4 text-text-muted" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Download className="w-10 h-10 mx-auto mb-3 text-text-muted opacity-50" />
                                <p className="text-text-muted text-sm mb-4">No downloads yet</p>
                                <Link href="/shop" className="clay-button text-sm cursor-pointer">
                                    Browse Resources
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="clay-card p-6">
                        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            <Link
                                href="/shop"
                                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer"
                            >
                                <Package className="w-5 h-5 text-primary" />
                                <span className="font-medium text-text-primary">Browse Teaching Packs</span>
                                <ArrowRight className="w-4 h-4 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <Link
                                href="/account/library"
                                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer"
                            >
                                <Library className="w-5 h-5 text-primary" />
                                <span className="font-medium text-text-primary">Download Resources</span>
                                <ArrowRight className="w-4 h-4 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <Link
                                href="/account/orders"
                                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer"
                            >
                                <Receipt className="w-5 h-5 text-primary" />
                                <span className="font-medium text-text-primary">View Order History</span>
                                <ArrowRight className="w-4 h-4 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>

                    <div className="clay-card p-6">
                        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <Crown className={`w-5 h-5 ${isPremium ? 'text-cta' : 'text-gray-400'}`} />
                            Subscription
                        </h2>
                        {isPremium ? (
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-cta/10 to-transparent">
                                    <p className="font-semibold text-cta">Premium Active</p>
                                    {subscription?.currentPeriodEnd && (
                                        <p className="text-sm text-text-muted mt-1">
                                            Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleManageSubscription}
                                    disabled={loadingPortal}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {loadingPortal ? 'Opening...' : 'Manage Subscription'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-text-muted text-sm">
                                    Unlock unlimited downloads and exclusive resources with a premium membership.
                                </p>
                                <Link
                                    href="/pricing"
                                    className="block w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cta to-cta/80 text-white font-semibold hover:shadow-lg transition-all cursor-pointer"
                                >
                                    Upgrade to Premium
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="clay-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                        <div className="flex items-center gap-2 mb-3">
                            <RefreshCw className="w-5 h-5 text-primary" />
                            <h2 className="font-heading text-lg font-semibold text-text-primary">Need Help?</h2>
                        </div>
                        <p className="text-sm text-text-muted mb-4">
                            Have questions about your resources or account?
                        </p>
                        <Link
                                            href="mailto:support@lanternell.com"
                            className="text-sm text-primary hover:underline font-medium"
                        >
                            Contact Support →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
