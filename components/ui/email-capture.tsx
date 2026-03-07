'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribing(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sourcePage: 'landing', leadMagnet: 'free-samples' }),
      })
      const data = await res.json()
      if (data.ok) setSubscribed(true)
    } catch {
      // silent
    } finally {
      setSubscribing(false)
      setEmail('')
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
        <CheckCircle className="w-5 h-5" />
        Thanks for subscribing! Check your email.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="clay-input flex-1"
      />
      <button type="submit" disabled={subscribing} className="clay-button-cta cursor-pointer whitespace-nowrap">
        {subscribing ? 'Subscribing...' : 'Get Free Samples'}
      </button>
    </form>
  )
}
