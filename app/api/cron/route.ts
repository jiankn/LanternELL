import { NextRequest, NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/cron — triggered by Cloudflare Cron Triggers or manual call
// Handles: cleanup stale data, ping search engines
export async function GET(request: NextRequest) {
  const results: string[] = [];

  try {
    // 1. Cleanup expired rate limit entries (older than 1 hour)
    const rlResult = await execute(
      `DELETE FROM rate_limits WHERE created_at < datetime('now', '-1 hour')`
    );
    results.push(`rate_limits: cleaned ${rlResult.rowsAffected} rows`);

    // 2. Cleanup expired magic links (older than 1 day)
    const mlResult = await execute(
      `DELETE FROM auth_magic_links WHERE expires_at < datetime('now', '-1 day')`
    );
    results.push(`magic_links: cleaned ${mlResult.rowsAffected} rows`);

    // 3. Cleanup old webhook events (older than 30 days)
    const whResult = await execute(
      `DELETE FROM webhook_events WHERE created_at < datetime('now', '-30 days')`
    );
    results.push(`webhook_events: cleaned ${whResult.rowsAffected} rows`);

    // 4. Ping search engines with sitemap (weekly)
    const baseUrl = process.env.APP_URL || 'https://lanternell.com';
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    try {
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      results.push('google sitemap ping: ok');
    } catch {
      results.push('google sitemap ping: failed');
    }

    return NextResponse.json({
      ok: true,
      data: { results, timestamp: new Date().toISOString() },
      error: null,
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'CRON_ERROR', message: 'Cron job failed' },
    }, { status: 500 });
  }
}
