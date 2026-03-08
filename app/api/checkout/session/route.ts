import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe';
import { getStripePriceId, PRICE_TIERS, type PriceTier } from '@/lib/pricing-tiers';

export const dynamic = 'force-dynamic';

// POST /api/checkout/session - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, successPath, cancelPath } = body;

    if (!productId) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'INVALID_PRODUCT', message: 'Product ID is required' }
      }, { status: 400 });
    }

    // Get product info
    const product = await queryOne<{
      id: string;
      slug: string;
      name: string;
      type: 'single' | 'bundle' | 'membership' | 'license';
      price_cents: number;
      stripe_price_id: string | null;
      stripe_product_id: string | null;
      price_tier: PriceTier | null;
    }>(
      'SELECT * FROM products WHERE id = ? AND active = 1',
      [productId]
    );

    if (!product) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Product not found' }
      }, { status: 404 });
    }

    // Get current user (optional - can checkout as guest)
    const user = await getCurrentUser(request);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';

    // ----------------------------
    // Real Stripe Integration
    // ----------------------------
    // Resolve Stripe Price ID: prefer explicit stripe_price_id, then fall back to tier-based lookup
    const resolvedPriceId = product.stripe_price_id
      || (product.price_tier ? getStripePriceId(product.price_tier) : null);

    // Determine product price from tier if available
    const priceCents = product.price_tier && PRICE_TIERS[product.price_tier]
      ? PRICE_TIERS[product.price_tier].priceCents
      : product.price_cents;

    if (isStripeConfigured() && resolvedPriceId) {
      const result = await createCheckoutSession({
        priceId: resolvedPriceId,
        productType: product.type,
        appProductId: product.id,
        appUserId: user?.id || null,
        customerEmail: user?.email || null,
        successUrl: `${baseUrl}${successPath || '/checkout/success'}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}${cancelPath || `/shop/${product.slug}`}`,
      });

      if (!result) {
        return NextResponse.json({
          ok: false,
          data: null,
          error: { code: 'STRIPE_ERROR', message: 'Failed to create checkout session' }
        }, { status: 500 });
      }

      // Create local order record
      const orderId = generateId('ord');
      await execute(
        `INSERT INTO orders (id, user_id, stripe_checkout_session_id, order_type, status, amount_total_cents, customer_email)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          user?.id || null,
          result.sessionId,
          product.type,
          'checkout_created',
          priceCents,
          user?.email || '',
        ]
      );

      return NextResponse.json({
        ok: true,
        data: {
          checkoutUrl: result.url,
          sessionId: result.sessionId,
          amount: priceCents,
          currency: 'usd',
        },
        error: null,
      });
    }

    // ----------------------------
    // Fallback: Mock checkout (dev mode without Stripe keys)
    // ----------------------------
    const mockSessionId = `cs_test_${crypto.randomUUID()}`;

    const orderId = generateId('ord');
    await execute(
      `INSERT INTO orders (id, user_id, stripe_checkout_session_id, order_type, status, amount_total_cents, customer_email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        user?.id || null,
        mockSessionId,
        product.type,
        'checkout_created',
        product.price_cents,
        user?.email || '',
      ]
    );

    const checkoutUrl = `${baseUrl}/checkout/success?session_id=${mockSessionId}`;

    return NextResponse.json({
      ok: true,
      data: {
        checkoutUrl,
        sessionId: mockSessionId,
        amount: product.price_cents,
        currency: 'usd',
        mock: true,
      },
      error: null,
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to create checkout session' }
    }, { status: 500 });
  }
}
