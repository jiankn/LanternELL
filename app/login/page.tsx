'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Mail, ArrowRight, CheckCircle } from 'lucide-react'

export default function LoginPage() {
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
                body: JSON.stringify({ email, redirectTo: '/account/library' })
            })
            const data = await res.json()

            if (data.ok) {
                setSent(true)
                if (data.data.devLink) {
                    setDevLink(data.data.devLink)
                }
            } else {
                alert(data.error?.message || 'Failed to send magic link')
            }
        } catch {
            alert('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-white/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
                        </Link>
                        <Link href="/shop" className="text-text-primary hover:text-primary transition-colors text-sm">
                            Browse Shop
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    <div className="clay-card p-8">
                        {sent ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="font-heading text-2xl font-bold text-text-primary mb-3">
                                    Check Your Email
                                </h1>
                                <p className="text-text-primary/70 mb-6">
                                    We sent a magic link to <strong>{email}</strong>.
                                    Click the link to sign in — no password needed.
                                </p>
                                <p className="text-sm text-text-muted">
                                    Didn't receive it? Check your spam folder or{' '}
                                    <button
                                        onClick={() => { setSent(false); setDevLink(null) }}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        try again
                                    </button>.
                                </p>
                                {devLink && (
                                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <p className="text-xs text-amber-700 font-medium mb-2">🔧 Dev Mode Only</p>
                                        <a
                                            href={devLink}
                                            className="text-xs text-primary break-all hover:underline"
                                        >
                                            {devLink}
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-clay-button">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">
                                        Sign In
                                    </h1>
                                    <p className="text-text-primary/70">
                                        Enter your email to receive a magic link — no password needed.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="teacher@school.edu"
                                            required
                                            className="clay-input w-full"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="clay-button-cta w-full flex items-center justify-center gap-2 py-3"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Send Magic Link
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-sm text-text-muted">
                                    Don't have an account?{' '}
                                    <Link href="/shop" className="text-primary hover:underline font-medium">
                                        Browse our resources
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
