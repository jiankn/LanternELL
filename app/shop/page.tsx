import { Suspense } from 'react'
import Link from 'next/link'
import { query } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { ShopClient, type Product } from './shop-client'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ELL Teaching Packs — Bilingual Print Resources',
  description:
    'Browse printable ELL teaching packs for K-5: vocabulary cards, sentence frames, classroom labels, visual supports & parent letters in English-Spanish.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'ELL Teaching Packs & Resources — LanternELL',
    description: 'Printable ELL teaching packs and bilingual classroom resources for K-5.',
    url: `${BASE_URL}/shop`,
  },
  robots: { index: true, follow: true },
}

/** Fetch the active product catalog on the server for SSR + SEO.
 *  Mirrors the shape returned by GET /api/products so ShopClient can use
 *  the result directly as its initial state. */
async function getInitialProducts(): Promise<Product[]> {
  try {
    const rows = await query<{
      id: string
      slug: string
      name: string
      description: string
      type: string
      price_cents: number
    }>(
      'SELECT id, slug, name, description, type, price_cents FROM products WHERE active = 1 ORDER BY created_at DESC'
    )

    const enriched = await Promise.all(
      rows.map(async (p) => {
        const resources = await query<{
          id: string
          title: string
          pack_type: string
          age_band: string
          language_pair: string
        }>(
          'SELECT r.id, r.title, r.pack_type, r.age_band, r.language_pair FROM resources r JOIN product_resources pr ON r.id = pr.resource_id WHERE pr.product_id = ?',
          [p.id]
        )
        return {
          ...p,
          resources,
          price_formatted: (p.price_cents / 100).toFixed(2),
        } satisfies Product
      })
    )

    return enriched
  } catch {
    // DB may not be available during local builds or first-run dev; client
    // will recover by fetching /api/products on mount.
    return []
  }
}

export default async function ShopPage() {
  const initialProducts = await getInitialProducts()

  return (
    <main className="min-h-screen bg-background">
      <Navbar
        links={[
          { href: '/', label: 'Home' },
          { href: '/free-samples', label: 'Free Samples' },
          { href: '/teaching-tips', label: 'Teaching Tips' },
          { href: '/pricing', label: 'Pricing' },
        ]}
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

      {/* Client-side interactive filters + product grid (SSR initial state) */}
      <Suspense fallback={<div className="px-4 sm:px-6 lg:px-8 pb-20"><div className="max-w-7xl mx-auto"><ProductGridSkeleton /></div></div>}>
        <ShopClient initialProducts={initialProducts} />
      </Suspense>

      <Footer />
    </main>
  )
}
