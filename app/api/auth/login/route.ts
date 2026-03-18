import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, generateId, generateSessionToken, hashToken, toISOString, addDays } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: { code: 'MISSING_FIELDS', message: 'Email and password are required.' } },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const limit = await checkRateLimit(`login-ip:${ip}`, 10, 900);
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    const user = await queryOne<{ id: string; email: string; role: string; password_hash: string | null }>(
      'SELECT id, email, role, password_hash FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user || !user.password_hash) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = generateSessionToken();
    const sessionTokenHash = await hashToken(sessionToken);
    const expiresAt = addDays(new Date(), 30);
    const sessionId = generateId('ses');

    await execute(
      'INSERT INTO sessions (id, user_id, session_token_hash, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, user.id, sessionTokenHash, toISOString(expiresAt)]
    );

    const response = NextResponse.json({ ok: true, data: { user: { id: user.id, email: user.email, role: user.role } } });
    response.cookies.set('__session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[auth:login] Error:', err);
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
