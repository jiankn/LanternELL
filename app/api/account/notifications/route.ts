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

interface DownloadRow {
    resource_title: string;
    created_at: string;
}

interface SubscriptionRow {
    status: string;
    created_at: string;
    product_name: string | null;
}

interface ActivityItem {
    id: string;
    type: 'order' | 'download' | 'subscription' | 'system';
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

// GET /api/account/notifications — aggregate activity from real data
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const activities: ActivityItem[] = [];

        // 1. Recent orders (paid/fulfilled)
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
            activities.push({
                id: `order-${order.created_at}`,
                type: 'order',
                title: 'Purchase Completed',
                message: `${productName} — ${amount}`,
                createdAt: order.created_at,
                actionUrl: '/account/orders',
                actionLabel: 'View Orders',
            });
        }

        // 2. Recent downloads
        const downloads = await query<DownloadRow>(
            `SELECT r.title AS resource_title, d.created_at
       FROM downloads d
       JOIN resources r ON r.id = d.resource_id
       WHERE d.user_id = ?
       ORDER BY d.created_at DESC
       LIMIT 15`,
            [user.id]
        );

        for (const dl of downloads) {
            activities.push({
                id: `download-${dl.created_at}-${dl.resource_title}`,
                type: 'download',
                title: 'Downloaded',
                message: dl.resource_title,
                createdAt: dl.created_at,
                actionUrl: '/account/library',
                actionLabel: 'View Library',
            });
        }

        // 3. Subscription events
        const subscriptions = await query<SubscriptionRow>(
            `SELECT s.status, s.created_at,
          (SELECT p.name FROM products p WHERE p.id = s.product_id LIMIT 1) AS product_name
       FROM subscriptions s
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC
       LIMIT 5`,
            [user.id]
        );

        for (const sub of subscriptions) {
            const planName = sub.product_name || 'All Access';
            const statusLabels: Record<string, string> = {
                active: 'Subscription Started',
                canceled: 'Subscription Canceled',
                past_due: 'Payment Past Due',
                expired: 'Subscription Expired',
            };
            activities.push({
                id: `sub-${sub.created_at}`,
                type: 'subscription',
                title: statusLabels[sub.status] || 'Subscription Update',
                message: planName,
                createdAt: sub.created_at,
                actionUrl: '/pricing',
                actionLabel: 'View Plans',
            });
        }

        // Sort by date, newest first
        activities.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({
            ok: true,
            data: { notifications: activities },
            error: null,
        });
    } catch (error) {
        console.error('Get activity error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to get activity' } },
            { status: 500 }
        );
    }
}
