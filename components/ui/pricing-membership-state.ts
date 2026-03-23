export type MembershipTier = 'monthly' | 'annual'

export interface PricingSubscription {
  status: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  priceTier?: string | null
}

export interface PricingUserStatus {
  authenticated: boolean
  subscription?: PricingSubscription | null
  purchases?: Record<string, number>
}

export type MembershipActionKind = 'checkout' | 'manage' | 'link'
export type MembershipBadgeTone = 'green' | 'amber' | 'orange' | 'slate'

export interface MembershipActionDescriptor {
  kind: MembershipActionKind
  label: string
  href?: string
  priceTier?: MembershipTier
}

export interface MembershipBadge {
  label: string
  tone: MembershipBadgeTone
}

export interface MembershipActionState {
  subscription: PricingSubscription | null
  hasMembership: boolean
  currentTier: MembershipTier | null
  viewedTier: MembershipTier
  isViewingCurrentTier: boolean
  isUpgradeOpportunity: boolean
  isPaymentIssue: boolean
  isCanceling: boolean
  formattedPeriodEnd: string | null
  badge: MembershipBadge | null
  helperCopy: string
  primaryAction: MembershipActionDescriptor
  secondaryAction?: MembershipActionDescriptor
}

function normalizeTier(priceTier?: string | null): MembershipTier {
  return priceTier === 'annual' ? 'annual' : 'monthly'
}

export function formatMembershipDate(dateValue: string | null | undefined): string | null {
  if (!dateValue) {
    return null
  }

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getMembershipActionState(
  userStatus: PricingUserStatus | null | undefined,
  viewedTier: MembershipTier
): MembershipActionState {
  const subscription = userStatus?.subscription ?? null
  const hasMembership = subscription?.status === 'active' || subscription?.status === 'past_due'
  const currentTier = hasMembership && subscription ? normalizeTier(subscription.priceTier) : null
  const isViewingCurrentTier = hasMembership && currentTier === viewedTier
  const isUpgradeOpportunity = currentTier === 'monthly' && viewedTier === 'annual'
  const isPaymentIssue = subscription?.status === 'past_due'
  const isCanceling = Boolean(subscription?.cancelAtPeriodEnd)
  const formattedPeriodEnd = formatMembershipDate(subscription?.currentPeriodEnd)

  if (!hasMembership || !currentTier) {
    return {
      subscription,
      hasMembership: false,
      currentTier: null,
      viewedTier,
      isViewingCurrentTier: false,
      isUpgradeOpportunity: false,
      isPaymentIssue: false,
      isCanceling: false,
      formattedPeriodEnd: null,
      badge: null,
      helperCopy:
        viewedTier === 'annual'
          ? 'Pay once for the year and save $29 compared to monthly billing.'
          : 'Start monthly today and switch to annual anytime to save $29/year.',
      primaryAction: {
        kind: 'checkout',
        label: viewedTier === 'annual' ? 'Start Annual Plan' : 'Start Monthly Plan',
        priceTier: viewedTier,
      },
    }
  }

  if (isPaymentIssue) {
    return {
      subscription,
      hasMembership: true,
      currentTier,
      viewedTier,
      isViewingCurrentTier,
      isUpgradeOpportunity,
      isPaymentIssue: true,
      isCanceling,
      formattedPeriodEnd,
      badge: {
        label: 'Payment Issue',
        tone: 'orange',
      },
      helperCopy: 'Your access is still active, but billing needs attention to avoid interruption.',
      primaryAction: {
        kind: 'manage',
        label: 'Update Payment Method',
      },
      secondaryAction: {
        kind: 'link',
        label: 'Go to Library',
        href: '/account/library',
      },
    }
  }

  if (isViewingCurrentTier) {
    return {
      subscription,
      hasMembership: true,
      currentTier,
      viewedTier,
      isViewingCurrentTier: true,
      isUpgradeOpportunity: false,
      isPaymentIssue: false,
      isCanceling,
      formattedPeriodEnd,
      badge: {
        label: isCanceling && formattedPeriodEnd ? `Ends ${formattedPeriodEnd}` : 'Current Plan',
        tone: isCanceling ? 'amber' : 'green',
      },
      helperCopy:
        isCanceling && formattedPeriodEnd
          ? `Your access stays active until ${formattedPeriodEnd}.`
          : currentTier === 'monthly'
            ? 'You are on All Access Monthly. Switch to annual anytime to save $29/year.'
            : 'You already have full-library access through your annual plan.',
      primaryAction: {
        kind: 'manage',
        label: 'Manage Subscription',
      },
      secondaryAction: {
        kind: 'link',
        label: 'Go to Library',
        href: '/account/library',
      },
    }
  }

  if (isUpgradeOpportunity) {
    return {
      subscription,
      hasMembership: true,
      currentTier,
      viewedTier,
      isViewingCurrentTier: false,
      isUpgradeOpportunity: true,
      isPaymentIssue: false,
      isCanceling,
      formattedPeriodEnd,
      badge: {
        label: isCanceling && formattedPeriodEnd ? `Ends ${formattedPeriodEnd}` : 'Upgrade Available',
        tone: 'amber',
      },
      helperCopy:
        isCanceling && formattedPeriodEnd
          ? `Your monthly access ends ${formattedPeriodEnd}. Switch to annual to keep access and save $29/year.`
          : 'Switch to annual for $79/year and save $29 compared to monthly billing.',
      primaryAction: {
        kind: 'checkout',
        label: 'Upgrade to Annual',
        priceTier: 'annual',
      },
      secondaryAction: {
        kind: 'link',
        label: 'Go to Library',
        href: '/account/library',
      },
    }
  }

  return {
    subscription,
    hasMembership: true,
    currentTier,
    viewedTier,
    isViewingCurrentTier: false,
    isUpgradeOpportunity: false,
    isPaymentIssue: false,
    isCanceling,
    formattedPeriodEnd,
    badge: {
      label: isCanceling && formattedPeriodEnd ? `Ends ${formattedPeriodEnd}` : 'Covered by Annual',
      tone: isCanceling ? 'amber' : 'green',
    },
    helperCopy:
      isCanceling && formattedPeriodEnd
        ? `Your annual plan stays active until ${formattedPeriodEnd}. Monthly access is already included.`
        : 'Your annual plan already includes everything in the monthly plan.',
    primaryAction: {
      kind: 'link',
      label: 'Go to Library',
      href: '/account/library',
    },
    secondaryAction: {
      kind: 'manage',
      label: 'Manage Subscription',
    },
  }
}
