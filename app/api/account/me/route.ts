import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne, query, toISOString } from '@/lib/db';
import { getPriceTierByStripePriceId } from '@/lib/pricing-tiers';

export const dynamic = 'force-dynamic';

interface SubscriptionRow {
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
  price_tier: string | null;
  stripe_price_id: string | null;
}

interface PurchaseCountRow {
  order_type: string;
  count: number;
}

// GET /api/account/me - Get current user info + subscription status + purchase counts
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({
        ok: true,
        data: { authenticated: false },
        error: null
      });
    }

    // Fetch subscription with active access, including cancel-at-period-end cases.
    let subscription = null;
    const nowIso = toISOString(new Date());
    const sub = await queryOne<SubscriptionRow>(
      `SELECT s.status, s.current_period_end, s.cancel_at_period_end, s.stripe_price_id, p.price_tier
       FROM subscriptions s
       LEFT JOIN products p ON p.id = s.product_id
       WHERE s.user_id = ?
         AND (
           s.status IN ('active', 'past_due')
           OR (
             s.status = 'canceled'
             AND s.cancel_at_period_end = 1
             AND s.current_period_end IS NOT NULL
             AND s.current_period_end > ?
           )
         )
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [user.id, nowIso]
    );

    if (sub) {
      const status =
        sub.status === 'canceled' &&
        Boolean(sub.cancel_at_period_end) &&
        !!sub.current_period_end &&
        sub.current_period_end > nowIso
          ? 'active'
          : sub.status;

      subscription = {
        status,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
        priceTier: getPriceTierByStripePriceId(sub.stripe_price_id) ?? sub.price_tier,
      };
    }

    // Count paid orders by type
    const purchaseCounts = await query<PurchaseCountRow>(
      `SELECT order_type, COUNT(*) as count
       FROM orders
       WHERE user_id = ? AND status IN ('paid', 'fulfilled')
       GROUP BY order_type`,
      [user.id]
    );

    const purchases: Record<string, number> = {};
    for (const row of purchaseCounts) {
      purchases[row.order_type] = Number(row.count);
    }

    return NextResponse.json({
      ok: true,
      data: {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription,
          purchases,
        }
      },
      error: null
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to get user info' }
    }, { status: 500 });
  }
}
