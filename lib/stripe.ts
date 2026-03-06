import Stripe from 'stripe'

// ============================================
// Stripe Client Initialization
// ============================================

let stripeClient: Stripe | null = null

function getStripeSecretKey(): string | null {
    if (typeof process !== 'undefined' && process.env?.STRIPE_SECRET_KEY) {
        return process.env.STRIPE_SECRET_KEY
    }
    return null
}

export function getStripe(): Stripe | null {
    if (stripeClient) return stripeClient

    const secretKey = getStripeSecretKey()
    if (!secretKey) {
        console.warn('STRIPE_SECRET_KEY not configured')
        return null
    }

    stripeClient = new Stripe(secretKey, {
        apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
        typescript: true,
    })

    return stripeClient
}

export function isStripeConfigured(): boolean {
    return !!getStripeSecretKey()
}

// ============================================
// Checkout Session Creation
// ============================================

export interface CreateCheckoutParams {
    priceId: string
    productType: 'single' | 'bundle' | 'membership' | 'license'
    appProductId: string
    appUserId: string | null
    customerEmail: string | null
    successUrl: string
    cancelUrl: string
}

export async function createCheckoutSession(
    params: CreateCheckoutParams
): Promise<{ url: string; sessionId: string } | null> {
    const stripe = getStripe()
    if (!stripe) return null

    const {
        priceId,
        productType,
        appProductId,
        appUserId,
        customerEmail,
        successUrl,
        cancelUrl,
    } = params

    const mode: Stripe.Checkout.SessionCreateParams['mode'] =
        productType === 'membership' ? 'subscription' : 'payment'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        metadata: {
            app_product_id: appProductId,
            app_product_type: productType,
            app_user_id: appUserId || '',
            app_source: 'web',
            app_env: process.env.APP_ENV || 'development',
        },
    }

    // For payment mode, always create a Stripe customer
    if (mode === 'payment') {
        sessionParams.customer_creation = 'always'
    }

    // Pre-fill email if available
    if (customerEmail) {
        sessionParams.customer_email = customerEmail
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return {
        url: session.url || '',
        sessionId: session.id,
    }
}

// ============================================
// Webhook Signature Verification
// ============================================

export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
): Stripe.Event | null {
    const stripe = getStripe()
    if (!stripe) return null

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
        console.warn('STRIPE_WEBHOOK_SECRET not configured')
        return null
    }

    try {
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return null
    }
}

// ============================================
// Customer Portal
// ============================================

export async function createPortalSession(
    customerId: string,
    returnUrl: string
): Promise<string | null> {
    const stripe = getStripe()
    if (!stripe) return null

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    })

    return session.url
}
