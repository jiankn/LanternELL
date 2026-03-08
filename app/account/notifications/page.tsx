'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    Bell,
    Package,
    Download,
    AlertCircle,
    Filter,
    ChevronRight,
    Clock,
    Info,
} from 'lucide-react'
import { useAccount } from '../use-account'

interface Notification {
    id: string
    type: 'order' | 'resource' | 'system'
    title: string
    message: string
    createdAt: string
    actionUrl?: string
    actionLabel?: string
}

const notificationIcons: Record<string, React.ReactNode> = {
    order: <Package className="w-5 h-5" />,
    resource: <Download className="w-5 h-5" />,
    system: <Info className="w-5 h-5" />,
}

const notificationColors: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    resource: 'bg-green-100 text-green-600',
    system: 'bg-amber-100 text-amber-600',
}

const filterOptions = [
    { value: '', label: 'All' },
    { value: 'order', label: 'Orders' },
    { value: 'resource', label: 'Resources' },
    { value: 'system', label: 'System' },
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
            const res = await fetch('/api/account/notifications')
            const data = await res.json()
            if (data.ok) {
                setNotifications(data.data.notifications)
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredNotifications = useMemo(() => {
        let result = [...notifications]
        if (filter) {
            result = result.filter((n) => n.type === filter)
        }
        return result
    }, [notifications, filter])

    if (!user) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">Notifications</h1>
                    <p className="text-text-muted mt-1">
                        {notifications.length} {notifications.length === 1 ? 'update' : 'updates'}
                    </p>
                </div>
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
                        {filter ? 'No matching notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-text-muted mb-4">
                        {filter
                            ? 'Try adjusting your filter settings.'
                            : 'Notifications will appear here when you make purchases or get new resources.'}
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
                                className="clay-card p-5 transition-all hover:shadow-clay-button"
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-text-primary truncate">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <span className="text-xs text-text-muted whitespace-nowrap shrink-0 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatRelativeTime(notification.createdAt)}
                                            </span>
                                        </div>

                                        {notification.actionUrl && (
                                            <div className="mt-3">
                                                <Link
                                                    href={notification.actionUrl}
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
                                                >
                                                    {notification.actionLabel || 'View'}
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        )}
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
