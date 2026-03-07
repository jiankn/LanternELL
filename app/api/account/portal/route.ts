import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { createPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json({ ok: false, error: { message: 'Not authenticated' } }, { status: 401 })
    }

    const { hashToken } = await import('@/lib/db')
    const tokenHash = await hashToken(sessionToken)

    const session = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > datetime(\'now\')',
      [tokenHash]
    )
    if (!session) {
      return NextResponse.json({ ok: false, error: { message: 'Session expired' } }, { status: 401 })
    }

    const user = await queryOne<{ stripe_customer_id: string | null }>(
      'SELECT stripe_customer_id FROM users WHERE id = ?',
      [session.user_id]
    )

    if (!user?.stripe_customer_id) {
      return NextResponse.json({ ok: false, error: { message: 'No subscription found' } }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'https://lanternell.com'
    const portalUrl = await createPortalSession(user.stripe_customer_id, `${baseUrl}/account/library`)

    if (!portalUrl) {
      return NextResponse.json({ ok: false, error: { message: 'Failed to create portal session' } }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: { portalUrl } })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json({ ok: false, error: { message: 'Internal error' } }, { status: 500 })
  }
}
