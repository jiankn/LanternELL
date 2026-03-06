// Seed topics for content generation
// These topics will be used to generate packs via AI

export interface SeedTopic {
  topic: string;
  pack_type: 'vocabulary_pack' | 'sentence_frames' | 'classroom_labels' | 'parent_communication';
  age_band: 'K-2' | '3-5' | '6-8';
  language_pair: 'en-es' | 'en-zh' | 'en-fr' | 'en-vi' | 'en-ar';
  priority: number; // 1 = highest priority
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimated_vocabulary_count?: number;
}

export const SEED_TOPICS: SeedTopic[] = [
  // === PRIORITY 1: Core K-2 Vocabulary (Most Popular) ===
  { topic: 'Classroom Objects', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 20 },
  { topic: 'Colors', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Numbers 1-20', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 20 },
  { topic: 'Shapes', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 10 },
  { topic: 'Animals', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 15 },
  { topic: 'Food', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 15 },
  { topic: 'Family Members', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Body Parts', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Weather & Seasons', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Clothes', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 1, status: 'pending', estimated_vocabulary_count: 12 },
  
  // === PRIORITY 2: Classroom Labels (High Value) ===
  { topic: 'Classroom Furniture', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 15 },
  { topic: 'School Supplies', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 15 },
  { topic: 'Classroom Areas', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 10 },
  { topic: 'Days & Months', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 20 },
  { topic: 'Time & Clock', pack_type: 'classroom_labels', age_band: 'K-2', language_pair: 'en-es', priority: 2, status: 'pending', estimated_vocabulary_count: 12 },
  
  // === PRIORITY 3: Sentence Frames (Conversation) ===
  { topic: 'Basic Greetings', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 10 },
  { topic: 'Asking for Help', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 8 },
  { topic: 'Expressing Feelings', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 10 },
  { topic: 'Classroom Instructions', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Sharing & Taking Turns', pack_type: 'sentence_frames', age_band: 'K-2', language_pair: 'en-es', priority: 3, status: 'pending', estimated_vocabulary_count: 8 },
  
  // === PRIORITY 4: Parent Communication ===
  { topic: 'Welcome Letter', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 4, status: 'pending' },
  { topic: 'Weekly Update', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 4, status: 'pending' },
  { topic: 'Homework Note', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 4, status: 'pending' },
  { topic: 'Behavior Report', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 4, status: 'pending' },
  { topic: 'Progress Report', pack_type: 'parent_communication', age_band: 'K-2', language_pair: 'en-es', priority: 4, status: 'pending' },
  
  // === PRIORITY 5: Extended Topics ===
  { topic: 'Transportation', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Places in Community', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 12 },
  { topic: 'Feelings & Emotions', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 10 },
  { topic: 'Action Verbs', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 15 },
  { topic: 'Opposites', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-es', priority: 5, status: 'pending', estimated_vocabulary_count: 10 },
];

// Topics for other language pairs (Phase 2+)
export const TOPICS_ES: SeedTopic[] = SEED_TOPICS; // Start with Spanish

export const TOPICS_ZH: SeedTopic[] = [
  { topic: 'Classroom Objects', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-zh', priority: 1, status: 'pending', estimated_vocabulary_count: 20 },
  { topic: 'Numbers 1-10', pack_type: 'vocabulary_pack', age_band: 'K-2', language_pair: 'en-zh', priority: 1, status: 'pending', estimated_vocabulary_count: 10 },
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
