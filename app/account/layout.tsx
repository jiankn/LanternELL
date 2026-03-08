'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Library,
    Receipt,
    Bookmark,
    Bell,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    Sparkles,
    Mail,
    CheckCircle,
} from 'lucide-react'
import type { UserData } from './account-context'
import { AccountContext } from './use-account'

const sidebarNavItems = [
    { href: '/account', label: 'Overview', icon: LayoutDashboard, description: 'Dashboard & stats' },
    { href: '/account/library', label: 'My Library', icon: Library, description: 'Download resources' },
    { href: '/account/orders', label: 'Orders', icon: Receipt, description: 'Purchase history' },
    { href: '/account/favorites', label: 'Favorites', icon: Bookmark, description: 'Saved resources' },
]

const secondaryNavItems = [
    { href: '/account/notifications', label: 'Notifications', icon: Bell, description: 'Updates & alerts' },
    { href: '/account/settings', label: 'Settings', icon: Settings, description: 'Preferences' },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notificationsCount, setNotificationsCount] = useState(3)
    const pathname = usePathname()

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/account/me')
            const data = await res.json()
            if (data.ok && data.data.authenticated) {
                setUser(data.data.user)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/account/logout', { method: 'POST' })
            setUser(null)
            window.location.href = '/'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-text-muted">Loading your workspace...</p>
                    </div>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-background flex flex-col">
                <div className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-md w-full">
                        <div className="clay-card p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-clay-button">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">
                                Sign In to Your Account
                            </h1>
                            <p className="text-text-primary/70 mb-6">
                                Enter your email to receive a magic link for instant access.
                            </p>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    return (
        <AccountContext.Provider value={{ user, loading, refreshUser: fetchUser, logout }}>
            <main className="min-h-screen bg-background">
                <div className="flex">
                    <aside
                        className={`
                            fixed lg:static inset-y-0 left-0 z-50
                            w-72 bg-white/95 backdrop-blur-sm border-r border-gray-200/60
                            transform transition-transform duration-300 ease-in-out
                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        `}
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm group-hover:shadow-clay-button transition-shadow">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
                                </Link>
                            </div>

                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-text-primary text-sm truncate">
                                            {user.name || 'Teacher'}
                                        </p>
                                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    Workspace
                                </p>
                                {sidebarNavItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group
                                                ${isActive
                                                    ? 'bg-primary text-white shadow-clay-sm'
                                                    : 'text-text-primary hover:bg-primary/5'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>{item.label}</p>
                                            </div>
                                            {isActive && <ChevronRight className="w-4 h-4 text-white/60" />}
                                        </Link>
                                    )
                                })}

                                <p className="px-3 py-2 mt-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    Account
                                </p>
                                {secondaryNavItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href
                                    const showBadge = item.href === '/account/notifications' && notificationsCount > 0
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group
                                                ${isActive
                                                    ? 'bg-primary text-white shadow-clay-sm'
                                                    : 'text-text-primary hover:bg-primary/5'
                                                }
                                            `}
                                        >
                                            <div className="relative">
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                                                {showBadge && !isActive && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-cta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                        {notificationsCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>{item.label}</p>
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="p-4 border-t border-gray-100">
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-text-primary hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group"
                                >
                                    <LogOut className="w-5 h-5 text-text-muted group-hover:text-red-500" />
                                    <span className="font-medium text-sm">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <div className="flex-1 min-h-screen lg:min-w-0">
                        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 lg:hidden">
                            <div className="flex items-center justify-between px-4 h-16">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-6 h-6 text-text-primary" />
                                </button>
                                <span className="font-heading font-bold text-text-primary">Account</span>
                                <div className="w-10" />
                            </div>
                        </header>

                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="max-w-6xl mx-auto">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AccountContext.Provider>
    )
}

function LoginForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/auth/request-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, redirectTo: '/account' }),
            })
            const data = await res.json()
            if (data.ok) {
                setSent(true)
            } else {
                alert(data.error?.message || 'Failed to send magic link')
            }
        } catch {
            alert('Login failed')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-4">
                    <CheckCircle className="w-5 h-5" />
                    Check your email for the magic link.
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="clay-input w-full"
            />
            <button
                type="submit"
                disabled={loading}
                className="clay-button-cta w-full cursor-pointer disabled:opacity-50"
            >
                {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
        </form>
    )
}
