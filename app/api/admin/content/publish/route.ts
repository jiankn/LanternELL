import { NextRequest, NextResponse } from 'next/server';
import { execute, toISOString } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/admin/content/publish - Publish or archive a pack
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const body = await request.json();
    const { packId, status } = body;

    if (!packId || !status) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'INVALID_PARAMS', message: 'packId and status are required' }
      }, { status: 400 });
    }

    // Update pack status
    await execute(
      `UPDATE packs_json SET status = ?, updated_at = ? WHERE id = ?`,
      [status, toISOString(new Date()), packId]
    );

    // When publishing, auto-activate the linked product
    if (status === 'published') {
      await execute(
        `UPDATE products SET active = 1 WHERE id IN (
          SELECT pr.product_id FROM product_resources pr
          JOIN packs_json p ON p.resource_id = pr.resource_id
          WHERE p.id = ?
        )`,
        [packId]
      );
    }

    // When archiving, deactivate the linked product
    if (status === 'archived') {
      await execute(
        `UPDATE products SET active = 0 WHERE id IN (
          SELECT pr.product_id FROM product_resources pr
          JOIN packs_json p ON p.resource_id = pr.resource_id
          WHERE p.id = ?
        )`,
        [packId]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { packId, status },
      error: null
    });

  } catch (error) {
    console.error('Publish pack error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to publish pack' }
    }, { status: 500 });
  }
}
