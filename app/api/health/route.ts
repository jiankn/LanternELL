import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  let dbOk = false;

  try {
    const result = await queryOne<{ v: number }>('SELECT 1 as v');
    dbOk = result?.v === 1;
  } catch { /* db unavailable */ }

  return NextResponse.json({
    ok: true,
    data: {
      status: dbOk ? 'healthy' : 'degraded',
      version: process.env.npm_package_version || '1.0.0',
      db: dbOk ? 'connected' : 'unavailable',
      latencyMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    },
    error: null,
  });
}
