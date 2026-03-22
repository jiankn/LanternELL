'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingCart, Library, Receipt, Settings, LogOut, User } from 'lucide-react'

interface NavLink {
  href: string
  label: string
  active?: boolean
}

interface NavbarProps {
  links?: NavLink[]
  showCart?: boolean
  static?: boolean
  rightSlot?: React.ReactNode
}

interface NavUser {
  email: string
  name: string | null
}

const defaultLinks: NavLink[] = [
  { href: '/shop', label: 'Packs' },
  { href: '/account/library', label: 'My Library' },
]

const avatarMenuItems = [
  { href: '/account/library', label: 'My Library', icon: Library },
  { href: '/account/orders', label: 'Orders', icon: Receipt },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

function useNavUser() {
  const [user, setUser] = useState<NavUser | null>(null)
  useEffect(() => {
    fetch('/api/account/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.data?.authenticated) {
          setUser({ email: data.data.user.email, name: data.data.user.name })
        }
      })
      .catch(() => {})
  }, [])
  return user
}

export function Navbar({ links = defaultLinks, showCart = false, static: isStatic = false, rightSlot }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const navUser = useNavUser()

  // Close avatar menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    if (avatarOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [avatarOpen])

  // Filter out "Sign In" link if user is logged in
  const visibleLinks = navUser
    ? links.filter((l) => l.label !== 'Sign In' && l.href !== '/login')
    : links

  const initial = navUser?.name?.charAt(0)?.toUpperCase() || navUser?.email?.charAt(0)?.toUpperCase() || '?'

  const handleLogout = async () => {
    setAvatarOpen(false)
    await fetch('/api/account/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <nav
      className={`${isStatic ? '' : 'fixed top-0 left-0 right-0'} z-50 bg-white/80 backdrop-blur-md border-b border-white/40`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <Image src="/images/logo.webp" alt="LanternELL Logo" fill className="object-contain" priority />
            </div>
            <span className="font-heading text-xl font-bold text-text-primary tracking-tight">LanternELL</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors cursor-pointer ${link.active ? 'text-primary font-medium' : 'text-text-primary hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
            {showCart && (
              <Link href="/cart" className="text-text-primary hover:text-primary transition-colors cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
              </Link>
            )}
            {rightSlot}

            {/* Avatar or Sign In */}
            {navUser ? (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-md transition-shadow"
                  aria-label="Account menu"
                >
                  {initial}
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-text-primary truncate">{navUser.name || 'Teacher'}</p>
                      <p className="text-xs text-text-muted truncate">{navUser.email}</p>
                    </div>
                    {avatarMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setAvatarOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                        >
                          <Icon className="w-4 h-4 text-text-muted" />
                          {item.label}
                        </Link>
                      )
                    })}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Only show Sign In if not already in links
              !links.some((l) => l.href === '/login') && (
                <Link href="/login" className="text-text-primary hover:text-primary transition-colors cursor-pointer">
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile: avatar + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {navUser && (
              <Link
                href="/account"
                className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer"
                aria-label="Account"
              >
                {initial}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6 text-text-primary" /> : <Menu className="w-6 h-6 text-text-primary" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/40 px-4 pb-4">
          <div className="flex flex-col gap-2 pt-2">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl transition-colors cursor-pointer ${link.active ? 'bg-primary/10 text-primary font-medium' : 'text-text-primary hover:bg-primary/5'}`}
              >
                {link.label}
              </Link>
            ))}
            {navUser ? (
              <>
                {avatarMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            )}
            {rightSlot && <div className="px-4 py-2">{rightSlot}</div>}
          </div>
        </div>
      )}
    </nav>
  )
}
