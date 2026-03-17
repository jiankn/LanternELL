// Add response_section and response prompts to parent communication packs
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

const files = readdirSync(PACKS_DIR).filter(f => f.includes('parent_communication'));

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  const pack = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (!pack.parent_notes) continue;

  let changed = false;
  for (const note of pack.parent_notes) {
    // welcome and behavior notes should have response_section = true
    if (['welcome', 'behavior', 'homework', 'attendance'].includes(note.type)) {
      if (!note.response_section) {
        note.response_section = true;
        note.response_prompt_en = 'I have read and understood this letter. / Parent/Guardian Signature: _______________ Date: ___/___/______';
        note.response_prompt_l2 = 'He leído y entendido esta carta. / Firma del padre/tutor: _______________ Fecha: ___/___/______';
        changed = true;
        console.log(`${file}: ${note.type} → response_section = true`);
      }
    }
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(pack, null, 2) + '\n');
  }
}

console.log('\nDone.');
