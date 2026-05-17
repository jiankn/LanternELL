import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  Sparkles,
  Download,
  Users,
  Zap,
  Shield,
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { FaqAccordion } from '@/components/ui/faq-accordion'
import { PricingCards } from '@/components/ui/pricing-cards'
import {
  PricingHeroStatusBar,
  PricingAnnualCallout,
  PricingFinalCta,
} from '@/components/ui/pricing-membership-cta'
import type { PricingUserStatus } from '@/components/ui/pricing-membership-state'
import { getCurrentUserBySessionToken } from '@/lib/auth'
import { getAccountSnapshot } from '@/lib/account-status'
import { queryOne } from '@/lib/db'

const BASE_URL = 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'Pricing — ELL Teaching Packs & Plans',
  description:
    'Single packs from $3.99, bundles from $14.99, or unlimited access with All Access — $9/mo or $79/year. Affordable bilingual ELL teaching resources.',
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: 'LanternELL Pricing — Plans for Every Teacher',
    description:
      'Single packs, bundles, and unlimited membership plans for ELL & bilingual classrooms.',
    url: `${BASE_URL}/pricing`,
  },
}

const faqs = [
  {
    question: 'Can I try before I buy?',
    answer:
      'Yes. We provide detailed previews of every pack so you can see the quality before purchasing. We also offer free sample worksheets on our free resources page. No credit card required.',
  },
  {
    question: 'What is the difference between monthly and annual billing?',
    answer:
      'Monthly billing is $9/mo. Annual billing is $79/year — that\'s 3+ months free, saving you $29 compared to paying monthly. You can switch plans or cancel anytime from your account settings.',
  },
  {
    question: 'What formats are the packs in?',
    answer:
      'All packs are delivered as print-ready PDF files. Just download, print, and use in your classroom. Some packs include both US Letter and A4 sizes.',
  },
  {
    question: 'Can I share packs with other teachers?',
    answer:
      'Each purchase is licensed for one teacher and their classroom. If your school needs multiple copies, check out our bundle options or contact us for school licensing.',
  },
  {
    question: 'How does the All Access membership work?',
    answer:
      'With All Access, you get unlimited downloads of every pack in our library for as long as your subscription is active. New packs are added weekly. You can cancel anytime from your account settings.',
  },
  {
    question: 'What is your refund policy?',
    answer:
      'All sales are final on digital downloads. We encourage you to download our free samples before purchasing. Exceptions apply for duplicate charges, corrupted files, or content materially different from the description — report within 7 days of purchase.',
  },
  {
    question: 'Do you offer school or district pricing?',
    answer:
      'Yes. Contact us at support@lanternell.com for custom pricing for schools, districts, and tutoring centers.',
  },
]

export default async function PricingPage() {
  const sessionToken = cookies().get('__session')?.value ?? null
  const [membershipProduct, user] = await Promise.all([
    queryOne<{ id: string }>(
      `SELECT id FROM products WHERE slug = ? AND type = 'membership' AND active = 1 LIMIT 1`,
      ['all-access-membership']
    ),
    getCurrentUserBySessionToken(sessionToken),
  ])
  const membershipProductId = membershipProduct?.id ?? null
  const accountSnapshot = user ? await getAccountSnapshot(user.id) : null
  const initialUserStatus: PricingUserStatus = user
    ? {
      authenticated: true,
      subscription: accountSnapshot?.subscription ?? null,
      purchases: accountSnapshot?.purchases ?? {},
    }
    : {
      authenticated: false,
      subscription: null,
      purchases: {},
    }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'LanternELL Pricing',
    description: metadata.description,
    url: `${BASE_URL}/pricing`,
    publisher: {
      '@type': 'Organization',
      name: 'LanternELL',
      url: BASE_URL,
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navbar
        links={[
          { href: '/shop', label: 'Packs' },
          { href: '/pricing', label: 'Pricing', active: true },
          { href: '/teaching-tips', label: 'Teaching Tips' },
          { href: '/login', label: 'Sign In' },
        ]}
      />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">Pricing</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <PricingHeroStatusBar
            membershipProductId={membershipProductId}
            initialUserStatus={initialUserStatus}
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Zap className="w-4 h-4 text-cta" />
            <span className="text-sm font-medium text-text-primary">Preview Packs Before You Buy</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Simple Pricing for <span className="text-gradient">Every Classroom</span>
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
            Whether you need one pack or unlimited access, we have a plan that fits your teaching needs and budget.
          </p>
        </div>
      </section>

      {/* Pricing Cards (client — billing toggle) */}
      <section className="px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <PricingCards
            membershipProductId={membershipProductId}
            initialUserStatus={initialUserStatus}
          />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Shield className="w-6 h-6" />, label: 'Free Samples Available' },
              { icon: <Download className="w-6 h-6" />, label: 'Instant Download' },
              { icon: <Zap className="w-6 h-6" />, label: 'Cancel Anytime' },
              { icon: <Users className="w-6 h-6" />, label: '50+ Teaching Packs' },
            ].map((badge) => (
              <div key={badge.label} className="clay-card-sm p-4 text-center">
                <div className="text-primary mx-auto mb-2 flex justify-center">{badge.icon}</div>
                <span className="text-xs font-medium text-text-primary/70">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual value callout */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <PricingAnnualCallout
            membershipProductId={membershipProductId}
            initialUserStatus={initialUserStatus}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary text-center mb-10">
            Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <PricingFinalCta
            membershipProductId={membershipProductId}
            initialUserStatus={initialUserStatus}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
