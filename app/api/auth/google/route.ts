import { NextRequest, NextResponse } from 'next/server';

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

// GET /api/auth/google — Redirect to Google OAuth consent screen
export async function GET(request: NextRequest) {
  const clientId = await getEnvVar('GOOGLE_CLIENT_ID');
  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: 'Google OAuth not configured' },
      { status: 500 }
    );
  }

  const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/account/library';

  // Build the base URL for callback
  let baseUrl = await getEnvVar('NEXT_PUBLIC_SITE_URL');
  if (!baseUrl) baseUrl = await getEnvVar('APP_URL');
  if (!baseUrl) baseUrl = 'http://localhost:3000';

  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // State parameter encodes the redirect destination
  const state = Buffer.from(JSON.stringify({ redirectTo })).toString('base64url');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
