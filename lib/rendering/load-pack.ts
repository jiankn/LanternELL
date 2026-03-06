import 'server-only';

import type { PackContent } from '@/lib/content-schema';
import { queryOne } from '@/lib/db';
import type { PackDocumentResource } from '@/components/pdf/pack-document';

interface RenderablePackRow {
  pack_id: string;
  resource_id: string;
  content_json: string;
  status: string;
  slug: string;
  title: string;
  description: string | null;
  pack_type: string;
  topic: string | null;
  age_band: string | null;
  language_pair: string | null;
}

export interface RenderablePack {
  packId: string;
  status: string;
  content: PackContent;
  resource: PackDocumentResource;
}

export async function getRenderablePack(params: {
  packId?: string;
  resourceId?: string;
}): Promise<RenderablePack | null> {
  const { packId, resourceId } = params;

  if (!packId && !resourceId) {
    return null;
  }

  const row = await queryOne<RenderablePackRow>(
    `SELECT
        p.id AS pack_id,
        p.resource_id AS resource_id,
        p.content_json AS content_json,
        p.status AS status,
        r.slug AS slug,
        r.title AS title,
        r.description AS description,
        r.pack_type AS pack_type,
        r.topic AS topic,
        r.age_band AS age_band,
        r.language_pair AS language_pair
     FROM packs_json p
     JOIN resources r ON r.id = p.resource_id
     WHERE ${packId ? 'p.id = ?' : 'r.id = ?'}
     LIMIT 1`,
    [packId || resourceId]
  );

  if (!row) {
    return null;
  }

  return {
    packId: row.pack_id,
    status: row.status,
    content: JSON.parse(row.content_json) as PackContent,
    resource: {
      id: row.resource_id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      pack_type: row.pack_type,
      topic: row.topic,
      age_band: row.age_band,
      language_pair: row.language_pair,
    },
  };
}
