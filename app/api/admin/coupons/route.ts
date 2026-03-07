import { NextRequest, NextResponse } from 'next/server'
import { isStripeConfigured } from '@/lib/stripe'

const STRIPE_API = 'https://api.stripe.com/v1'

function stripeHeaders(): Record<string, string> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured')
  return {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
}

function encodeForm(data: Record<string, string>): string {
  return Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

// GET: List promotion codes from Stripe
export async function GET() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: true, data: { coupons: [] } })
  }

  try {
    const res = await fetch(`${STRIPE_API}/coupons?limit=50`, {
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    })
    const data = await res.json()
    const coupons = (data.data || []).map((c: any) => ({
      id: c.id,
      code: c.name || c.id,
      percent_off: c.percent_off,
      amount_off: c.amount_off,
      currency: c.currency || 'usd',
      active: c.valid,
      times_redeemed: c.times_redeemed || 0,
      max_redemptions: c.max_redemptions,
    }))
    return NextResponse.json({ ok: true, data: { coupons } })
  } catch (error) {
    console.error('Stripe coupons fetch error:', error)
    return NextResponse.json({ ok: false, error: { message: 'Failed to fetch coupons' } }, { status: 500 })
  }
}

// POST: Create coupon + promotion code in Stripe
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: false, error: { message: 'Stripe not configured' } }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { code, type, value, maxRedemptions } = body

    if (!code || !value) {
      return NextResponse.json({ ok: false, error: { message: 'Code and value required' } }, { status: 400 })
    }

    // Step 1: Create coupon
    const couponBody: Record<string, string> = {
      name: code,
    }
    if (type === 'percent') {
      couponBody.percent_off = String(value)
    } else {
      couponBody.amount_off = String(Math.round(value * 100))
      couponBody.currency = 'usd'
    }
    if (maxRedemptions) {
      couponBody.max_redemptions = String(maxRedemptions)
    }

    const couponRes = await fetch(`${STRIPE_API}/coupons`, {
      method: 'POST',
      headers: stripeHeaders(),
      body: encodeForm(couponBody),
    })

    if (!couponRes.ok) {
      const err = await couponRes.text()
      console.error('Stripe coupon error:', err)
      return NextResponse.json({ ok: false, error: { message: 'Failed to create coupon in Stripe' } }, { status: 500 })
    }

    const coupon = await couponRes.json()

    // Step 2: Create promotion code
    const promoRes = await fetch(`${STRIPE_API}/promotion_codes`, {
      method: 'POST',
      headers: stripeHeaders(),
      body: encodeForm({
        coupon: coupon.id,
        code: code.toUpperCase(),
        active: 'true',
      }),
    })

    if (!promoRes.ok) {
      const err = await promoRes.text()
      console.error('Stripe promo code error:', err)
    }

    return NextResponse.json({ ok: true, data: { couponId: coupon.id } })
  } catch (error) {
    console.error('Coupon creation error:', error)
    return NextResponse.json({ ok: false, error: { message: 'Internal error' } }, { status: 500 })
  }
}
