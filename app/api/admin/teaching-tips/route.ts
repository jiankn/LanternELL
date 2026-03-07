import { NextRequest, NextResponse } from 'next/server';
import { query, execute, generateId, toISOString } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let sql = 'SELECT * FROM blog_posts';
    const params: unknown[] = [];
    if (status) { sql += ' WHERE status = ?'; params.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const posts = await query(sql, params);
    return NextResponse.json({ ok: true, data: { posts }, error: null });
  } catch (error) {
    console.error('List blog posts error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const body = await request.json();
    const { title, slug, excerpt, contentMd, coverImageUrl, author, tags, seoTitle, seoDescription, status } = body;

    if (!title || !slug || !contentMd) {
      return NextResponse.json({ ok: false, data: null, error: { code: 'INVALID_PARAMS', message: 'title, slug, contentMd required' } }, { status: 400 });
    }

    const id = generateId('bp');
    const now = toISOString(new Date());
    const publishedAt = status === 'published' ? now : null;

    await execute(
      `INSERT INTO blog_posts (id, slug, title, excerpt, content_md, cover_image_url, author, tags, seo_title, seo_description, status, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, slug, title, excerpt || null, contentMd, coverImageUrl || null, author || 'LanternELL Team', tags ? JSON.stringify(tags) : null, seoTitle || null, seoDescription || null, status || 'draft', publishedAt, now, now]
    );

    return NextResponse.json({ ok: true, data: { id }, error: null });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const body = await request.json();
    const { id, title, slug, excerpt, contentMd, coverImageUrl, author, tags, seoTitle, seoDescription, status } = body;

    if (!id) return NextResponse.json({ ok: false, data: null, error: { code: 'INVALID_PARAMS', message: 'id required' } }, { status: 400 });

    const now = toISOString(new Date());
    const sets: string[] = ['updated_at = ?'];
    const params: unknown[] = [now];

    if (title !== undefined) { sets.push('title = ?'); params.push(title); }
    if (slug !== undefined) { sets.push('slug = ?'); params.push(slug); }
    if (excerpt !== undefined) { sets.push('excerpt = ?'); params.push(excerpt); }
    if (contentMd !== undefined) { sets.push('content_md = ?'); params.push(contentMd); }
    if (coverImageUrl !== undefined) { sets.push('cover_image_url = ?'); params.push(coverImageUrl); }
    if (author !== undefined) { sets.push('author = ?'); params.push(author); }
    if (tags !== undefined) { sets.push('tags = ?'); params.push(JSON.stringify(tags)); }
    if (seoTitle !== undefined) { sets.push('seo_title = ?'); params.push(seoTitle); }
    if (seoDescription !== undefined) { sets.push('seo_description = ?'); params.push(seoDescription); }
    if (status !== undefined) {
      sets.push('status = ?'); params.push(status);
      if (status === 'published') { sets.push('published_at = COALESCE(published_at, ?)'); params.push(now); }
    }

    params.push(id);
    await execute(`UPDATE blog_posts SET ${sets.join(', ')} WHERE id = ?`, params);

    return NextResponse.json({ ok: true, data: { updated: true }, error: null });
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return NextResponse.json({ ok: false, data: null, error: { code: 'FORBIDDEN', message: 'Admin access required' } }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, data: null, error: { code: 'INVALID_PARAMS', message: 'id required' } }, { status: 400 });

    await execute('DELETE FROM blog_posts WHERE id = ?', [id]);
    return NextResponse.json({ ok: true, data: { deleted: true }, error: null });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed' } }, { status: 500 });
  }
}
