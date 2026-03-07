import { describe, it, expect } from 'vitest'
import { generateId, addMinutes, addDays, isExpired, toISOString, hashToken } from '@/lib/db'

describe('generateId', () => {
  it('generates ID with correct prefix', () => {
    const id = generateId('usr')
    expect(id).toMatch(/^usr_/)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId('t')))
    expect(ids.size).toBe(100)
  })
})

describe('addMinutes', () => {
  it('adds minutes correctly', () => {
    const base = new Date('2026-01-01T00:00:00Z')
    const result = addMinutes(base, 20)
    expect(result.getTime() - base.getTime()).toBe(20 * 60 * 1000)
  })
})

describe('addDays', () => {
  it('adds days correctly', () => {
    const base = new Date('2026-01-01T00:00:00Z')
    const result = addDays(base, 30)
    expect(result.getTime() - base.getTime()).toBe(30 * 24 * 60 * 60 * 1000)
  })
})

describe('isExpired', () => {
  it('returns true for past date', () => {
    expect(isExpired(new Date('2020-01-01'))).toBe(true)
  })

  it('returns false for future date', () => {
    expect(isExpired(new Date('2099-01-01'))).toBe(false)
  })
})

describe('toISOString', () => {
  it('returns ISO string', () => {
    const date = new Date('2026-03-07T12:00:00Z')
    expect(toISOString(date)).toBe('2026-03-07T12:00:00.000Z')
  })
})

describe('hashToken', () => {
  it('returns consistent hash for same input', async () => {
    const hash1 = await hashToken('test-token')
    const hash2 = await hashToken('test-token')
    expect(hash1).toBe(hash2)
  })

  it('returns different hash for different input', async () => {
    const hash1 = await hashToken('token-a')
    const hash2 = await hashToken('token-b')
    expect(hash1).not.toBe(hash2)
  })

  it('returns hex string', async () => {
    const hash = await hashToken('test')
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })
})
