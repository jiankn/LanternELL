'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react'
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
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams?.get('tab') === 'register' ? 'register' : 'login'

  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  useEffect(() => {
    const errCode = searchParams?.get('error')
    if (errCode && GOOGLE_ERRORS[errCode]) {
      setError(GOOGLE_ERRORS[errCode])
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push('/account/library')
      } else {
        setError(data.error?.message || 'Login failed.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push('/account/library')
      } else {
        setError(data.error?.message || 'Registration failed.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (data.ok) {
        setForgotSent(true)
      } else {
        setError(data.error?.message || 'Failed to send reset email.')
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

  // Forgot password view
  if (forgotMode) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar static links={[{ href: '/shop', label: 'Browse Shop' }]} />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="clay-card p-8">
              {forgotSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-text-primary mb-3">Check Your Email</h1>
                  <p className="text-text-primary/70 mb-6">
                    If an account exists for <strong>{forgotEmail}</strong>, we sent a password reset link.
                  </p>
                  <button
                    onClick={() => { setForgotMode(false); setForgotSent(false); setError(null) }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">Forgot Password?</h1>
                    <p className="text-text-primary/70">Enter your email and we'll send you a reset link.</p>
                  </div>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" role="alert">{error}</div>
                  )}
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label htmlFor="forgot-email" className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                      <input id="forgot-email" type="email" value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="teacher@school.edu" required className="clay-input w-full" autoFocus autoComplete="email" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                  <p className="mt-6 text-center text-sm text-text-muted">
                    Remember your password?{' '}
                    <button onClick={() => { setForgotMode(false); setError(null) }}
                      className="text-primary hover:underline font-medium cursor-pointer">Sign In</button>
                  </p>
                </>
              )}
            </div>
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
            <div className="text-center mb-6">
              <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">
                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-text-primary/70">
                {tab === 'login' ? 'Sign in to access your teaching resources.' : 'Join LanternELL to get started.'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button onClick={() => { setTab('login'); setError(null) }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${tab === 'login' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
                Sign In
              </button>
              <button onClick={() => { setTab('register'); setError(null) }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${tab === 'register' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" role="alert">{error}</div>
            )}

            {/* Google */}
            <button type="button" onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-text-primary hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-text-muted">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.edu" required className="clay-input w-full" autoComplete="email" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
                    <button type="button" onClick={() => { setForgotMode(true); setForgotEmail(email); setError(null) }}
                      className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required
                      className="clay-input w-full pr-10" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* Register form */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-text-primary mb-2">Name (optional)</label>
                  <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" className="clay-input w-full" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.edu" required className="clay-input w-full" autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-text-primary mb-2">Password</label>
                  <div className="relative">
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
                      required minLength={8} className="clay-input w-full pr-10" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 cursor-pointer">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-text-muted">
              <Link href="/shop" className="text-primary hover:underline font-medium">Browse our resources</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
