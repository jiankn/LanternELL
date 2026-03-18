import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, generateId, generateSessionToken, hashToken, toISOString, addDays } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: { code: 'MISSING_FIELDS', message: 'Email and password are required.' } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters.' } },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const limit = await checkRateLimit(`register-ip:${ip}`, 5, 900);
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later.' } },
        { status: 429 }
      );
    }

    // Check existing user
    const existing = await queryOne<{ id: string; password_hash: string | null }>(
      'SELECT id, password_hash FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existing && existing.password_hash) {
      return NextResponse.json(
        { ok: false, error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists. Please sign in.' } },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    let userId: string;
    if (existing) {
      // User exists (e.g. from Google OAuth or old magic link) but no password — set password
      await execute('UPDATE users SET password_hash = ?, name = COALESCE(NULLIF(name, \'\'), ?), updated_at = ? WHERE id = ?', [
        passwordHash,
        name || null,
        toISOString(new Date()),
        existing.id,
      ]);
      userId = existing.id;
    } else {
      userId = generateId('usr');
      await execute(
        'INSERT INTO users (id, email, name, role, password_hash) VALUES (?, ?, ?, ?, ?)',
        [userId, email.toLowerCase(), name || null, 'customer', passwordHash]
      );
    }

    // Create session
    const sessionToken = generateSessionToken();
    const sessionTokenHash = await hashToken(sessionToken);
    const expiresAt = addDays(new Date(), 30);
    const sessionId = generateId('ses');

    await execute(
      'INSERT INTO sessions (id, user_id, session_token_hash, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, userId, sessionTokenHash, toISOString(expiresAt)]
    );

    const response = NextResponse.json({ ok: true, data: { user: { id: userId, email: email.toLowerCase() } } });
    response.cookies.set('__session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[auth:register] Error:', err);
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
