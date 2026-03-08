import { describe, it, expect, vi, beforeEach } from 'vitest'
import { magicLinkEmail, orderConfirmationEmail, downloadReadyEmail, sendEmail, isEmailConfigured } from '@/lib/email'

describe('Email Templates', () => {
  describe('magicLinkEmail', () => {
    it('generates correct subject and contains link', () => {
      const result = magicLinkEmail('https://lanternell.com/auth/verify?token=abc123')
      expect(result.subject).toBe('Sign in to LanternELL')
      expect(result.html).toContain('https://lanternell.com/auth/verify?token=abc123')
      expect(result.html).toContain('Sign In')
      expect(result.html).toContain('20 minutes')
    })
  })

  describe('orderConfirmationEmail', () => {
    it('generates correct subject and contains order details', () => {
      const result = orderConfirmationEmail({
        productName: 'Colors Vocabulary Pack',
        amountFormatted: '$4.99',
        libraryUrl: 'https://lanternell.com/account/library',
      })
      expect(result.subject).toBe('Order Confirmed: Colors Vocabulary Pack')
      expect(result.html).toContain('Colors Vocabulary Pack')
      expect(result.html).toContain('$4.99')
      expect(result.html).toContain('https://lanternell.com/account/library')
    })
  })

  describe('downloadReadyEmail', () => {
    it('generates correct subject and contains download link', () => {
      const result = downloadReadyEmail({
        resourceTitle: 'Classroom Labels EN-ES',
        downloadUrl: 'https://lanternell.com/download/abc',
      })
      expect(result.subject).toBe('Your download is ready: Classroom Labels EN-ES')
      expect(result.html).toContain('Classroom Labels EN-ES')
      expect(result.html).toContain('https://lanternell.com/download/abc')
    })
  })
})

describe('sendEmail', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns error when RESEND_API_KEY is not set', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    const result = await sendEmail({ to: 'test@example.com', subject: 'Test', html: '<p>Hi</p>' })
    expect(result.ok).toBe(false)
    expect(result.error).toBeDefined()

    errorSpy.mockRestore()
  })
})

describe('isEmailConfigured', () => {
  it('returns false when no API key', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    expect(await isEmailConfigured()).toBe(false)
  })
})
