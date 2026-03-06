import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/account/me - Get current user info
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

    return NextResponse.json({
      ok: true,
      data: {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
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
