import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: unknown[] = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (active !== null) {
      sql += ' AND active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY created_at DESC';

    const products = await query(sql, params);

    // Get resources for each product
    const productsWithResources = await Promise.all(
      products.map(async (product: any) => {
        const resources = await query(
          'SELECT r.* FROM resources r JOIN product_resources pr ON r.id = pr.resource_id WHERE pr.product_id = ?',
          [product.id]
        );
        return {
          ...product,
          resources,
          price_formatted: `$${(product.price_cents / 100).toFixed(2)}`
        };
      })
    );

    return NextResponse.json({
      ok: true,
      data: { products: productsWithResources },
      error: null
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to get products' }
    }, { status: 500 });
  }
}
