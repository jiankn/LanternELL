// Add scenario_tags to all pack JSON files
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

function getScenarioTags(pack) {
  const topic = (pack.topic || '').toLowerCase();
  const packType = pack.pack_type;
  const tags = [];

  // === Pack type based tags ===
  if (packType === 'classroom_labels') {
    tags.push('classroom_setup');
    // Labels are used at start of year and when new students arrive
    tags.push('first_week');
    if (topic.includes('routine') || topic.includes('time') || topic.includes('day')) {
      tags.push('daily_routine');
    }
  }

  if (packType === 'parent_communication') {
    tags.push('parent_conference');
    if (topic.includes('welcome')) {
      tags.push('first_week');
      tags.push('new_student_arrival');
    }
    if (topic.includes('homework') || topic.includes('progress')) {
      tags.push('ongoing_support');
    }
  }

  if (packType === 'sentence_frames') {
    tags.push('daily_routine');
    if (topic.includes('greeting') || topic.includes('help') || topic.includes('instruction')) {
      tags.push('first_week');
      tags.push('new_student_arrival');
    }
    if (topic.includes('feeling') || topic.includes('sharing')) {
      tags.push('ongoing_support');
    }
    if (topic.includes('academic') || topic.includes('book') || topic.includes('writing') || topic.includes('literary') || topic.includes('research')) {
      tags.push('ongoing_support');
    }
  }

  if (packType === 'vocabulary_pack') {
    // Basic survival vocabulary = first week / new student
    const firstWeekTopics = ['classroom', 'colors', 'numbers', 'body', 'greetings', 'shapes', 'food', 'clothes'];
    if (firstWeekTopics.some(t => topic.includes(t))) {
      tags.push('first_week');
      tags.push('new_student_arrival');
    }

    // Academic vocabulary = ongoing
    const academicTopics = ['academic', 'science', 'math', 'reading', 'writing', 'social studies', 'geography', 'technology', 'health', 'arts', 'lab', 'literary', 'career'];
    if (academicTopics.some(t => topic.includes(t))) {
      tags.push('ongoing_support');
    }

    // General vocabulary = daily routine
    tags.push('daily_routine');
  }

  // === Topic based overrides ===
  if (topic.includes('welcome') || topic.includes('greeting')) {
    if (!tags.includes('first_week')) tags.push('first_week');
    if (!tags.includes('new_student_arrival')) tags.push('new_student_arrival');
  }

  if (topic.includes('assessment') || topic.includes('progress') || topic.includes('report')) {
    if (!tags.includes('assessment_week')) tags.push('assessment_week');
  }

  // Deduplicate
  return [...new Set(tags)];
}

const files = readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
let updated = 0;

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  const pack = JSON.parse(readFileSync(filePath, 'utf-8'));

  const tags = getScenarioTags(pack);

  // Insert scenario_tags after proficiency_level (or after target_user)
  const newPack = {};
  for (const [key, value] of Object.entries(pack)) {
    newPack[key] = value;
    if (key === 'proficiency_level') {
      newPack['scenario_tags'] = tags;
    }
  }

  // Fallback: if proficiency_level wasn't found, add after target_user
  if (!newPack.scenario_tags) {
    const newPack2 = {};
    for (const [key, value] of Object.entries(pack)) {
      newPack2[key] = value;
      if (key === 'target_user') {
        newPack2['scenario_tags'] = tags;
      }
    }
    writeFileSync(filePath, JSON.stringify(newPack2, null, 2) + '\n');
  } else {
    writeFileSync(filePath, JSON.stringify(newPack, null, 2) + '\n');
  }

  console.log(`${file}: [${tags.join(', ')}]`);
  updated++;
}

console.log(`\nDone. Updated ${updated} files.`);
