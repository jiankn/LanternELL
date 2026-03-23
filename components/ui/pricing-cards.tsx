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
  CheckCircle,
} from 'lucide-react'
import { BillingToggle } from './billing-toggle'
import { MembershipActionButton } from './membership-action-button'
import {
  getMembershipActionState,
  type MembershipBadgeTone,
  type PricingUserStatus,
} from './pricing-membership-state'
import { usePricingUserStatus } from './use-pricing-user-status'

const CircleCheckBig = CheckCircle

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

function getBadgeClassName(tone: MembershipBadgeTone) {
  switch (tone) {
    case 'amber':
      return 'bg-amber-500 text-white'
    case 'orange':
      return 'bg-orange-500 text-white'
    case 'slate':
      return 'bg-slate-500 text-white'
    case 'green':
    default:
      return 'bg-green-500 text-white'
  }
}

function getActionButtonClassName(isPrimaryHighlight: boolean, actionKind: 'checkout' | 'manage' | 'link') {
  const baseClassName = actionKind === 'checkout'
    ? isPrimaryHighlight
      ? 'clay-button-cta'
      : 'clay-button'
    : 'clay-button'

  return `${baseClassName} block text-center py-3 px-6 rounded-[12px] font-semibold transition-all duration-200 cursor-pointer w-full`
}

const comparisonFeatures = [
  { name: 'Printable PDF packs', single: true, bundle: true, membership: true },
  { name: 'English-Spanish bilingual packs', single: true, bundle: true, membership: true },
  { name: 'K-5 core grades + Pre-K & middle school', single: true, bundle: true, membership: true },
  { name: 'Unlimited classroom printing', single: true, bundle: true, membership: true },
  { name: 'Vocabulary packs', single: true, bundle: true, membership: true },
  { name: 'Sentence frames', single: true, bundle: true, membership: true },
  { name: 'Classroom labels', single: true, bundle: true, membership: true },
  { name: 'Parent communication sheets', single: true, bundle: true, membership: true },
  { name: 'Visual supports for diverse learners', single: false, bundle: 'Some', membership: true },
  { name: 'Progress tracking templates', single: false, bundle: 'Some', membership: true },
  { name: 'New packs added regularly', single: false, bundle: false, membership: true },
  { name: 'High-res / no watermark', single: true, bundle: true, membership: true },
  { name: 'Bundle discount (up to 40%)', single: false, bundle: true, membership: 'N/A' },
]

interface PricingCardsProps {
  membershipProductId: string | null
  initialUserStatus: PricingUserStatus
}

export function PricingCards({ membershipProductId, initialUserStatus }: PricingCardsProps) {
  const [isAnnual, setIsAnnual] = useState(initialUserStatus.subscription?.priceTier === 'annual')
  const userStatus = usePricingUserStatus(initialUserStatus)

  const hasSubscription = userStatus?.subscription?.status === 'active' || userStatus?.subscription?.status === 'past_due'
  const singleCount = userStatus?.purchases?.single || 0
  const bundleCount = userStatus?.purchases?.bundle || 0

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
        'English-Spanish bilingual content',
        'K-5 core grades + Pre-K & middle school',
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
        'New packs added regularly',
        'English-Spanish bilingual packs',
        'Visual supports for diverse learners',
        'Progress tracking templates included',
        'High-resolution, no watermark',
        'Cancel anytime',
      ],
      annualPerks: isAnnual ? [
        '3+ months free vs monthly',
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
            Annual billing selected — you save $29 per year on All Access
          </p>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start mb-20">
        {tiers.map((tier) => {
          // Determine purchase status for this tier
          const isSingleTier = tier.name === 'Single Packs'
          const isBundleTier = tier.name === 'Bundles'
          const isAllAccessTier = tier.name === 'All Access'
          const membershipState = isAllAccessTier
            ? getMembershipActionState(userStatus, isAnnual ? 'annual' : 'monthly')
            : null
          const isSingleOwned = isSingleTier && singleCount > 0
          const isBundleOwned = isBundleTier && bundleCount > 0
          const isAllAccessActive = Boolean(membershipState?.hasMembership)
          const isOwned = isSingleOwned || isBundleOwned || isAllAccessActive
          const isCoveredByCurrentPlan = hasSubscription && (isSingleTier || isBundleTier)
          const statusBadge = membershipState?.badge
            ? {
              label: membershipState.badge.label,
              className: getBadgeClassName(membershipState.badge.tone),
            }
            : isOwned
              ? {
                label: isSingleOwned ? `${singleCount} purchased` : `${bundleCount} purchased`,
                className: 'bg-green-500 text-white',
              }
              : null
          const showAnnualSavingsCallout =
            tier.highlight &&
            isAnnual &&
            (!membershipState || !membershipState.hasMembership || membershipState.isUpgradeOpportunity)

          return (
          <div
            key={tier.name}
            className={`clay-card p-8 relative transition-all duration-200 ${tier.highlight
              ? 'ring-2 ring-cta md:-mt-4 md:pb-10'
              : ''
              } ${isOwned ? 'ring-2 ring-green-400' : ''}`}
          >
            {/* Status badge for owned plans and current membership */}
            {statusBadge && (
              <div className="absolute -top-3 right-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${statusBadge.className}`}>
                  <CircleCheckBig className="w-3 h-3" />
                  {statusBadge.label}
                </span>
              </div>
            )}

            {tier.badge && !isOwned && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-cta to-[#ea580c] text-white text-xs font-bold rounded-full shadow-clay-sm">
                  <Star className="w-3 h-3 fill-white" /> {tier.badge}
                </span>
              </div>
            )}
            {tier.badge && isOwned && (
              <div className="absolute -top-3 left-4">
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
            {showAnnualSavingsCallout && (
              <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium text-center">
                3+ months free — save $29 vs monthly billing
              </div>
            )}

            {isAllAccessTier && membershipState ? (
              <>
                <MembershipActionButton
                  action={membershipState.primaryAction}
                  membershipProductId={membershipProductId}
                  className={`${getActionButtonClassName(tier.highlight, membershipState.primaryAction.kind)} mb-3`}
                >
                  {membershipState.primaryAction.label} <ArrowRight className="w-4 h-4 inline ml-1" />
                </MembershipActionButton>
                {membershipState.secondaryAction && (
                  <MembershipActionButton
                    action={membershipState.secondaryAction}
                    membershipProductId={membershipProductId}
                    className="clay-button block text-center py-3 px-6 rounded-[12px] font-semibold transition-all duration-200 cursor-pointer mb-3 w-full"
                  >
                    {membershipState.secondaryAction.label}
                  </MembershipActionButton>
                )}
                <p className={`text-center text-xs font-medium mb-5 ${membershipState.isUpgradeOpportunity ? 'text-amber-700' : membershipState.isPaymentIssue ? 'text-orange-700' : 'text-green-700'}`}>
                  {membershipState.helperCopy}
                </p>
              </>
            ) : (
              <Link
                href={tier.ctaHref}
                className={`${getActionButtonClassName(tier.highlight, 'link')} mb-3`}
              >
                {tier.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
            )}

            {isCoveredByCurrentPlan && !isAllAccessTier && (
              <p className="text-center text-xs font-medium text-green-700 mb-5">
                Included in your plan
              </p>
            )}

            {!isCoveredByCurrentPlan && !isAllAccessTier && <div className="mb-5" />}

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
          )
        })}
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
