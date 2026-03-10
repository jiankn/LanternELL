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
    'action-verbs-vocabulary-pack-k-2-en-es': '/images/products/action-verbs-vocab-k2.webp',
    'animals-vocabulary-pack-k-2-en-es': '/images/products/animals-vocab-k2.webp',
    'body-parts-vocabulary-pack-k-2-en-es': '/images/products/body-parts-vocab-k2.webp',
    'classroom-objects-vocabulary-pack-k-2-en-es': '/images/products/classroom-objects-vocab-k2.webp',
    'clothes-vocabulary-pack-k-2-en-es': '/images/products/clothes-vocab-k2.webp',
    'colors-vocabulary-pack-k-2-en-es': '/images/products/colors-vocab-k2.webp',
    'community-vocabulary-pack-k-2-en-es': '/images/products/community-vocab-k2.webp',
    'family-vocabulary-pack-k-2-en-es': '/images/products/family-vocab-k2.webp',
    'feelings-vocabulary-pack-k-2-en-es': '/images/products/feelings-vocab-k2.webp',
    'food-vocabulary-pack-k-2-en-es': '/images/products/food-vocab-k2.webp',
    'classroom-furniture-classroom-labels-k-2-en-es': '/images/products/furniture-labels-k2.webp',
    'school-supplies-classroom-labels-k-2-en-es': '/images/products/supplies-labels-k2.webp',
    'numbers-1-20-vocabulary-pack-k-2-en-es': '/images/products/numbers-vocab-k2.webp',
    'opposites-vocabulary-pack-k-2-en-es': '/images/products/opposites-vocab-k2.webp',
    'shapes-vocabulary-pack-k-2-en-es': '/images/products/shapes-vocab-k2.webp',
    'transportation-vocabulary-pack-k-2-en-es': '/images/products/transportation-vocab-k2.webp',
    'weather-and-seasons-vocabulary-pack-k-2-en-es': '/images/products/weather-vocab-k2.webp',
}

/**
 * Returns the appropriate cover image path for a product.
 *
 * @param productType - 'single' | 'bundle' | 'membership'
 * @param packType - e.g. 'vocabulary_pack', 'sentence_frames', etc.
 * @param ageBand - e.g. 'K-2', '3-5', '6-8'
 * @param slug - product slug for direct mapping
 */
export function getProductImage(
    productType: string,
    packType?: string,
    ageBand?: string,
    slug?: string
): string {
    // Bundles and memberships have their own dedicated images
    if (productType === 'bundle' || productType === 'membership') {
        return TYPE_IMAGES[productType] || FALLBACK_IMAGE
    }

    // Direct mapping by slug (new system)
    if (slug && SLUG_IMAGES[slug]) {
        return SLUG_IMAGES[slug]
    }

    // Single packs fallback: look up by pack_type + age_band (old system)
    if (packType) {
        const ageMap = PACK_TYPE_AGE_IMAGES[packType]
        if (ageMap) {
            // Try exact age band match, then wildcard
            return ageMap[ageBand || 'K-2'] || ageMap['*'] || FALLBACK_IMAGE
        }
    }

    return FALLBACK_IMAGE
}
