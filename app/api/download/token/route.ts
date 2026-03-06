import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, addMinutes, queryOne, toISOString } from '@/lib/db';
import { hashToken } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/download/token - Generate download token
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Please login to download' }
      }, { status: 401 });
    }

    const body = await request.json();
    const { resourceId } = body;

    if (!resourceId) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'INVALID_RESOURCE', message: 'Resource ID is required' }
      }, { status: 400 });
    }

    // Check if resource exists
    const resource = await queryOne<{
      id: string;
      title: string;
      free_or_paid: string;
      pdf_url: string | null;
      sample_pdf_url: string | null;
    }>(
      'SELECT id, title, free_or_paid, pdf_url, sample_pdf_url FROM resources WHERE id = ?',
      [resourceId]
    );

    if (!resource) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Resource not found' }
      }, { status: 404 });
    }

    // Check entitlement for paid resources
    if (resource.free_or_paid === 'paid') {
      const entitlement = await queryOne<{ id: string }>(
        `SELECT e.id FROM entitlements e
         WHERE e.user_id = ?
           AND e.status = 'active'
           AND (e.resource_id = ? OR e.product_id IN (
             SELECT pr.product_id FROM product_resources pr WHERE pr.resource_id = ?
           ))
           AND (e.ends_at IS NULL OR e.ends_at > datetime('now'))
         LIMIT 1`,
        [user.id, resourceId, resourceId]
      );

      if (!entitlement) {
        return NextResponse.json({
          ok: false,
          data: null,
          error: { code: 'NO_ACCESS', message: 'Please purchase this resource to download' }
        }, { status: 403 });
      }
    }

    // Generate download token
    const token = crypto.randomUUID();
    const tokenHash = await hashToken(token);
    const expiresAt = addMinutes(new Date(), 5);
    const tokenId = generateId('dt');

    await execute(
      'INSERT INTO download_tokens (id, user_id, resource_id, token, expires_at) VALUES (?, ?, ?, ?, ?)',
      [tokenId, user.id, resourceId, tokenHash, toISOString(expiresAt)]
    );

    // Log download
    const downloadId = generateId('dl');
    await execute(
      'INSERT INTO downloads (id, user_id, resource_id) VALUES (?, ?, ?)',
      [downloadId, user.id, resourceId]
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const downloadType = resource.free_or_paid === 'free' ? 'sample' : 'full';

    return NextResponse.json({
      ok: true,
      data: {
        downloadUrl: `${baseUrl}/api/download/file?token=${token}&resource=${resourceId}&type=${downloadType}`
      },
      error: null
    });

  } catch (error) {
    console.error('Download token error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to generate download token' }
    }, { status: 500 });
  }
}
