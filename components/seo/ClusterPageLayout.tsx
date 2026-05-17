import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { FaqAccordion } from '@/components/ui/faq-accordion'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export interface ClusterFaqItem {
  question: string
  answer: string
}

export interface ClusterRelatedLink {
  href: string
  label: string
}

export interface ClusterPageLayoutProps {
  /** Breadcrumb display label (last segment) */
  breadcrumbLabel: string
  /** Canonical path e.g. "/dual-language-classroom" — used for JSON-LD URLs */
  canonicalPath: string

  /** Hero badge above H1 (small pill) */
  badge?: { icon: LucideIcon; text: string }
  /** Page H1 (must contain primary keyword) */
  h1: string
  /** Hero intro paragraph — first 100 words must contain primary keyword */
  intro: string
  /** Primary CTA button */
  primaryCta: { href: string; label: string; icon?: LucideIcon }
  /** Optional secondary CTA */
  secondaryCta?: { href: string; label: string }

  /** Body sections — write JSX freely as children */
  children: ReactNode

  /** FAQ items rendered with FaqAccordion + FAQPage JSON-LD */
  faqs?: ClusterFaqItem[]

  /** Related cluster / pillar links shown at bottom */
  relatedLinks: ClusterRelatedLink[]

  /** WebPage JSON-LD name (defaults to H1) */
  webPageName?: string
  /** WebPage JSON-LD description (defaults to intro) */
  webPageDescription?: string
}

/**
 * ClusterPageLayout — Reusable SEO landing page layout.
 *
 * Provides:
 *   - Navbar + Footer
 *   - Breadcrumb (UI + JSON-LD BreadcrumbList)
 *   - Hero with H1, intro, CTAs
 *   - {children} slot for free-form body sections
 *   - Optional FAQ accordion + FAQPage JSON-LD
 *   - Related links footer (pillar + sibling clusters)
 *   - WebPage JSON-LD
 *
 * Usage: Page must export its own `metadata` (Next.js requirement) and pass
 * canonical/title/description there. This component handles structured data
 * for BreadcrumbList / WebPage / FAQPage.
 */
export function ClusterPageLayout({
  breadcrumbLabel,
  canonicalPath,
  badge,
  h1,
  intro,
  primaryCta,
  secondaryCta,
  children,
  faqs,
  relatedLinks,
  webPageName,
  webPageDescription,
}: ClusterPageLayoutProps) {
  const fullUrl = `${BASE_URL}${canonicalPath}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabel, item: fullUrl },
    ],
  }

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: webPageName || h1,
    description: webPageDescription || intro,
    url: fullUrl,
    breadcrumb: breadcrumbJsonLd,
  }

  const faqJsonLd = faqs && faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  const BadgeIcon = badge?.icon
  const PrimaryIcon = primaryCta.icon

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Navbar
        links={[
          { href: '/', label: 'Home' },
          { href: '/shop', label: 'Shop' },
          { href: '/teaching-tips', label: 'Teaching Tips' },
        ]}
      />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">{breadcrumbLabel}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          {badge && BadgeIcon && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
              <BadgeIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-text-primary">{badge.text}</span>
            </div>
          )}
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">{h1}</h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">{intro}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={primaryCta.href} className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link href={secondaryCta.href} className="clay-button text-lg cursor-pointer">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Body sections (rendered via children) */}
      {children}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* Related links back to Pillar + sibling Clusters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-primary/70 mb-4">
            Looking for more resources? Browse our complete collection of{' '}
            <Link href="/" className="text-primary hover:underline">
              ELL worksheets and bilingual teaching resources
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="clay-button text-sm cursor-pointer inline-flex items-center gap-1"
              >
                {link.label} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/**
 * Section wrapper helper — alternating background.
 * Use `<ClusterSection alt={i % 2 === 0}>` inside `<ClusterPageLayout>` children.
 */
export function ClusterSection({ alt, children }: { alt?: boolean; children: ReactNode }) {
  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${alt ? 'bg-white/50' : ''}`}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  )
}
