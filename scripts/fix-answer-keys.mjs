/**
 * 为缺少 answer_key 的 pack 自动从 worksheet items 的 correct_answer 生成
 * 
 * 用法: node scripts/fix-answer-keys.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = path.resolve(__dirname, '..', 'data', 'packs');

function main() {
  const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
  let fixed = 0;

  for (const file of files) {
    const filePath = path.join(PACKS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.worksheets?.length) continue;
    if (data.answer_key?.length > 0) continue; // 已有 answer_key

    const answerKey = [];
    for (let wi = 0; wi < data.worksheets.length; wi++) {
      const ws = data.worksheets[wi];
      const answers = {};
      let hasAnswers = false;

      for (const item of ws.items) {
        if (item.correct_answer) {
          answers[item.id] = item.correct_answer;
          hasAnswers = true;
        }
      }

      if (hasAnswers) {
        answerKey.push({
          worksheet_id: `ws-${wi + 1}`,
          answers,
        });
      } else {
        // writing/tracing 等无标准答案的 worksheet
        const desc = ws.type === 'writing'
          ? 'Answers will vary. Check for complete sentences and correct use of the target vocabulary or sentence frames.'
          : ws.type === 'tracing'
          ? 'No specific answer key needed for tracing. Check for legibility and completeness.'
          : `Answers will vary for ${ws.type} activity.`;
        answerKey.push({
          worksheet_id: `ws-${wi + 1}`,
          answers: desc,
        });
      }
    }

    if (answerKey.length > 0) {
      data.answer_key = answerKey;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      fixed++;
      console.log(`  ✅ ${data.topic} (${data.age_band}): 生成 ${answerKey.length} 个 answer_key`);
    }
  }

  console.log(`\n总计修复: ${fixed} 个 pack`);
}

main();
