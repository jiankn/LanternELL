// AI Content Generation - Unified Interface
// Uses the multi-provider architecture

import type { PackContent, PackType, LanguagePair, AgeBand } from './content-schema';
import { getAIConfig, generateWithAI, AIProvider, getConfiguredProviders } from './ai-providers';

// Import adapters to register them (they self-register)
import './ai-providers/openai';
import './ai-providers/zhipuai';
import './ai-providers/deepseek';
import './ai-providers/gemini';

// Prompt templates - identical to before
const SYSTEM_PROMPTS: Record<PackType, string> = {
  vocabulary_pack: `You are an expert ESL/ELL curriculum designer specializing in newcomer students from Pre-K through 8th grade. 
You create vocabulary packs with age-appropriate, classroom-tested content.
Adapt complexity based on the age_band: Pre-K uses simple 1-2 syllable words with heavy visual cues, K-2 uses basic vocabulary with tracing, 3-5 uses academic vocabulary with context sentences, 6-8 uses content-area vocabulary with definitions.
Always respond with valid JSON only, no explanations.`,

  sentence_frames: `You are an expert ESL/ELL curriculum designer specializing in sentence frames for newcomer students from Pre-K through 8th grade.
You create functional sentence patterns that help ELL students communicate in classroom settings.
Adapt complexity: Pre-K/K-2 uses 3-5 word frames, 3-5 uses compound sentences, 6-8 uses academic language frames.
Always respond with valid JSON only, no explanations.`,

  classroom_labels: `You are an expert at creating bilingual classroom labels for Pre-K through 8th grade settings.
Labels should be practical, high-frequency, and useful for language immersion.
Always respond with valid JSON only, no explanations.`,

  parent_communication: `You are an expert at creating bilingual parent communication templates for Pre-K through 8th grade teachers.
Notes should be warm, clear, and professional. Include appropriate sections.
Always respond with valid JSON only, no explanations.`,

  visual_supports: `You are an expert special education and ELL curriculum designer creating visual support materials.
Visual supports include behavior charts, visual schedules, social stories, emotion cards, transition cues, and sensory break cards.
These materials serve both ELL newcomers and students with IEPs/504 plans who benefit from visual scaffolding.
Adapt complexity based on age_band. Always respond with valid JSON only, no explanations.`,

  assessment_tools: `You are an expert at creating formative assessment tools for ELL and multilingual learners.
Assessment tools include progress checklists, self-assessment cards, observation guides, and rubrics.
Adapt to the student's proficiency level and age band. Always respond with valid JSON only, no explanations.`,
};

const PROMPT_TEMPLATES: Record<PackType, string> = {
  vocabulary_pack: `Create a vocabulary pack for the topic "{{topic}}" for {{age_band}} {{language_pair}} ELL students.

Requirements:
- Include exactly {{count}} vocabulary items
- Each item must have: en (English word), l2 (translation), image_prompt (brief description for illustration)
- Include a mini-book with 8 pages (title + 7 content pages)
- Include 3 worksheets: 1 matching, 1 tracing, 1 coloring
- Add teacher_notes with objective, suggested_use, materials_needed, differentiation_tips
- Include answer_key for all worksheets
- License: "personal-classroom-use"
- Adapt vocabulary complexity to the {{age_band}} grade level

Format the output as a JSON object with this structure:
{
  "pack_id": "auto-generated-id",
  "pack_type": "vocabulary_pack",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL newcomer {{age_band}}",
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

  sentence_frames: `Create sentence frames for the topic "{{topic}}" for {{age_band}} {{language_pair}} ELL students.

Requirements:
- Include exactly {{count}} sentence frames
- Frames should be functional for classroom communication
- Include translation in the target language
- Include 4 dialogue strips (2-person conversations using the frames)
- Include 4 speaking prompt cards with visual cues
- Add 2 worksheets: 1 writing practice, 1 fill-in-the-blank
- Include teacher_notes with objective and suggested_use
- Adapt sentence complexity to {{age_band}} grade level
- License: "personal-classroom-use"

Output as JSON with:
{
  "pack_id": "auto-generated",
  "pack_type": "sentence_frames",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL newcomer {{age_band}}",
  "title": "...",
  "description": "...",
  "sentence_frames": [{"frame": "...", "translation": "..."}],
  "dialogue_strips": [{"speaker_a_en": "...", "speaker_b_en": "...", "speaker_a_l2": "...", "speaker_b_l2": "...", "context": "..."}],
  "speaking_prompts": [{"prompt_en": "...", "prompt_l2": "...", "expected_response": "...", "visual_cue": "..."}],
  "worksheets": [{"type": "writing|fill-blank", "instructions_en": "...", "instructions_l2": "...", "items": [{"id": "1", "content": "...", "correct_answer": "..."}]}],
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,

  classroom_labels: `Create classroom labels for "{{topic}}" in {{language_pair}} for {{age_band}}.

Requirements:
- Include exactly {{count}} labels total
- Split into two sizes: 10 full-size labels (for walls/doors) and the rest as small-size labels (for objects/bins)
- Labels should be practical and high-frequency
- Categorize labels (supplies, furniture, areas, routines)
- Include 5 visual routine cards (morning arrival, lunch, dismissal, etc.)
- Include 4 classroom rules posters (bilingual)
- Include teacher_notes with setup tips
- License: "personal-classroom-use"

Output as JSON:
{
  "pack_id": "auto-generated",
  "pack_type": "classroom_labels",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL newcomer {{age_band}}",
  "title": "...",
  "description": "...",
  "labels": [{"en": "...", "l2": "...", "category": "...", "size": "full|small", "plural_form": "..."}],
  "visual_routine_cards": [{"routine_en": "...", "routine_l2": "...", "time_of_day": "morning|afternoon|dismissal", "icon_prompt": "..."}],
  "classroom_rules": [{"rule_en": "...", "rule_l2": "...", "icon_prompt": "..."}],
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,

  parent_communication: `Create parent communication templates for "{{topic}}" in {{language_pair}} for {{age_band}}.

Requirements:
- Include 7 note types: welcome, homework, behavior, progress, supply_request, attendance, general
- Make templates warm, clear, and professional
- Include both English and translated versions
- Add signature fields where appropriate
- Mark which notes need a parent response section (response_section: true)
- Include teacher_notes with when/how to use each note type
- License: "personal-classroom-use"

Output as JSON:
{
  "pack_id": "auto-generated",
  "pack_type": "parent_communication",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL newcomer {{age_band}}",
  "title": "...",
  "description": "...",
  "parent_notes": [{"type": "welcome|homework|behavior|progress|supply_request|attendance|general", "title_en": "...", "title_l2": "...", "content_en": "...", "content_l2": "...", "signature_required": true/false, "response_section": true/false}],
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,

  visual_supports: `Create visual support materials for "{{topic}}" in {{language_pair}} for {{age_band}} students (ELL and/or SPED).

Requirements:
- Include 6 visual schedule cards with bilingual labels and icon descriptions
- Include 4 social story pages (simple narrative with visual cues)
- Include 8 emotion/feeling cards with bilingual labels
- Include 4 behavior expectation visuals
- Include 4 transition cue cards
- Include teacher_notes with implementation strategies for both ELL and SPED contexts
- License: "personal-classroom-use"

Output as JSON:
{
  "pack_id": "auto-generated",
  "pack_type": "visual_supports",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL/SPED {{age_band}}",
  "title": "...",
  "description": "...",
  "visual_schedule": [{"activity_en": "...", "activity_l2": "...", "time": "...", "icon_prompt": "..."}],
  "social_story": [{"page": 1, "text_en": "...", "text_l2": "...", "image_prompt": "..."}],
  "emotion_cards": [{"emotion_en": "...", "emotion_l2": "...", "icon_prompt": "..."}],
  "behavior_visuals": [{"expectation_en": "...", "expectation_l2": "...", "icon_prompt": "..."}],
  "transition_cues": [{"cue_en": "...", "cue_l2": "...", "icon_prompt": "..."}],
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
  "license": "personal-classroom-use",
  "version": "1.0"
}`,

  assessment_tools: `Create assessment tools for "{{topic}}" in {{language_pair}} for {{age_band}} ELL students.

Requirements:
- Include a vocabulary mastery checklist (10 items)
- Include a student self-assessment card (can-do statements)
- Include a teacher observation guide with 8 observable behaviors
- Include a simple rubric (3 levels: beginning, developing, proficient)
- Include teacher_notes with how to use each tool
- License: "personal-classroom-use"

Output as JSON:
{
  "pack_id": "auto-generated",
  "pack_type": "assessment_tools",
  "topic": "{{topic}}",
  "age_band": "{{age_band}}",
  "language_pair": "{{language_pair}}",
  "target_user": "ELL {{age_band}}",
  "title": "...",
  "description": "...",
  "mastery_checklist": [{"skill_en": "...", "skill_l2": "...", "level": "beginning|developing|proficient"}],
  "self_assessment": [{"statement_en": "I can ...", "statement_l2": "..."}],
  "observation_guide": [{"behavior": "...", "indicators": ["..."]}],
  "rubric": {"levels": ["beginning", "developing", "proficient"], "criteria": [{"criterion": "...", "beginning": "...", "developing": "...", "proficient": "..."}]},
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
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
    .replace(/\{\{language_pair\}\}/g, language_pair)
    .replace(/\{\{age_band\}\}/g, age_band);

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.parent_communication,
    userPrompt: prompt,
    temperature: 0.7,
  });
}

export async function generateVisualSupports(
  params: {
    topic: string;
    language_pair: LanguagePair;
    age_band: AgeBand;
  }
): Promise<PackContent> {
  const { topic, language_pair, age_band } = params;

  const prompt = PROMPT_TEMPLATES.visual_supports
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{language_pair\}\}/g, language_pair)
    .replace(/\{\{age_band\}\}/g, age_band);

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.visual_supports,
    userPrompt: prompt,
    temperature: 0.7,
  });
}

export async function generateAssessmentTools(
  params: {
    topic: string;
    language_pair: LanguagePair;
    age_band: AgeBand;
  }
): Promise<PackContent> {
  const { topic, language_pair, age_band } = params;

  const prompt = PROMPT_TEMPLATES.assessment_tools
    .replace(/\{\{topic\}\}/g, topic)
    .replace(/\{\{language_pair\}\}/g, language_pair)
    .replace(/\{\{age_band\}\}/g, age_band);

  return generateWithAI({
    systemPrompt: SYSTEM_PROMPTS.assessment_tools,
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
  
  // Required top-level fields
  if (!c.pack_type) errors.push('Missing pack_type');
  if (!c.topic) errors.push('Missing topic');
  if (!c.license) errors.push('Missing license');
  if (!c.title || typeof c.title !== 'string' || c.title.length < 3) errors.push('title must be a string with at least 3 characters');
  
  // Pack-type-specific deep validation
  switch (c.pack_type) {
    case 'vocabulary_pack': {
      if (!Array.isArray(c.vocabulary) || c.vocabulary.length === 0) {
        errors.push('vocabulary must be a non-empty array');
      } else {
        for (let i = 0; i < c.vocabulary.length; i++) {
          const v = c.vocabulary[i] as Record<string, unknown>;
          if (!v.en || typeof v.en !== 'string') errors.push(`vocabulary[${i}].en is missing or not a string`);
          if (!v.l2 || typeof v.l2 !== 'string') errors.push(`vocabulary[${i}].l2 is missing or not a string`);
        }
        if (c.vocabulary.length < 5) errors.push(`vocabulary has only ${c.vocabulary.length} items, minimum is 5`);
      }
      // Worksheets expected
      if (!Array.isArray(c.worksheets) || c.worksheets.length === 0) {
        errors.push('vocabulary_pack should include at least 1 worksheet');
      }
      break;
    }
    case 'sentence_frames': {
      if (!Array.isArray(c.sentence_frames) || c.sentence_frames.length === 0) {
        errors.push('sentence_frames must be a non-empty array');
      } else {
        for (let i = 0; i < c.sentence_frames.length; i++) {
          const f = c.sentence_frames[i] as Record<string, unknown>;
          if (!f.frame || typeof f.frame !== 'string') errors.push(`sentence_frames[${i}].frame is missing`);
        }
        if (c.sentence_frames.length < 3) errors.push(`sentence_frames has only ${c.sentence_frames.length} items, minimum is 3`);
      }
      break;
    }
    case 'classroom_labels': {
      if (!Array.isArray(c.labels) || c.labels.length === 0) {
        errors.push('labels must be a non-empty array');
      } else {
        for (let i = 0; i < c.labels.length; i++) {
          const l = c.labels[i] as Record<string, unknown>;
          if (!l.en || typeof l.en !== 'string') errors.push(`labels[${i}].en is missing`);
          if (!l.l2 || typeof l.l2 !== 'string') errors.push(`labels[${i}].l2 is missing`);
          if (!l.category || typeof l.category !== 'string') errors.push(`labels[${i}].category is missing`);
        }
        if (c.labels.length < 5) errors.push(`labels has only ${c.labels.length} items, minimum is 5`);
      }
      break;
    }
    case 'parent_communication': {
      if (!Array.isArray(c.parent_notes) || c.parent_notes.length === 0) {
        errors.push('parent_notes must be a non-empty array');
      } else {
        for (let i = 0; i < c.parent_notes.length; i++) {
          const n = c.parent_notes[i] as Record<string, unknown>;
          if (!n.title_en || typeof n.title_en !== 'string') errors.push(`parent_notes[${i}].title_en is missing`);
          if (!n.content_en || typeof n.content_en !== 'string') errors.push(`parent_notes[${i}].content_en is missing`);
          if (!n.title_l2 || typeof n.title_l2 !== 'string') errors.push(`parent_notes[${i}].title_l2 is missing`);
          if (!n.content_l2 || typeof n.content_l2 !== 'string') errors.push(`parent_notes[${i}].content_l2 is missing`);
        }
        if (c.parent_notes.length < 3) errors.push(`parent_notes has only ${c.parent_notes.length} items, minimum is 3`);
      }
      break;
    }
    case 'visual_supports': {
      if (!Array.isArray(c.visual_schedule) || c.visual_schedule.length === 0) {
        errors.push('visual_schedule must be a non-empty array');
      } else {
        for (let i = 0; i < c.visual_schedule.length; i++) {
          const vs = c.visual_schedule[i] as Record<string, unknown>;
          if (!vs.activity_en || typeof vs.activity_en !== 'string') errors.push(`visual_schedule[${i}].activity_en is missing`);
          if (!vs.activity_l2 || typeof vs.activity_l2 !== 'string') errors.push(`visual_schedule[${i}].activity_l2 is missing`);
        }
        if (c.visual_schedule.length < 4) errors.push(`visual_schedule has only ${c.visual_schedule.length} items, minimum is 4`);
      }
      if (!Array.isArray(c.emotion_cards) || c.emotion_cards.length === 0) {
        errors.push('emotion_cards must be a non-empty array');
      } else {
        for (let i = 0; i < c.emotion_cards.length; i++) {
          const ec = c.emotion_cards[i] as Record<string, unknown>;
          if (!ec.emotion_en || typeof ec.emotion_en !== 'string') errors.push(`emotion_cards[${i}].emotion_en is missing`);
          if (!ec.emotion_l2 || typeof ec.emotion_l2 !== 'string') errors.push(`emotion_cards[${i}].emotion_l2 is missing`);
        }
      }
      break;
    }
    case 'assessment_tools': {
      if (!Array.isArray(c.mastery_checklist) || c.mastery_checklist.length === 0) {
        errors.push('mastery_checklist must be a non-empty array');
      } else {
        for (let i = 0; i < c.mastery_checklist.length; i++) {
          const mc = c.mastery_checklist[i] as Record<string, unknown>;
          if (!mc.skill_en || typeof mc.skill_en !== 'string') errors.push(`mastery_checklist[${i}].skill_en is missing`);
        }
        if (c.mastery_checklist.length < 5) errors.push(`mastery_checklist has only ${c.mastery_checklist.length} items, minimum is 5`);
      }
      if (!Array.isArray(c.self_assessment) || c.self_assessment.length === 0) {
        errors.push('self_assessment must be a non-empty array');
      }
      if (!c.rubric || typeof c.rubric !== 'object') {
        errors.push('rubric is missing');
      }
      break;
    }
  }
  
  // Teacher notes validation (should exist for all pack types)
  if (!c.teacher_notes || typeof c.teacher_notes !== 'object') {
    errors.push('teacher_notes is missing');
  } else {
    const tn = c.teacher_notes as Record<string, unknown>;
    if (!tn.objective || typeof tn.objective !== 'string') errors.push('teacher_notes.objective is missing');
    if (!tn.suggested_use || typeof tn.suggested_use !== 'string') errors.push('teacher_notes.suggested_use is missing');
  }
  
  // Worksheet items validation (if present)
  if (Array.isArray(c.worksheets)) {
    for (let i = 0; i < c.worksheets.length; i++) {
      const w = c.worksheets[i] as Record<string, unknown>;
      if (!w.type || typeof w.type !== 'string') errors.push(`worksheets[${i}].type is missing`);
      if (!w.instructions_en || typeof w.instructions_en !== 'string') errors.push(`worksheets[${i}].instructions_en is missing`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function getCurrentProvider(): AIProvider {
  return getAIConfig().ACTIVE_PROVIDER;
}

export function isProviderConfigured(provider: AIProvider): boolean {
  return getConfiguredProviders(getAIConfig()).includes(provider);
}
