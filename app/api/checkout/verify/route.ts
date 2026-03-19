import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/checkout/verify?session_id=xxx
// Polls order status to know when webhook has processed
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({
      ok: false,
      error: { code: 'MISSING_SESSION', message: 'session_id is required' },
    }, { status: 400 });
  }

  const order = await queryOne<{
    id: string;
    status: string;
    order_type: string;
    customer_email: string | null;
    product_name: string | null;
  }>(
    `SELECT o.id, o.status, o.order_type, o.customer_email,
            (SELECT p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = o.id LIMIT 1) AS product_name
     FROM orders o
     WHERE o.stripe_checkout_session_id = ?
     LIMIT 1`,
    [sessionId]
  );

  if (!order) {
    return NextResponse.json({
      ok: true,
      data: { status: 'not_found', ready: false },
    });
  }

  const ready = order.status === 'paid' || order.status === 'fulfilled';

  return NextResponse.json({
    ok: true,
    data: {
      status: order.status,
      ready,
      productName: order.product_name,
    },
  });
}
