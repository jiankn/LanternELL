import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { execute, queryOne, toISOString } from '@/lib/db';
import { hashToken } from '@/lib/db';
import { slugify } from '@/lib/slugs';

export const dynamic = 'force-dynamic';

// GET /api/download/file - Serve the actual file
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const resourceId = searchParams.get('resource');
  const downloadType = searchParams.get('type') || 'sample';

  if (!token || !resourceId) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  try {
    // Validate token
    const tokenHash = await hashToken(token);
    const tokenRecord = await queryOne<{
      id: string;
      user_id: string;
      resource_id: string;
      expires_at: string;
      used_at: string | null;
    }>(
      `SELECT *
       FROM download_tokens
       WHERE token = ?
         AND resource_id = ?
         AND expires_at > ?
         AND used_at IS NULL`,
      [tokenHash, resourceId, toISOString(new Date())]
    );

    if (!tokenRecord) {
      return new NextResponse('Invalid or expired download token', { status: 401 });
    }

    // Mark token as used
    await execute(
      'UPDATE download_tokens SET used_at = ? WHERE id = ?',
      [toISOString(new Date()), tokenRecord.id]
    );

    // Get resource file info
    const resource = await queryOne<{
      id: string;
      title: string;
      pdf_url: string | null;
      sample_pdf_url: string | null;
    }>(
      'SELECT id, title, pdf_url, sample_pdf_url FROM resources WHERE id = ?',
      [resourceId]
    );

    if (!resource) {
      return new NextResponse('Resource not found', { status: 404 });
    }

    // Get the appropriate file URL
    const fileUrl = downloadType === 'sample' ? resource.sample_pdf_url : resource.pdf_url;

    if (!fileUrl) {
      return new NextResponse('File not available', { status: 404 });
    }

    if (/^https?:\/\//.test(fileUrl)) {
      return NextResponse.redirect(fileUrl);
    }

    const context = await getCloudflareContext();
    const env = (context.env || {}) as Record<string, any>;
    const objectKey = fileUrl.replace(/^\/+/, '');
    const object = await env.FILES?.get(objectKey);

    if (!object) {
      return new NextResponse('File object not found', { status: 404 });
    }

    const headers = new Headers();
    if (typeof object.writeHttpMetadata === 'function') {
      object.writeHttpMetadata(headers);
    }
    headers.set('content-type', headers.get('content-type') || 'application/pdf');
    headers.set(
      'content-disposition',
      `attachment; filename="${slugify(resource.title || 'lanternell-pack')}-${downloadType}.pdf"`
    );

    return new NextResponse(object.body, { headers });

  } catch (error) {
    console.error('Download file error:', error);
    return new NextResponse('Download failed', { status: 500 });
  }
}
