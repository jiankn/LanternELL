/**
 * 为 matching worksheet 的 items 补充 match_target 字段
 * match_target = content_l2（西班牙语翻译），用于连线题的右侧列
 * 
 * 用法: node scripts/fix-match-targets.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = path.resolve(__dirname, '..', 'data', 'packs');

function main() {
  const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
  let fixedPacks = 0, fixedItems = 0;

  for (const file of files) {
    const filePath = path.join(PACKS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.worksheets) continue;

    let changed = false;
    for (const ws of data.worksheets) {
      if (ws.type !== 'matching') continue;

      for (const item of ws.items) {
        if (item.match_target) continue; // 已有

        // 优先用 content_l2，其次用 correct_answer
        if (item.content_l2) {
          item.match_target = item.content_l2;
          fixedItems++;
          changed = true;
        } else if (item.correct_answer) {
          item.match_target = item.correct_answer;
          fixedItems++;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      fixedPacks++;
      console.log(`  ✅ ${data.topic} (${data.age_band})`);
    }
  }

  console.log(`\n总计: ${fixedPacks} 个 pack, ${fixedItems} 个 items 补充了 match_target`);
}

main();
