import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const context = await getCloudflareContext();
        const env = (context.env || {}) as Record<string, any>;

        if (!env.FILES) {
            return NextResponse.json({ error: 'R2 bucket binding (FILES) not found' }, { status: 500 });
        }

        // List objects
        const listed = await env.FILES.list({ limit: 50 });

        return NextResponse.json({
            ok: true,
            objects: listed.objects.map(o => ({
                key: o.key,
                size: o.size,
                uploaded: o.uploaded
            })),
            truncated: listed.truncated,
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
