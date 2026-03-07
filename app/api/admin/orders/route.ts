import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `SELECT o.*, u.email as user_email FROM orders o LEFT JOIN users u ON u.id = o.user_id`;
    const params: unknown[] = [];

    if (status) {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const orders = await query(sql, params);

    return NextResponse.json({ ok: true, data: { orders }, error: null });
  } catch (error) {
    console.error('List orders error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to list orders' } }, { status: 500 });
  }
}
