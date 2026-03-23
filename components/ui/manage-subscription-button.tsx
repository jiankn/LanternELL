'use client'

import { useState, type ReactNode } from 'react'

interface ManageSubscriptionButtonProps {
  className: string
  children: ReactNode
}

export function ManageSubscriptionButton({
  className,
  children,
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/account/portal', { method: 'POST' })
      const data = await res.json()

      if (data.ok && data.data?.portalUrl) {
        window.location.href = data.data.portalUrl
        return
      }

      alert(data.error?.message || 'Could not open subscription portal')
    } catch {
      alert('Failed to open subscription portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleManageSubscription}
      disabled={loading}
      className={`${className} disabled:opacity-70 disabled:cursor-wait`}
    >
      {loading ? 'Opening...' : children}
    </button>
  )
}
