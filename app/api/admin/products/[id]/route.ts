import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, toISOString } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/products/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { id } = await params;
    const product = await queryOne('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) return NextResponse.json({ ok: false, data: null, error: { code: 'NOT_FOUND', message: 'Product not found' } }, { status: 404 });

    return NextResponse.json({ ok: true, data: { product }, error: null });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}

// PUT /api/admin/products/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { name, description, priceCents, active, stripePriceId, stripeProductId, priceTier } = body;

    const sets: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) { sets.push('name = ?'); values.push(name); }
    if (description !== undefined) { sets.push('description = ?'); values.push(description); }
    if (priceCents !== undefined) { sets.push('price_cents = ?'); values.push(priceCents); }
    if (active !== undefined) { sets.push('active = ?'); values.push(active ? 1 : 0); }
    if (stripePriceId !== undefined) { sets.push('stripe_price_id = ?'); values.push(stripePriceId); }
    if (stripeProductId !== undefined) { sets.push('stripe_product_id = ?'); values.push(stripeProductId); }
    if (priceTier !== undefined) { sets.push('price_tier = ?'); values.push(priceTier || null); }

    if (sets.length === 0) {
      return NextResponse.json({ ok: false, data: null, error: { code: 'NO_CHANGES', message: 'Nothing to update' } }, { status: 400 });
    }

    sets.push('updated_at = ?');
    values.push(toISOString(new Date()));
    values.push(id);

    await execute(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ ok: true, data: { updated: true }, error: null });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { id } = await params;
    await execute('DELETE FROM product_resources WHERE product_id = ?', [id]);
    await execute('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ ok: true, data: { deleted: true }, error: null });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}
