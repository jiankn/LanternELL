/**
 * 批量图片提示词提取脚本
 * 
 * 扫描 data/packs/ 下所有 JSON 文件，提取所有需要 AI 生图的提示词，
 * 结合对应年级段的风格提示词，输出 batch-prompts.json 供批量 API 调用。
 * 
 * 用法: node scripts/extract-batch-prompts.mjs
 * 输出: data/batch-prompts.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'data', 'packs');
const OUTPUT_FILE = path.join(ROOT, 'data', 'batch-prompts.json');

// ============================================================
// 风格提示词（按年级段）
// ============================================================
const STYLE_PROMPTS = {
    'K-2': 'kawaii cute style with a happy smiling face, big round eyes, small pink blush cheeks, thick clean black outlines, bright saturated cheerful colors, simple rounded shapes, white clean background, no text, no words, no letters, professional children\'s educational flashcard illustration, consistent art style',
    '3-5': 'modern flat vector illustration, friendly subtle expression, thick clean outlines, vibrant saturated colors, geometric clean shapes, educational material style, white clean background, no text, no words, no letters, professional children\'s educational flashcard illustration, consistent art style',
    '6-8': 'clean anime illustration style, semi-realistic proportions, cell shaded coloring, vibrant colors, detailed but clean design, thick outlines, white clean background, no text, no words, no letters, professional educational material illustration, consistent art style',
};

// Coloring worksheet 专用 (线稿)
const STYLE_COLORING = 'black and white line art, thick clean outlines, no fill, no shading, no color, kawaii cute style with a happy smiling face, big round eyes, simple rounded shapes, white background, coloring book page for children, no text, no words';

// ============================================================
// 提取逻辑
// ============================================================
function makeSlug(topic, ageBand) {
    return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '-' + ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function extractImages(packData) {
    const images = [];
    const ageBand = packData.age_band || 'K-2';
    const stylePrompt = STYLE_PROMPTS[ageBand] || STYLE_PROMPTS['K-2'];
    const slug = makeSlug(packData.topic, ageBand);
    let idx = 0;

    // 1. Vocabulary items
    if (packData.vocabulary) {
        for (const item of packData.vocabulary) {
            if (item.image_prompt) {
                idx++;
                images.push({
                    id: `${slug}/vocab_${String(idx).padStart(2, '0')}_${item.en.toLowerCase().replace(/\s+/g, '-')}`,
                    pack_id: packData.pack_id,
                    pack_topic: packData.topic,
                    age_band: ageBand,
                    type: 'vocabulary',
                    en: item.en,
                    l2: item.l2,
                    original_prompt: item.image_prompt,
                    full_prompt: `${item.image_prompt}, ${stylePrompt}`,
                    output_filename: `vocab_${String(idx).padStart(2, '0')}_${item.en.toLowerCase().replace(/\s+/g, '-')}.png`,
                    output_dir: `data/images/${slug}/`,
                });
            }
        }
    }

    // 2. Worksheet items
    if (packData.worksheets) {
        for (let wi = 0; wi < packData.worksheets.length; wi++) {
            const ws = packData.worksheets[wi];
            const isColoring = ws.type === 'coloring';
            const wsStyle = isColoring ? STYLE_COLORING : stylePrompt;

            if (ws.items) {
                for (const item of ws.items) {
                    if (item.image_prompt) {
                        idx++;
                        images.push({
                            id: `${slug}/ws${wi + 1}_${String(idx).padStart(2, '0')}_${(item.content || item.id).toLowerCase().replace(/\s+/g, '-')}`,
                            pack_id: packData.pack_id,
                            pack_topic: packData.topic,
                            age_band: ageBand,
                            type: isColoring ? 'worksheet_coloring' : `worksheet_${ws.type}`,
                            en: item.content || '',
                            original_prompt: item.image_prompt,
                            full_prompt: `${item.image_prompt}, ${wsStyle}`,
                            output_filename: `ws${wi + 1}_${String(idx).padStart(2, '0')}_${(item.content || item.id).toLowerCase().replace(/\s+/g, '-')}.png`,
                            output_dir: `data/images/${slug}/`,
                        });
                    }
                }
            }
        }
    }

    // 3. Mini book pages
    if (packData.mini_book?.pages) {
        for (const page of packData.mini_book.pages) {
            if (page.image_prompt) {
                idx++;
                images.push({
                    id: `${slug}/minibook_p${page.page_number}`,
                    pack_id: packData.pack_id,
                    pack_topic: packData.topic,
                    age_band: ageBand,
                    type: 'mini_book',
                    en: page.text_en || '',
                    original_prompt: page.image_prompt,
                    full_prompt: `${page.image_prompt}, ${stylePrompt}`,
                    output_filename: `minibook_p${page.page_number}.png`,
                    output_dir: `data/images/${slug}/`,
                });
            }
        }
    }

    // 4. Speaking prompts (visual_cue)
    if (packData.speaking_prompts) {
        for (let si = 0; si < packData.speaking_prompts.length; si++) {
            const sp = packData.speaking_prompts[si];
            if (sp.visual_cue) {
                idx++;
                images.push({
                    id: `${slug}/speaking_${String(si + 1).padStart(2, '0')}`,
                    pack_id: packData.pack_id,
                    pack_topic: packData.topic,
                    age_band: ageBand,
                    type: 'speaking_prompt',
                    en: sp.expected_response || '',
                    original_prompt: sp.visual_cue,
                    full_prompt: `${sp.visual_cue}, ${stylePrompt}`,
                    output_filename: `speaking_${String(si + 1).padStart(2, '0')}.png`,
                    output_dir: `data/images/${slug}/`,
                });
            }
        }
    }

    // 5. Visual routine cards (icon_prompt)
    if (packData.visual_routine_cards) {
        for (let ri = 0; ri < packData.visual_routine_cards.length; ri++) {
            const rc = packData.visual_routine_cards[ri];
            if (rc.icon_prompt) {
                idx++;
                images.push({
                    id: `${slug}/routine_${String(ri + 1).padStart(2, '0')}`,
                    pack_id: packData.pack_id,
                    pack_topic: packData.topic,
                    age_band: ageBand,
                    type: 'routine_card',
                    en: rc.routine_en || '',
                    original_prompt: rc.icon_prompt,
                    full_prompt: `${rc.icon_prompt}, ${stylePrompt}`,
                    output_filename: `routine_${String(ri + 1).padStart(2, '0')}.png`,
                    output_dir: `data/images/${slug}/`,
                });
            }
        }
    }

    // 6. Classroom rules (icon_prompt)
    if (packData.classroom_rules) {
        for (let ci = 0; ci < packData.classroom_rules.length; ci++) {
            const cr = packData.classroom_rules[ci];
            if (cr.icon_prompt) {
                idx++;
                images.push({
                    id: `${slug}/rule_${String(ci + 1).padStart(2, '0')}`,
                    pack_id: packData.pack_id,
                    pack_topic: packData.topic,
                    age_band: ageBand,
                    type: 'classroom_rule',
                    en: cr.rule_en || '',
                    original_prompt: cr.icon_prompt,
                    full_prompt: `${cr.icon_prompt}, ${stylePrompt}`,
                    output_filename: `rule_${String(ci + 1).padStart(2, '0')}.png`,
                    output_dir: `data/images/${slug}/`,
                });
            }
        }
    }

    return images;
}

// ============================================================
// 主逻辑
// ============================================================
function main() {
    console.log('========================================');
    console.log('  批量图片提示词提取');
    console.log('========================================\n');

    const packFiles = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
    console.log(`找到 ${packFiles.length} 个 Pack 文件\n`);

    const allImages = [];
    const stats = { vocabulary: 0, worksheet_matching: 0, worksheet_tracing: 0, worksheet_coloring: 0, mini_book: 0, speaking_prompt: 0, routine_card: 0, classroom_rule: 0, other: 0 };

    for (const file of packFiles) {
        const data = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, file), 'utf8'));
        const images = extractImages(data);
        allImages.push(...images);

        for (const img of images) {
            const key = img.type in stats ? img.type : 'other';
            stats[key] = (stats[key] || 0) + 1;
        }

        console.log(`  ${data.topic} (${data.age_band}, ${data.pack_type}): ${images.length} 张图`);
    }

    // 输出统计
    console.log('\n========================================');
    console.log(`  总计: ${allImages.length} 张图片`);
    console.log('========================================');
    console.log('  按类型统计:');
    for (const [type, count] of Object.entries(stats)) {
        if (count > 0) console.log(`    ${type}: ${count}`);
    }

    // 写入 batch-prompts.json
    const output = {
        _meta: {
            generated_at: new Date().toISOString(),
            total_images: allImages.length,
            total_packs: packFiles.length,
            style_prompts: STYLE_PROMPTS,
            style_coloring: STYLE_COLORING,
        },
        stats,
        images: allImages,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n输出文件: ${OUTPUT_FILE}`);
    console.log('已完成!');
}

main();
