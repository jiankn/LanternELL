import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/checkout/session - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

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
      type: string;
      price_cents: number;
      stripe_price_id: string | null;
      stripe_product_id: string | null;
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

    // In production, create Stripe checkout session
    // For now, simulate with a mock response
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const mockSessionId = `cs_test_${crypto.randomUUID()}`;

    // Create order record
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
        user?.email || ''
      ]
    );

    // Mock checkout URL (in production, this would be Stripe's URL)
    const checkoutUrl = `${baseUrl}/shop/${product.slug}/checkout?session=${mockSessionId}`;

    return NextResponse.json({
      ok: true,
      data: {
        checkoutUrl,
        sessionId: mockSessionId,
        amount: product.price_cents,
        currency: 'usd'
      },
      error: null
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
