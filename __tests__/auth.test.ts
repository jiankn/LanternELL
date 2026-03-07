import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock db module
vi.mock('@/lib/db', () => ({
  hashToken: vi.fn(async (token: string) => `hashed_${token}`),
  queryOne: vi.fn(),
  toISOString: vi.fn((d: Date) => d.toISOString()),
}))

import { getCurrentSession, getCurrentUser, requireAdmin } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { NextRequest } from 'next/server'

const mockQueryOne = vi.mocked(queryOne)

function makeRequest(sessionToken?: string): NextRequest {
  const url = 'http://localhost:3000/api/test'
  const req = new NextRequest(url)
  if (sessionToken) {
    // Manually set cookie header
    return new NextRequest(url, {
      headers: { cookie: `__session=${sessionToken}` },
    })
  }
  return req
}

beforeEach(() => { vi.clearAllMocks() })

describe('getCurrentSession', () => {
  it('returns null when no session cookie', async () => {
    const req = makeRequest()
    const session = await getCurrentSession(req)
    expect(session).toBeNull()
  })

  it('returns session when valid token exists', async () => {
    const mockSession = { id: 's_1', user_id: 'usr_1', expires_at: '2099-01-01T00:00:00Z', revoked_at: null }
    mockQueryOne.mockResolvedValueOnce(mockSession)

    const req = makeRequest('valid-token')
    const session = await getCurrentSession(req)
    expect(session).toEqual(mockSession)
    expect(mockQueryOne).toHaveBeenCalledOnce()
  })

  it('returns null when session not found in DB', async () => {
    mockQueryOne.mockResolvedValueOnce(null)
    const req = makeRequest('expired-token')
    const session = await getCurrentSession(req)
    expect(session).toBeNull()
  })
})

describe('getCurrentUser', () => {
  it('returns null when no session', async () => {
    const req = makeRequest()
    const user = await getCurrentUser(req)
    expect(user).toBeNull()
  })

  it('returns user when session is valid', async () => {
    const mockSession = { id: 's_1', user_id: 'usr_1', expires_at: '2099-01-01T00:00:00Z', revoked_at: null }
    const mockUser = { id: 'usr_1', email: 'test@example.com', name: 'Test', role: 'customer', stripe_customer_id: null }
    mockQueryOne.mockResolvedValueOnce(mockSession).mockResolvedValueOnce(mockUser)

    const req = makeRequest('valid-token')
    const user = await getCurrentUser(req)
    expect(user).toEqual(mockUser)
  })
})

describe('requireAdmin', () => {
  it('returns null for non-admin user', async () => {
    const mockSession = { id: 's_1', user_id: 'usr_1', expires_at: '2099-01-01T00:00:00Z', revoked_at: null }
    const mockUser = { id: 'usr_1', email: 'test@example.com', name: 'Test', role: 'customer', stripe_customer_id: null }
    mockQueryOne.mockResolvedValueOnce(mockSession).mockResolvedValueOnce(mockUser)

    const req = makeRequest('valid-token')
    const admin = await requireAdmin(req)
    expect(admin).toBeNull()
  })

  it('returns user for admin', async () => {
    const mockSession = { id: 's_1', user_id: 'usr_1', expires_at: '2099-01-01T00:00:00Z', revoked_at: null }
    const mockUser = { id: 'usr_1', email: 'admin@example.com', name: 'Admin', role: 'admin', stripe_customer_id: null }
    mockQueryOne.mockResolvedValueOnce(mockSession).mockResolvedValueOnce(mockUser)

    const req = makeRequest('valid-token')
    const admin = await requireAdmin(req)
    expect(admin).toEqual(mockUser)
  })
})
