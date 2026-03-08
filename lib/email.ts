// Email service using Resend API (fetch-based, no SDK needed for CF Workers)

const RESEND_API_URL = 'https://api.resend.com/emails'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

interface SendEmailResult {
  ok: boolean
  id?: string
  error?: string
}

async function getResendApiKey(): Promise<string | null> {
  // Try process.env first (for local dev)
  if (process.env.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY
  }
  // Try Cloudflare context (for production)
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const context = await getCloudflareContext()
    const env = (context?.env || {}) as Record<string, any>
    return env.RESEND_API_KEY || null
  } catch {
    return null
  }
}

async function getFromAddress(): Promise<string> {
  if (process.env.EMAIL_FROM) {
    return process.env.EMAIL_FROM
  }
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const context = await getCloudflareContext()
    const env = (context?.env || {}) as Record<string, any>
    return env.EMAIL_FROM || 'LanternELL <noreply@lanternell.com>'
  } catch {
    return 'LanternELL <noreply@lanternell.com>'
  }
}

export async function isEmailConfigured(): Promise<boolean> {
  const key = await getResendApiKey()
  return !!key
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = await getResendApiKey()

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not configured, logging email instead')
    console.log(`[email] To: ${params.to} | Subject: ${params.subject}`)
    return { ok: true, id: 'dev-' + Date.now() }
  }

  const maxRetries = 3
  let lastError = ''
  const fromAddress = await getFromAddress()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: params.from || fromAddress,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          reply_to: params.replyTo,
        }),
      })

      if (res.ok) {
        const data = await res.json() as { id: string }
        return { ok: true, id: data.id }
      }

      lastError = `Resend API error: ${res.status}`
      const errBody = await res.text()
      console.error(`[email] Attempt ${attempt}/${maxRetries} failed:`, res.status, errBody)

      // Don't retry on 4xx client errors (except 429 rate limit)
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        return { ok: false, error: lastError }
      }
    } catch (error) {
      lastError = 'Email send failed'
      console.error(`[email] Attempt ${attempt}/${maxRetries} exception:`, error)
    }

    // Wait before retry: 500ms, 1500ms
    if (attempt < maxRetries) {
      await new Promise(r => setTimeout(r, attempt * 500))
    }
  }

  return { ok: false, error: lastError }
}

// ============================================
// Email Templates
// ============================================

export function magicLinkEmail(magicLink: string): { subject: string; html: string } {
  return {
    subject: 'Sign in to LanternELL',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:20px;padding:40px;border:2px solid rgba(255,255,255,0.6);box-shadow:4px 4px 8px rgba(163,177,198,0.4),-4px -4px 8px rgba(255,255,255,0.6);">
    <div style="text-align:center;margin-bottom:24px;">
      <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'}/images/logo.webp" alt="LanternELL Logo" width="64" height="64" style="display:inline-block;border-radius:12px;">
    </div>
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#1E1B4B;text-align:center;margin:0 0 8px;">Sign in to LanternELL</h1>
    <p style="color:#6366F1;text-align:center;margin:0 0 24px;font-size:14px;">Click the button below to sign in. No password needed.</p>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${magicLink}" style="display:inline-block;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;">Sign In</a>
    </div>
    <p style="color:#6366F1;text-align:center;font-size:12px;margin:0;">This link expires in 20 minutes. If you didn't request this, you can safely ignore it.</p>
  </div>
</body>
</html>`,
  }
}

export function orderConfirmationEmail(params: {
  productName: string
  amountFormatted: string
  libraryUrl: string
}): { subject: string; html: string } {
  return {
    subject: `Order Confirmed: ${params.productName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:20px;padding:40px;border:2px solid rgba(255,255,255,0.6);box-shadow:4px 4px 8px rgba(163,177,198,0.4),-4px -4px 8px rgba(255,255,255,0.6);">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#10B981,#059669);border-radius:50%;line-height:48px;color:#fff;font-size:24px;">✓</div>
    </div>
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#1E1B4B;text-align:center;margin:0 0 8px;">Thank You!</h1>
    <p style="color:#1E1B4B;text-align:center;margin:0 0 24px;">Your purchase of <strong>${params.productName}</strong> (${params.amountFormatted}) was successful.</p>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${params.libraryUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#4545d4);color:#fff;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;">Go to My Downloads</a>
    </div>
    <p style="color:#6366F1;text-align:center;font-size:12px;margin:0;">Your resources are ready to download from your library.</p>
  </div>
</body>
</html>`,
  }
}

export function downloadReadyEmail(params: {
  resourceTitle: string
  downloadUrl: string
}): { subject: string; html: string } {
  return {
    subject: `Your download is ready: ${params.resourceTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:20px;padding:40px;border:2px solid rgba(255,255,255,0.6);box-shadow:4px 4px 8px rgba(163,177,198,0.4),-4px -4px 8px rgba(255,255,255,0.6);">
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#1E1B4B;text-align:center;margin:0 0 8px;">Download Ready</h1>
    <p style="color:#1E1B4B;text-align:center;margin:0 0 24px;"><strong>${params.resourceTitle}</strong> is ready to download.</p>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${params.downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;">Download Now</a>
    </div>
    <p style="color:#6366F1;text-align:center;font-size:12px;margin:0;">You can also access all your downloads from your <a href="https://lanternell.com/account/library" style="color:#4F46E5;">library</a>.</p>
  </div>
</body>
</html>`,
  }
}
