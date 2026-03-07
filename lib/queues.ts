// Queue message types and helpers for Cloudflare Queues
import { getCloudflareContext } from '@opennextjs/cloudflare';

// ============================================
// Message Types
// ============================================

export interface ContentJobMessage {
  type: 'content_generate'
  jobId: string
  topic: string
  packType: string
  languagePair: string
  ageBand: string
  options?: Record<string, unknown>
}

export interface RenderJobMessage {
  type: 'render_pack'
  packId?: string
  resourceId?: string
  renderTargets: string[]
}

export interface EmailJobMessage {
  type: 'magic_link' | 'order_confirmation' | 'download_ready'
  to: string
  data: Record<string, string>
}

export interface WebhookJobMessage {
  type: 'stripe_webhook'
  eventId: string
  eventType: string
  payload: string
}

export type QueueMessage = ContentJobMessage | RenderJobMessage | EmailJobMessage | WebhookJobMessage

// ============================================
// Queue Producers
// ============================================

async function getEnv(): Promise<Record<string, any> | null> {
  try {
    const context = await getCloudflareContext();
    return (context?.env || null) as Record<string, any> | null;
  } catch {
    return null;
  }
}

export async function enqueueContent(message: ContentJobMessage): Promise<boolean> {
  const env = await getEnv();
  const queue = env?.CONTENT_QUEUE;
  if (!queue) {
    console.warn('[queue] CONTENT_QUEUE not available, processing synchronously');
    return false;
  }
  await queue.send(message);
  return true;
}

export async function enqueueRender(message: RenderJobMessage): Promise<boolean> {
  const env = await getEnv();
  const queue = env?.RENDER_QUEUE;
  if (!queue) {
    console.warn('[queue] RENDER_QUEUE not available');
    return false;
  }
  await queue.send(message);
  return true;
}

export async function enqueueEmail(message: EmailJobMessage): Promise<boolean> {
  const env = await getEnv();
  const queue = env?.EMAIL_QUEUE;
  if (!queue) {
    console.warn('[queue] EMAIL_QUEUE not available, sending synchronously');
    return false;
  }
  await queue.send(message);
  return true;
}

export async function enqueueWebhook(message: WebhookJobMessage): Promise<boolean> {
  const env = await getEnv();
  const queue = env?.WEBHOOK_QUEUE;
  if (!queue) {
    console.warn('[queue] WEBHOOK_QUEUE not available');
    return false;
  }
  await queue.send(message);
  return true;
}
