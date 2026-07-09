import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '@/api/subscription.api';

const DEFAULT_CREDIT_PRICING: CreditPricingResponse = {
    credit_pricing: {
        seo_features: {
            title: 2,
            introduction: 2,
            subheadings: 2,
            meta_title: 2,
            meta_description: 2,
            keyword_density: 2,
            toc: 2,
            faq: 5,
            banner: 5,
            poll: 5,
            infograph: 5,
            lead_magnet: 5,
            enhance_blog: 5,
            seo_score: 5,
        },
        assets: {
            lead_magnet: 5,
            ai_pdf_generation: 5,
            ai_banner: 5,
            info_graphics: 5,
        },
    },
};

const SEO_FEATURE_KEY_ALIASES: Record<string, string> = {
    faq_schema: 'faq',
    info_graph: 'infograph',
};

export const useCreditPricing = () =>
    useQuery<CreditPricingResponse>({
        queryKey: ['subscription_pricing'],
        queryFn: () => subscriptionApi.handleGetCreditPricing(),
        meta: { persist: true },
    });

export const getSeoFeatureCredit = (
    pricing: CreditPricingResponse | undefined,
    key?: string
): number => {
    if (!key) return 0;

    const normalizedKey = key.toLowerCase();
    const pricingKey = SEO_FEATURE_KEY_ALIASES[normalizedKey] || normalizedKey;

    return (
        pricing?.credit_pricing?.seo_features?.[pricingKey] ??
        DEFAULT_CREDIT_PRICING.credit_pricing.seo_features[pricingKey] ??
        0
    );
};

export const getAssetCredit = (
    pricing: CreditPricingResponse | undefined,
    key: string
): number => {
    return (
        pricing?.credit_pricing?.assets?.[key] ??
        DEFAULT_CREDIT_PRICING.credit_pricing.assets[key] ??
        0
    );
};
