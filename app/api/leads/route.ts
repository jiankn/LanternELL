import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, queryOne } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

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

    // Rate limit: 3 per email per hour
    const limit = await checkRateLimit(`lead:${normalizedEmail}`, 3, 3600);
    if (!limit.allowed) {
      return NextResponse.json({
        ok: true,
        data: { subscribed: true, existing: true },
        error: null
      });
    }

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

    // Auto-deliver free sample email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'https://lanternell.com';
    await sendEmail({
      to: normalizedEmail,
      subject: 'Your Free ELL Teaching Samples from LanternELL',
      html: freeSampleEmail(baseUrl),
    });

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

function freeSampleEmail(baseUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:20px;padding:40px;border:2px solid rgba(255,255,255,0.6);box-shadow:4px 4px 8px rgba(163,177,198,0.4),-4px -4px 8px rgba(255,255,255,0.6);">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#4F46E5,#818CF8);border-radius:12px;line-height:48px;color:#fff;font-size:24px;font-weight:bold;">L</div>
    </div>
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#1E1B4B;text-align:center;margin:0 0 8px;">Welcome to LanternELL!</h1>
    <p style="color:#1E1B4B;text-align:center;margin:0 0 24px;">Here are your free ELL teaching samples. Just print and use in your classroom today.</p>
    <div style="background:#EEF2FF;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="font-weight:bold;color:#1E1B4B;margin:0 0 12px;">Your free samples include:</p>
      <ul style="color:#1E1B4B;margin:0;padding-left:20px;line-height:1.8;">
        <li>Classroom Objects Vocabulary Cards (EN-ES)</li>
        <li>Basic Sentence Frames Poster</li>
        <li>Feelings Check-In Sheet</li>
      </ul>
    </div>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${baseUrl}/shop" style="display:inline-block;background:linear-gradient(135deg,#F97316,#ea580c);color:#fff;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;">Browse All Packs</a>
    </div>
    <p style="color:#6366F1;text-align:center;font-size:12px;margin:0;">New packs added weekly. Reply to this email anytime — we read every message.</p>
  </div>
</body>
</html>`;
}
