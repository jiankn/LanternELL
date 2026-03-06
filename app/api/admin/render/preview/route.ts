import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getRenderablePack } from '@/lib/rendering/load-pack';
import { renderPackHtmlDocument } from '@/lib/rendering/pack-renderer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const packId = searchParams.get('packId') || undefined;
    const resourceId = searchParams.get('resourceId') || undefined;
    const mode = searchParams.get('mode') === 'sample' ? 'sample' : 'final';

    const pack = await getRenderablePack({ packId, resourceId });
    if (!pack) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Renderable pack not found' }
      }, { status: 404 });
    }

    const html = await renderPackHtmlDocument({
      pack,
      mode,
      sampleWatermarkText: 'Sample Only',
    });

    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Render preview error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to build render preview' }
    }, { status: 500 });
  }
}
