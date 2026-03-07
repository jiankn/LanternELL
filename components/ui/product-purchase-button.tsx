'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

interface Props {
  productId: string
  productSlug: string
  productType: string
}

export function ProductPurchaseButton({ productId, productSlug, productType }: Props) {
  const [purchasing, setPurchasing] = useState(false)

  const handlePurchase = async () => {
    setPurchasing(true)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 1,
          successPath: '/checkout/success',
          cancelPath: `/shop/${productSlug}`,
        })
      })
      const data = await res.json()
      if (data.ok && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      } else {
        alert(data.error?.message || 'Checkout failed')
      }
    } catch {
      alert('Checkout failed')
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={purchasing}
      className="clay-button-cta w-full text-lg py-4 flex items-center justify-center gap-2 mb-4 cursor-pointer"
    >
      {purchasing ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {purchasing ? 'Processing...' : productType === 'membership' ? 'Subscribe Now' : 'Buy Now'}
    </button>
  )
}
