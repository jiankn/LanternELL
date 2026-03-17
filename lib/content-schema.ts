// LanternELL Content Schema Types
// Based on PRD Section 9.4

export type PackType = 'vocabulary_pack' | 'sentence_frames' | 'classroom_labels' | 'parent_communication' | 'visual_supports' | 'assessment_tools';
export type AgeBand = 'Pre-K' | 'K-2' | '3-5' | '6-8' | '9-12';
export type LanguagePair = 'en-es' | 'en-zh' | 'en-fr' | 'en-vi' | 'en-ar' | 'en-pt';
export type PackStatus = 'draft' | 'review' | 'published' | 'archived';
export type ProficiencyLevel = 'entering' | 'emerging' | 'developing' | 'expanding';
export type ScenarioTag = 'first_week' | 'new_student_arrival' | 'parent_conference' | 'daily_routine' | 'assessment_week' | 'classroom_setup' | 'ongoing_support';

export interface VocabularyItem {
  en: string;
  l2: string; // Second language translation
  image_prompt?: string; // For AI image generation
}

export interface SentenceFrame {
  frame: string; // e.g., "This is a ___."
  translation?: string;
  icon_prompt?: string; // Visual anchor for classroom wall display
}

export interface DialogueStrip {
  speaker_a_en: string;
  speaker_b_en: string;
  speaker_a_l2?: string;
  speaker_b_l2?: string;
  context?: string; // e.g., "At the cafeteria"
}

export interface SpeakingPrompt {
  prompt_en: string;
  prompt_l2?: string;
  expected_response?: string;
  visual_cue?: string;
}

export interface WorksheetItem {
  type: 'matching' | 'tracing' | 'writing' | 'coloring' | 'cutting' | 'fill-blank' | 'categorizing' | 'context-clues';
  instructions_en: string;
  instructions_l2?: string;
  items: WorksheetItemData[];
}

export interface WorksheetItemData {
  id: string;
  content: string;
  content_l2?: string;
  image_url?: string;
  correct_answer?: string;
}

export interface MiniBookPage {
  page_number: number;
  text_en: string;
  text_l2?: string;
  image_prompt?: string;
}

export interface MiniBook {
  title: string;
  pages: MiniBookPage[];
}

export interface TeacherNotes {
  objective: string;
  suggested_use: string;
  materials_needed?: string[];
  differentiation_tips?: string[];
  assessment_ideas?: string[];
}

export interface AnswerKey {
  worksheet_id: string;
  answers: Record<string, string>;
}

export interface ClassroomLabel {
  en: string;
  l2: string;
  category: string; // e.g., "supplies", "furniture", "areas"
  plural_form?: string;
  size?: 'full' | 'small'; // For large vs small label rendering
}

export interface VisualRoutineCard {
  routine_en: string;
  routine_l2: string;
  time_of_day?: string; // e.g., "morning", "afternoon"
  icon_prompt?: string;
}

export interface ClassroomRule {
  rule_en: string;
  rule_l2: string;
  icon_prompt?: string;
}

export interface ParentNote {
  type: 'homework' | 'behavior' | 'progress' | 'general' | 'supply_request' | 'attendance' | 'welcome';
  title_en: string;
  title_l2: string;
  content_en: string;
  content_l2: string;
  signature_required: boolean;
  response_section?: boolean; // Parent can write back
  response_prompt_en?: string; // e.g., "I have read and understood this letter."
  response_prompt_l2?: string; // e.g., "He leído y entendido esta carta."
}

export interface PackContent {
  pack_id: string;
  pack_type: PackType;
  topic: string;
  age_band: AgeBand;
  language_pair: LanguagePair;
  target_user: string;
  proficiency_level?: ProficiencyLevel; // WIDA-aligned ELP level
  scenario_tags?: ScenarioTag[]; // Usage scenarios for filtering
  estimated_pages?: number; // Estimated printed page count
  title: string;
  description: string;
  
  // Vocabulary pack fields
  vocabulary?: VocabularyItem[];
  
  // Sentence frames fields
  sentence_frames?: SentenceFrame[];
  dialogue_strips?: DialogueStrip[];
  speaking_prompts?: SpeakingPrompt[];
  
  // Worksheets
  worksheets?: WorksheetItem[];
  
  // Mini book (for vocabulary packs)
  mini_book?: MiniBook;
  
  // Classroom labels
  labels?: ClassroomLabel[];
  visual_routine_cards?: VisualRoutineCard[];
  classroom_rules?: ClassroomRule[];
  
  // Parent communication
  parent_notes?: ParentNote[];
  
  // Visual supports (ELL/SPED)
  visual_schedule?: { activity_en: string; activity_l2: string; time?: string; icon_prompt?: string }[];
  social_story?: { page: number; text_en: string; text_l2?: string; image_prompt?: string }[];
  emotion_cards?: { emotion_en: string; emotion_l2: string; icon_prompt?: string }[];
  behavior_visuals?: { expectation_en: string; expectation_l2: string; icon_prompt?: string }[];
  transition_cues?: { cue_en: string; cue_l2: string; icon_prompt?: string }[];

  // Assessment tools
  mastery_checklist?: { skill_en: string; skill_l2?: string; level?: string }[];
  self_assessment?: { statement_en: string; statement_l2?: string }[];
  observation_guide?: { behavior: string; indicators: string[] }[];
  rubric?: { levels: string[]; criteria: { criterion: string; beginning: string; developing: string; proficient: string }[] };

  // Common fields
  teacher_notes?: TeacherNotes;
  answer_key?: AnswerKey[];
  license: string;
  version: string;
  created_at: string;
  updated_at: string;
}

// Content generation request
export interface ContentGenerationRequest {
  topic: string;
  pack_type: PackType;
  language_pair: LanguagePair;
  age_band: AgeBand;
  vocabulary_count?: number; // For vocabulary packs: 10-20
  worksheet_count?: number;  // For worksheets: 3-10
  label_count?: number;       // For labels: 20-50
}

// Content generation job
export interface ContentJob {
  id: string;
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  request: ContentGenerationRequest;
  result?: PackContent;
  error_message?: string;
  created_at: string;
  updated_at: string;
}
