import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { queryOne, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

    const [productsCount, ordersCount, usersCount, resourcesCount, recentOrders] = await Promise.all([
      queryOne<{ count: number }>('SELECT COUNT(*) as count FROM products WHERE active = 1'),
      queryOne<{ count: number }>('SELECT COUNT(*) as count FROM orders'),
      queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users'),
      queryOne<{ count: number }>('SELECT COUNT(*) as count FROM resources'),
      query<{
        id: string
        customer_email: string
        amount_total_cents: number
        status: string
        created_at: string
      }>('SELECT id, customer_email, amount_total_cents, status, created_at FROM orders ORDER BY created_at DESC LIMIT 10'),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        totalProducts: productsCount?.count || 0,
        totalOrders: ordersCount?.count || 0,
        totalUsers: usersCount?.count || 0,
        totalResources: resourcesCount?.count || 0,
        recentOrders: recentOrders || [],
      },
      error: null,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch dashboard stats' }
    }, { status: 500 });
  }
}
