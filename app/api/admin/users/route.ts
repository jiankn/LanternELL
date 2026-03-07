import { NextRequest, NextResponse } from 'next/server';
import { query, execute, toISOString } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const role = searchParams.get('role');

    let sql = `SELECT u.*, (SELECT COUNT(*) FROM entitlements e WHERE e.user_id = u.id AND e.status = 'active') as active_entitlements FROM users u`;
    const params: unknown[] = [];

    if (role) {
      sql += ' WHERE u.role = ?';
      params.push(role);
    }

    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await query(sql, params);

    return NextResponse.json({ ok: true, data: { users }, error: null });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to list users' } }, { status: 500 });
  }
}

// PATCH /api/admin/users?id=xxx&role=admin
export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || !['customer', 'admin'].includes(role)) {
      return NextResponse.json({ ok: false, data: null, error: { code: 'INVALID_PARAMS', message: 'userId and valid role required' } }, { status: 400 });
    }

    await execute('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', [role, toISOString(new Date()), userId]);

    return NextResponse.json({ ok: true, data: { updated: true }, error: null });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}
