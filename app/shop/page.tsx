import { Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { ShopClient } from './shop-client'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'ELL Teaching Packs & Resources — Printable Bilingual Materials | LanternELL',
  description:
    'Browse printable ELL teaching packs and bilingual classroom resources for K-5. Vocabulary packs, sentence frames, classroom labels, visual supports, and parent communication templates in English-Spanish.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'ELL Teaching Packs & Resources — LanternELL',
    description: 'Printable ELL teaching packs and bilingual classroom resources for K-5.',
    url: `${BASE_URL}/shop`,
  },
  robots: { index: true, follow: true },
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar
        links={[
          { href: '/', label: 'Home' },
          { href: '/shop', label: 'Shop', active: true },
          { href: '/pricing', label: 'Pricing' },
          { href: '/account/library', label: 'My Library' },
        ]}
        showCart
      />

      {/* Hero — SSR H1 */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Teaching Packs & Resources
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">
            Ready-to-use printable resources for your K-5 ELL and bilingual classroom. Browse{' '}
            <Link href="/ell-worksheets" className="text-primary hover:underline">ELL worksheets</Link>,{' '}
            <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link>,{' '}
            <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports</Link>, and{' '}
            <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link>.
            Pre-K and middle school packs also available.
          </p>
        </div>
      </section>

      {/* Client-side interactive filters + product grid */}
      <Suspense fallback={<div className="px-4 sm:px-6 lg:px-8 pb-20"><div className="max-w-7xl mx-auto"><ProductGridSkeleton /></div></div>}>
        <ShopClient />
      </Suspense>

      <Footer minimal />
    </main>
  )
}
