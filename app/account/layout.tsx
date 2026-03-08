'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Library,
    Receipt,
    Settings,
    LogOut,
    User,
    Mail,
    ArrowRight,
    CheckCircle,
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'

// ============================================
// Auth Context (shared across /account pages)
// ============================================

interface UserData {
    id: string
    email: string
    name: string | null
    role: string
    subscription?: {
        status: string
        currentPeriodEnd: string | null
        cancelAtPeriodEnd: boolean
    } | null
}

interface AccountContextType {
    user: UserData | null
    loading: boolean
    refreshUser: () => Promise<void>
    logout: () => Promise<void>
}

const AccountContext = createContext<AccountContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
    logout: async () => { },
})

export function useAccount() {
    return useContext(AccountContext)
}

// ============================================
// Nav tabs
// ============================================

const accountTabs = [
    { href: '/account', label: 'Overview', icon: User },
    { href: '/account/library', label: 'My Downloads', icon: Library },
    { href: '/account/orders', label: 'Orders', icon: Receipt },
]

// ============================================
// Layout
// ============================================

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
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

    // --- Loading state ---
    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar links={[{ href: '/shop', label: 'Shop' }]} />
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="clay-card p-12 text-center">
                            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    // --- Not logged in ---
    if (!user) {
        return (
            <main className="min-h-screen bg-background flex flex-col">
                <Navbar static links={[{ href: '/shop', label: 'Browse Shop' }]} />
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

    // --- Logged in ---
    return (
        <AccountContext.Provider value={{ user, loading, refreshUser: fetchUser, logout }}>
            <main className="min-h-screen bg-background">
                <Navbar
                    links={[
                        { href: '/shop', label: 'Shop' },
                        { href: '/account', label: 'Account', active: true },
                    ]}
                    rightSlot={
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors cursor-pointer text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    }
                />

                <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Tab Navigation */}
                        <div className="flex gap-1 p-1 bg-white/50 rounded-2xl mb-8 overflow-x-auto">
                            {accountTabs.map((tab) => {
                                const Icon = tab.icon
                                const isActive = pathname === tab.href
                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                                ? 'bg-white text-primary shadow-clay-sm'
                                                : 'text-text-primary/60 hover:text-text-primary hover:bg-white/50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Page content */}
                        {children}
                    </div>
                </section>
            </main>
        </AccountContext.Provider>
    )
}

// ============================================
// Inline Login Form
// ============================================

function LoginForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [devLink, setDevLink] = useState<string | null>(null)

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
                if (data.data.devLink) setDevLink(data.data.devLink)
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
                {devLink && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-xs text-amber-700 font-medium mb-2">Dev Mode Only</p>
                        <a href={devLink} className="text-xs text-primary break-all hover:underline">
                            {devLink}
                        </a>
                    </div>
                )}
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="account-email" className="sr-only">Email address</label>
            <input
                id="account-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                required
                className="clay-input w-full"
                autoComplete="email"
            />
            <button
                type="submit"
                disabled={loading}
                className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        Send Magic Link
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    )
}
