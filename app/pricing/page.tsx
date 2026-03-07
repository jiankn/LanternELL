import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Check,
  Star,
  Sparkles,
  ArrowRight,
  Download,
  Users,
  Zap,
  Shield,
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { FaqAccordion } from '@/components/ui/faq-accordion'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'Pricing — ELL Teaching Packs & Membership Plans',
  description:
    'Choose the right plan for your classroom. Single packs from $3.99, bundles from $19, or get unlimited access with All Access membership starting at $9/mo.',
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: 'LanternELL Pricing — Plans for Every Teacher',
    description:
      'Single packs, bundles, and unlimited membership plans for ELL & bilingual classrooms.',
    url: `${BASE_URL}/pricing`,
  },
}

const tiers = [
  {
    name: 'Single Packs',
    description: 'Perfect for trying out or targeting a specific topic',
    price: '$3.99',
    priceNote: '– $9.99 per pack',
    period: '',
    cta: 'Browse Packs',
    ctaHref: '/shop',
    highlight: false,
    icon: <Download className="w-6 h-6" />,
    features: [
      'One printable teaching pack',
      'PDF instant download',
      '6 language pairs available',
      'Pre-K through Grade 8',
      'Lifetime access to purchased pack',
      'Print unlimited copies for your class',
    ],
  },
  {
    name: 'All Access',
    description: 'Unlimited access to every resource in the library',
    price: '$9',
    priceNote: '/mo',
    period: 'or $99/year (save 8%)',
    cta: 'Start All Access',
    ctaHref: '/shop?filter=membership',
    highlight: true,
    badge: 'Most Popular',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      'Unlimited downloads — every pack',
      'New packs added weekly',
      'All 6 language pairs',
      'SPED visual supports included',
      'Assessment tools included',
      'High-resolution, no watermark',
      'Cancel anytime',
    ],
  },
  {
    name: 'Bundles',
    description: 'Curated sets of packs grouped by theme or grade',
    price: '$19',
    priceNote: '– $79 per bundle',
    period: '',
    cta: 'View Bundles',
    ctaHref: '/shop?filter=bundle',
    highlight: false,
    icon: <Users className="w-6 h-6" />,
    features: [
      '4–10 packs per bundle',
      'Save up to 40% vs singles',
      'Themed collections (Back to School, etc.)',
      'Grade-level starter kits',
      'Lifetime access to all packs in bundle',
      'Print unlimited copies for your class',
    ],
  },
]

const comparisonFeatures = [
  { name: 'Printable PDF packs', single: true, bundle: true, membership: true },
  { name: '6 language pairs (ES, ZH, AR, VI, FR, PT)', single: true, bundle: true, membership: true },
  { name: 'Pre-K through Grade 8', single: true, bundle: true, membership: true },
  { name: 'Unlimited classroom printing', single: true, bundle: true, membership: true },
  { name: 'Vocabulary packs', single: true, bundle: true, membership: true },
  { name: 'Sentence frames', single: true, bundle: true, membership: true },
  { name: 'Classroom labels', single: true, bundle: true, membership: true },
  { name: 'Parent communication sheets', single: true, bundle: true, membership: true },
  { name: 'SPED visual supports', single: false, bundle: 'Some', membership: true },
  { name: 'Assessment tools', single: false, bundle: 'Some', membership: true },
  { name: 'New weekly packs', single: false, bundle: false, membership: true },
  { name: 'High-res / no watermark', single: true, bundle: true, membership: true },
  { name: 'Bundle discount (up to 40%)', single: false, bundle: true, membership: 'N/A' },
]

const faqs = [
  {
    question: 'Can I try before I buy?',
    answer:
      'Yes. We offer free sample packs on our shop page so you can see the quality before purchasing. No credit card required.',
  },
  {
    question: 'What formats are the packs in?',
    answer:
      'All packs are delivered as print-ready PDF files. Just download, print, and use in your classroom. Some packs include multiple page sizes (Letter and A4).',
  },
  {
    question: 'Can I share packs with other teachers?',
    answer:
      'Each purchase is licensed for one teacher and their classroom. If your school needs multiple copies, check out our bundle options or contact us for school licensing.',
  },
  {
    question: 'How does the All Access membership work?',
    answer:
      'With All Access, you get unlimited downloads of every pack in our library for as long as your subscription is active. New packs are added weekly. You can cancel anytime.',
  },
  {
    question: 'What is your refund policy?',
    answer:
      'We offer a 30-day money-back guarantee on all purchases. If you are not satisfied, contact us for a full refund. No questions asked.',
  },
  {
    question: 'Do you offer school or district pricing?',
    answer:
      'Yes. Contact us at support@lanternell.com for custom pricing for schools, districts, and tutoring centers.',
  },
]

function CheckIcon() {
  return <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  )
}

export default function PricingPage() {
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Zap className="w-4 h-4 text-cta" />
            <span className="text-sm font-medium text-text-primary">30-Day Money-Back Guarantee</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Simple Pricing for <span className="text-gradient">Every Classroom</span>
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
            Whether you need one pack or unlimited access, we have a plan that fits your teaching needs and budget.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`clay-card p-8 relative ${
                  tier.highlight
                    ? 'ring-2 ring-cta md:-mt-4 md:mb-0 md:pb-10'
                    : ''
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-cta to-[#ea580c] text-white text-xs font-bold rounded-full shadow-clay-sm">
                      <Star className="w-3 h-3 fill-white" /> {tier.badge}
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  tier.highlight ? 'bg-cta/10 text-cta' : 'bg-primary/10 text-primary'
                }`}>
                  {tier.icon}
                </div>

                <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-text-primary/60 mb-6">{tier.description}</p>

                <div className="mb-6">
                  <span className={`font-heading text-4xl font-bold ${
                    tier.highlight ? 'text-cta' : 'text-primary'
                  }`}>
                    {tier.price}
                  </span>
                  <span className="text-text-primary/60 text-sm">{tier.priceNote}</span>
                  {tier.period && (
                    <p className="text-xs text-text-muted mt-1">{tier.period}</p>
                  )}
                </div>

                <Link
                  href={tier.ctaHref}
                  className={`block text-center py-3 px-6 rounded-[12px] font-semibold transition-all duration-200 cursor-pointer mb-8 ${
                    tier.highlight
                      ? 'clay-button-cta w-full justify-center'
                      : 'clay-button w-full justify-center'
                  }`}
                >
                  {tier.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-text-primary/80">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary text-center mb-10">
            Compare Plans
          </h2>
          <div className="clay-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-6 font-heading font-semibold text-text-primary">Feature</th>
                    <th className="text-center py-4 px-4 font-heading font-semibold text-text-primary">Single</th>
                    <th className="text-center py-4 px-4 font-heading font-semibold text-text-primary">Bundle</th>
                    <th className="text-center py-4 px-4 font-heading font-semibold text-cta">All Access</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 0 ? 'bg-background/30' : ''}>
                      <td className="py-3 px-6 text-text-primary/80">{row.name}</td>
                      <td className="py-3 px-4 text-center">
                        {row.single === true ? <CheckIcon /> : row.single === false ? <XIcon /> : <span className="text-xs text-text-muted">{row.single}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.bundle === true ? <CheckIcon /> : row.bundle === false ? <XIcon /> : <span className="text-xs text-text-muted">{row.bundle}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.membership === true ? <CheckIcon /> : row.membership === false ? <XIcon /> : <span className="text-xs text-text-muted">{row.membership}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Shield className="w-6 h-6" />, label: '30-Day Guarantee' },
              { icon: <Download className="w-6 h-6" />, label: 'Instant Download' },
              { icon: <Zap className="w-6 h-6" />, label: 'Cancel Anytime' },
              { icon: <Users className="w-6 h-6" />, label: '10,000+ Teachers' },
            ].map((badge) => (
              <div key={badge.label} className="clay-card-sm p-4 text-center">
                <div className="text-primary mx-auto mb-2 flex justify-center">{badge.icon}</div>
                <span className="text-xs font-medium text-text-primary/70">{badge.label}</span>
              </div>
            ))}
          </div>
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
          <div className="clay-card p-8 sm:p-12">
            <Sparkles className="w-10 h-10 text-cta mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Ready to Save Hours of Prep Time?
            </h2>
            <p className="text-text-primary/70 mb-8">
              Join thousands of teachers using LanternELL in their classrooms every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop?filter=membership" className="clay-button-cta text-lg cursor-pointer">
                Start All Access — $9/mo
              </Link>
              <Link href="/shop" className="clay-button text-lg cursor-pointer">
                Browse Free Samples
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
