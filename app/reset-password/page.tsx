'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Lock, CheckCircle, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  )
}

function ResetPasswordInner() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') || ''
  const email = searchParams?.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
      } else {
        setError(data.error?.message || 'Failed to reset password.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar static links={[{ href: '/shop', label: 'Browse Shop' }]} />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="clay-card p-8 max-w-md w-full text-center">
            <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">Invalid Link</h1>
            <p className="text-text-primary/70 mb-6">This password reset link is invalid or has expired.</p>
            <Link href="/login" className="text-primary hover:underline font-medium">Back to Sign In</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar static links={[{ href: '/shop', label: 'Browse Shop' }]} />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="clay-card p-8">
            {done ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-text-primary mb-3">Password Updated</h1>
                <p className="text-text-primary/70 mb-6">Your password has been reset successfully.</p>
                <Link
                  href="/login"
                  className="clay-button-cta inline-flex items-center gap-2 px-6 py-3 cursor-pointer"
                >
                  Sign In <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-clay-button">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">Set New Password</h1>
                  <p className="text-text-primary/70">Enter your new password below.</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">New Password</label>
                    <input
                      id="password" type="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters" required minLength={8}
                      className="clay-input w-full" autoComplete="new-password" autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
                    <input
                      id="confirm" type="password" value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password" required minLength={8}
                      className="clay-input w-full" autoComplete="new-password"
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Reset Password <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
