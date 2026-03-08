import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createPortalSession } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    if (!user.stripe_customer_id) {
      return NextResponse.json(
        { ok: false, data: null, error: { code: 'NO_SUBSCRIPTION', message: 'No subscription found' } },
        { status: 400 }
      )
    }

    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || ''
    if (!baseUrl) {
      try {
        const { getCloudflareContext } = await import('@opennextjs/cloudflare')
        const context = await getCloudflareContext()
        const env = (context?.env || {}) as Record<string, any>
        baseUrl = env.NEXT_PUBLIC_SITE_URL || env.APP_URL || 'https://lanternell.com'
      } catch {
        baseUrl = 'https://lanternell.com'
      }
    }

    const portalUrl = await createPortalSession(user.stripe_customer_id, `${baseUrl}/account`)

    if (!portalUrl) {
      return NextResponse.json(
        { ok: false, data: null, error: { code: 'PORTAL_ERROR', message: 'Failed to create portal session' } },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, data: { portalUrl }, error: null })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Internal error' } },
      { status: 500 }
    )
  }
}
