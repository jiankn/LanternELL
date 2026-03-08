import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne, toISOString } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface SubscriptionRow {
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
}

// GET /api/account/me - Get current user info + subscription status
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({
        ok: true,
        data: { authenticated: false },
        error: null
      });
    }

    // Fetch active subscription if any
    let subscription = null;
    const sub = await queryOne<SubscriptionRow>(
      `SELECT status, current_period_end, cancel_at_period_end
       FROM subscriptions
       WHERE user_id = ? AND status IN ('active', 'past_due')
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id]
    );

    if (sub) {
      subscription = {
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
      };
    }

    return NextResponse.json({
      ok: true,
      data: {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription,
        }
      },
      error: null
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to get user info' }
    }, { status: 500 });
  }
}
