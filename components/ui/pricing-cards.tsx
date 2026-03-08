'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Star,
  Sparkles,
  ArrowRight,
  Download,
  Users,
} from 'lucide-react'
import { BillingToggle } from './billing-toggle'

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

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false)

  const allAccessPrice = isAnnual ? '$79' : '$9'
  const allAccessNote = isAnnual ? '/year' : '/mo'
  const allAccessSub = isAnnual ? 'Billed annually — save $29 vs monthly' : 'or $79/year — save $29'

  const tiers = [
    {
      name: 'Single Packs',
      description: 'Perfect for targeting a specific topic or trying us out',
      price: '$3.99',
      priceNote: '– $8.99',
      period: 'per pack, one-time',
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
      description: 'Unlimited access to every resource — best value for active teachers',
      price: allAccessPrice,
      priceNote: allAccessNote,
      period: allAccessSub,
      cta: isAnnual ? 'Start Annual Plan' : 'Start Monthly Plan',
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
      annualPerks: isAnnual ? [
        '3+ months free vs monthly',
        'Priority email support',
        'Early access to new packs',
      ] : [],
    },
    {
      name: 'Bundles',
      description: 'Curated sets grouped by theme or grade — great one-time value',
      price: '$14.99',
      priceNote: '– $29.99',
      period: 'per bundle, one-time',
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

  return (
    <>
      {/* Billing Toggle */}
      <div className="mb-10">
        <BillingToggle onChange={setIsAnnual} />
        {isAnnual && (
          <p className="text-center text-sm text-green-600 font-medium mt-3">
            Annual plan active — you save $29 per year on All Access
          </p>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start mb-20">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`clay-card p-8 relative transition-all duration-200 ${tier.highlight
              ? 'ring-2 ring-cta md:-mt-4 md:pb-10'
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

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tier.highlight ? 'bg-cta/10 text-cta' : 'bg-primary/10 text-primary'
              }`}>
              {tier.icon}
            </div>

            <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">{tier.name}</h3>
            <p className="text-sm text-text-primary/60 mb-6">{tier.description}</p>

            <div className="mb-2">
              <span className={`font-heading text-4xl font-bold ${tier.highlight ? 'text-cta' : 'text-primary'}`}>
                {tier.price}
              </span>
              <span className="text-text-primary/60 text-sm">{tier.priceNote}</span>
            </div>
            <p className="text-xs text-text-muted mb-6">{tier.period}</p>

            {/* Annual savings callout */}
            {tier.highlight && isAnnual && (
              <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium text-center">
                3+ months free — save $29 vs monthly billing
              </div>
            )}

            <Link
              href={tier.ctaHref}
              className={`block text-center py-3 px-6 rounded-[12px] font-semibold transition-all duration-200 cursor-pointer mb-8 ${tier.highlight
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
              {'annualPerks' in tier && tier.annualPerks && tier.annualPerks.length > 0 && (
                <>
                  <li className="pt-2 border-t border-green-100">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Annual extras</span>
                  </li>
                  {tier.annualPerks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-green-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto mb-20">
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
    </>
  )
}
