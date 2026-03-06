import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/content/review - List packs for review
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'review';

    const packs = await query(
      `SELECT * FROM packs_json WHERE status = ? ORDER BY COALESCE(created_at, updated_at) DESC`,
      [status]
    );

    return NextResponse.json({
      ok: true,
      data: { packs },
      error: null
    });

  } catch (error) {
    console.error('Get review packs error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to get packs' }
    }, { status: 500 });
  }
}
