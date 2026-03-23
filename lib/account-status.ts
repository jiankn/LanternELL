import { query, queryOne, toISOString } from '@/lib/db';
import { getPriceTierByStripePriceId } from '@/lib/pricing-tiers';

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

export interface AccountSubscription {
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  priceTier?: string | null;
}

export interface AccountSnapshot {
  subscription: AccountSubscription | null;
  purchases: Record<string, number>;
}

export async function getAccountSnapshot(userId: string): Promise<AccountSnapshot> {
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
    [userId, nowIso]
  );

  let subscription: AccountSubscription | null = null;

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

  const purchaseCounts = await query<PurchaseCountRow>(
    `SELECT order_type, COUNT(*) as count
     FROM orders
     WHERE user_id = ? AND status IN ('paid', 'fulfilled')
     GROUP BY order_type`,
    [userId]
  );

  const purchases: Record<string, number> = {};

  for (const row of purchaseCounts) {
    purchases[row.order_type] = Number(row.count);
  }

  return { subscription, purchases };
}
