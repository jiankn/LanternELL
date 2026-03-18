import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, hashToken, toISOString } from '@/lib/db';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { ok: false, error: { code: 'MISSING_FIELDS', message: 'All fields are required.' } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters.' } },
        { status: 400 }
      );
    }

    const tokenHash = await hashToken(token);

    const link = await queryOne<{ id: string; email: string }>(
      `SELECT id, email FROM auth_magic_links
       WHERE email = ? AND token_hash = ? AND redirect_to = '__reset_password__'
         AND used_at IS NULL AND expires_at > ?
       LIMIT 1`,
      [email.toLowerCase(), tokenHash, toISOString(new Date())]
    );

    if (!link) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_TOKEN', message: 'This reset link is invalid or has expired.' } },
        { status: 400 }
      );
    }

    // Mark token as used
    await execute('UPDATE auth_magic_links SET used_at = ? WHERE id = ?', [toISOString(new Date()), link.id]);

    // Update password
    const passwordHash = await hashPassword(password);
    const result = await execute('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?', [
      passwordHash,
      toISOString(new Date()),
      email.toLowerCase(),
    ]);

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { ok: false, error: { code: 'USER_NOT_FOUND', message: 'Account not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: { reset: true } });
  } catch (err) {
    console.error('[auth:reset-password] Error:', err);
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
