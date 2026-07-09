interface Plan {
    id?: string;
    product_id?: string;
    type?: string;
    description: string;
    name?: string;
    billing_cycle?: Billingcycle;
    trial_period?: null;
    tax_mode?: string;
    unit_price?: Unitprice;
    unit_price_overrides?: any[];
    custom_data?: Customdatum | null;
    status?: string;
    quantity?: Quantity;
    import_meta?: null;
    created_at?: string;
    updated_at?: string;
    is_current_plan: boolean;
    features?: string[];
    plan_id?: string;
    plan_name?: string;
    price?: number;
}

interface Quantity {
    minimum: number;
    maximum: number;
}

interface Customdatum {
    credits: string;
}

interface Unitprice {
    amount: string;
    currency_code: string;
}

interface Billingcycle {
    interval: string;
    frequency: number;
}

interface ActiveSubscription {
    plan_details: {
        plan_id: string;
        plan_amount: number;
        billing_period: string;
        plan_name: string;
    };
    expiry_date: string;
    total_ai_credits: number;
}

interface CreditPricingResponse {
    credit_pricing: {
        seo_features: Record<string, number>;
        assets: Record<string, number>;
    };
}
