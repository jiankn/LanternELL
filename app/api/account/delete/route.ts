import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { execute, toISOString } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/account/delete — permanently delete user account
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { confirmEmail } = body;

        // Verify email confirmation matches
        if (!confirmEmail || confirmEmail.toLowerCase() !== user.email.toLowerCase()) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'CONFIRMATION_FAILED', message: 'Email confirmation does not match' } },
                { status: 400 }
            );
        }

        // Cancel Stripe subscription if active
        if (user.stripe_customer_id) {
            try {
                const { cancelAllSubscriptions } = await import('@/lib/stripe');
                await cancelAllSubscriptions(user.stripe_customer_id);
            } catch (stripeError) {
                console.error('[account-delete] Failed to cancel Stripe subscriptions:', stripeError);
                // Continue with deletion even if Stripe fails
            }
        }

        // Delete user data (ON DELETE CASCADE handles most related tables)
        // Explicitly delete in case CASCADE is not set on all tables
        const userId = user.id;

        await execute('DELETE FROM favorites WHERE user_id = ?', [userId]);
        await execute('DELETE FROM user_preferences WHERE user_id = ?', [userId]);
        await execute('DELETE FROM download_tokens WHERE user_id = ?', [userId]);
        await execute('DELETE FROM downloads WHERE user_id = ?', [userId]);
        await execute('DELETE FROM entitlements WHERE user_id = ?', [userId]);
        await execute('DELETE FROM sessions WHERE user_id = ?', [userId]);

        // Finally delete the user record
        await execute('DELETE FROM users WHERE id = ?', [userId]);

        console.log(`[account-delete] User ${userId} (${user.email}) account deleted successfully`);

        // Clear session cookie
        const response = NextResponse.json({
            ok: true,
            data: { deleted: true },
            error: null,
        });

        response.cookies.set('__session', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to delete account' } },
            { status: 500 }
        );
    }
}
