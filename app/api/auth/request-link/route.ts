import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, generateSessionToken, hashToken, addMinutes, queryOne, toISOString } from '@/lib/db';
import { sendEmail, magicLinkEmail, isEmailConfigured } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// POST /api/auth/request-link - Send magic link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, redirectTo = '/account/library' } = body;
    const safeRedirectTo =
      typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/account/library';

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'INVALID_EMAIL', message: 'Valid email is required' }
      }, { status: 400 });
    }

    // Rate limit: 5 requests per email per 15 minutes
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const emailKey = `auth:${email.toLowerCase()}`;
    const ipKey = `auth-ip:${ip}`;

    const [emailLimit, ipLimit] = await Promise.all([
      checkRateLimit(emailKey, 5, 900),
      checkRateLimit(ipKey, 10, 900),
    ]);

    if (!emailLimit.allowed || !ipLimit.allowed) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' }
      }, { status: 429 });
    }

    // Check if user exists, create if not
    let user = await queryOne<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      const userId = generateId('usr');
      await execute(
        'INSERT INTO users (id, email, role) VALUES (?, ?, ?)',
        [userId, email.toLowerCase(), 'customer']
      );
      user = { id: userId, email: email.toLowerCase() };
    }

    // Generate magic link token
    const token = generateSessionToken();
    const tokenHash = await hashToken(token);
    const expiresAt = addMinutes(new Date(), 20); // 20 minutes
    const magicLinkId = generateId('ml');

    await execute(
      'INSERT INTO auth_magic_links (id, email, token_hash, redirect_to, expires_at) VALUES (?, ?, ?, ?, ?)',
      [magicLinkId, email.toLowerCase(), tokenHash, safeRedirectTo, toISOString(expiresAt)]
    );

    // Send magic link email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

    const emailTemplate = magicLinkEmail(magicLink);
    const emailResult = await sendEmail({
      to: email.toLowerCase(),
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (!emailResult.ok) {
      console.error('Failed to send magic link email:', emailResult.error);
    }

    // In dev mode, also return the link directly
    const isDev = !isEmailConfigured() || process.env.APP_ENV === 'development';

    return NextResponse.json({
      ok: true,
      data: {
        sent: true,
        ...(isDev ? { devLink: magicLink } : {})
      },
      error: null
    });

  } catch (error) {
    console.error('Auth request error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to send magic link' }
    }, { status: 500 });
  }
}
