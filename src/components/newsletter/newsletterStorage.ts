export interface Template1Config {
    title: string;
    description: string;
    buttonText: string;
    placeholderText: string;
}

export interface Template2Config {
    title: string;
    description: string;
    buttonText: string;
    placeholderText: string;
    rightHeading: string;
    rightSubtext: string;
}

export interface NewsletterConfig {
    id: string;
    activeTemplate: 1 | 2;
    template1: Template1Config;
    template2: Template2Config;
    createdAt: string;
    updatedAt: string;
}

export const DEFAULT_TEMPLATE1: Template1Config = {
    title: 'Subscribe to Our Newsletter',
    description: 'Stay up to date with our latest news and updates.',
    buttonText: 'Subscribe Now',
    placeholderText: 'Enter your email address',
};

export const DEFAULT_TEMPLATE2: Template2Config = {
    title: 'Stay in the Loop',
    description: 'Get the freshest articles and insights delivered straight to your inbox.',
    buttonText: 'Subscribe',
    placeholderText: 'Enter your email address',
    rightHeading: 'Join our readers',
    rightSubtext: 'No spam. Unsubscribe anytime.',
};

const KEY = 'newsletter_config';

export function getNewsletterConfig(): NewsletterConfig | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

export function saveNewsletterConfig(
    cfg: Partial<Omit<NewsletterConfig, 'id' | 'createdAt' | 'updatedAt'>>
): NewsletterConfig {
    const now = new Date().toISOString();
    const existing = getNewsletterConfig();
    const item: NewsletterConfig = {
        id: existing?.id ?? `nl_${Date.now()}`,
        activeTemplate: cfg.activeTemplate ?? existing?.activeTemplate ?? 1,
        template1: { ...DEFAULT_TEMPLATE1, ...existing?.template1, ...cfg.template1 },
        template2: { ...DEFAULT_TEMPLATE2, ...existing?.template2, ...cfg.template2 },
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
    };
    localStorage.setItem(KEY, JSON.stringify(item));
    return item;
}
