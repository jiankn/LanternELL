import { NextRequest } from 'next/server';
import { hashToken, queryOne, toISOString } from '@/lib/db';

export interface SessionRecord {
  id: string;
  user_id: string;
  expires_at: string;
  revoked_at: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  stripe_customer_id?: string | null;
}

export async function getCurrentSession(request: NextRequest): Promise<SessionRecord | null> {
  const sessionToken = request.cookies.get('__session')?.value;
  if (!sessionToken) {
    return null;
  }

  const tokenHash = await hashToken(sessionToken);
  return queryOne<SessionRecord>(
    `SELECT id, user_id, expires_at, revoked_at
     FROM sessions
     WHERE session_token_hash = ?
       AND expires_at > ?
       AND revoked_at IS NULL`,
    [tokenHash, toISOString(new Date())]
  );
}

export async function getCurrentUserBySessionToken(sessionToken?: string | null): Promise<AuthUser | null> {
  if (!sessionToken) {
    return null;
  }

  const tokenHash = await hashToken(sessionToken);

  return queryOne<AuthUser>(
    `SELECT u.id, u.email, u.name, u.role, u.stripe_customer_id
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.session_token_hash = ?
       AND s.expires_at > ?
       AND s.revoked_at IS NULL`,
    [tokenHash, toISOString(new Date())]
  );
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  return getCurrentUserBySessionToken(request.cookies.get('__session')?.value ?? null);
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser | null> {
  const user = await getCurrentUser(request);
  if (!user || user.role !== 'admin') {
    return null;
  }

  return user;
}
