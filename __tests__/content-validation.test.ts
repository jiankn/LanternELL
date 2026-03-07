import { describe, it, expect, vi } from 'vitest'

// Mock AI providers to avoid import side effects
vi.mock('@/lib/ai-providers', () => ({
  getAIConfig: vi.fn(() => ({ ACTIVE_PROVIDER: 'openai' })),
  generateWithAI: vi.fn(),
  getConfiguredProviders: vi.fn(() => []),
  getActiveProviderConfig: vi.fn(),
  getProviderConfigForType: vi.fn(),
  registerProvider: vi.fn(),
  getProvider: vi.fn(),
}))
vi.mock('@/lib/ai-providers/openai', () => ({}))
vi.mock('@/lib/ai-providers/zhipuai', () => ({}))
vi.mock('@/lib/ai-providers/deepseek', () => ({}))
vi.mock('@/lib/ai-providers/gemini', () => ({}))

import { validateContent } from '@/lib/ai-content'

describe('validateContent - deep validation', () => {
  it('rejects empty object', () => {
    const result = validateContent({})
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing pack_type')
  })

  it('rejects non-object', () => {
    const result = validateContent('hello')
    expect(result.valid).toBe(false)
  })

  it('validates vocabulary_pack deeply', () => {
    const result = validateContent({
      pack_type: 'vocabulary_pack',
      topic: 'Colors',
      title: 'Colors Pack',
      license: 'personal-classroom-use',
      vocabulary: [
        { en: 'red', l2: 'rojo' },
        { en: 'blue', l2: 'azul' },
        { en: 'green', l2: 'verde' },
      ],
      teacher_notes: { objective: 'Learn colors', suggested_use: 'Print and cut' },
    })
    // Only 3 vocab items, minimum is 5
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('minimum is 5'))).toBe(true)
    // Missing worksheets
    expect(result.errors.some(e => e.includes('worksheet'))).toBe(true)
  })

  it('validates vocabulary items have en and l2', () => {
    const result = validateContent({
      pack_type: 'vocabulary_pack',
      topic: 'Colors',
      title: 'Colors Pack',
      license: 'personal-classroom-use',
      vocabulary: [
        { en: 'red' }, // missing l2
        { en: 'blue', l2: 'azul' },
        { en: 'green', l2: 'verde' },
        { en: 'yellow', l2: 'amarillo' },
        { en: 'orange', l2: 'naranja' },
      ],
      worksheets: [{ type: 'matching', instructions_en: 'Match' }],
      teacher_notes: { objective: 'Learn colors', suggested_use: 'Print' },
    })
    expect(result.errors.some(e => e.includes('vocabulary[0].l2'))).toBe(true)
  })

  it('passes valid vocabulary_pack', () => {
    const result = validateContent({
      pack_type: 'vocabulary_pack',
      topic: 'Colors',
      title: 'Colors Vocabulary Pack',
      license: 'personal-classroom-use',
      vocabulary: Array.from({ length: 10 }, (_, i) => ({ en: `word${i}`, l2: `palabra${i}` })),
      worksheets: [{ type: 'matching', instructions_en: 'Match the words' }],
      teacher_notes: { objective: 'Learn colors', suggested_use: 'Print and cut cards' },
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('validates sentence_frames minimum count', () => {
    const result = validateContent({
      pack_type: 'sentence_frames',
      topic: 'Greetings',
      title: 'Greetings Frames',
      license: 'personal-classroom-use',
      sentence_frames: [{ frame: 'Hello, my name is ___.' }],
      teacher_notes: { objective: 'Practice greetings', suggested_use: 'Role play' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('minimum is 3'))).toBe(true)
  })

  it('validates classroom_labels deeply', () => {
    const result = validateContent({
      pack_type: 'classroom_labels',
      topic: 'Classroom',
      title: 'Classroom Labels',
      license: 'personal-classroom-use',
      labels: [
        { en: 'Door', l2: 'Puerta', category: 'furniture' },
        { en: 'Window', category: 'furniture' }, // missing l2
      ],
      teacher_notes: { objective: 'Label classroom', suggested_use: 'Print and laminate' },
    })
    expect(result.errors.some(e => e.includes('labels[1].l2'))).toBe(true)
    expect(result.errors.some(e => e.includes('minimum is 5'))).toBe(true)
  })

  it('validates parent_communication deeply', () => {
    const result = validateContent({
      pack_type: 'parent_communication',
      topic: 'Welcome',
      title: 'Welcome Notes',
      license: 'personal-classroom-use',
      parent_notes: [
        { title_en: 'Welcome', content_en: 'Hello', title_l2: 'Bienvenido', content_l2: 'Hola', type: 'welcome', signature_required: false },
      ],
      teacher_notes: { objective: 'Communicate with parents', suggested_use: 'Send home' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('minimum is 3'))).toBe(true)
  })

  it('requires teacher_notes', () => {
    const result = validateContent({
      pack_type: 'vocabulary_pack',
      topic: 'Animals',
      title: 'Animals Pack',
      license: 'personal-classroom-use',
      vocabulary: Array.from({ length: 10 }, (_, i) => ({ en: `animal${i}`, l2: `animal${i}` })),
      worksheets: [{ type: 'matching', instructions_en: 'Match' }],
    })
    expect(result.errors).toContain('teacher_notes is missing')
  })

  it('validates title minimum length', () => {
    const result = validateContent({
      pack_type: 'vocabulary_pack',
      topic: 'X',
      title: 'AB', // too short
      license: 'personal-classroom-use',
      vocabulary: Array.from({ length: 10 }, (_, i) => ({ en: `w${i}`, l2: `p${i}` })),
      worksheets: [{ type: 'matching', instructions_en: 'Match' }],
      teacher_notes: { objective: 'Learn', suggested_use: 'Print' },
    })
    expect(result.errors.some(e => e.includes('at least 3 characters'))).toBe(true)
  })

  // ---- visual_supports tests ----

  it('validates visual_supports requires visual_schedule and emotion_cards', () => {
    const result = validateContent({
      pack_type: 'visual_supports',
      topic: 'Daily Routines',
      title: 'Daily Routines Visual Supports',
      license: 'personal-classroom-use',
      teacher_notes: { objective: 'Support transitions', suggested_use: 'Post on wall' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('visual_schedule'))).toBe(true)
    expect(result.errors.some(e => e.includes('emotion_cards'))).toBe(true)
  })

  it('validates visual_supports minimum visual_schedule count', () => {
    const result = validateContent({
      pack_type: 'visual_supports',
      topic: 'Daily Routines',
      title: 'Daily Routines Visual Supports',
      license: 'personal-classroom-use',
      visual_schedule: [
        { activity_en: 'Arrival', activity_l2: 'Llegada' },
        { activity_en: 'Lunch', activity_l2: 'Almuerzo' },
      ],
      emotion_cards: [
        { emotion_en: 'Happy', emotion_l2: 'Feliz' },
      ],
      teacher_notes: { objective: 'Support transitions', suggested_use: 'Post on wall' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('minimum is 4'))).toBe(true)
  })

  it('passes valid visual_supports', () => {
    const result = validateContent({
      pack_type: 'visual_supports',
      topic: 'Daily Routines',
      title: 'Daily Routines Visual Supports',
      license: 'personal-classroom-use',
      visual_schedule: Array.from({ length: 6 }, (_, i) => ({ activity_en: `Activity ${i}`, activity_l2: `Actividad ${i}` })),
      emotion_cards: Array.from({ length: 8 }, (_, i) => ({ emotion_en: `Emotion ${i}`, emotion_l2: `Emoción ${i}` })),
      teacher_notes: { objective: 'Support transitions', suggested_use: 'Post on wall' },
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  // ---- assessment_tools tests ----

  it('validates assessment_tools requires mastery_checklist, self_assessment, rubric', () => {
    const result = validateContent({
      pack_type: 'assessment_tools',
      topic: 'Reading Comprehension',
      title: 'Reading Assessment Tools',
      license: 'personal-classroom-use',
      teacher_notes: { objective: 'Track progress', suggested_use: 'Weekly check-in' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('mastery_checklist'))).toBe(true)
    expect(result.errors.some(e => e.includes('self_assessment'))).toBe(true)
    expect(result.errors.some(e => e.includes('rubric'))).toBe(true)
  })

  it('validates assessment_tools minimum mastery_checklist count', () => {
    const result = validateContent({
      pack_type: 'assessment_tools',
      topic: 'Reading',
      title: 'Reading Assessment Tools',
      license: 'personal-classroom-use',
      mastery_checklist: [
        { skill_en: 'Identify letters' },
        { skill_en: 'Sound out words' },
      ],
      self_assessment: [{ statement_en: 'I can read a sentence.' }],
      rubric: { levels: ['beginning', 'developing', 'proficient'], criteria: [{ criterion: 'Fluency', beginning: 'Reads slowly', developing: 'Reads with some pauses', proficient: 'Reads smoothly' }] },
      teacher_notes: { objective: 'Track progress', suggested_use: 'Weekly' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('minimum is 5'))).toBe(true)
  })

  it('passes valid assessment_tools', () => {
    const result = validateContent({
      pack_type: 'assessment_tools',
      topic: 'Reading Comprehension',
      title: 'Reading Assessment Tools',
      license: 'personal-classroom-use',
      mastery_checklist: Array.from({ length: 10 }, (_, i) => ({ skill_en: `Skill ${i}` })),
      self_assessment: Array.from({ length: 5 }, (_, i) => ({ statement_en: `I can do ${i}` })),
      rubric: { levels: ['beginning', 'developing', 'proficient'], criteria: [{ criterion: 'Fluency', beginning: 'Slow', developing: 'Moderate', proficient: 'Smooth' }] },
      teacher_notes: { objective: 'Track ELL progress', suggested_use: 'Use weekly' },
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})
