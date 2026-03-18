/**
 * 扫描所有 pack，找出缺图项，生成 batch-prompts.json 供 batch-generate-images.mjs 使用
 */
import fs from 'fs';
import path from 'path';

const PACKS_DIR = 'data/packs';
const IMAGES_DIR = 'data/images';
const OUTPUT = 'data/batch-prompts.json';

function makeSlug(topic, ageBand) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '-' + ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
function safeFilename(str) {
  return str.toLowerCase().replace(/[/\\:*?"<>|]+/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// 风格前缀（按年龄段）
function stylePrefix(ageBand) {
  if (ageBand?.includes('6') || ageBand?.includes('7') || ageBand?.includes('8'))
    return 'Clean flat vector illustration, simple modern style, white background, educational,';
  if (ageBand?.includes('3') || ageBand?.includes('4') || ageBand?.includes('5'))
    return 'Bright colorful cartoon illustration, bold outlines, fun educational style, white background,';
  return 'Cute kawaii cartoon illustration, soft pastel colors, rounded shapes, white background, for young children,';
}

const packFiles = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
const images = [];

for (const pf of packFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, pf), 'utf8'));
  const slug = makeSlug(content.topic, content.age_band || 'K-2');
  const imgDir = path.join(IMAGES_DIR, slug);
  const prefix = stylePrefix(content.age_band);
  const packName = pf.replace('.json', '');

  // Mini book p1
  if (content.mini_book?.pages) {
    for (const page of content.mini_book.pages) {
      const fname = `minibook_p${page.page_number}.png`;
      if (!fs.existsSync(path.join(imgDir, fname))) {
        const prompt = page.image_prompt || `${content.mini_book.title} - ${page.text_en}`;
        images.push({
          id: `${slug}/minibook_p${page.page_number}`,
          pack_topic: content.topic,
          output_dir: `data/images/${slug}`,
          output_filename: fname,
          full_prompt: `${prefix} ${prompt}`,
        });
      }
    }
  }

  // Worksheet items
  if (content.worksheets) {
    let globalIdx = content.vocabulary?.filter(v => v.image_prompt).length || 0;
    for (let wi = 0; wi < content.worksheets.length; wi++) {
      const ws = content.worksheets[wi];
      if (ws.items) {
        for (const item of ws.items) {
          if (item.image_prompt) {
            globalIdx++;
            const fname = `ws${wi + 1}_${String(globalIdx).padStart(2, '0')}_${safeFilename(item.content || item.id)}.png`;
            if (!fs.existsSync(path.join(imgDir, fname))) {
              images.push({
                id: `${slug}/ws${wi + 1}_${item.content || item.id}`,
                pack_topic: content.topic,
                output_dir: `data/images/${slug}`,
                output_filename: fname,
                full_prompt: `${prefix} ${item.image_prompt}`,
              });
            }
          }
        }
      }
    }
  }
}

const output = {
  _meta: {
    generated_at: new Date().toISOString(),
    total_images: images.length,
    total_packs: new Set(images.map(i => i.pack_topic)).size,
    description: 'Missing images only',
  },
  images,
};

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
console.log(`生成 ${images.length} 张缺图 prompt → ${OUTPUT}`);
