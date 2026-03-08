'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingCart } from 'lucide-react'

interface NavLink {
  href: string
  label: string
  active?: boolean
}

interface NavbarProps {
  links?: NavLink[]
  showCart?: boolean
  /** If true, navbar is not fixed (e.g. for simple pages like login) */
  static?: boolean
  rightSlot?: React.ReactNode
}

const defaultLinks: NavLink[] = [
  { href: '/shop', label: 'Packs' },
  { href: '/account/library', label: 'My Library' },
]

export function Navbar({ links = defaultLinks, showCart = false, static: isStatic = false, rightSlot }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors cursor-pointer ${link.active ? 'text-primary font-medium' : 'text-text-primary hover:text-primary'
                  }`}
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
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6 text-text-primary" /> : <Menu className="w-6 h-6 text-text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/40 px-4 pb-4">
          <div className="flex flex-col gap-2 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl transition-colors cursor-pointer ${link.active ? 'bg-primary/10 text-primary font-medium' : 'text-text-primary hover:bg-primary/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {rightSlot && <div className="px-4 py-2">{rightSlot}</div>}
          </div>
        </div>
      )}
    </nav>
  )
}
