// AI Content Generation - Unified Interface
// Uses the multi-provider architecture

import type { PackContent, PackType, LanguagePair, AgeBand } from './content-schema';
import { getAIConfig, generateWithAI, AIProvider, getConfiguredProviders } from './ai-providers';

// Import adapters to register them (they self-register)
import './ai-providers/openai';
import './ai-providers/zhipuai';

// Prompt templates - identical to before
const SYSTEM_PROMPTS: Record<PackType, string> = {
  vocabulary_pack: `You are an expert ESL/ELL curriculum designer specializing in K-2 newcomer students. 
You create vocabulary packs with age-appropriate, classroom-tested content.
Always respond with valid JSON only, no explanations.`,

  sentence_frames: `You are an expert ESL/ELL curriculum designer specializing in sentence frames for K-2 newcomer students.
You create functional sentence patterns that help ELL students communicate in classroom settings.
Always respond with valid JSON only, no explanations.`,

  classroom_labels: `You are an expert at creating bilingual classroom labels for K-2 settings.
Labels should be practical, high-frequency, and useful for language immersion.
Always respond with valid JSON only, no explanations.`,

  parent_communication: `You are an expert at creating bilingual parent communication templates for K-2 teachers.
Notes should be warm, clear, and professional. Include appropriate sections.
Always respond with valid JSON only, no explanations.`,
};

const PROMPT_TEMPLATES: Record<PackType, string> = {
  vocabulary_pack: `Create a vocabulary pack for the topic "{{topic}}" for K-2 {{age_band}} {{language_pair}} ELL students.

Requirements:
- Include exactly {{count}} vocabulary items
- Each item must have: en (English word), l2 (translation), image_prompt (brief description for illustration)
- Include a mini-book with 8 pages (title + 7 content pages)
- Include 3 worksheets: 1 matching, 1 tracing, 1 coloring
- Add teacher_notes with objective, suggested_use, materials_needed, differentiation_tips
- Include answer_key for all worksheets
- License: "personal-classroom-use"

Format the output as a JSON object with this structure:
{
  "pack_id": "auto-generated-id",
  "pack_type": "vocabulary_pack",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL newcomer K-2",
  "title": "Descriptive title",
  "description": "Brief description",
  "vocabulary": [{"en": "word", "l2": "translation", "image_prompt": "description"}],
  "worksheets": [{"type": "matching|tracing|coloring", "instructions_en": "...", "items": [...]}],
  "mini_book": {"title": "...", "pages": [{"page_number": 1, "text_en": "..."}]},
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
  "answer_key": [...],
  "license": "personal-classroom-use",
  "version": "1.0",
  "created_at": "ISO date",
  "updated_at": "ISO date"
}`,

  sentence_frames: `Create sentence frames for the topic "{{topic}}" for K-2 {{age_band}} {{language_pair}} ELL students.

Requirements:
- Include exactly {{count}} sentence frames
- Frames should be functional for classroom communication
- Include translation in the target language
- Add 2 worksheets for practice
- Include teacher_notes with objective and suggested_use
- License: "personal-classroom-use"

Output as JSON with:
{
  "pack_id": "auto-generated",
  "pack_type": "sentence_frames",
  "topic": "{{topic}}",
  "title": "...",
  "sentence_frames": [{"frame": "...", "translation": "..."}],
  "worksheets": [...],
  "teacher_notes": {...},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,

  classroom_labels: `Create classroom labels for "{{topic}}" in {{language_pair}} for K-2.

Requirements:
- Include exactly {{count}} labels
- Labels should be practical and high-frequency
- Categorize labels appropriately
- Include singular and plural forms where applicable
- License: "personal-classroom-use"

Output as JSON:
{
  "pack_id": "auto-generated",
  "pack_type": "classroom_labels",
  "topic": "{{topic}}",
  "title": "...",
  "labels": [{"en": "...", "l2": "...", "category": "...", "plural_form": "..."}],
  "teacher_notes": {...},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,

  parent_communication: `Create parent communication templates for "{{topic}}" in {{language_pair}} for K-2.

Requirements:
- Include multiple note types (welcome, homework, behavior, progress)
- Make templates warm, clear, and professional
- Include both English and translated versions
- Add signature fields where appropriate
- License: "personal-classroom-use"

Output as JSON:
{
  "pack_id": "auto-generated",
  "pack_type": "parent_communication",
  "topic": "{{topic}}",
  "title": "...",
  "parent_notes": [{"type": "...", "title_en": "...", "title_l2": "...", "content_en": "...", "content_l2": "...", "signature_required": true/false}],
  "teacher_notes": {...},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,
};

// ============================================
// Generation Functions
// ============================================

export async function generateVocabularyPack(
  params: {
    topic: string;
    language_pair: LanguagePair;
    age_band: AgeBand;
    vocabulary_count: number;
  }
): Promise<PackContent> {
  const { topic, language_pair, age_band, vocabulary_count } = params;
  
  const prompt = PROMPT_TEMPLATES.vocabulary_pack
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{age_band\}\}/g, age_band)
    .replace(/\{\{language_pair\}\}/g, language_pair)
    .replace(/\{\{count\}\}/g, vocabulary_count.toString());

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.vocabulary_pack,
    userPrompt: prompt,
    temperature: 0.7,
  });
}

export async function generateSentenceFrames(
  params: {
    topic: string;
    language_pair: LanguagePair;
    age_band: AgeBand;
    frame_count: number;
  }
): Promise<PackContent> {
  const { topic, language_pair, age_band, frame_count } = params;
  
  const prompt = PROMPT_TEMPLATES.sentence_frames
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{age_band\}\}/g, age_band)
    .replace(/\{\{language_pair\}\}/g, language_pair)
    .replace(/\{\{count\}\}/g, frame_count.toString());

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.sentence_frames,
    userPrompt: prompt,
    temperature: 0.7,
  });
}

export async function generateClassroomLabels(
  params: {
    topic: string;
    language_pair: LanguagePair;
    age_band: AgeBand;
    label_count: number;
  }
): Promise<PackContent> {
  const { topic, language_pair, age_band, label_count } = params;
  
  const prompt = PROMPT_TEMPLATES.classroom_labels
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{language_pair\}\}/g, language_pair)
    .replace(/\{\{count\}\}/g, label_count.toString());

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.classroom_labels,
    userPrompt: prompt,
    temperature: 0.7,
  });
}

export async function generateParentNotes(
  params: {
    topic: string;
    language_pair: LanguagePair;
    age_band: AgeBand;
  }
): Promise<PackContent> {
  const { topic, language_pair, age_band } = params;
  
  const prompt = PROMPT_TEMPLATES.parent_communication
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{language_pair\}\}/g, language_pair);

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.parent_communication,
    userPrompt: prompt,
    temperature: 0.7,
  });
}

// ============================================
// Utility Functions
// ============================================

export function validateContent(content: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'object') {
    return { valid: false, errors: ['Content must be an object'] };
  }
  
  const c = content as Record<string, unknown>;
  
  if (!c.pack_type) errors.push('Missing pack_type');
  if (!c.topic) errors.push('Missing topic');
  if (!c.license) errors.push('Missing license');
  
  switch (c.pack_type) {
    case 'vocabulary_pack':
      if (!Array.isArray(c.vocabulary) || c.vocabulary.length === 0) {
        errors.push('vocabulary must be a non-empty array');
      }
      break;
    case 'sentence_frames':
      if (!Array.isArray(c.sentence_frames) || c.sentence_frames.length === 0) {
        errors.push('sentence_frames must be a non-empty array');
      }
      break;
    case 'classroom_labels':
      if (!Array.isArray(c.labels) || c.labels.length === 0) {
        errors.push('labels must be a non-empty array');
      }
      break;
    case 'parent_communication':
      if (!Array.isArray(c.parent_notes) || c.parent_notes.length === 0) {
        errors.push('parent_notes must be a non-empty array');
      }
      break;
  }
  
  return { valid: errors.length === 0, errors };
}

export function getCurrentProvider(): AIProvider {
  return getAIConfig().ACTIVE_PROVIDER;
}

export function isProviderConfigured(provider: AIProvider): boolean {
  return getConfiguredProviders(getAIConfig()).includes(provider);
}
