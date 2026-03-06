import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/products/[slug] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await queryOne<{
      id: string;
      slug: string;
      name: string;
      description: string;
      type: string;
      price_cents: number;
    }>(
      'SELECT * FROM products WHERE slug = ? AND active = 1',
      [slug]
    );

    if (!product) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Product not found' }
      }, { status: 404 });
    }

    // Get associated resources
    const resources = await query(
      `SELECT r.* FROM resources r
       JOIN product_resources pr ON r.id = pr.resource_id
       WHERE pr.product_id = ?`,
      [product.id]
    );

    return NextResponse.json({
      ok: true,
      data: {
        product: {
          ...product,
          resources,
          price_formatted: `$${(product.price_cents / 100).toFixed(2)}`
        }
      },
      error: null
    });

  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to get product' }
    }, { status: 500 });
  }
}
