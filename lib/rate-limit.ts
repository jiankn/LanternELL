// Simple in-memory rate limiter for Cloudflare Workers
// Uses D1 for distributed rate limiting across isolates

import { execute, query } from './db';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check rate limit using D1 as distributed store.
 * Falls back to always-allow if DB is unavailable.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);
    const resetAt = new Date(now.getTime() + windowSeconds * 1000);

    // Count recent requests
    const rows = await query<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM rate_limits WHERE key = ? AND created_at > ?`,
      [key, windowStart.toISOString()]
    );
    const count = rows[0]?.cnt ?? 0;

    if (count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt };
    }

    // Record this request
    await execute(
      `INSERT INTO rate_limits (key, created_at) VALUES (?, ?)`,
      [key, now.toISOString()]
    );

    // Cleanup old entries (async, don't await)
    execute(
      `DELETE FROM rate_limits WHERE created_at < ?`,
      [windowStart.toISOString()]
    ).catch(() => {});

    return { allowed: true, remaining: maxRequests - count - 1, resetAt };
  } catch {
    // If rate limiting fails, allow the request
    return { allowed: true, remaining: maxRequests, resetAt: new Date() };
  }
}
