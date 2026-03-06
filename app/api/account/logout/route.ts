// Logout endpoint
import { NextRequest, NextResponse } from 'next/server';
import { execute, toISOString } from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/account/logout - Logout and revoke session
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession(request);

    if (session) {
      await execute(
        'UPDATE sessions SET revoked_at = ? WHERE id = ?',
        [toISOString(new Date()), session.id]
      );
    }

    const response = NextResponse.json({
      ok: true,
      data: { loggedOut: true },
      error: null
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
    console.error('Logout error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to logout' }
    }, { status: 500 });
  }
}
