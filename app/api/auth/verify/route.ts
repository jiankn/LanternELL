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

  console.log(`[auth:verify] Verifying token for email=${email}`);

  try {
    const tokenHash = await hashToken(token);
    console.log(`[auth:verify] Token hash=${tokenHash.substring(0, 16)}...`);

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
      console.log(`[auth:verify] Magic link not found for email=${email}, hash=${tokenHash.substring(0, 16)}...`);
      
      // Debug: check if any magic link exists for this email
      const anyLink = await queryOne<{ id: string; token_hash: string; expires_at: string; used_at: string | null }>(
        'SELECT id, token_hash, expires_at, used_at FROM auth_magic_links WHERE email = ? ORDER BY created_at DESC LIMIT 1',
        [email.toLowerCase()]
      );
      if (anyLink) {
        console.log(`[auth:verify] Found latest link: hash=${anyLink.token_hash?.substring(0, 16)}..., expires=${anyLink.expires_at}, used=${anyLink.used_at}`);
      } else {
        console.log(`[auth:verify] No magic links found for this email`);
      }
      
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
