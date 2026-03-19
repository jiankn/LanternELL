'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Download, Package, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id') || null

  const [status, setStatus] = useState<'verifying' | 'ready' | 'processing' | 'failed'>('verifying')
  const [productName, setProductName] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setStatus('ready') // No session_id means direct visit, show default
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
        const data = await res.json()

        if (cancelled) return

        if (data.ok && data.data) {
          if (data.data.productName) setProductName(data.data.productName)

          if (data.data.ready) {
            setStatus('ready')
            return
          } else if (data.data.status === 'failed') {
            setStatus('failed')
            return
          }
        }

        // Continue polling (max 12 times = ~60s)
        setPollCount((prev) => {
          if (prev >= 12) {
            setStatus('ready') // Show success anyway after timeout
            return prev
          }
          timer = setTimeout(poll, 5000)
          return prev + 1
        })
      } catch {
        if (!cancelled) {
          setStatus('ready') // On error, show success anyway
        }
      }
    }

    // Start polling after a short delay (give webhook time)
    timer = setTimeout(poll, 2000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [sessionId])

  return (
    <div className="w-full max-w-lg text-center">
      <div className="clay-card p-10">
        {/* Icon */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          {status === 'verifying' || status === 'processing' ? (
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-clay-button">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          ) : status === 'failed' ? (
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-clay-button">
              <Package className="w-12 h-12 text-white" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-clay-button">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </>
          )}
        </div>

        {status === 'verifying' || status === 'processing' ? (
          <>
            <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">
              Processing Your Order...
            </h1>
            <p className="text-lg text-text-primary/70 mb-8">
              We're confirming your payment. This usually takes just a few seconds.
            </p>
          </>
        ) : status === 'failed' ? (
          <>
            <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">
              Payment Issue
            </h1>
            <p className="text-lg text-text-primary/70 mb-8">
              There was a problem processing your payment. Please contact support if the charge was made.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">
              Thank You!
            </h1>
            <p className="text-lg text-text-primary/70 mb-2">
              Your purchase was successful.
            </p>
            {productName && (
              <p className="text-md font-semibold text-primary mb-6">{productName}</p>
            )}
            <p className="text-text-primary/70 mb-8">
              Your teaching packs are ready to download.
            </p>
          </>
        )}

        <div className="space-y-3">
          <Link
            href="/account/library"
            className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 text-lg cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Go to My Downloads
          </Link>
          <Link
            href="/shop"
            className="clay-button w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
          >
            <Package className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-xl">
          <p className="text-sm text-text-primary/70">
            We've also sent a confirmation email with a link to access your downloads.
            If you're a new user, check your email to set up your password.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar static links={[{ href: '/shop', label: 'Shop' }, { href: '/account/library', label: 'My Library' }]} />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense>
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </main>
  )
}
