import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface OrderRow {
    product_name: string | null;
    amount_total_cents: number;
    currency: string;
    status: string;
    created_at: string;
}

interface EntitlementRow {
    resource_title: string;
    created_at: string;
}

interface NotificationItem {
    id: string;
    type: 'order' | 'resource' | 'system';
    title: string;
    message: string;
    createdAt: string;
    actionUrl?: string;
    actionLabel?: string;
}

function formatCurrency(cents: number, currency: string): string {
    const amount = cents / 100;
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
    } catch {
        return `$${amount.toFixed(2)}`;
    }
}

// GET /api/account/notifications — aggregate notifications from real data
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const notifications: NotificationItem[] = [];

        // 1. Recent orders (last 90 days)
        const orders = await query<OrderRow>(
            `SELECT
          (SELECT p.name FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = o.id LIMIT 1) AS product_name,
          o.amount_total_cents, o.currency, o.status, o.created_at
       FROM orders o
       WHERE o.user_id = ? AND o.status IN ('paid', 'fulfilled')
       ORDER BY o.created_at DESC
       LIMIT 10`,
            [user.id]
        );

        for (const order of orders) {
            const productName = order.product_name || 'Teaching Pack';
            const amount = formatCurrency(order.amount_total_cents, order.currency);
            notifications.push({
                id: `order-${order.created_at}`,
                type: 'order',
                title: 'Order Confirmed',
                message: `Your purchase of ${productName} (${amount}) was successful.`,
                createdAt: order.created_at,
                actionUrl: '/account/orders',
                actionLabel: 'View Orders',
            });
        }

        // 2. New resources available (from entitlements, last 90 days)
        const entitlements = await query<EntitlementRow>(
            `SELECT r.title AS resource_title, e.created_at
       FROM entitlements e
       JOIN resources r ON r.id = e.resource_id
       WHERE e.user_id = ? AND e.status = 'active'
       ORDER BY e.created_at DESC
       LIMIT 10`,
            [user.id]
        );

        for (const ent of entitlements) {
            notifications.push({
                id: `resource-${ent.created_at}-${ent.resource_title}`,
                type: 'resource',
                title: 'Resource Available',
                message: `${ent.resource_title} is ready to download from your library.`,
                createdAt: ent.created_at,
                actionUrl: '/account/library',
                actionLabel: 'View Library',
            });
        }

        // 3. Welcome message (based on account creation)
        notifications.push({
            id: 'welcome',
            type: 'system',
            title: 'Welcome to LanternELL!',
            message: 'Your account is set up. Browse our teaching packs to find resources for your classroom.',
            createdAt: new Date().toISOString(),
            actionUrl: '/shop',
            actionLabel: 'Browse Shop',
        });

        // Sort by date, newest first
        notifications.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({
            ok: true,
            data: { notifications },
            error: null,
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to get notifications' } },
            { status: 500 }
        );
    }
}
