// ============================================
// LanternELL — Three-Tier Pricing System
// Central pricing constants shared by frontend and backend
// ============================================

export type PriceTier =
    | 'standard'
    | 'plus'
    | 'premium'
    | 'mini_bundle'
    | 'full_bundle'
    | 'monthly'
    | 'annual';

export interface TierInfo {
    label: string;
    priceCents: number;
    priceDisplay: string;
    productType: 'single' | 'bundle' | 'membership';
    stripeMode: 'payment' | 'subscription';
    /** Environment variable name that holds the Stripe Price ID */
    envKey: string;
}

export const PRICE_TIERS: Record<PriceTier, TierInfo> = {
    // --- Single packs ---
    standard: {
        label: 'Standard',
        priceCents: 399,
        priceDisplay: '$3.99',
        productType: 'single',
        stripeMode: 'payment',
        envKey: 'STRIPE_PRICE_STANDARD',
    },
    plus: {
        label: 'Plus',
        priceCents: 599,
        priceDisplay: '$5.99',
        productType: 'single',
        stripeMode: 'payment',
        envKey: 'STRIPE_PRICE_PLUS',
    },
    premium: {
        label: 'Premium',
        priceCents: 899,
        priceDisplay: '$8.99',
        productType: 'single',
        stripeMode: 'payment',
        envKey: 'STRIPE_PRICE_PREMIUM',
    },

    // --- Bundles ---
    mini_bundle: {
        label: 'Mini Bundle',
        priceCents: 1499,
        priceDisplay: '$14.99',
        productType: 'bundle',
        stripeMode: 'payment',
        envKey: 'STRIPE_PRICE_MINI_BUNDLE',
    },
    full_bundle: {
        label: 'Full Bundle',
        priceCents: 2999,
        priceDisplay: '$29.99',
        productType: 'bundle',
        stripeMode: 'payment',
        envKey: 'STRIPE_PRICE_FULL_BUNDLE',
    },

    // --- Membership ---
    monthly: {
        label: 'Monthly',
        priceCents: 900,
        priceDisplay: '$9',
        productType: 'membership',
        stripeMode: 'subscription',
        envKey: 'STRIPE_PRICE_MONTHLY',
    },
    annual: {
        label: 'Annual',
        priceCents: 7900,
        priceDisplay: '$79',
        productType: 'membership',
        stripeMode: 'subscription',
        envKey: 'STRIPE_PRICE_ANNUAL',
    },
} as const;

/**
 * Resolve the Stripe Price ID for a given tier.
 * Reads from process.env using the tier's envKey.
 */
export function getStripePriceId(tier: PriceTier): string | null {
    const info = PRICE_TIERS[tier];
    if (!info) return null;
    return process.env[info.envKey] || null;
}

/**
 * Resolve an app price tier from a Stripe Price ID.
 * Useful when one product supports multiple billing cadences.
 */
export function getPriceTierByStripePriceId(priceId: string | null | undefined): PriceTier | null {
    if (!priceId) return null;

    for (const [tier, info] of Object.entries(PRICE_TIERS) as Array<[PriceTier, TierInfo]>) {
        if (process.env[info.envKey] === priceId) {
            return tier;
        }
    }

    return null;
}

/** All valid price tier values (for DB CHECK constraint) */
export const ALL_PRICE_TIERS: PriceTier[] = Object.keys(PRICE_TIERS) as PriceTier[];
