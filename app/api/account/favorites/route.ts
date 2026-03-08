import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, execute, generateId, queryOne, toISOString } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface FavoriteRow {
    id: string;
    resource_id: string;
    title: string;
    slug: string;
    pack_type: string;
    language_pair: string;
    downloadable: number;
    created_at: string;
}

// GET /api/account/favorites — list user's favorites
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const items = await query<FavoriteRow>(
            `SELECT
          f.id,
          f.resource_id,
          r.title,
          r.slug,
          r.pack_type,
          r.language_pair,
          CASE WHEN COALESCE(r.pdf_url, r.sample_pdf_url) IS NOT NULL THEN 1 ELSE 0 END AS downloadable,
          f.created_at
       FROM favorites f
       JOIN resources r ON r.id = f.resource_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
            [user.id]
        );

        return NextResponse.json({
            ok: true,
            data: {
                items: items.map((item) => ({
                    id: item.id,
                    resourceId: item.resource_id,
                    title: item.title,
                    slug: item.slug,
                    packType: item.pack_type,
                    languagePair: item.language_pair,
                    downloadable: Boolean(item.downloadable),
                    createdAt: item.created_at,
                })),
                count: items.length,
            },
            error: null,
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to get favorites' } },
            { status: 500 }
        );
    }
}

// POST /api/account/favorites — add a favorite
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { resourceId } = body;

        if (!resourceId) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'BAD_REQUEST', message: 'resourceId is required' } },
                { status: 400 }
            );
        }

        // Check if already favorited
        const existing = await queryOne<{ id: string }>(
            'SELECT id FROM favorites WHERE user_id = ? AND resource_id = ?',
            [user.id, resourceId]
        );

        if (existing) {
            return NextResponse.json({ ok: true, data: { id: existing.id, action: 'already_exists' }, error: null });
        }

        const id = generateId('fav');
        await execute(
            'INSERT INTO favorites (id, user_id, resource_id) VALUES (?, ?, ?)',
            [id, user.id, resourceId]
        );

        return NextResponse.json({ ok: true, data: { id, action: 'added' }, error: null });
    } catch (error) {
        console.error('Add favorite error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to add favorite' } },
            { status: 500 }
        );
    }
}

// DELETE /api/account/favorites — remove a favorite
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { resourceId } = body;

        if (!resourceId) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'BAD_REQUEST', message: 'resourceId is required' } },
                { status: 400 }
            );
        }

        await execute(
            'DELETE FROM favorites WHERE user_id = ? AND resource_id = ?',
            [user.id, resourceId]
        );

        return NextResponse.json({ ok: true, data: { action: 'removed' }, error: null });
    } catch (error) {
        console.error('Remove favorite error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to remove favorite' } },
            { status: 500 }
        );
    }
}
