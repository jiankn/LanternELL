'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingCart,
  Users,
  BookOpen,
  Layers,
  Tag,
} from 'lucide-react'

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/bundles', label: 'Bundles', icon: Layers },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/teaching-tips', label: 'Teaching Tips', icon: BookOpen },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        links={[
          ...adminLinks.map(l => ({ href: l.href, label: l.label, active: pathname === l.href })),
          { href: '/', label: 'Site' },
        ]}
      />
      <div className="pt-20 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 px-4 py-4 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-primary text-white shadow-clay-button'
                      : 'text-text-primary hover:bg-primary/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-20">
          {children}
        </div>
      </div>
    </main>
  )
}
