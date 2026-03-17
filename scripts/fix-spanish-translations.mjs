// Fix Spanish translations to match US bilingual classroom actual usage
// Based on research from TPT bilingual labels, Colorín Colorado, US dual language programs
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

// Corrections based on actual US bilingual classroom usage
// Format: { wrong/awkward: correct/natural }
const corrections = {
  // === Classroom routine terms ===
  // "Círculo de Conversación" is not used in US schools; "Tiempo en Círculo" is standard
  'Círculo de Conversación': 'Tiempo en Círculo',
  // "Descanso para el Baño" is overly formal; US schools use "Ir al Baño" or "Hora del Baño"
  'Descanso para el Baño': 'Ir al Baño',

  // === Classroom area terms ===
  // "Rincón de Lectura" is correct and widely used — keep as is
  // "Área de la Alfombra" — US dual language classrooms commonly say "La Alfombra" or "Área de la Alfombra"
  // Both are fine, but shorter is more natural for a label
  'Área de la Alfombra': 'La Alfombra',
  // "Escritorio del Maestro/a" — in practice, labels just say "Escritorio del Maestro" (without /a)
  'Escritorio del Maestro/a': 'Escritorio del Maestro',

  // === Parent communication terms ===
  // "hijo/a" is grammatically correct but reads awkwardly in letters
  // US bilingual schools typically use "su hijo(a)" or "su estudiante"
  // We'll replace the most common awkward patterns
  'su hijo/a': 'su hijo(a)',
  'hijo/a': 'hijo(a)',
  'Su hijo/a': 'Su hijo(a)',
  'niño/a': 'niño(a)',
  'seguro/a': 'seguro(a)',
  'valorado/a': 'valorado(a)',
  'emocionado/a': 'emocionado(a)',
  'listo/a': 'listo(a)',
  'atento/a': 'atento(a)',
  'comprometido/a': 'comprometido(a)',
  'emocionada/o': 'emocionado(a)',

  // === Common classroom object terms ===
  // "pizarra" is correct for whiteboard in many regions, but US schools
  // commonly use "pizarrón" for the board. Both are acceptable.
  // TPT labels show "pizarrón" is more common in US context
  'pizarra': 'pizarrón',

  // === Greeting/routine terms ===
  // "Llegada por la Mañana" is fine but "Llegada" alone is more natural for a routine card
  'Llegada por la Mañana': 'Llegada',
  // "Hora del Almuerzo" is correct and widely used — keep as is

  // === Teacher notes terms ===
  // "maestra/o" — in US bilingual contexts, "maestro(a)" is standard
  'maestra/o': 'maestro(a)',
  'Maestro/a': 'Maestro(a)',
  'maestro/a': 'maestro(a)',
  'Nombre del Maestro/a': 'Nombre del Maestro(a)',
  'Nivel de Grado': 'Grado',
};

// Process all JSON files
const files = readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
let totalFixes = 0;

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  let content = readFileSync(filePath, 'utf-8');
  let fixCount = 0;

  for (const [wrong, correct] of Object.entries(corrections)) {
    // Use global replace to catch all instances
    const escaped = wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, correct);
      fixCount += matches.length;
    }
  }

  if (fixCount > 0) {
    writeFileSync(filePath, content);
    console.log(`${file}: ${fixCount} corrections`);
    totalFixes += fixCount;
  }
}

console.log(`\nDone. Applied ${totalFixes} total corrections across all files.`);
