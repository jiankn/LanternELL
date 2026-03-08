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

/**
 * Returns the appropriate cover image path for a product.
 *
 * @param productType - 'single' | 'bundle' | 'membership'
 * @param packType - e.g. 'vocabulary_pack', 'sentence_frames', etc.
 * @param ageBand - e.g. 'K-2', '3-5', '6-8'
 */
export function getProductImage(
    productType: string,
    packType?: string,
    ageBand?: string
): string {
    // Bundles and memberships have their own dedicated images
    if (productType === 'bundle' || productType === 'membership') {
        return TYPE_IMAGES[productType] || FALLBACK_IMAGE
    }

    // Single packs: look up by pack_type + age_band
    if (packType) {
        const ageMap = PACK_TYPE_AGE_IMAGES[packType]
        if (ageMap) {
            // Try exact age band match, then wildcard
            return ageMap[ageBand || 'K-2'] || ageMap['*'] || FALLBACK_IMAGE
        }
    }

    return FALLBACK_IMAGE
}
