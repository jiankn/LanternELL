#!/usr/bin/env node
/**
 * AI Content Generation Script
 * Generates PackContent JSON for seed topics using Gemini API
 *
 * Usage:
 *   node scripts/generate-content.mjs                   # Generate all pending packs
 *   node scripts/generate-content.mjs --topic "Colors"   # Generate specific topic
 *   node scripts/generate-content.mjs --batch 5          # Generate N packs
 *   node scripts/generate-content.mjs --type vocabulary_pack  # Filter by pack type
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Proxy support for environments behind a firewall
let proxyDispatcher = undefined;
try {
    const { ProxyAgent } = require('undici');
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY || 'http://127.0.0.1:10808';
    proxyDispatcher = new ProxyAgent(proxyUrl);
    console.log(`[PROXY] Using proxy: ${proxyUrl}`);
} catch (e) {
    console.log('[PROXY] No proxy configured, using direct connection');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'packs');

// Ensure data directory exists
fs.mkdirSync(DATA_DIR, { recursive: true });

// ============================================
// Configuration
// ============================================

// Load from .env.local
function loadEnv() {
    const envPath = path.join(ROOT, '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('❌ .env.local not found. Please create it with GEMINI_API_KEY.');
        process.exit(1);
    }
    const raw = fs.readFileSync(envPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            process.env[key] = value;
            if (key === 'GEMINI_API_KEY') console.log('[DEBUG loadEnv] Set GEMINI_API_KEY =', value.substring(0, 10) + '...');
        }
    }
}

loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

console.log('[DEBUG] GEMINI_API_KEY from env:', JSON.stringify(GEMINI_API_KEY?.substring(0, 10)));

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('❌ GEMINI_API_KEY is not set. Please add a valid key to .env.local');
    process.exit(1);
}

// ============================================
// Seed Topics (from lib/seed-topics.ts)
// ============================================

const SEED_TOPICS = [
    // K-2 Vocabulary (10)
    { topic: 'Classroom Objects', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 20 },
    { topic: 'Colors', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 12 },
    { topic: 'Numbers 1-20', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 20 },
    { topic: 'Shapes', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 10 },
    { topic: 'Animals', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 15 },
    { topic: 'Food', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 15 },
    { topic: 'Family Members', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 12 },
    { topic: 'Body Parts', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 12 },
    { topic: 'Weather & Seasons', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 12 },
    { topic: 'Clothes', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, vocabulary_count: 12 },
    // K-2 Labels (5)
    { topic: 'Classroom Furniture', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, label_count: 15 },
    { topic: 'School Supplies', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, label_count: 15 },
    { topic: 'Classroom Areas', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, label_count: 10 },
    { topic: 'Days & Months', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, label_count: 20 },
    { topic: 'Time & Clock', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, label_count: 12 },
    // K-2 Sentence Frames (5)
    { topic: 'Basic Greetings', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, frame_count: 10 },
    { topic: 'Asking for Help', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, frame_count: 8 },
    { topic: 'Expressing Feelings', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, frame_count: 10 },
    { topic: 'Classroom Instructions', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, frame_count: 12 },
    { topic: 'Sharing & Taking Turns', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, frame_count: 8 },
    // K-2 Extended Vocabulary (5)
    { topic: 'Transportation', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, vocabulary_count: 12 },
    { topic: 'Places in Community', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, vocabulary_count: 12 },
    { topic: 'Feelings & Emotions', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, vocabulary_count: 10 },
    { topic: 'Action Verbs', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, vocabulary_count: 15 },
    { topic: 'Opposites', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, vocabulary_count: 10 },
    // 3-5 Vocabulary (8)
    { topic: 'Science Vocabulary', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, vocabulary_count: 20 },
    { topic: 'Math Vocabulary', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, vocabulary_count: 18 },
    { topic: 'Social Studies', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, vocabulary_count: 16 },
    { topic: 'Reading & Writing', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, vocabulary_count: 15 },
    { topic: 'Health & Safety', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, vocabulary_count: 14 },
    { topic: 'Geography & Maps', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 5, vocabulary_count: 15 },
    { topic: 'Technology & Computers', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 5, vocabulary_count: 14 },
    { topic: 'Arts & Music', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 5, vocabulary_count: 12 },
    // 3-5 Sentence Frames (3)
    { topic: 'Academic Discussion', pack_type: 'sentence_frames', age_band: '3-5', language_pair: 'en-es', priority: 4, frame_count: 12 },
    { topic: 'Writing Prompts & Responses', pack_type: 'sentence_frames', age_band: '3-5', language_pair: 'en-es', priority: 4, frame_count: 10 },
    { topic: 'Book Reports & Reading Logs', pack_type: 'sentence_frames', age_band: '3-5', language_pair: 'en-es', priority: 5, frame_count: 10 },
    // 3-5 Labels (1)
    { topic: 'Science Lab Labels', pack_type: 'classroom_labels', age_band: '3-5', language_pair: 'en-es', priority: 5, label_count: 15 },
    // 6-8 Vocabulary (3)
    { topic: 'Academic Vocabulary', pack_type: 'vocabulary_pack', age_band: '6-8', language_pair: 'en-es', priority: 6, vocabulary_count: 20 },
    { topic: 'Lab Reports & Scientific Method', pack_type: 'vocabulary_pack', age_band: '6-8', language_pair: 'en-es', priority: 6, vocabulary_count: 18 },
    { topic: 'Career & Life Skills', pack_type: 'vocabulary_pack', age_band: '6-8', language_pair: 'en-es', priority: 6, vocabulary_count: 15 },
    // 6-8 Sentence Frames (2)
    { topic: 'Literary Analysis', pack_type: 'sentence_frames', age_band: '6-8', language_pair: 'en-es', priority: 6, frame_count: 12 },
    { topic: 'Research & Citation', pack_type: 'sentence_frames', age_band: '6-8', language_pair: 'en-es', priority: 6, frame_count: 10 },
    // Parent Communication (3)
    { topic: 'Welcome Letter', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 5 },
    { topic: 'Homework Note', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 5 },
    { topic: 'Progress Report', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 5 },
];

// ============================================
// System Prompts (from lib/ai-content.ts)
// ============================================

const SYSTEM_PROMPTS = {
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
};

// ============================================
// Prompt Templates (from lib/ai-content.ts)
// ============================================

const PROMPT_TEMPLATES = {
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
  "worksheets": [{"type": "matching|tracing|coloring", "instructions_en": "...", "instructions_l2": "...", "items": [{"id": "1", "content": "...", "content_l2": "...", "correct_answer": "..."}]}],
  "mini_book": {"title": "...", "pages": [{"page_number": 1, "text_en": "...", "text_l2": "..."}]},
  "teacher_notes": {"objective": "...", "suggested_use": "...", "materials_needed": [...], "differentiation_tips": [...]},
  "answer_key": [{"worksheet_id": "ws-1", "answers": {"1": "answer"}}],
  "license": "personal-classroom-use",
  "version": "1.0",
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
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
  "version": "1.0",
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
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
  "version": "1.0",
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
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
  "version": "1.0",
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
}`,
};

// ============================================
// Gemini API Call
// ============================================

async function callGemini(systemPrompt, userPrompt) {
    const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
        contents: [
            { role: 'user', parts: [{ text: userPrompt }] },
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
        },
    };

    const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
    if (proxyDispatcher) fetchOptions.dispatcher = proxyDispatcher;

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    // Parse JSON (handle markdown code blocks)
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleaned);
}

// ============================================
// Content Validation (from lib/ai-content.ts)
// ============================================

function validateContent(content) {
    const errors = [];
    if (!content || typeof content !== 'object') return { valid: false, errors: ['Content must be an object'] };

    if (!content.pack_type) errors.push('Missing pack_type');
    if (!content.topic) errors.push('Missing topic');
    if (!content.license) errors.push('Missing license');
    if (!content.title || typeof content.title !== 'string' || content.title.length < 3) errors.push('title must be a string ≥3 chars');

    switch (content.pack_type) {
        case 'vocabulary_pack':
            if (!Array.isArray(content.vocabulary) || content.vocabulary.length === 0) errors.push('vocabulary must be non-empty array');
            else if (content.vocabulary.length < 5) errors.push(`vocabulary has only ${content.vocabulary.length} items, minimum is 5`);
            if (!Array.isArray(content.worksheets) || content.worksheets.length === 0) errors.push('worksheets required');
            break;
        case 'sentence_frames':
            if (!Array.isArray(content.sentence_frames) || content.sentence_frames.length === 0) errors.push('sentence_frames required');
            break;
        case 'classroom_labels':
            if (!Array.isArray(content.labels) || content.labels.length === 0) errors.push('labels required');
            break;
        case 'parent_communication':
            if (!Array.isArray(content.parent_notes) || content.parent_notes.length === 0) errors.push('parent_notes required');
            break;
    }

    if (!content.teacher_notes || typeof content.teacher_notes !== 'object') errors.push('teacher_notes missing');

    return { valid: errors.length === 0, errors };
}

// ============================================
// File Naming
// ============================================

function getFilename(topic) {
    return topic.topic.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + `_${topic.pack_type}_${topic.age_band.toLowerCase()}_${topic.language_pair}.json`;
}

// ============================================
// Build Prompt
// ============================================

function buildPrompt(topic) {
    const template = PROMPT_TEMPLATES[topic.pack_type];
    if (!template) throw new Error(`No template for pack_type: ${topic.pack_type}`);

    let prompt = template
        .replace(/\{\{topic\}\}/g, topic.topic)
        .replace(/\{\{age_band\}\}/g, topic.age_band)
        .replace(/\{\{language_pair\}\}/g, topic.language_pair);

    if (topic.vocabulary_count) prompt = prompt.replace(/\{\{count\}\}/g, topic.vocabulary_count.toString());
    if (topic.frame_count) prompt = prompt.replace(/\{\{count\}\}/g, topic.frame_count.toString());
    if (topic.label_count) prompt = prompt.replace(/\{\{count\}\}/g, topic.label_count.toString());

    return prompt;
}

// ============================================
// Main
// ============================================

async function main() {
    const args = process.argv.slice(2);
    let topicFilter = null;
    let typeFilter = null;
    let batchSize = Infinity;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--topic' && args[i + 1]) topicFilter = args[++i];
        if (args[i] === '--type' && args[i + 1]) typeFilter = args[++i];
        if (args[i] === '--batch' && args[i + 1]) batchSize = parseInt(args[++i], 10);
    }

    // Filter topics
    let topics = SEED_TOPICS;
    if (topicFilter) topics = topics.filter(t => t.topic.toLowerCase().includes(topicFilter.toLowerCase()));
    if (typeFilter) topics = topics.filter(t => t.pack_type === typeFilter);

    // Skip already generated
    topics = topics.filter(t => {
        const filename = getFilename(t);
        return !fs.existsSync(path.join(DATA_DIR, filename));
    });

    // Sort by priority
    topics.sort((a, b) => a.priority - b.priority);
    topics = topics.slice(0, batchSize);

    if (topics.length === 0) {
        console.log('✅ All packs already generated! Nothing to do.');
        return;
    }

    console.log(`\n🚀 Generating ${topics.length} packs...\n`);

    let success = 0;
    let failed = 0;

    for (const topic of topics) {
        const filename = getFilename(topic);
        console.log(`📦 [${success + failed + 1}/${topics.length}] ${topic.topic} (${topic.pack_type}, ${topic.age_band})...`);

        try {
            const systemPrompt = SYSTEM_PROMPTS[topic.pack_type];
            const userPrompt = buildPrompt(topic);

            const content = await callGemini(systemPrompt, userPrompt);

            // Validate
            const { valid, errors } = validateContent(content);
            if (!valid) {
                console.log(`   ⚠️  Validation warnings: ${errors.join(', ')}`);
            }

            // Save
            const outPath = path.join(DATA_DIR, filename);
            fs.writeFileSync(outPath, JSON.stringify(content, null, 2), 'utf8');
            console.log(`   ✅ Saved → ${filename}`);
            success++;

            // Rate limit: 2s between calls
            if (success + failed < topics.length) {
                await new Promise(r => setTimeout(r, 2000));
            }
        } catch (err) {
            console.error(`   ❌ Failed: ${err.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Results: ${success} success, ${failed} failed, ${topics.length - success - failed} skipped`);
    console.log(`📁 Output: ${DATA_DIR}\n`);
}

main().catch(console.error);
