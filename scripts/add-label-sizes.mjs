// Add small size variants to classroom labels where appropriate
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

// Labels that should be "small" — items that get stuck ON objects, bins, shelves
const smallCategories = ['supplies', 'furniture', 'objects', 'tools', 'equipment', 'materials'];
const smallKeywords = [
  'pencil', 'pen', 'crayon', 'marker', 'eraser', 'ruler', 'scissors', 'glue',
  'paper', 'folder', 'notebook', 'book', 'backpack', 'tape', 'stapler',
  'bin', 'box', 'basket', 'tray', 'shelf', 'drawer', 'cabinet', 'cubby',
  'chair', 'desk', 'table', 'stool',
  'beaker', 'test tube', 'microscope', 'goggles', 'thermometer', 'magnet',
  'globe', 'map', 'calculator', 'computer', 'tablet', 'headphones',
  'clock', 'calendar',
];

// Labels that should be "full" — areas, zones, signs posted on walls/doors
const fullKeywords = [
  'corner', 'center', 'station', 'area', 'zone', 'door', 'window',
  'carpet', 'rug', 'board', 'whiteboard', 'bulletin',
  'library', 'reading', 'art', 'math', 'science', 'music',
  'restroom', 'bathroom', 'cafeteria', 'gym', 'office',
  'morning', 'lunch', 'dismissal', 'recess',
];

function shouldBeSmall(label) {
  const en = label.en.toLowerCase();
  const cat = (label.category || '').toLowerCase();
  
  if (smallCategories.includes(cat)) return true;
  if (smallKeywords.some(kw => en.includes(kw))) return true;
  if (fullKeywords.some(kw => en.includes(kw))) return false;
  
  return false; // default to full
}

const files = readdirSync(PACKS_DIR).filter(f => f.includes('classroom_labels'));

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  const pack = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (!pack.labels) continue;

  let smallCount = 0;
  let fullCount = 0;

  for (const label of pack.labels) {
    if (shouldBeSmall(label)) {
      label.size = 'small';
      smallCount++;
    } else {
      label.size = label.size || 'full';
      fullCount++;
    }
  }

  writeFileSync(filePath, JSON.stringify(pack, null, 2) + '\n');
  console.log(`${file}: ${smallCount} small, ${fullCount} full`);
}

console.log('\nDone.');
