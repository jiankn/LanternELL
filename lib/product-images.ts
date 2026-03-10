/**
 * Product image mapping utility
 *
 * Maps product type + pack_type + age_band to cover image paths.
 * Images are stored in /public/images/products/ as PNG files.
 * Next.js Image component automatically optimizes and serves them as WebP.
 */

const PACK_TYPE_AGE_IMAGES: Record<string, Record<string, string>> = {
    vocabulary_pack: {
        'K-2': '/images/products/pack-vocabulary-k2.png',
        '3-5': '/images/products/pack-vocabulary-35.png',
        '6-8': '/images/products/pack-vocabulary-68.png',
    },
    sentence_frames: {
        'K-2': '/images/products/pack-sentence-k2.png',
        '3-5': '/images/products/pack-sentence-35.png',
        '6-8': '/images/products/pack-sentence-68.png',
    },
    classroom_labels: {
        '*': '/images/products/pack-labels.png',
    },
    parent_communication: {
        '*': '/images/products/pack-parents.png',
    },
}

const TYPE_IMAGES: Record<string, string> = {
    bundle: '/images/products/pack-bundle.png',
    membership: '/images/products/pack-membership.png',
}

const FALLBACK_IMAGE = '/images/products/pack-vocabulary-k2.png'

/** Exported for use as onError fallback in Image components */
export const PLACEHOLDER_IMAGE = '/images/products/placeholder-pack.webp'

export const SLUG_IMAGES: Record<string, string> = {
    // --- K-2 Vocabulary Packs (15) ---
    'action-verbs-vocabulary-pack-k-2-en-es': '/images/products/action-verbs-vocab-k2.webp',
    'animals-vocabulary-pack-k-2-en-es': '/images/products/animals-vocab-k2.webp',
    'body-parts-vocabulary-pack-k-2-en-es': '/images/products/body-parts-vocab-k2.webp',
    'classroom-objects-vocabulary-pack-k-2-en-es': '/images/products/classroom-objects-vocab-k2.webp',
    'clothes-vocabulary-pack-k-2-en-es': '/images/products/clothes-vocab-k2.webp',
    'colors-vocabulary-pack-k-2-en-es': '/images/products/colors-vocab-k2.webp',
    'places-in-community-vocabulary-pack-k-2-en-es': '/images/products/community-vocab-k2.webp',
    'family-members-vocabulary-pack-k-2-en-es': '/images/products/family-vocab-k2.webp',
    'feelings-and-emotions-vocabulary-pack-k-2-en-es': '/images/products/feelings-vocab-k2.webp',
    'food-vocabulary-pack-k-2-en-es': '/images/products/food-vocab-k2.webp',
    'numbers-1-20-vocabulary-pack-k-2-en-es': '/images/products/numbers-vocab-k2.webp',
    'opposites-vocabulary-pack-k-2-en-es': '/images/products/opposites-vocab-k2.webp',
    'shapes-vocabulary-pack-k-2-en-es': '/images/products/shapes-vocab-k2.webp',
    'transportation-vocabulary-pack-k-2-en-es': '/images/products/transportation-vocab-k2.webp',
    'weather-and-seasons-vocabulary-pack-k-2-en-es': '/images/products/weather-vocab-k2.webp',
    // --- K-2 Classroom Labels (5) ---
    'classroom-furniture-classroom-labels-k-2-en-es': '/images/products/furniture-labels-k2.webp',
    'school-supplies-classroom-labels-k-2-en-es': '/images/products/supplies-labels-k2.webp',
    'classroom-areas-classroom-labels-k-2-en-es': '/images/products/areas-labels-k2.webp',
    'days-and-months-classroom-labels-k-2-en-es': '/images/products/days-months-labels-k2.webp',
    'time-and-clock-classroom-labels-k-2-en-es': '/images/products/time-clock-labels-k2.webp',
    // --- K-2 Sentence Frames (5) ---
    'basic-greetings-sentence-frames-k-2-en-es': '/images/products/greetings-sentences-k2.webp',
    'asking-for-help-sentence-frames-k-2-en-es': '/images/products/asking-help-sentences-k2.webp',
    'expressing-feelings-sentence-frames-k-2-en-es': '/images/products/feelings-sentences-k2.webp',
    'classroom-instructions-sentence-frames-k-2-en-es': '/images/products/instructions-sentences-k2.webp',
    'sharing-and-taking-turns-sentence-frames-k-2-en-es': '/images/products/sharing-sentences-k2.webp',
    // --- 3-5 Vocabulary Packs (8) ---
    'science-vocabulary-vocabulary-pack-3-5-en-es': '/images/products/science-vocab-35.webp',
    'math-vocabulary-vocabulary-pack-3-5-en-es': '/images/products/math-vocab-35.webp',
    'social-studies-vocabulary-pack-3-5-en-es': '/images/products/social-studies-vocab-35.webp',
    'reading-and-writing-vocabulary-pack-3-5-en-es': '/images/products/reading-writing-vocab-35.webp',
    'health-and-safety-vocabulary-pack-3-5-en-es': '/images/products/health-safety-vocab-35.webp',
    'geography-and-maps-vocabulary-pack-3-5-en-es': '/images/products/geography-vocab-35.webp',
    'technology-and-computers-vocabulary-pack-3-5-en-es': '/images/products/technology-vocab-35.webp',
    'arts-and-music-vocabulary-pack-3-5-en-es': '/images/products/arts-music-vocab-35.webp',
    // --- 3-5 Sentence Frames (3) ---
    'academic-discussion-sentence-frames-3-5-en-es': '/images/products/academic-discussion-sentences-35.webp',
    'writing-prompts-and-responses-sentence-frames-3-5-en-es': '/images/products/writing-prompts-sentences-35.webp',
    'book-reports-and-reading-logs-sentence-frames-3-5-en-es': '/images/products/book-reports-sentences-35.webp',
    // --- 3-5 Classroom Labels (1) ---
    'science-lab-labels-classroom-labels-3-5-en-es': '/images/products/science-lab-labels-35.webp',
    // --- 6-8 Vocabulary Packs (3) ---
    'academic-vocabulary-vocabulary-pack-6-8-en-es': '/images/products/academic-vocab-68.webp',
    'lab-reports-and-scientific-method-vocabulary-pack-6-8-en-es': '/images/products/lab-reports-vocab-68.webp',
    'career-and-life-skills-vocabulary-pack-6-8-en-es': '/images/products/career-skills-vocab-68.webp',
    // --- 6-8 Sentence Frames (2) ---
    'literary-analysis-sentence-frames-6-8-en-es': '/images/products/literary-analysis-sentences-68.webp',
    'research-and-citation-sentence-frames-6-8-en-es': '/images/products/research-citation-sentences-68.webp',
    // --- K-2 Parent Communication (3) ---
    'welcome-letter-parent-communication-k-2-en-es': '/images/products/welcome-letter-parent.webp',
    'homework-note-parent-communication-k-2-en-es': '/images/products/homework-note-parent.webp',
    'progress-report-parent-communication-k-2-en-es': '/images/products/progress-report-parent.webp',
    // --- Bundles (5) ---
    'newcomer-starter-kit-bundle-en-es': '/images/products/newcomer-starter-bundle.webp',
    'classroom-essentials-labels-bundle-en-es': '/images/products/classroom-essentials-bundle.webp',
    'grade-3-5-academic-pack-bundle-en-es': '/images/products/grade-35-academic-bundle.webp',
    'middle-school-newcomer-pack-bundle-en-es': '/images/products/middle-school-bundle.webp',
    'complete-k8-ell-pack-bundle-en-es': '/images/products/complete-k8-bundle.webp',
    // --- Memberships (1) ---
    'all-access-membership': '/images/products/all-access-membership.webp',
}

/**
 * Returns the appropriate cover image path for a product.
 *
 * @param productType - 'single' | 'bundle' | 'membership'
 * @param packType - e.g. 'vocabulary_pack', 'sentence_frames', etc.
 * @param ageBand - e.g. 'K-2', '3-5', '6-8'
 * @param slug - product slug for direct mapping (highest priority)
 */
export function getProductImage(
    productType: string,
    packType?: string,
    ageBand?: string,
    slug?: string
): string {
    // 1. Highest priority: direct mapping by slug (new per-product images)
    if (slug && SLUG_IMAGES[slug]) {
        return SLUG_IMAGES[slug]
    }

    // 2. Bundles and memberships fallback to type-level images
    if (productType === 'bundle' || productType === 'membership') {
        return TYPE_IMAGES[productType] || FALLBACK_IMAGE
    }

    // 3. Single packs fallback: look up by pack_type + age_band
    if (packType) {
        const ageMap = PACK_TYPE_AGE_IMAGES[packType]
        if (ageMap) {
            return ageMap[ageBand || 'K-2'] || ageMap['*'] || FALLBACK_IMAGE
        }
    }

    return FALLBACK_IMAGE
}
