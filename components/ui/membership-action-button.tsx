'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ManageSubscriptionButton } from './manage-subscription-button'
import { MembershipCheckoutButton } from './membership-checkout-button'
import type { MembershipActionDescriptor } from './pricing-membership-state'

interface MembershipActionButtonProps {
  action: MembershipActionDescriptor
  membershipProductId: string | null
  className: string
  children?: ReactNode
  cancelPath?: string
}

export function MembershipActionButton({
  action,
  membershipProductId,
  className,
  children,
  cancelPath = '/pricing',
}: MembershipActionButtonProps) {
  const content = children ?? action.label

  if (action.kind === 'manage') {
    return (
      <ManageSubscriptionButton className={className}>
        {content}
      </ManageSubscriptionButton>
    )
  }

  if (action.kind === 'checkout') {
    if (membershipProductId) {
      return (
        <MembershipCheckoutButton
          productId={membershipProductId}
          priceTier={action.priceTier ?? 'monthly'}
          cancelPath={cancelPath}
          className={className}
        >
          {content}
        </MembershipCheckoutButton>
      )
    }

    return (
      <Link href="/shop?filter=membership" className={className}>
        {content}
      </Link>
    )
  }

  return (
    <Link href={action.href ?? '/account'} className={className}>
      {content}
    </Link>
  )
}
