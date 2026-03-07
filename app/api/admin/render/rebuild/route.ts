import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { execute, generateId, toISOString } from '@/lib/db';
import { getRenderablePack } from '@/lib/rendering/load-pack';
import { renderPackArtifacts, type RenderArtifact, type RenderTarget } from '@/lib/rendering/pack-renderer';

export const dynamic = 'force-dynamic';

const DEFAULT_RENDER_TARGETS: RenderTarget[] = ['final_pdf', 'sample_pdf', 'preview_images'];

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const body = await request.json();
    const packId = body.packId as string | undefined;
    const resourceId = body.resourceId as string | undefined;
    const renderTargets = normaliseRenderTargets(body.renderTargets);
    const pageFormat = body.pageFormat === 'a4' ? 'a4' as const : 'letter' as const;

    const pack = await getRenderablePack({ packId, resourceId });
    if (!pack) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Renderable pack not found' }
      }, { status: 404 });
    }

    const renderJobId = generateId('job_render');
    await execute(
      `INSERT INTO render_jobs (id, job_id, resource_id, render_targets, status)
       VALUES (?, ?, ?, ?, 'processing')`,
      [renderJobId, renderJobId, pack.resource.id, JSON.stringify(renderTargets)]
    );

    try {
      const { artifacts } = await renderPackArtifacts({
        pack,
        renderTargets,
        sampleWatermarkText: process.env.FREE_SAMPLE_WATERMARK_TEXT || 'Sample Only',
        pageFormat,
      });

      await execute('DELETE FROM preview_assets WHERE resource_id = ?', [pack.resource.id]);
      await persistArtifacts(pack.resource.id, artifacts);

      const finalPdf = artifacts.find((artifact) => artifact.assetType === 'final_pdf')?.objectKey || null;
      const samplePdf = artifacts.find((artifact) => artifact.assetType === 'sample_pdf')?.objectKey || null;
      const previews = artifacts
        .filter((artifact) => artifact.assetType === 'preview_image')
        .sort((left, right) => (left.pageNumber || 0) - (right.pageNumber || 0))
        .map((artifact) => artifact.objectKey);

      await execute(
        `UPDATE resources
         SET pdf_url = ?,
             sample_pdf_url = ?,
             preview_images = ?,
             updated_at = ?
         WHERE id = ?`,
        [
          finalPdf,
          samplePdf,
          JSON.stringify(previews),
          toISOString(new Date()),
          pack.resource.id,
        ]
      );

      await execute(
        `UPDATE render_jobs
         SET status = 'completed', result_json = ?, updated_at = ?
         WHERE id = ?`,
        [JSON.stringify({ artifacts }), toISOString(new Date()), renderJobId]
      );

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';

      return NextResponse.json({
        ok: true,
        data: {
          jobId: renderJobId,
          resourceId: pack.resource.id,
          artifacts,
          previewUrl: `${baseUrl}/api/admin/render/preview?packId=${pack.packId}`,
          samplePreviewUrl: `${baseUrl}/api/admin/render/preview?packId=${pack.packId}&mode=sample`,
        },
        error: null,
      });
    } catch (renderError) {
      const message = renderError instanceof Error ? renderError.message : 'Unknown render error';
      await execute(
        `UPDATE render_jobs
         SET status = 'failed', error_message = ?, updated_at = ?
         WHERE id = ?`,
        [message, toISOString(new Date()), renderJobId]
      );

      return NextResponse.json({
        ok: false,
        data: {
          jobId: renderJobId,
          previewUrl: `/api/admin/render/preview?packId=${pack.packId}`,
        },
        error: { code: 'RENDER_FAILED', message }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Render rebuild error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to rebuild render assets' }
    }, { status: 500 });
  }
}

async function persistArtifacts(resourceId: string, artifacts: RenderArtifact[]) {
  for (const artifact of artifacts) {
    const assetId = generateId('ast');
    await execute(
      `INSERT INTO preview_assets (id, resource_id, asset_type, object_key, mime_type, page_number, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        assetId,
        resourceId,
        artifact.assetType,
        artifact.objectKey,
        artifact.mimeType,
        artifact.pageNumber || null,
        JSON.stringify({ bytes: artifact.bytes }),
      ]
    );
  }
}

function normaliseRenderTargets(value: unknown): RenderTarget[] {
  if (!Array.isArray(value)) {
    return DEFAULT_RENDER_TARGETS;
  }

  const validTargets = value.filter(
    (item): item is RenderTarget =>
      item === 'final_pdf' || item === 'sample_pdf' || item === 'preview_images'
  );

  return validTargets.length > 0 ? validTargets : DEFAULT_RENDER_TARGETS;
}
