'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'

const GOOGLE_ERRORS: Record<string, string> = {
  google_denied: 'Google sign-in was cancelled.',
  google_token_failed: 'Google authentication failed. Please try again.',
  google_userinfo_failed: 'Could not retrieve your Google account info.',
  email_not_verified: 'Your Google email is not verified.',
  server_error: 'Something went wrong. Please try again.',
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errCode = searchParams?.get('error')
    if (errCode && GOOGLE_ERRORS[errCode]) {
      setError(GOOGLE_ERRORS[errCode])
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: '/account/library' })
      })
      const data = await res.json()

      if (data.ok) {
        setSent(true)
      } else {
        setError(data.error?.message || 'Failed to send magic link')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google?redirectTo=/account/library'
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar
        static
        links={[{ href: '/shop', label: 'Browse Shop' }]}
      />

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
                    onClick={() => { setSent(false); setError(null) }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    try again
                  </button>.
                </p>
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
                    Sign in with your Google account or email magic link.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-text-primary hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <GoogleIcon className="w-5 h-5" />
                  Sign in with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-text-muted">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Email Magic Link */}
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
                      autoComplete="email"
                    />
                  </div>

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
