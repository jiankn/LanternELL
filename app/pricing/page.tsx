import type { Metadata } from 'next'
import Link from 'next/link'
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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'Pricing — ELL Teaching Packs & Membership Plans',
  description:
    'Choose the right plan for your classroom. Single packs from $3.99, bundles from $14.99, or get unlimited access with All Access membership — $9/mo or $79/year.',
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
      'Yes. We offer free sample packs on our shop page so you can see the quality before purchasing. No credit card required.',
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
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Zap className="w-4 h-4 text-cta" />
            <span className="text-sm font-medium text-text-primary">Free Samples Before You Buy</span>
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
          <PricingCards />
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

      {/* Annual value callout */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="clay-card p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-cta/5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
                  Annual plan — the smart choice for full-year teachers
                </h2>
                <p className="text-text-primary/70 text-sm leading-relaxed">
                  Pay $79 once and get unlimited access for the entire school year. That's less than $6.60/month — 3+ months free compared to monthly billing. Perfect for teachers who use resources throughout the year.
                </p>
              </div>
              <Link
                href="/shop?filter=membership"
                className="clay-button-cta shrink-0 cursor-pointer whitespace-nowrap"
              >
                Get Annual — $79/yr
              </Link>
            </div>
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
            <p className="text-xs text-text-muted mt-4">
              Or save $29 with <Link href="/shop?filter=membership" className="text-primary hover:underline">annual billing at $79/year</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
