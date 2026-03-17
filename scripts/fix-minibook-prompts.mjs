/**
 * 为缺少 image_prompt 的 mini_book 页面自动补充提示词
 * 
 * 规则：
 *   - 第 1 页（封面）不需要 image_prompt
 *   - 其余页面根据 text_en 内容生成简洁的图片描述
 * 
 * 用法: node scripts/fix-minibook-prompts.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = path.resolve(__dirname, '..', 'data', 'packs');

// 从 text_en 生成描述性的 image_prompt
function generateImagePrompt(textEn, topic) {
  // 取前两句话作为上下文
  const sentences = textEn.split(/(?<=[.!?])\s+/).slice(0, 2);
  const context = sentences.join(' ').trim();
  
  // 生成描述性 prompt：主题 + 内容概要
  let prompt = `a child-friendly illustration about: ${context}`;
  
  // 限制长度
  if (prompt.length > 120) {
    prompt = prompt.substring(0, 120).replace(/\s+\S*$/, '');
  }
  
  return prompt;
}

function main() {
  const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
  let totalFixed = 0;

  for (const file of files) {
    const filePath = path.join(PACKS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.mini_book?.pages?.length) continue;

    const hasAnyPrompt = data.mini_book.pages.some(p => p.image_prompt);
    // 检查是否是我们刚才自动生成的低质量 prompt（太短）
    const hasGoodPrompts = data.mini_book.pages
      .filter(p => p.page_number > 1 && p.image_prompt)
      .every(p => p.image_prompt.length > 20);
    if (hasAnyPrompt && hasGoodPrompts) continue;

    let fixed = 0;
    for (const page of data.mini_book.pages) {
      if (page.page_number === 1) continue; // 封面不需要图

      page.image_prompt = generateImagePrompt(page.text_en, data.topic);
      fixed++;
    }

    if (fixed > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`  ✅ ${data.topic} (${data.age_band}): 补充 ${fixed} 个 image_prompt`);
      totalFixed += fixed;
    }
  }

  console.log(`\n总计补充: ${totalFixed} 个 image_prompt`);
}

main();
