'use client'

import { useState, type ReactNode } from 'react'

interface MembershipCheckoutButtonProps {
  productId: string
  priceTier: 'monthly' | 'annual'
  className: string
  children: ReactNode
  cancelPath?: string
}

export function MembershipCheckoutButton({
  productId,
  priceTier,
  className,
  children,
  cancelPath = '/pricing',
}: MembershipCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          priceTier,
          successPath: '/checkout/success',
          cancelPath,
        }),
      })

      const data = await res.json()

      if (data.ok && data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
        return
      }

      alert(data.error?.message || 'Checkout failed')
    } catch {
      alert('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} disabled:opacity-70 disabled:cursor-wait`}
    >
      {loading ? 'Processing...' : children}
    </button>
  )
}
