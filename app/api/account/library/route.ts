import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne, toISOString } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface LibraryItemRow {
  resourceId: string;
  title: string;
  slug: string;
  packType: string;
  languagePair: string;
  hasPdf: number;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Please login to view your library' },
        },
        { status: 401 }
      );
    }

    // Check if user has an active membership/subscription
    const hasActiveMembership = await queryOne<{ id: string }>(
      `SELECT id FROM subscriptions
       WHERE user_id = ? AND status IN ('active', 'past_due')
       LIMIT 1`,
      [user.id]
    ) || await queryOne<{ id: string }>(
      `SELECT e.id FROM entitlements e
       LEFT JOIN products p ON p.id = e.product_id
       WHERE e.user_id = ?
         AND e.status = 'active'
         AND p.type = 'membership'
         AND (e.ends_at IS NULL OR e.ends_at > ?)
       LIMIT 1`,
      [user.id, toISOString(new Date())]
    );

    const nowIso = toISOString(new Date());

    let items: LibraryItemRow[];

    if (hasActiveMembership) {
      // Membership users: show ALL resources that have a PDF file ready
      items = await query<LibraryItemRow>(
        `SELECT DISTINCT
            r.id AS resourceId,
            r.title AS title,
            r.slug AS slug,
            r.pack_type AS packType,
            r.language_pair AS languagePair,
            CASE WHEN COALESCE(r.pdf_url, r.sample_pdf_url) IS NOT NULL THEN 1 ELSE 0 END AS hasPdf
         FROM resources r
         WHERE COALESCE(r.pdf_url, r.sample_pdf_url) IS NOT NULL
         ORDER BY r.created_at DESC, r.title ASC`
      );
    } else {
      // Non-membership users: show only resources they have specific entitlements for
      items = await query<LibraryItemRow>(
        `SELECT DISTINCT
            r.id AS resourceId,
            r.title AS title,
            r.slug AS slug,
            r.pack_type AS packType,
            r.language_pair AS languagePair,
            CASE WHEN COALESCE(r.pdf_url, r.sample_pdf_url) IS NOT NULL THEN 1 ELSE 0 END AS hasPdf
         FROM resources r
         WHERE COALESCE(r.pdf_url, r.sample_pdf_url) IS NOT NULL
           AND EXISTS (
             SELECT 1
             FROM entitlements e
             LEFT JOIN product_resources pr
               ON pr.product_id = e.product_id
              AND pr.resource_id = r.id
             WHERE e.user_id = ?
               AND e.status = 'active'
               AND (e.ends_at IS NULL OR e.ends_at > ?)
               AND (
                 e.resource_id = r.id
                 OR pr.resource_id IS NOT NULL
               )
           )
         ORDER BY r.created_at DESC, r.title ASC`,
        [user.id, nowIso]
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        items: items.map((item) => ({
          resourceId: item.resourceId,
          title: item.title,
          slug: item.slug,
          packType: item.packType,
          languagePair: item.languagePair,
          downloadable: Boolean(item.hasPdf),
        })),
      },
      error: null,
    });
  } catch (error) {
    console.error('Get library error:', error);
    return NextResponse.json(
      {
        ok: false,
        data: null,
        error: { code: 'SERVER_ERROR', message: 'Failed to get library items' },
      },
      { status: 500 }
    );
  }
}
