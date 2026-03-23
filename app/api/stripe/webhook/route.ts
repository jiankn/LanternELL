import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, generateId, toISOString } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/stripe';
import { enqueueEmail } from '@/lib/queues';
import { sendEmail, orderConfirmationEmail } from '@/lib/email';
import { getStripePriceId, type PriceTier } from '@/lib/pricing-tiers';

export const dynamic = 'force-dynamic';

// Stripe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    let event: any;

    // Attempt Stripe signature verification if configured
    const signature = request.headers.get('stripe-signature');
    if (signature) {
      const verified = await verifyWebhookSignature(body, signature);
      if (!verified) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      event = verified;
    } else {
      // Fallback for dev mode without signatures
      try {
        event = JSON.parse(body);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
    }

    // Check for duplicate event (idempotency)
    const existingEvent = await queryOne<{ id: string }>(
      'SELECT id FROM webhook_events WHERE event_id = ?',
      [event.id]
    );

    if (existingEvent) {
      return NextResponse.json({ received: true, status: 'duplicate' });
    }

    // Log the event
    const eventId = generateId('we');
    await execute(
      `INSERT INTO webhook_events (id, provider, event_id, event_type, payload_json, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [eventId, 'stripe', event.id, event.type, JSON.stringify(event), 'processing']
    );

    // Process the event
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutComplete(event.data.object);
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        await handlePaymentSuccess(event.data.object);
        break;
      }
      case 'checkout.session.async_payment_failed': {
        await handlePaymentFailed(event.data.object);
        break;
      }
      case 'charge.refunded': {
        await handleRefund(event.data.object);
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        await handleSubscriptionPayment(event.data.object);
        break;
      }
      case 'invoice.payment_failed': {
        await handleSubscriptionPaymentFailed(event.data.object);
        break;
      }
      case 'customer.subscription.created': {
        await handleSubscriptionCreated(event.data.object);
        break;
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdate(event.data.object);
        break;
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDelete(event.data.object);
        break;
      }
    }

    // Mark as processed
    await execute(
      'UPDATE webhook_events SET status = ?, processed_at = ? WHERE id = ?',
      ['processed', toISOString(new Date()), eventId]
    );

    return NextResponse.json({ received: true, status: 'processed' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function upsertSubscriptionRecord(params: {
  userId: string;
  productId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string;
  stripePriceId?: string | null;
  status: 'incomplete' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
}) {
  const existingSub = await queryOne<{ id: string }>(
    'SELECT id FROM subscriptions WHERE stripe_subscription_id = ?',
    [params.stripeSubscriptionId]
  );

  if (existingSub) {
    await execute(
      `UPDATE subscriptions
       SET user_id = ?,
           product_id = ?,
           stripe_customer_id = ?,
           stripe_price_id = COALESCE(?, stripe_price_id),
           status = ?,
           current_period_start = COALESCE(?, current_period_start),
           current_period_end = COALESCE(?, current_period_end),
           updated_at = ?
       WHERE stripe_subscription_id = ?`,
      [
        params.userId,
        params.productId,
        params.stripeCustomerId,
        params.stripePriceId || null,
        params.status,
        params.currentPeriodStart || null,
        params.currentPeriodEnd || null,
        toISOString(new Date()),
        params.stripeSubscriptionId,
      ]
    );
    return;
  }

  await execute(
    `INSERT INTO subscriptions (
      id, user_id, product_id, stripe_customer_id, stripe_subscription_id, stripe_price_id,
      status, current_period_start, current_period_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      generateId('sub'),
      params.userId,
      params.productId,
      params.stripeCustomerId,
      params.stripeSubscriptionId,
      params.stripePriceId || null,
      params.status,
      params.currentPeriodStart || null,
      params.currentPeriodEnd || null,
    ]
  );
}

async function getLatestMembershipProductIdForUser(userId: string): Promise<string | null> {
  const recentOrder = await queryOne<{ product_id: string }>(
    `SELECT oi.product_id
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON p.id = oi.product_id
     WHERE o.user_id = ?
       AND p.type = 'membership'
     ORDER BY o.created_at DESC
     LIMIT 1`,
    [userId]
  );

  if (recentOrder?.product_id) {
    return recentOrder.product_id;
  }

  const fallbackMembership = await queryOne<{ id: string }>(
    `SELECT id FROM products WHERE type = 'membership' AND active = 1 ORDER BY created_at DESC LIMIT 1`
  );

  return fallbackMembership?.id || null;
}

async function handleCheckoutComplete(session: any) {
  const { id: sessionId, customer_email, customer, subscription, metadata } = session;

  // Find or create user
  let userId = null;
  if (customer_email) {
    let user = await queryOne<{ id: string }>
(
      'SELECT id FROM users WHERE email = ?',
      [customer_email.toLowerCase()]
    );

    if (!user) {
      userId = generateId('usr');
      await execute(
        'INSERT INTO users (id, email, stripe_customer_id, role) VALUES (?, ?, ?, ?)',
        [userId, customer_email.toLowerCase(), customer, 'customer']
      );
    } else {
      userId = user.id;
      // Update stripe_customer_id if missing
      if (customer) {
        await execute(
          'UPDATE users SET stripe_customer_id = ? WHERE id = ? AND stripe_customer_id IS NULL',
          [customer, userId]
        );
      }
    }
  }

  // Update this order
  await execute(
    `UPDATE orders SET user_id = ?, status = ?, updated_at = ? WHERE stripe_checkout_session_id = ?`,
    [userId, 'paid', toISOString(new Date()), sessionId]
  );

  // Also link all orphaned orders from this customer email
  if (userId && customer_email) {
    await execute(
      `UPDATE orders SET user_id = ?, updated_at = ? WHERE customer_email = ? AND user_id IS NULL`,
      [userId, toISOString(new Date()), customer_email.toLowerCase()]
    );
  }

  // Get product and create entitlements
  const productId = metadata?.app_product_id;
  if (productId && userId) {
    await createEntitlementsForProduct(userId, productId, 'purchase', sessionId);

    if (subscription) {
      const metadataPriceTier = typeof metadata?.app_price_tier === 'string'
        ? metadata.app_price_tier as PriceTier
        : null;
      const stripePriceId = metadataPriceTier ? getStripePriceId(metadataPriceTier) : null;

      await upsertSubscriptionRecord({
        userId,
        productId,
        stripeCustomerId: customer || null,
        stripeSubscriptionId: subscription,
        stripePriceId,
        status: 'active',
      });
    }

    // Ensure order_items exist (in case they were missed during checkout)
    const order = await queryOne<{ id: string; amount_total_cents: number }>(
      'SELECT id, amount_total_cents FROM orders WHERE stripe_checkout_session_id = ?',
      [sessionId]
    );
    if (order) {
      const existingItem = await queryOne<{ id: string }>(
        'SELECT id FROM order_items WHERE order_id = ?',
        [order.id]
      );
      if (!existingItem) {
        const itemId = generateId('oi');
        await execute(
          'INSERT INTO order_items (id, order_id, product_id, quantity, price_cents) VALUES (?, ?, ?, 1, ?)',
          [itemId, order.id, productId, order.amount_total_cents || 0]
        );
      }
    }
  }

  // Send order confirmation email
  if (customer_email && productId) {
    const orderSummary = await queryOne<{ amount_total_cents: number; product_name: string | null }>(
      `SELECT
         o.amount_total_cents,
         (
           SELECT p.name
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = o.id
           LIMIT 1
         ) AS product_name
       FROM orders o
       WHERE o.stripe_checkout_session_id = ?`,
      [sessionId]
    );
    const product = await queryOne<{ name: string; price_cents: number }>(
      'SELECT name, price_cents FROM products WHERE id = ?',
      [productId]
    );

    if (orderSummary || product) {
      const baseUrl = process.env.APP_URL || 'https://lanternell.com';
      const amountCents = orderSummary?.amount_total_cents ?? product?.price_cents ?? 0;
      const productName = orderSummary?.product_name || product?.name || 'LanternELL Order';
      const emailData = {
        type: 'order_confirmation' as const,
        to: customer_email.toLowerCase(),
        data: {
          productName,
          amountFormatted: `$${(amountCents / 100).toFixed(2)}`,
          libraryUrl: `${baseUrl}/account/library`,
        },
      };
      const queued = await enqueueEmail(emailData);
      if (!queued) {
        const tpl = orderConfirmationEmail(emailData.data);
        await sendEmail({ to: emailData.to, subject: tpl.subject, html: tpl.html });
      }
    }
  }
}

async function handlePaymentSuccess(session: any) {
  const { id: sessionId } = session;
  await execute(
    `UPDATE orders SET status = 'paid', updated_at = ? WHERE stripe_checkout_session_id = ?`,
    [toISOString(new Date()), sessionId]
  );
}

async function handlePaymentFailed(session: any) {
  const { id: sessionId } = session;
  await execute(
    `UPDATE orders SET status = 'failed', updated_at = ? WHERE stripe_checkout_session_id = ?`,
    [toISOString(new Date()), sessionId]
  );
}

async function handleRefund(charge: any) {
  const paymentIntentId = charge.payment_intent;
  if (paymentIntentId) {
    const orders = await query<{ id: string }>(
      `SELECT id FROM orders WHERE stripe_payment_intent_id = ?`,
      [paymentIntentId]
    );

    for (const order of orders) {
      await execute(
        `UPDATE orders SET status = 'refunded', updated_at = ? WHERE id = ?`,
        [toISOString(new Date()), order.id]
      );
    }
  }
}

async function handleSubscriptionPayment(invoice: any) {
  const { customer, subscription, lines } = invoice;
  const stripePriceId = lines?.data?.[0]?.price?.id || null;

  // Find user
  const user = await queryOne<{ id: string }>(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customer]
  );

  if (!user) return;

  const productId = await getLatestMembershipProductIdForUser(user.id);

  if (productId) {
    await upsertSubscriptionRecord({
      userId: user.id,
      productId,
      stripeCustomerId: customer || null,
      stripeSubscriptionId: subscription,
      stripePriceId,
      status: 'active',
      currentPeriodStart: toISOString(new Date(invoice.period_start * 1000)),
      currentPeriodEnd: toISOString(new Date(invoice.period_end * 1000)),
    });
  }

  // Create membership entitlement
  const entitlementId = generateId('ent');
  const periodEnd = new Date(invoice.period_end * 1000);

  await execute(
    `INSERT INTO entitlements (id, user_id, source_type, source_id, status, ends_at)
     VALUES (?, ?, 'subscription', ?, 'active', ?)`,
    [entitlementId, user.id, subscription, toISOString(periodEnd)]
  );
}

async function handleSubscriptionPaymentFailed(invoice: any) {
  const { subscription } = invoice;

  await execute(
    `UPDATE subscriptions SET status = 'past_due', updated_at = ? WHERE stripe_subscription_id = ?`,
    [toISOString(new Date()), subscription]
  );
}

async function handleSubscriptionCreated(subscription: any) {
  const { id: subId, customer, status, current_period_start, current_period_end } = subscription;
  const stripePriceId = subscription.items?.data?.[0]?.price?.id || null;

  // Find user by stripe_customer_id
  const user = await queryOne<{ id: string }>(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customer]
  );

  if (!user) return;

  const productId = await getLatestMembershipProductIdForUser(user.id);
  if (!productId) {
    // Fallback: any active membership product
    const membership = await queryOne<{ id: string }>(
      `SELECT id FROM products WHERE type = 'membership' AND active = 1 LIMIT 1`
    );
    if (!membership) return;
    await upsertSubscriptionRecord({
      userId: user.id,
      productId: membership.id,
      stripeCustomerId: customer || null,
      stripeSubscriptionId: subId,
      stripePriceId,
      status: status === 'active' ? 'active' : 'incomplete',
      currentPeriodStart: current_period_start ? toISOString(new Date(current_period_start * 1000)) : null,
      currentPeriodEnd: current_period_end ? toISOString(new Date(current_period_end * 1000)) : null,
    });
    return;
  }

  await upsertSubscriptionRecord({
    userId: user.id,
    productId,
    stripeCustomerId: customer || null,
    stripeSubscriptionId: subId,
    stripePriceId,
    status: status === 'active' ? 'active' : 'incomplete',
    currentPeriodStart: current_period_start ? toISOString(new Date(current_period_start * 1000)) : null,
    currentPeriodEnd: current_period_end ? toISOString(new Date(current_period_end * 1000)) : null,
  });
}

async function handleSubscriptionUpdate(subscription: any) {
  const { id: subId, customer, status, cancel_at_period_end, current_period_start, current_period_end } = subscription;
  const stripePriceId = subscription.items?.data?.[0]?.price?.id || null;

  let dbStatus = status;
  if (cancel_at_period_end && status === 'active') {
    dbStatus = 'canceled';
  }

  // First try to update existing record
  const existingSub = await queryOne<{ id: string }>(
    'SELECT id FROM subscriptions WHERE stripe_subscription_id = ?',
    [subId]
  );

  if (existingSub) {
    await execute(
      `UPDATE subscriptions
       SET status = ?,
           cancel_at_period_end = ?,
           current_period_end = ?,
           stripe_price_id = COALESCE(?, stripe_price_id),
           updated_at = ?
       WHERE stripe_subscription_id = ?`,
      [
        dbStatus,
        cancel_at_period_end ? 1 : 0,
        toISOString(new Date(current_period_end * 1000)),
        stripePriceId,
        toISOString(new Date()),
        subId,
      ]
    );
  } else {
    // If no existing record, create one (handles case where subscription.created was missed)
    const user = await queryOne<{ id: string }>(
      'SELECT id FROM users WHERE stripe_customer_id = ?',
      [customer]
    );
    if (!user) return;

    const productId = await getLatestMembershipProductIdForUser(user.id)
      || (await queryOne<{ id: string }>(`SELECT id FROM products WHERE type = 'membership' AND active = 1 LIMIT 1`))?.id;
    if (!productId) return;

    await upsertSubscriptionRecord({
      userId: user.id,
      productId,
      stripeCustomerId: customer || null,
      stripeSubscriptionId: subId,
      stripePriceId,
      status: dbStatus,
      currentPeriodStart: current_period_start ? toISOString(new Date(current_period_start * 1000)) : null,
      currentPeriodEnd: current_period_end ? toISOString(new Date(current_period_end * 1000)) : null,
    });
  }
}

async function handleSubscriptionDelete(subscription: any) {
  const { id: subId } = subscription;

  await execute(
    `UPDATE subscriptions SET status = 'canceled', canceled_at = ?, updated_at = ? WHERE stripe_subscription_id = ?`,
    [toISOString(new Date()), toISOString(new Date()), subId]
  );
}

async function createEntitlementsForProduct(userId: string, productId: string, sourceType: string, sourceId: string) {
  // Get product type
  const product = await queryOne<{ type: string; id: string }>(
    'SELECT type FROM products WHERE id = ?',
    [productId]
  );

  if (!product) return;

  if (product.type === 'bundle') {
    // Get all resources in the bundle
    const resources = await query<{ resource_id: string }>(
      'SELECT resource_id FROM product_resources WHERE product_id = ?',
      [productId]
    );

    for (const res of resources) {
      const entId = generateId('ent');
      await execute(
        `INSERT INTO entitlements (id, user_id, product_id, resource_id, source_type, source_id, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [entId, userId, productId, res.resource_id, sourceType, sourceId]
      );
    }
  } else if (product.type === 'single') {
    // Get the single resource
    const resource = await queryOne<{ resource_id: string }>(
      'SELECT resource_id FROM product_resources WHERE product_id = ? LIMIT 1',
      [productId]
    );

    if (resource) {
      const entId = generateId('ent');
      await execute(
        `INSERT INTO entitlements (id, user_id, product_id, resource_id, source_type, source_id, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [entId, userId, productId, resource.resource_id, sourceType, sourceId]
      );
    }
  } else if (product.type === 'membership') {
    const entId = generateId('ent');
    await execute(
      `INSERT INTO entitlements (id, user_id, product_id, source_type, source_id, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [entId, userId, productId, sourceType, sourceId]
    );
  }
}
