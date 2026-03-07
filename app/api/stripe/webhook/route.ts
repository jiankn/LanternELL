import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, generateId, toISOString } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/stripe';
import { enqueueEmail } from '@/lib/queues';
import { sendEmail, orderConfirmationEmail } from '@/lib/email';

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
      case 'invoice.paid': {
        await handleSubscriptionPayment(event.data.object);
        break;
      }
      case 'invoice.payment_failed': {
        await handleSubscriptionPaymentFailed(event.data.object);
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

async function handleCheckoutComplete(session: any) {
  const { id: sessionId, customer_email, customer, metadata } = session;

  // Find or create user
  let userId = null;
  if (customer_email) {
    let user = await queryOne<{ id: string }>(
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

  // Update order
  await execute(
    `UPDATE orders SET user_id = ?, status = ?, updated_at = ? WHERE stripe_checkout_session_id = ?`,
    [userId, 'paid', toISOString(new Date()), sessionId]
  );

  // Get product and create entitlements
  const productId = metadata?.app_product_id;
  if (productId && userId) {
    await createEntitlementsForProduct(userId, productId, 'purchase', sessionId);
  }

  // Send order confirmation email
  if (customer_email && productId) {
    const product = await queryOne<{ name: string; price_cents: number }>(
      'SELECT name, price_cents FROM products WHERE id = ?',
      [productId]
    );
    if (product) {
      const baseUrl = process.env.APP_URL || 'https://lanternell.com';
      const emailData = {
        type: 'order_confirmation' as const,
        to: customer_email.toLowerCase(),
        data: {
          productName: product.name,
          amountFormatted: `$${(product.price_cents / 100).toFixed(2)}`,
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

  // Find user
  const user = await queryOne<{ id: string }>(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customer]
  );

  if (!user) return;

  // Update or create subscription
  const existingSub = await queryOne<{ id: string }>(
    'SELECT id FROM subscriptions WHERE stripe_subscription_id = ?',
    [subscription]
  );

  if (existingSub) {
    await execute(
      `UPDATE subscriptions SET status = 'active', current_period_start = ?, current_period_end = ?, updated_at = ?
       WHERE stripe_subscription_id = ?`,
      [
        toISOString(new Date(invoice.period_start * 1000)),
        toISOString(new Date(invoice.period_end * 1000)),
        toISOString(new Date()),
        subscription
      ]
    );
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

async function handleSubscriptionUpdate(subscription: any) {
  const { id: subId, status, cancel_at_period_end, current_period_end } = subscription;

  let dbStatus = status;
  if (cancel_at_period_end && status === 'active') {
    dbStatus = 'canceled';
  }

  await execute(
    `UPDATE subscriptions SET status = ?, cancel_at_period_end = ?, current_period_end = ?, updated_at = ?
     WHERE stripe_subscription_id = ?`,
    [dbStatus, cancel_at_period_end ? 1 : 0, toISOString(new Date(current_period_end * 1000)), toISOString(new Date()), subId]
  );
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
