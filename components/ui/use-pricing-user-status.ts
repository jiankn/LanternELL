'use client'

import { useEffect, useState } from 'react'
import type { PricingUserStatus } from './pricing-membership-state'

function normalizeApiUserStatus(data: any): PricingUserStatus {
  if (data.ok && data.data?.authenticated) {
    return {
      authenticated: true,
      subscription: data.data.user?.subscription ?? null,
      purchases: data.data.user?.purchases ?? {},
    }
  }

  return {
    authenticated: false,
    subscription: null,
    purchases: {},
  }
}

export function usePricingUserStatus(initialStatus: PricingUserStatus) {
  const [status, setStatus] = useState<PricingUserStatus>(initialStatus)

  useEffect(() => {
    let cancelled = false

    fetch('/api/account/me')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setStatus(normalizeApiUserStatus(data))
        }
      })
      .catch(() => {
        if (!cancelled && !initialStatus.authenticated) {
          setStatus({
            authenticated: false,
            subscription: null,
            purchases: {},
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [initialStatus.authenticated])

  return status
}
