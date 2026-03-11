import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { queryOne } from '@/lib/db';
import { slugify } from '@/lib/slugs';

export const dynamic = 'force-dynamic';

// GET /api/download/sample/[slug]
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;

    if (!slug) {
        return new NextResponse('Missing slug parameter', { status: 400 });
    }

    try {
        // Look up resource
        const resource = await queryOne<{
            title: string;
            sample_pdf_url: string | null;
        }>(
            'SELECT title, sample_pdf_url FROM resources WHERE slug = ?',
            [slug]
        );

        if (!resource) {
            return new NextResponse('Resource not found', { status: 404 });
        }

        if (!resource.sample_pdf_url) {
            return new NextResponse('Sample file not available', { status: 404 });
        }

        // Attempt to download file via Cloudflare Bindings
        const context = await getCloudflareContext();
        const env = (context.env || {}) as Record<string, any>;

        // R2 Key usually e.g., "samples/filename.pdf"
        const objectKey = resource.sample_pdf_url.replace(/^\/+/, '');
        const object = await env.FILES?.get(objectKey);

        if (!object) {
            return new NextResponse('Sample file object not found in storage', { status: 404 });
        }

        const headers = new Headers();
        if (typeof object.writeHttpMetadata === 'function') {
            object.writeHttpMetadata(headers);
        }
        headers.set('content-type', headers.get('content-type') || 'application/pdf');
        headers.set(
            'content-disposition',
            `attachment; filename="${slugify(resource.title || 'lanternell-sample')}-sample.pdf"`
        );

        return new NextResponse(object.body, { headers });

    } catch (error) {
        console.error('Download sample error:', error);
        return new NextResponse('Failed to fetch sample', { status: 500 });
    }
}
