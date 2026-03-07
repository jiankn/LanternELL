import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/leads - Subscribe to newsletter / get free samples
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sourcePage, leadMagnet } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'INVALID_EMAIL', message: 'Valid email is required' }
      }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await queryOne<{ id: string }>(
      'SELECT id FROM email_leads WHERE email = ?',
      [normalizedEmail]
    );

    if (existing) {
      return NextResponse.json({
        ok: true,
        data: { subscribed: true, existing: true },
        error: null
      });
    }

    const leadId = generateId('lead');
    await execute(
      'INSERT INTO email_leads (id, email, source_page, lead_magnet) VALUES (?, ?, ?, ?)',
      [leadId, normalizedEmail, sourcePage || null, leadMagnet || null]
    );

    return NextResponse.json({
      ok: true,
      data: { subscribed: true, existing: false },
      error: null
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to subscribe' }
    }, { status: 500 });
  }
}
