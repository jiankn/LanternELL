// Queue consumer handlers — process messages from Cloudflare Queues
import type { ContentJobMessage, RenderJobMessage, EmailJobMessage, WebhookJobMessage } from './queues';
import { sendEmail, magicLinkEmail, orderConfirmationEmail, downloadReadyEmail } from './email';

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
// Content Queue Handler (stub — calls AI generation)
// ============================================

export async function handleContentJob(message: ContentJobMessage): Promise<void> {
  console.log(`[content-queue] Processing content job ${message.jobId}: ${message.topic} (${message.packType})`);
  // The actual AI generation is already implemented in /api/admin/content/generate
  // This handler would be used for batch processing from the queue
  // For now, log and acknowledge
  console.log(`[content-queue] Job ${message.jobId} acknowledged (implement batch processing here)`);
}

// ============================================
// Render Queue Handler (stub — calls pack renderer)
// ============================================

export async function handleRenderJob(message: RenderJobMessage): Promise<void> {
  console.log(`[render-queue] Processing render job for pack=${message.packId} resource=${message.resourceId}`);
  // The actual rendering is already implemented in /api/admin/render/rebuild
  // This handler would be used for async rendering from the queue
  console.log(`[render-queue] Job acknowledged (implement async rendering here)`);
}

// ============================================
// Webhook Queue Handler (stub — processes Stripe events)
// ============================================

export async function handleWebhookJob(message: WebhookJobMessage): Promise<void> {
  console.log(`[webhook-queue] Processing webhook event ${message.eventId} (${message.eventType})`);
  // The actual webhook processing is already in /api/stripe/webhook
  // This handler would be used for async processing after quick ack
  console.log(`[webhook-queue] Event ${message.eventId} acknowledged (implement async processing here)`);
}
