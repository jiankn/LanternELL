import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/products - Get all products with search/filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');
    const search = searchParams.get('q');
    const packType = searchParams.get('pack_type');
    const grade = searchParams.get('grade');
    const language = searchParams.get('language');

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

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
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
          price_formatted: `${(product.price_cents / 100).toFixed(2)}`
        };
      })
    );

    // Post-filter by resource attributes
    let filtered = productsWithResources;
    if (packType) {
      filtered = filtered.filter((p: any) =>
        p.resources?.some((r: any) => r.pack_type === packType) || p.type !== 'single'
      );
    }
    if (grade) {
      filtered = filtered.filter((p: any) =>
        p.resources?.some((r: any) => r.age_band?.toLowerCase().includes(grade.toLowerCase())) || p.type !== 'single'
      );
    }
    if (language) {
      filtered = filtered.filter((p: any) =>
        p.resources?.some((r: any) => r.language_pair === language) || p.type !== 'single'
      );
    }

    return NextResponse.json({
      ok: true,
      data: { products: filtered },
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
