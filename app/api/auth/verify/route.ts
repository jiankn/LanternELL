import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, generateId, generateSessionToken, hashToken, toISOString, addDays } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Magic link verification and login
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const fallbackRedirect = new URL('/account/library?error=invalid_link', request.url);

  if (!token || !email) {
    return NextResponse.redirect(fallbackRedirect);
  }

  try {
    const tokenHash = await hashToken(token);

    // Find the magic link
    const magicLink = await queryOne<{
      id: string;
      email: string;
      token_hash: string;
      redirect_to: string;
      expires_at: string;
      used_at: string | null;
    }>(
      `SELECT *
       FROM auth_magic_links
       WHERE email = ?
         AND token_hash = ?
         AND used_at IS NULL
         AND expires_at > ?
       LIMIT 1`,
      [email.toLowerCase(), tokenHash, toISOString(new Date())]
    );

    if (!magicLink) {
      return NextResponse.redirect(new URL('/account/library?error=invalid_or_expired', request.url));
    }

    // Mark magic link as used
    await execute(
      'UPDATE auth_magic_links SET used_at = ? WHERE id = ?',
      [toISOString(new Date()), magicLink.id]
    );

    // Find or create user
    let user = await queryOne<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      const userId = generateId('usr');
      await execute(
        'INSERT INTO users (id, email, role) VALUES (?, ?, ?)',
        [userId, email.toLowerCase(), 'customer']
      );
      user = { id: userId, email: email.toLowerCase(), role: 'customer' };
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

    // Set cookie and redirect
    const targetPath =
      magicLink.redirect_to && magicLink.redirect_to.startsWith('/')
        ? magicLink.redirect_to
        : '/account/library';
    const response = NextResponse.redirect(new URL(targetPath, request.url));

    response.cookies.set('__session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.redirect(new URL('/account/library?error=server_error', request.url));
  }
}
