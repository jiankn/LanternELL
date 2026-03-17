// Batch add proficiency_level to all pack JSON files
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

// Mapping rules based on age_band and content complexity
function getProficiencyLevel(pack) {
  const age = pack.age_band;
  const topic = (pack.topic || '').toLowerCase();
  const packType = pack.pack_type;

  // K-2: mostly entering/emerging
  if (age === 'K-2' || age === 'Pre-K') {
    // Basic survival topics = entering
    if (['colors', 'numbers-1-20', 'body-parts', 'classroom-objects', 'animals', 'food', 'clothes', 'shapes'].some(t => topic.includes(t.replace('-', ' ').replace('_', ' ')) || topic.includes(t))) {
      return 'entering';
    }
    // Sentence frames and communication = emerging (requires some output)
    if (packType === 'sentence_frames' || packType === 'parent_communication') {
      return 'entering';
    }
    // Classroom labels = entering (receptive)
    if (packType === 'classroom_labels') {
      return 'entering';
    }
    return 'emerging';
  }

  // 3-5: emerging/developing
  if (age === '3-5') {
    if (packType === 'sentence_frames') {
      return 'developing';
    }
    return 'emerging';
  }

  // 6-8: developing/expanding
  if (age === '6-8') {
    if (topic.includes('literary') || topic.includes('research') || topic.includes('academic')) {
      return 'expanding';
    }
    return 'developing';
  }

  // 9-12
  if (age === '9-12') {
    return 'expanding';
  }

  return 'emerging';
}

const files = readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
let updated = 0;

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  const pack = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  const level = getProficiencyLevel(pack);
  
  // Insert proficiency_level after target_user
  const newPack = {};
  for (const [key, value] of Object.entries(pack)) {
    newPack[key] = value;
    if (key === 'target_user') {
      newPack['proficiency_level'] = level;
    }
  }
  
  writeFileSync(filePath, JSON.stringify(newPack, null, 2) + '\n');
  console.log(`${file}: ${pack.age_band} → ${level}`);
  updated++;
}

console.log(`\nDone. Updated ${updated} files.`);
