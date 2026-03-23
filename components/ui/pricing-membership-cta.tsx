'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { MembershipActionButton } from './membership-action-button'
import {
  formatMembershipDate,
  getMembershipActionState,
  type MembershipActionDescriptor,
  type PricingUserStatus,
} from './pricing-membership-state'
import { usePricingUserStatus } from './use-pricing-user-status'

interface PricingMembershipCtaProps {
  membershipProductId: string | null
  initialUserStatus: PricingUserStatus
}

function getPrimaryButtonClass(action: MembershipActionDescriptor, extraClassName = '') {
  const baseClassName = action.kind === 'checkout' ? 'clay-button-cta' : 'clay-button'
  return `${baseClassName} ${extraClassName}`.trim()
}

function getAnnualCalloutCopy(hasMembership: boolean, currentTier: 'monthly' | 'annual' | null, helperCopy: string) {
  if (!hasMembership) {
    return {
      title: 'Annual plan — the smart choice for full-year teachers',
      body: "Pay $79 once and get unlimited access for the entire school year. That's less than $6.60/month — 3+ months free compared to monthly billing. Perfect for teachers who use resources throughout the year.",
    }
  }

  if (currentTier === 'monthly') {
    return {
      title: 'Upgrade to annual and save $29',
      body: helperCopy,
    }
  }

  return {
    title: 'Your annual plan is already active',
    body: helperCopy,
  }
}

function getFinalCtaCopy(monthlyState: ReturnType<typeof getMembershipActionState>) {
  if (!monthlyState.hasMembership) {
    return {
      title: 'Ready to Save Hours of Prep Time?',
      body: 'Built for the real needs of ESL teachers, bilingual educators, and homeschool families.',
    }
  }

  if (monthlyState.isPaymentIssue) {
    return {
      title: 'Your membership needs attention',
      body: monthlyState.helperCopy,
    }
  }

  if (monthlyState.currentTier === 'monthly') {
    return {
      title: 'Your All Access monthly plan is active',
      body: monthlyState.helperCopy,
    }
  }

  return {
    title: 'Your annual All Access plan is active',
    body: monthlyState.helperCopy,
  }
}

function getHeroStatusCopy(monthlyState: ReturnType<typeof getMembershipActionState>) {
  if (!monthlyState.hasMembership || !monthlyState.currentTier) {
    return null
  }

  const tierLabel = monthlyState.currentTier === 'annual' ? 'Annual' : 'Monthly'
  const periodEnd = formatMembershipDate(monthlyState.subscription?.currentPeriodEnd)

  if (monthlyState.isPaymentIssue) {
    return {
      title: `Your All Access ${tierLabel} plan needs attention`,
      body: monthlyState.helperCopy,
    }
  }

  if (monthlyState.isCanceling && periodEnd) {
    return {
      title: `You're on All Access ${tierLabel} until ${periodEnd}`,
      body: 'Your access is still active. Manage your subscription anytime before it ends.',
    }
  }

  return {
    title: `You're on All Access ${tierLabel}`,
    body:
      monthlyState.currentTier === 'monthly'
        ? 'You already have full monthly access. Upgrade to annual anytime to save $29/year.'
        : 'Your annual plan already covers the full library.',
  }
}

export function PricingHeroStatusBar({
  membershipProductId,
  initialUserStatus,
}: PricingMembershipCtaProps) {
  const userStatus = usePricingUserStatus(initialUserStatus)
  const monthlyState = getMembershipActionState(userStatus, 'monthly')
  const annualState = getMembershipActionState(userStatus, 'annual')
  const copy = getHeroStatusCopy(monthlyState)

  if (!copy) {
    return null
  }

  return (
    <div className="mb-5 clay-card-sm p-4 bg-gradient-to-r from-green-50 via-white to-primary/5 border-green-200/70">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 text-left">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {copy.title}
            </p>
            <p className="text-sm text-text-primary/70 mt-1">
              {copy.body}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
          <MembershipActionButton
            action={monthlyState.primaryAction}
            membershipProductId={membershipProductId}
            className={getPrimaryButtonClass(monthlyState.primaryAction, 'cursor-pointer whitespace-nowrap')}
          />
          {monthlyState.currentTier === 'monthly' && annualState.isUpgradeOpportunity ? (
            <MembershipActionButton
              action={annualState.primaryAction}
              membershipProductId={membershipProductId}
              className="clay-button-cta cursor-pointer whitespace-nowrap"
            />
          ) : (
            monthlyState.secondaryAction && (
              <MembershipActionButton
                action={monthlyState.secondaryAction}
                membershipProductId={membershipProductId}
                className="clay-button cursor-pointer whitespace-nowrap"
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export function PricingAnnualCallout({
  membershipProductId,
  initialUserStatus,
}: PricingMembershipCtaProps) {
  const userStatus = usePricingUserStatus(initialUserStatus)
  const annualState = getMembershipActionState(userStatus, 'annual')
  const copy = getAnnualCalloutCopy(
    annualState.hasMembership,
    annualState.currentTier,
    annualState.helperCopy
  )

  return (
    <div className="clay-card p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-cta/5">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
            {copy.title}
          </h2>
          <p className="text-text-primary/70 text-sm leading-relaxed">
            {copy.body}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <MembershipActionButton
            action={annualState.primaryAction}
            membershipProductId={membershipProductId}
            className={getPrimaryButtonClass(
              annualState.primaryAction,
              'shrink-0 cursor-pointer whitespace-nowrap'
            )}
          />
          {annualState.secondaryAction && (
            <MembershipActionButton
              action={annualState.secondaryAction}
              membershipProductId={membershipProductId}
              className="clay-button shrink-0 cursor-pointer whitespace-nowrap"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function PricingFinalCta({
  membershipProductId,
  initialUserStatus,
}: PricingMembershipCtaProps) {
  const userStatus = usePricingUserStatus(initialUserStatus)
  const monthlyState = getMembershipActionState(userStatus, 'monthly')
  const annualState = getMembershipActionState(userStatus, 'annual')
  const copy = getFinalCtaCopy(monthlyState)
  const showAnnualInlineAction = !monthlyState.hasMembership || annualState.isUpgradeOpportunity

  return (
    <div className="clay-card p-8 sm:p-12">
      <Sparkles className="w-10 h-10 text-cta mx-auto mb-4" />
      <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
        {copy.title}
      </h2>
      <p className="text-text-primary/70 mb-8">
        {copy.body}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <MembershipActionButton
          action={monthlyState.primaryAction}
          membershipProductId={membershipProductId}
          className={getPrimaryButtonClass(monthlyState.primaryAction, 'text-lg cursor-pointer')}
        />
        {monthlyState.hasMembership ? (
          monthlyState.secondaryAction && (
            <MembershipActionButton
              action={monthlyState.secondaryAction}
              membershipProductId={membershipProductId}
              className="clay-button text-lg cursor-pointer"
            />
          )
        ) : (
          <Link href="/free-samples" className="clay-button text-lg cursor-pointer">
            Browse Free Samples
          </Link>
        )}
      </div>
      {showAnnualInlineAction && (
        <p className="text-xs text-text-muted mt-4">
          {!monthlyState.hasMembership ? 'Or save $29 with ' : 'Want a better yearly value? '}
          <MembershipActionButton
            action={annualState.primaryAction}
            membershipProductId={membershipProductId}
            className="bg-transparent border-0 p-0 text-primary hover:underline cursor-pointer"
          >
            {!monthlyState.hasMembership ? 'annual billing at $79/year' : 'upgrade to annual'}
          </MembershipActionButton>
        </p>
      )}
    </div>
  )
}
