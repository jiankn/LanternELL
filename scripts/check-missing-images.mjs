import fs from 'fs';
import path from 'path';

const PACKS_DIR = 'data/packs';
const IMAGES_DIR = 'data/images';

function makeSlug(topic, ageBand) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '-' + ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
function safeFilename(str) {
  return str.toLowerCase().replace(/[/\\:*?"<>|]+/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const packFiles = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
const missing = [];

for (const pf of packFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, pf), 'utf8'));
  const slug = makeSlug(content.topic, content.age_band || 'K-2');
  const imgDir = path.join(IMAGES_DIR, slug);

  // Mini book
  if (content.mini_book?.pages) {
    for (const page of content.mini_book.pages) {
      const fname = `minibook_p${page.page_number}.png`;
      if (!fs.existsSync(path.join(imgDir, fname))) {
        missing.push({ pack: pf.replace('.json',''), type: 'minibook', file: fname, slug, prompt: page.image_prompt || page.text_en });
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
            const fname = `ws${wi+1}_${String(globalIdx).padStart(2,'0')}_${safeFilename(item.content || item.id)}.png`;
            if (!fs.existsSync(path.join(imgDir, fname))) {
              missing.push({ pack: pf.replace('.json',''), type: 'ws_item', file: fname, slug, prompt: item.image_prompt });
            }
          }
        }
      }
    }
  }

  // Vocab
  if (content.vocabulary) {
    let idx = 0;
    for (const item of content.vocabulary) {
      if (item.image_prompt) {
        idx++;
        const fname = `vocab_${String(idx).padStart(2,'0')}_${safeFilename(item.en)}.png`;
        if (!fs.existsSync(path.join(imgDir, fname))) {
          missing.push({ pack: pf.replace('.json',''), type: 'vocab', file: fname, slug, prompt: item.image_prompt });
        }
      }
    }
  }

  // Speaking prompts
  if (content.speaking_prompts) {
    for (let i = 0; i < content.speaking_prompts.length; i++) {
      const sp = content.speaking_prompts[i];
      if (sp.visual_cue) {
        const fname = `speaking_${String(i+1).padStart(2,'0')}.png`;
        if (!fs.existsSync(path.join(imgDir, fname))) {
          missing.push({ pack: pf.replace('.json',''), type: 'speaking', file: fname, slug, prompt: sp.visual_cue });
        }
      }
    }
  }

  // Routine cards
  if (content.visual_routine_cards) {
    for (let i = 0; i < content.visual_routine_cards.length; i++) {
      const rc = content.visual_routine_cards[i];
      if (rc.icon_prompt) {
        const fname = `routine_${String(i+1).padStart(2,'0')}.png`;
        if (!fs.existsSync(path.join(imgDir, fname))) {
          missing.push({ pack: pf.replace('.json',''), type: 'routine', file: fname, slug, prompt: rc.icon_prompt });
        }
      }
    }
  }

  // Classroom rules
  if (content.classroom_rules) {
    for (let i = 0; i < content.classroom_rules.length; i++) {
      const cr = content.classroom_rules[i];
      if (cr.icon_prompt) {
        const fname = `rule_${String(i+1).padStart(2,'0')}.png`;
        if (!fs.existsSync(path.join(imgDir, fname))) {
          missing.push({ pack: pf.replace('.json',''), type: 'rule', file: fname, slug, prompt: cr.icon_prompt });
        }
      }
    }
  }
}

// 统计
const byType = {};
for (const m of missing) { byType[m.type] = (byType[m.type] || 0) + 1; }

console.log('=== 缺图统计 ===');
console.log(`总计缺图: ${missing.length} 张`);
console.log('');
console.log('按类型:');
for (const [type, count] of Object.entries(byType).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${type}: ${count} 张`);
}

// Minibook 详情
const mbMissing = missing.filter(m => m.type === 'minibook');
if (mbMissing.length) {
  console.log('');
  console.log('=== Mini Book 缺图 ===');
  const byPack = {};
  for (const m of mbMissing) { if (!byPack[m.pack]) byPack[m.pack] = []; byPack[m.pack].push(m.file); }
  for (const [pack, files] of Object.entries(byPack)) {
    console.log(`  ${pack}: ${files.join(', ')}`);
  }
}

// Worksheet 详情
const wsMissing = missing.filter(m => m.type === 'ws_item');
if (wsMissing.length) {
  console.log('');
  console.log('=== Worksheet 缺图 ===');
  for (const m of wsMissing) {
    console.log(`  ${m.slug}/${m.file}`);
  }
}

console.log(`\n预计费用: ~${missing.length} credits (每张 1 credit)`);
