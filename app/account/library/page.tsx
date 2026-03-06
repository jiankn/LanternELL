'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Sparkles,
  Download,
  Package,
  LogOut,
  FileText,
  User
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface EntitledResource {
  resourceId: string
  title: string
  slug: string
  packType: string
  languagePair: string
  downloadable: boolean
}

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [entitledResources, setEntitledResources] = useState<EntitledResource[]>([])
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setAuthError(params.get('error'))
    }
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/account/me')
      const data = await res.json()
      
      if (data.ok && data.data.authenticated) {
        setUser(data.data.user)
        await fetchLibrary()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLibrary = async () => {
    try {
      const res = await fetch('/api/account/library')
      const data = await res.json()
      if (data.ok) {
        setEntitledResources(data.data.items)
      }
    } catch (error) {
      console.error('Failed to fetch library:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/account/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleDownload = async (resourceId: string) => {
    setDownloadingId(resourceId)
    try {
      const res = await fetch('/api/download/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId })
      })
      const data = await res.json()
      
      if (data.ok && data.data.downloadUrl) {
        window.open(data.data.downloadUrl, '_blank')
      } else {
        alert(data.error?.message || 'Download failed')
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed')
    } finally {
      setDownloadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-md mx-auto pt-32 px-4">
          <div className="clay-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-clay-button">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">
              Sign In to Access Your Library
            </h1>
            <p className="text-text-primary/70 mb-6">
              Enter your email to receive a magic link for instant access.
            </p>
            {authError && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {getAuthErrorMessage(authError)}
              </p>
            )}
            <LoginForm />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/shop" className="text-text-primary hover:text-primary transition-colors">Shop</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* User Info */}
          <div className="clay-card p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-text-primary">
                  {user.name || 'Teacher'}
                </h2>
                <p className="text-text-muted">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Library */}
          <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">
            My Downloads
          </h1>

          {entitledResources.length === 0 ? (
            <div className="clay-card p-12 text-center">
              <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                No downloads yet
              </h3>
              <p className="text-text-muted mb-6">
                Purchase a teaching pack to start building your library.
              </p>
              <Link href="/shop" className="clay-button-cta">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {entitledResources.map((resource) => (
                <div key={resource.resourceId} className="clay-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{resource.title}</h3>
                      <p className="text-sm text-text-muted">
                        {resource.packType.replace('_', ' ')} • {resource.languagePair.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(resource.resourceId)}
                    disabled={downloadingId === resource.resourceId || !resource.downloadable}
                    className="clay-button flex items-center gap-2"
                  >
                    {downloadingId === resource.resourceId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {resource.downloadable ? 'Download' : 'Unavailable'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function getAuthErrorMessage(error: string) {
  switch (error) {
    case 'invalid_or_expired':
      return 'This magic link has expired. Request a new one below.'
    case 'server_error':
      return 'We could not verify the magic link. Try requesting a new one.'
    default:
      return 'This sign-in link is invalid. Request a new one below.'
  }
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
        body: JSON.stringify({ email, redirectTo: '/account/library' })
      })
      const data = await res.json()
      
      if (data.ok) {
        setSent(true)
        // In development, show the magic link
        if (data.data.devLink) {
          console.log('Magic link:', data.data.devLink)
          alert(`Dev mode: Check console for magic link\n\n${data.data.devLink}`)
        }
      } else {
        alert(data.error?.message || 'Failed to send magic link')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <p className="text-text-primary font-medium">Check your email!</p>
        <p className="text-sm text-text-muted">We sent you a magic link to sign in.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="clay-input w-full"
      />
      <button 
        type="submit" 
        disabled={loading}
        className="clay-button-cta w-full"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  )
}
