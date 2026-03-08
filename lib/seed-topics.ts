// Seed topics for content generation
// These topics will be used to generate packs via AI
// Plan C: 45 packs covering K-5 core + 6-8 extended

export interface SeedTopic {
  topic: string;
  pack_type: 'vocabulary_pack' | 'sentence_frames' | 'classroom_labels' | 'parent_communication';
  age_band: 'K-2' | '3-5' | '6-8';
  language_pair: 'en-es' | 'en-zh' | 'en-fr' | 'en-vi' | 'en-ar';
  priority: number; // 1 = highest priority
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimated_vocabulary_count?: number;
  /** Price tier: standard ($3.99), plus ($5.99), premium ($8.99) */
  price_tier: 'standard' | 'plus' | 'premium';
}

export const SEED_TOPICS: SeedTopic[] = [
  // =====================================================
  // K-2  en-es  (25 packs)
  // =====================================================

  // --- P1: Core K-2 Vocabulary (10 packs) ---
  { topic: 'Classroom Objects', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 20, price_tier: 'plus' },
  { topic: 'Colors', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'standard' },
  { topic: 'Numbers 1-20', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 20, price_tier: 'standard' },
  { topic: 'Shapes', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'standard' },
  { topic: 'Animals', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'plus' },
  { topic: 'Food', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'plus' },
  { topic: 'Family Members', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'standard' },
  { topic: 'Body Parts', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'plus' },
  { topic: 'Weather & Seasons', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'plus' },
  { topic: 'Clothes', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'plus' },

  // --- P2: K-2 Classroom Labels (5 packs) ---
  { topic: 'Classroom Furniture', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'standard' },
  { topic: 'School Supplies', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'standard' },
  { topic: 'Classroom Areas', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'standard' },
  { topic: 'Days & Months', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 20, price_tier: 'standard' },
  { topic: 'Time & Clock', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'standard' },

  // --- P3: K-2 Sentence Frames (5 packs) ---
  { topic: 'Basic Greetings', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'standard' },
  { topic: 'Asking for Help', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 8, price_tier: 'standard' },
  { topic: 'Expressing Feelings', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'plus' },
  { topic: 'Classroom Instructions', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'plus' },
  { topic: 'Sharing & Taking Turns', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 8, price_tier: 'standard' },

  // --- P5: Extended K-2 Vocabulary (5 packs) ---
  { topic: 'Transportation', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'standard' },
  { topic: 'Places in Community', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'plus' },
  { topic: 'Feelings & Emotions', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'plus' },
  { topic: 'Action Verbs', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'plus' },
  { topic: 'Opposites', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'standard' },

  // =====================================================
  // 3-5  en-es  (12 packs)
  // =====================================================

  // --- P4: 3-5 Vocabulary (8 packs) ---
  { topic: 'Science Vocabulary', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 20, price_tier: 'plus' },
  { topic: 'Math Vocabulary', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 18, price_tier: 'plus' },
  { topic: 'Social Studies', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 16, price_tier: 'plus' },
  { topic: 'Reading & Writing', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'premium' },
  { topic: 'Health & Safety', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 14, price_tier: 'plus' },
  { topic: 'Geography & Maps', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'plus' },
  { topic: 'Technology & Computers', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 14, price_tier: 'plus' },
  { topic: 'Arts & Music', pack_type: 'vocabulary_pack', age_band: '3-5', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'standard' },

  // --- P4: 3-5 Sentence Frames (3 packs) ---
  { topic: 'Academic Discussion', pack_type: 'sentence_frames', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'premium' },
  { topic: 'Writing Prompts & Responses', pack_type: 'sentence_frames', age_band: '3-5', language_pair: 'en-es', priority: 4, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'premium' },
  { topic: 'Book Reports & Reading Logs', pack_type: 'sentence_frames', age_band: '3-5', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'premium' },

  // --- P5: 3-5 Classroom Labels (1 pack) ---
  { topic: 'Science Lab Labels', pack_type: 'classroom_labels', age_band: '3-5', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'standard' },

  // =====================================================
  // 6-8  en-es  (5 packs)
  // =====================================================

  // --- P6: 6-8 Vocabulary (3 packs) ---
  { topic: 'Academic Vocabulary', pack_type: 'vocabulary_pack', age_band: '6-8', language_pair: 'en-es', priority: 6, status: 'pending', estimated_vocabulary_count: 20, price_tier: 'premium' },
  { topic: 'Lab Reports & Scientific Method', pack_type: 'vocabulary_pack', age_band: '6-8', language_pair: 'en-es', priority: 6, status: 'pending', estimated_vocabulary_count: 18, price_tier: 'premium' },
  { topic: 'Career & Life Skills', pack_type: 'vocabulary_pack', age_band: '6-8', language_pair: 'en-es', priority: 6, status: 'pending', estimated_vocabulary_count: 15, price_tier: 'plus' },

  // --- P6: 6-8 Sentence Frames (2 packs) ---
  { topic: 'Literary Analysis', pack_type: 'sentence_frames', age_band: '6-8', language_pair: 'en-es', priority: 6, status: 'pending', estimated_vocabulary_count: 12, price_tier: 'premium' },
  { topic: 'Research & Citation', pack_type: 'sentence_frames', age_band: '6-8', language_pair: 'en-es', priority: 6, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'premium' },

  // =====================================================
  // Universal  en-es  (3 packs — shared across K-8)
  // =====================================================
  { topic: 'Welcome Letter', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', price_tier: 'standard' },
  { topic: 'Homework Note', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', price_tier: 'standard' },
  { topic: 'Progress Report', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', price_tier: 'standard' },
];

// Total: 45 packs (25 K-2 + 12 3-5 + 5 6-8 + 3 universal)

// Topics for other language pairs (Phase 2+)
export const TOPICS_ES: SeedTopic[] = SEED_TOPICS; // Start with Spanish

export const TOPICS_ZH: SeedTopic[] = [
  { topic: 'Classroom Objects', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-zh', priority: 1, status: 'pending', estimated_vocabulary_count: 20, price_tier: 'plus' },
  { topic: 'Numbers 1-10', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-zh', priority: 1, status: 'pending', estimated_vocabulary_count: 10, price_tier: 'standard' },
];

// Helper to get topics by status
export function getTopicsByStatus(status: SeedTopic['status']): SeedTopic[] {
  return SEED_TOPICS.filter(t => t.status === status);
}

// Helper to get next topic to process
export function getNextTopic(): SeedTopic | undefined {
  return SEED_TOPICS
    .filter(t => t.status === 'pending')
    .sort((a, b) => a.priority - b.priority)[0];
}
