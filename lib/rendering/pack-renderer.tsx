import 'server-only';

import puppeteer from '@cloudflare/puppeteer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PackDocument } from '@/components/pdf/pack-document';
import type { RenderablePack } from '@/lib/rendering/load-pack';

export type RenderTarget = 'final_pdf' | 'sample_pdf' | 'preview_images';
export type PageFormat = 'letter' | 'a4';

export interface RenderArtifact {
  assetType: 'final_pdf' | 'sample_pdf' | 'preview_image' | 'cover';
  objectKey: string;
  mimeType: string;
  pageNumber?: number;
  bytes: number;
}

export async function renderPackHtmlDocument(options: {
  pack: RenderablePack;
  mode: 'final' | 'sample';
  sampleWatermarkText?: string;
}) {
  const { pack, mode, sampleWatermarkText } = options;
  const { renderToStaticMarkup } = await import('react-dom/server');
  return (
    '<!DOCTYPE html>' +
    renderToStaticMarkup(
      <PackDocument
        content={pack.content}
        resource={pack.resource}
        mode={mode}
        renderedAt={new Date().toISOString().slice(0, 10)}
        sampleWatermarkText={sampleWatermarkText}
      />
    )
  );
}

export async function renderPackArtifacts(options: {
  pack: RenderablePack;
  renderTargets: RenderTarget[];
  sampleWatermarkText?: string;
  pageFormat?: PageFormat;
}) {
  const { pack, renderTargets, sampleWatermarkText = 'Sample Only', pageFormat = 'letter' } = options;
  const finalHtml = await renderPackHtmlDocument({ pack, mode: 'final' });
  const sampleHtml = await renderPackHtmlDocument({
    pack,
    mode: 'sample',
    sampleWatermarkText,
  });

  const env = await getWorkerEnv();
  const browserBinding = env?.BROWSER;
  const filesBinding = env?.FILES;

  if (!browserBinding) {
    throw new Error('Browser Rendering binding is not configured');
  }

  if (!filesBinding) {
    throw new Error('R2 FILES binding is not configured');
  }

  const browser = await puppeteer.launch(browserBinding);
  const artifacts: RenderArtifact[] = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 });

    if (renderTargets.includes('final_pdf')) {
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: pageFormat === 'a4' ? 'A4' : 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
      });
      const objectKey = buildObjectKey(pack, pageFormat === 'a4' ? 'final-a4.pdf' : 'final.pdf');
      await filesBinding.put(objectKey, pdfBuffer, {
        httpMetadata: { contentType: 'application/pdf' },
      });
      artifacts.push({
        assetType: 'final_pdf',
        objectKey,
        mimeType: 'application/pdf',
        bytes: pdfBuffer.length,
      });
    }

    if (renderTargets.includes('sample_pdf')) {
      await page.setContent(sampleHtml, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: pageFormat === 'a4' ? 'A4' : 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
      });
      const objectKey = buildObjectKey(pack, pageFormat === 'a4' ? 'sample-a4.pdf' : 'sample.pdf');
      await filesBinding.put(objectKey, pdfBuffer, {
        httpMetadata: { contentType: 'application/pdf' },
      });
      artifacts.push({
        assetType: 'sample_pdf',
        objectKey,
        mimeType: 'application/pdf',
        bytes: pdfBuffer.length,
      });
    }

    if (renderTargets.includes('preview_images')) {
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
      const pageHandles = await page.$$('.pdf-page');

      if (pageHandles[0]) {
        const coverBuffer = await pageHandles[0].screenshot({ type: 'webp' });
        const objectKey = buildObjectKey(pack, 'cover.webp');
        await filesBinding.put(objectKey, coverBuffer, {
          httpMetadata: { contentType: 'image/webp' },
        });
        artifacts.push({
          assetType: 'cover',
          objectKey,
          mimeType: 'image/webp',
          bytes: coverBuffer.length,
          pageNumber: 1,
        });
      }

      for (let index = 0; index < Math.min(2, pageHandles.length); index += 1) {
        const previewBuffer = await pageHandles[index].screenshot({ type: 'webp' });
        const objectKey = buildObjectKey(pack, `preview/${String(index + 1).padStart(2, '0')}.webp`);
        await filesBinding.put(objectKey, previewBuffer, {
          httpMetadata: { contentType: 'image/webp' },
        });
        artifacts.push({
          assetType: 'preview_image',
          objectKey,
          mimeType: 'image/webp',
          bytes: previewBuffer.length,
          pageNumber: index + 1,
        });
      }
    }

    return {
      finalHtml,
      sampleHtml,
      artifacts,
    };
  } finally {
    await browser.close();
  }
}

async function getWorkerEnv(): Promise<Record<string, any> | null> {
  try {
    const context = await getCloudflareContext();
    return (context?.env || null) as Record<string, any> | null;
  } catch {
    return null;
  }
}

function buildObjectKey(pack: RenderablePack, suffix: string) {
  const languagePair = pack.content.language_pair || pack.resource.language_pair || 'en-es';
  const packType = pack.content.pack_type || pack.resource.pack_type;
  return `resources/${languagePair}/${packType}/${pack.resource.slug}/${suffix}`;
}
