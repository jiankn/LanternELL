import { NextRequest, NextResponse } from 'next/server';
import {
  queryOne,
  execute,
  generateId,
  generateSessionToken,
  hashToken,
  toISOString,
  addDays,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getEnvVar(name: string): Promise<string> {
  if (process.env[name]) return process.env[name]!;
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const context = await getCloudflareContext();
    const env = (context?.env || {}) as Record<string, any>;
    return env[name] || '';
  } catch {
    return '';
  }
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;       // Google user ID
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
}

// GET /api/auth/google/callback — Handle Google OAuth callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  let baseUrl = await getEnvVar('NEXT_PUBLIC_SITE_URL');
  if (!baseUrl) baseUrl = await getEnvVar('APP_URL');
  if (!baseUrl) baseUrl = 'http://localhost:3000';

  // Parse redirect destination from state
  let redirectTo = '/account/library';
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
      if (parsed.redirectTo && parsed.redirectTo.startsWith('/')) {
        redirectTo = parsed.redirectTo;
      }
    } catch { /* ignore */ }
  }

  if (error || !code) {
    console.error('[auth:google] OAuth error:', error);
    return NextResponse.redirect(new URL(`/login?error=google_denied`, baseUrl));
  }

  try {
    const clientId = await getEnvVar('GOOGLE_CLIENT_ID');
    const clientSecret = await getEnvVar('GOOGLE_CLIENT_SECRET');
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[auth:google] Token exchange failed:', tokenRes.status, errText);
      return NextResponse.redirect(new URL(`/login?error=google_token_failed`, baseUrl));
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Get user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      console.error('[auth:google] UserInfo fetch failed:', userInfoRes.status);
      return NextResponse.redirect(new URL(`/login?error=google_userinfo_failed`, baseUrl));
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();
    console.log(`[auth:google] Google user: email=${googleUser.email}, sub=${googleUser.sub}`);

    if (!googleUser.email || !googleUser.email_verified) {
      return NextResponse.redirect(new URL(`/login?error=email_not_verified`, baseUrl));
    }

    const email = googleUser.email.toLowerCase();

    // Find existing user by email or google_id
    let user = await queryOne<{ id: string; email: string; role: string; google_id: string | null }>(
      'SELECT id, email, role, google_id FROM users WHERE email = ? OR google_id = ?',
      [email, googleUser.sub]
    );

    if (!user) {
      // Create new user
      const userId = generateId('usr');
      await execute(
        'INSERT INTO users (id, email, name, role, google_id) VALUES (?, ?, ?, ?, ?)',
        [userId, email, googleUser.name || null, 'customer', googleUser.sub]
      );
      user = { id: userId, email, role: 'customer', google_id: googleUser.sub };
    } else if (!user.google_id) {
      // Link Google account to existing user
      await execute('UPDATE users SET google_id = ?, updated_at = ? WHERE id = ?', [
        googleUser.sub,
        toISOString(new Date()),
        user.id,
      ]);
    }

    // Update name if not set
    if (googleUser.name) {
      await execute(
        'UPDATE users SET name = COALESCE(NULLIF(name, \'\'), ?), updated_at = ? WHERE id = ?',
        [googleUser.name, toISOString(new Date()), user.id]
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

    // Set cookie and redirect
    const response = NextResponse.redirect(new URL(redirectTo, baseUrl));
    response.cookies.set('__session', sessionToken, {
      httpOnly: true,
      secure: baseUrl.startsWith('https'),
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    console.log(`[auth:google] Login successful for ${email}, redirecting to ${redirectTo}`);
    return response;
  } catch (err) {
    console.error('[auth:google] Callback error:', err);
    return NextResponse.redirect(new URL(`/login?error=server_error`, baseUrl));
  }
}
