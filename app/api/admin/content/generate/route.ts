import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, query, toISOString } from '@/lib/db';
import { generateVocabularyPack, generateSentenceFrames, generateClassroomLabels, generateParentNotes, validateContent, getCurrentProvider, isProviderConfigured } from '@/lib/ai-content';
import type { PackType, LanguagePair, AgeBand } from '@/lib/content-schema';
import { getAIConfig, getConfiguredProviders } from '@/lib/ai-providers';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/slugs';

export const dynamic = 'force-dynamic';

// POST /api/admin/content/generate - Generate new content
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const body = await request.json();
    const { topic, pack_type, language_pair, age_band, vocabulary_count, frame_count, label_count } = body;

    // Validate required fields
    if (!topic || !pack_type || !language_pair || !age_band) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'INVALID_PARAMS', message: 'Missing required fields' }
      }, { status: 400 });
    }

    // Check if provider is configured
    const config = getAIConfig();

    if (!isProviderConfigured(config.ACTIVE_PROVIDER)) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'CONFIG_ERROR', message: `${config.ACTIVE_PROVIDER} API key not configured` }
      }, { status: 500 });
    }

    // Create content job
    const jobId = generateId('job');
    await execute(
      `INSERT INTO content_jobs (id, job_id, topic, pack_type, language_pair, age_band, status)
       VALUES (?, ?, ?, ?, ?, ?, 'processing')`,
      [jobId, jobId, topic, pack_type, language_pair, age_band]
    );

    // Generate content based on pack type
    let content;
    try {
      switch (pack_type) {
        case 'vocabulary_pack':
          content = await generateVocabularyPack({
            topic,
            language_pair: language_pair as LanguagePair,
            age_band: age_band as AgeBand,
            vocabulary_count: vocabulary_count || 15,
          });
          break;
        case 'sentence_frames':
          content = await generateSentenceFrames({
            topic,
            language_pair: language_pair as LanguagePair,
            age_band: age_band as AgeBand,
            frame_count: frame_count || 10,
          });
          break;
        case 'classroom_labels':
          content = await generateClassroomLabels({
            topic,
            language_pair: language_pair as LanguagePair,
            age_band: age_band as AgeBand,
            label_count: label_count || 20,
          });
          break;
        case 'parent_communication':
          content = await generateParentNotes({
            topic,
            language_pair: language_pair as LanguagePair,
            age_band: age_band as AgeBand,
          });
          break;
        default:
          throw new Error(`Unknown pack type: ${pack_type}`);
      }

      // Validate content
      const validation = validateContent(content);
      if (!validation.valid) {
        throw new Error(`Content validation failed: ${validation.errors.join(', ')}`);
      }

      const resourceId = generateId('res');
      const slugBase = slugify(content.title || topic);
      const resourceSlug = `${slugBase || pack_type}-${resourceId.slice(-6)}`;
      const createdAt = toISOString(new Date());

      await execute(
        `INSERT INTO resources (
          id, slug, title, description, pack_type, topic, age_band, language_pair,
          free_or_paid, seo_title, seo_description, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'paid', ?, ?, ?, ?)`,
        [
          resourceId,
          resourceSlug,
          content.title || topic,
          content.description || `Printable ${pack_type} pack for ${topic}`,
          content.pack_type,
          content.topic,
          content.age_band,
          content.language_pair,
          content.title || topic,
          content.description || `Printable ${pack_type} pack for ${topic}`,
          createdAt,
          createdAt,
        ]
      );

      // Save content to packs_json
      const packId = generateId('pk');
      await execute(
        `INSERT INTO packs_json (id, resource_id, content_json, status, updated_at, created_at)
         VALUES (?, ?, ?, 'review', ?, ?)`,
        [packId, resourceId, JSON.stringify(content), createdAt, createdAt]
      );

      // Auto-create product so it's ready to sell after review/publish
      const productId = generateId('prod');
      const productSlug = resourceSlug;
      const defaultPriceCents = pack_type === 'parent_communication' ? 399 : pack_type === 'classroom_labels' ? 499 : 599;
      await execute(
        `INSERT INTO products (id, slug, type, name, description, price_cents, active, created_at)
         VALUES (?, ?, 'single', ?, ?, ?, 0, ?)`,
        [productId, productSlug, content.title || topic, content.description || `Printable ${pack_type} pack for ${topic}`, defaultPriceCents, createdAt]
      );

      // Link product to resource
      const prId = generateId('pr');
      await execute(
        `INSERT INTO product_resources (id, product_id, resource_id, created_at)
         VALUES (?, ?, ?, ?)`,
        [prId, productId, resourceId, createdAt]
      );

      // Update job status
      await execute(
        `UPDATE content_jobs SET status = 'completed', result_json = ?, updated_at = ? WHERE id = ?`,
        [JSON.stringify(content), toISOString(new Date()), jobId]
      );

      return NextResponse.json({
        ok: true,
        data: {
          jobId,
          status: 'completed',
          content,
          packId,
          resourceId,
          resourceSlug,
          productId,
          provider: getCurrentProvider(),
          fallbackProvider: config.FALLBACK_PROVIDER || null,
        },
        error: null
      });

    } catch (genError) {
      // Mark job as failed
      const errorMessage = genError instanceof Error ? genError.message : 'Unknown error';
      await execute(
        `UPDATE content_jobs SET status = 'failed', error_message = ?, updated_at = ? WHERE id = ?`,
        [errorMessage, toISOString(new Date()), jobId]
      );

      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'GENERATION_FAILED', message: errorMessage }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to generate content' }
    }, { status: 500 });
  }
}

// GET /api/admin/content/generate - List content jobs
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let sql = 'SELECT * FROM content_jobs';
    const params: unknown[] = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const jobs = await query(sql, params);
    const config = getAIConfig();

    return NextResponse.json({
      ok: true,
      data: {
        jobs,
        provider: getCurrentProvider(),
        fallbackProvider: config.FALLBACK_PROVIDER || null,
        configuredProviders: getConfiguredProviders(config),
      },
      error: null
    });

  } catch (error) {
    console.error('List jobs error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: 'Failed to list jobs' }
    }, { status: 500 });
  }
}
