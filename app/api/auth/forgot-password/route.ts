import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, generateId, generateSessionToken, hashToken, addMinutes, toISOString } from '@/lib/db';
import { sendEmail, resetPasswordEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_EMAIL', message: 'Valid email is required.' } },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const emailKey = `forgot:${email.toLowerCase()}`;
    const ipKey = `forgot-ip:${ip}`;
    const [emailLimit, ipLimit] = await Promise.all([
      checkRateLimit(emailKey, 3, 900),
      checkRateLimit(ipKey, 10, 900),
    ]);

    if (!emailLimit.allowed || !ipLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
        { status: 429 }
      );
    }

    // Always return success to prevent email enumeration
    const user = await queryOne<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (user) {
      const token = generateSessionToken();
      const tokenHash = await hashToken(token);
      const expiresAt = addMinutes(new Date(), 30);
      const id = generateId('rst');

      await execute(
        'INSERT INTO auth_magic_links (id, email, token_hash, redirect_to, expires_at) VALUES (?, ?, ?, ?, ?)',
        [id, email.toLowerCase(), tokenHash, '__reset_password__', toISOString(expiresAt)]
      );

      let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
      if (!baseUrl) {
        try {
          const { getCloudflareContext } = await import('@opennextjs/cloudflare');
          const context = await getCloudflareContext();
          const env = (context?.env || {}) as Record<string, any>;
          baseUrl = env.NEXT_PUBLIC_SITE_URL || env.APP_URL || 'http://localhost:3000';
        } catch {
          baseUrl = 'http://localhost:3000';
        }
      }

      const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
      const template = resetPasswordEmail(resetLink);
      await sendEmail({ to: email.toLowerCase(), subject: template.subject, html: template.html });
    }

    return NextResponse.json({ ok: true, data: { sent: true } });
  } catch (err) {
    console.error('[auth:forgot-password] Error:', err);
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
