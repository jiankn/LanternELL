'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    Bell,
    Package,
    Download,
    Gift,
    AlertCircle,
    CheckCircle,
    Info,
    Sparkles,
    Filter,
    Check,
    Trash2,
    X,
    ChevronRight,
    Clock,
    ExternalLink,
} from 'lucide-react'
import { useAccount } from '../use-account'

interface Notification {
    id: string
    type: 'order' | 'resource' | 'system' | 'promo'
    title: string
    message: string
    read: boolean
    createdAt: string
    actionUrl?: string
    actionLabel?: string
}

const notificationIcons: Record<string, React.ReactNode> = {
    order: <Package className="w-5 h-5" />,
    resource: <Download className="w-5 h-5" />,
    system: <AlertCircle className="w-5 h-5" />,
    promo: <Gift className="w-5 h-5" />,
}

const notificationColors: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    resource: 'bg-green-100 text-green-600',
    system: 'bg-amber-100 text-amber-600',
    promo: 'bg-purple-100 text-purple-600',
}

const filterOptions = [
    { value: '', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'order', label: 'Orders' },
    { value: 'resource', label: 'Resources' },
    { value: 'system', label: 'System' },
    { value: 'promo', label: 'Promotions' },
]

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'resource',
        title: 'New Resource Available',
        message: 'Your Vocabulary Pack - Spanish Basics is ready for download.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actionUrl: '/account/library',
        actionLabel: 'View Library',
    },
    {
        id: '2',
        type: 'order',
        title: 'Order Confirmed',
        message: 'Your order #ORD-2024-001 has been successfully processed.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        actionUrl: '/account/orders',
        actionLabel: 'View Order',
    },
    {
        id: '3',
        type: 'promo',
        title: 'Special Offer: 20% Off',
        message: 'Enjoy 20% off your next purchase with code TEACHER20. Valid until end of month.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        actionUrl: '/shop',
        actionLabel: 'Shop Now',
    },
    {
        id: '4',
        type: 'system',
        title: 'Account Security Update',
        message: 'Your account security settings have been updated successfully.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: '5',
        type: 'resource',
        title: 'Bundle Download Complete',
        message: 'All 12 resources in your ELL Starter Bundle have been downloaded.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
]

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationsPage() {
    const { user } = useAccount()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const [showFilterMenu, setShowFilterMenu] = useState(false)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            setNotifications(mockNotifications)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredNotifications = useMemo(() => {
        let result = [...notifications]

        if (filter === 'unread') {
            result = result.filter((n) => !n.read)
        } else if (filter) {
            result = result.filter((n) => n.type === filter)
        }

        result.sort((a, b) => {
            if (a.read !== b.read) return a.read ? 1 : -1
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        return result
    }, [notifications, filter])

    const unreadCount = notifications.filter((n) => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const clearAllRead = () => {
        setNotifications((prev) => prev.filter((n) => !n.read))
    }

    if (!user) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">Notifications</h1>
                    <p className="text-text-muted mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="clay-button-secondary cursor-pointer inline-flex items-center gap-2 text-sm"
                        >
                            <Check className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors cursor-pointer ${showFilterMenu ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary/50 text-text-primary'}`}
                        >
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filter</span>
                        </button>
                        {showFilterMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowFilterMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                    {filterOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setFilter(opt.value)
                                                setShowFilterMenu(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${filter === opt.value ? 'text-primary font-medium bg-primary/5' : 'text-text-primary'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="clay-card p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-gray-200 rounded" />
                                    <div className="h-3 w-full bg-gray-100 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="clay-card p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-text-muted" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                        {filter ? 'No matching notifications' : 'No notifications'}
                    </h3>
                    <p className="text-text-muted mb-4">
                        {filter
                            ? 'Try adjusting your filter settings.'
                            : "You're all caught up! Check back later for updates."}
                    </p>
                    {filter && (
                        <button
                            onClick={() => setFilter('')}
                            className="text-primary hover:underline cursor-pointer"
                        >
                            Clear filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => {
                        const iconBg = notificationColors[notification.type]
                        const icon = notificationIcons[notification.type]

                        return (
                            <div
                                key={notification.id}
                                className={`clay-card p-5 transition-all ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-text-primary truncate">
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <span className="text-xs text-text-muted whitespace-nowrap shrink-0">
                                                {formatRelativeTime(notification.createdAt)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3">
                                            {notification.actionUrl && (
                                                <Link
                                                    href={notification.actionUrl}
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
                                                >
                                                    {notification.actionLabel || 'View'}
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-sm text-text-muted hover:text-primary cursor-pointer"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-sm text-text-muted hover:text-red-500 cursor-pointer ml-auto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {notifications.some((n) => n.read) && (
                <div className="flex justify-center">
                    <button
                        onClick={clearAllRead}
                        className="text-sm text-text-muted hover:text-red-500 cursor-pointer inline-flex items-center gap-1.5"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear all read notifications
                    </button>
                </div>
            )}
        </div>
    )
}
