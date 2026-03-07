// Queue consumer handlers — process messages from Cloudflare Queues
import type { ContentJobMessage, RenderJobMessage, EmailJobMessage, WebhookJobMessage } from './queues';
import { sendEmail, magicLinkEmail, orderConfirmationEmail, downloadReadyEmail } from './email';
import { execute, query, queryOne, generateId } from './db';

// ============================================
// Email Queue Handler
// ============================================

export async function handleEmailJob(message: EmailJobMessage): Promise<void> {
  const { type, to, data } = message;

  let template: { subject: string; html: string };

  switch (type) {
    case 'magic_link':
      template = magicLinkEmail(data.magicLink);
      break;
    case 'order_confirmation':
      template = orderConfirmationEmail({
        productName: data.productName,
        amountFormatted: data.amountFormatted,
        libraryUrl: data.libraryUrl,
      });
      break;
    case 'download_ready':
      template = downloadReadyEmail({
        resourceTitle: data.resourceTitle,
        downloadUrl: data.downloadUrl,
      });
      break;
    default:
      console.error(`[email-queue] Unknown email type: ${type}`);
      return;
  }

  const result = await sendEmail({ to, subject: template.subject, html: template.html });
  if (!result.ok) {
    console.error(`[email-queue] Failed to send ${type} email to ${to}:`, result.error);
    throw new Error(`Email send failed: ${result.error}`);
  }

  console.log(`[email-queue] Sent ${type} email to ${to}, id: ${result.id}`);
}

// ============================================
// Content Queue Handler — batch AI content generation
// ============================================

export async function handleContentJob(message: ContentJobMessage): Promise<void> {
  const { jobId, topic, packType, languagePair, ageBand } = message;
  console.log(`[content-queue] Processing job ${jobId}: ${topic} (${packType}, ${languagePair}, ${ageBand})`);

  try {
    // Call the internal content generation API
    const baseUrl = process.env.APP_URL || 'https://lanternell.com';
    const res = await fetch(`${baseUrl}/api/admin/content/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        packType,
        languagePair,
        ageBand,
        queueJobId: jobId,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[content-queue] Generation failed for job ${jobId}:`, err);
      throw new Error(`Content generation failed: ${res.status}`);
    }

    const data = await res.json();
    console.log(`[content-queue] Job ${jobId} completed, resource: ${data.data?.resourceId || 'unknown'}`);
  } catch (err) {
    console.error(`[content-queue] Job ${jobId} error:`, err);
    throw err; // Re-throw to trigger queue retry
  }
}

// ============================================
// Render Queue Handler — async PDF rendering
// ============================================

export async function handleRenderJob(message: RenderJobMessage): Promise<void> {
  const { packId, resourceId, renderTargets } = message;
  console.log(`[render-queue] Processing render for pack=${packId} resource=${resourceId} targets=${renderTargets.join(',')}`);

  try {
    const baseUrl = process.env.APP_URL || 'https://lanternell.com';
    const res = await fetch(`${baseUrl}/api/admin/render/rebuild`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceId: resourceId || packId,
        targets: renderTargets,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[render-queue] Render failed:`, err);
      throw new Error(`Render failed: ${res.status}`);
    }

    console.log(`[render-queue] Render completed for resource=${resourceId || packId}`);
  } catch (err) {
    console.error(`[render-queue] Render error:`, err);
    throw err;
  }
}

// ============================================
// Webhook Queue Handler — async Stripe event processing
// ============================================

export async function handleWebhookJob(message: WebhookJobMessage): Promise<void> {
  const { eventId, eventType, payload } = message;
  console.log(`[webhook-queue] Processing event ${eventId} (${eventType})`);

  try {
    // Check if already processed (idempotency)
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM webhook_events WHERE event_id = ?`,
      [eventId]
    );

    if (existing) {
      console.log(`[webhook-queue] Event ${eventId} already processed, skipping`);
      return;
    }

    // Record the event
    await execute(
      `INSERT INTO webhook_events (id, event_id, event_type, payload_json, status, processed_at) VALUES (?, ?, ?, ?, 'processed', datetime('now'))`,
      [generateId('whe'), eventId, eventType, payload]
    );

    // Parse and process the event payload
    const event = JSON.parse(payload);
    const object = event.data?.object;

    if (!object) {
      console.warn(`[webhook-queue] No data.object in event ${eventId}`);
      return;
    }

    // Route to appropriate handler based on event type
    switch (eventType) {
      case 'checkout.session.completed':
        await processCheckoutComplete(object);
        break;
      case 'charge.refunded':
        await processRefund(object);
        break;
      case 'customer.subscription.deleted':
        await processSubscriptionCancel(object);
        break;
      default:
        console.log(`[webhook-queue] Event ${eventType} acknowledged (no async handler needed)`);
    }

    console.log(`[webhook-queue] Event ${eventId} processed successfully`);
  } catch (err) {
    console.error(`[webhook-queue] Event ${eventId} error:`, err);
    throw err;
  }
}

// ── Webhook sub-handlers ──

async function processCheckoutComplete(session: any): Promise<void> {
  const orderId = session.metadata?.app_product_id;
  if (!orderId) return;

  // Send order confirmation email if customer email available
  const email = session.customer_details?.email || session.customer_email;
  if (email) {
    const product = await queryOne<{ name: string; price_cents: number }>(
      `SELECT name, price_cents FROM products WHERE id = ?`,
      [session.metadata.app_product_id]
    );
    if (product) {
      const baseUrl = process.env.APP_URL || 'https://lanternell.com';
      await sendEmail({
        to: email,
        ...orderConfirmationEmail({
          productName: product.name,
          amountFormatted: `$${(product.price_cents / 100).toFixed(2)}`,
          libraryUrl: `${baseUrl}/account/library`,
        }),
      });
    }
  }
}

async function processRefund(charge: any): Promise<void> {
  const paymentIntent = charge.payment_intent;
  if (!paymentIntent) return;

  await execute(
    `UPDATE orders SET status = 'refunded' WHERE stripe_payment_intent_id = ?`,
    [paymentIntent]
  );
  console.log(`[webhook-queue] Refund processed for PI ${paymentIntent}`);
}

async function processSubscriptionCancel(subscription: any): Promise<void> {
  const subId = subscription.id;
  await execute(
    `UPDATE subscriptions SET status = 'canceled' WHERE stripe_subscription_id = ?`,
    [subId]
  );
  console.log(`[webhook-queue] Subscription ${subId} canceled`);
}
