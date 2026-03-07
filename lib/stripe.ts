// ============================================
// Stripe Integration — fetch-based (Cloudflare Workers compatible)
// No Node.js SDK — uses Stripe REST API directly
// ============================================

const STRIPE_API = 'https://api.stripe.com/v1';

function getStripeSecretKey(): string | null {
  return process.env.STRIPE_SECRET_KEY || null;
}

export function isStripeConfigured(): boolean {
  return !!getStripeSecretKey();
}

function stripeHeaders(): Record<string, string> {
  const key = getStripeSecretKey();
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

/** Encode an object as application/x-www-form-urlencoded (Stripe format) */
function encodeForm(data: Record<string, unknown>, prefix = ''): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (typeof value === 'object' && !Array.isArray(value)) {
      parts.push(encodeForm(value as Record<string, unknown>, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object') {
          parts.push(encodeForm(item as Record<string, unknown>, `${fullKey}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.filter(Boolean).join('&');
}

// ============================================
// Checkout Session Creation
// ============================================

export interface CreateCheckoutParams {
  priceId: string;
  productType: 'single' | 'bundle' | 'membership' | 'license';
  appProductId: string;
  appUserId: string | null;
  customerEmail: string | null;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<{ url: string; sessionId: string } | null> {
  if (!isStripeConfigured()) return null;

  const {
    priceId, productType, appProductId, appUserId,
    customerEmail, successUrl, cancelUrl,
  } = params;

  const mode = productType === 'membership' ? 'subscription' : 'payment';

  const body: Record<string, unknown> = {
    mode,
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: 'true',
    'automatic_tax[enabled]': 'true',
    'metadata[app_product_id]': appProductId,
    'metadata[app_product_type]': productType,
    'metadata[app_user_id]': appUserId || '',
    'metadata[app_source]': 'web',
    'metadata[app_env]': process.env.APP_ENV || 'development',
  };

  if (mode === 'payment') {
    body.customer_creation = 'always';
  }
  if (customerEmail) {
    body.customer_email = customerEmail;
  }

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: 'POST',
    headers: stripeHeaders(),
    body: encodeForm(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Stripe checkout error:', err);
    return null;
  }

  const session = await res.json();
  return { url: session.url || '', sessionId: session.id };
}

// ============================================
// Webhook Signature Verification (HMAC-SHA256)
// ============================================

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<Record<string, unknown> | null> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('STRIPE_WEBHOOK_SECRET not configured');
    return null;
  }

  try {
    const pairs = signature.split(',').reduce<Record<string, string>>((acc, part) => {
      const [k, v] = part.split('=');
      acc[k.trim()] = v.trim();
      return acc;
    }, {});

    const timestamp = pairs['t'];
    const sig = pairs['v1'];
    if (!timestamp || !sig) return null;

    // Reject events older than 5 minutes
    const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
    if (Math.abs(age) > 300) return null;

    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
    const expected = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (expected !== sig) return null;

    return JSON.parse(payload);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return null;
  }
}

// ============================================
// Customer Portal
// ============================================

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!isStripeConfigured()) return null;

  const res = await fetch(`${STRIPE_API}/billing_portal/sessions`, {
    method: 'POST',
    headers: stripeHeaders(),
    body: encodeForm({ customer: customerId, return_url: returnUrl }),
  });

  if (!res.ok) {
    console.error('Stripe portal error:', await res.text());
    return null;
  }

  const session = await res.json();
  return session.url;
}
