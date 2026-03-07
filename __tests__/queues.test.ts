import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the cloudflare context
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: vi.fn(async () => null),
}))

import { enqueueEmail, enqueueContent, enqueueRender } from '@/lib/queues'

beforeEach(() => { vi.clearAllMocks() })

describe('Queue Producers (no queue available)', () => {
  it('enqueueEmail returns false when queue unavailable', async () => {
    const result = await enqueueEmail({ type: 'order_confirmation', to: 'test@example.com', data: { productName: 'Test', amountFormatted: '$5', libraryUrl: '/library' } })
    expect(result).toBe(false)
  })

  it('enqueueContent returns false when queue unavailable', async () => {
    const result = await enqueueContent({ type: 'content_generate', jobId: 'j1', topic: 'Colors', packType: 'vocabulary_pack', languagePair: 'en-es', ageBand: 'K-2' })
    expect(result).toBe(false)
  })

  it('enqueueRender returns false when queue unavailable', async () => {
    const result = await enqueueRender({ type: 'render_pack', packId: 'p1', renderTargets: ['final_pdf'] })
    expect(result).toBe(false)
  })
})
