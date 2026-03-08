import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface OrderRow {
    id: string
    status: string
    order_type: string
    amount_total_cents: number
    currency: string
    product_name: string | null
    created_at: string
}

// GET /api/account/orders — list current user's orders
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request)
        if (!user) {
            return NextResponse.json(
                {
                    ok: false,
                    data: null,
                    error: { code: 'UNAUTHORIZED', message: 'Please login to view your orders' },
                },
                { status: 401 }
            )
        }

        const rows = await query<OrderRow>(
            `SELECT
          o.id,
          o.status,
          o.order_type,
          o.amount_total_cents,
          o.currency,
          (SELECT p.name FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = o.id
           LIMIT 1) AS product_name,
          o.created_at
       FROM orders o
       WHERE o.user_id = ?
         AND o.status NOT IN ('checkout_created')
       ORDER BY o.created_at DESC
       LIMIT 100`,
            [user.id]
        )

        const orders = rows.map((row) => ({
            id: row.id,
            status: row.status,
            orderType: row.order_type,
            amountTotal: formatCurrency(row.amount_total_cents, row.currency),
            currency: row.currency,
            productName: row.product_name,
            createdAt: row.created_at,
        }))

        return NextResponse.json({ ok: true, data: { orders }, error: null })
    } catch (error) {
        console.error('Get orders error:', error)
        return NextResponse.json(
            {
                ok: false,
                data: null,
                error: { code: 'SERVER_ERROR', message: 'Failed to get orders' },
            },
            { status: 500 }
        )
    }
}

function formatCurrency(cents: number, currency: string): string {
    const amount = cents / 100
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount)
    } catch {
        return `$${amount.toFixed(2)}`
    }
}
