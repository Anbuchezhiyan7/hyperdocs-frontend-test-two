// Lead Library localStorage utilities

export interface LeadMagnetLibraryItem {
    id: string;
    name: string;
    templateId: string;
    title: string;
    description: string;
    ctaButtonText: string;
    imageUrl?: string;
    pdfUrl?: string;
    pdfFile?: string;
    requiredFields: string[];
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = 'lead_library_magnets';
const SEED_KEY = 'lead_library_seeded_v1';


// ── Seed data ──────────────────────────────────────────────────────────────

const SEED_DATA: Omit<LeadMagnetLibraryItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        name: 'SEO Starter Guide',
        templateId: 'blog-lead-magnet-1',
        title: 'The Complete SEO Starter Guide for 2024',
        description: 'Learn the fundamentals of SEO and rank higher on Google.',
        ctaButtonText: 'Download Free Guide',
        pdfUrl: 'https://example.com/seo-guide.pdf',
        requiredFields: ['name', 'email'],
    },
    {
        name: 'Content Marketing Playbook',
        templateId: 'blog-lead-magnet-2',
        title: 'Content Marketing Playbook — 30 Proven Strategies',
        description: 'A step-by-step playbook to grow your blog traffic 10x.',
        ctaButtonText: 'Get the Playbook',
        pdfUrl: 'https://example.com/content-playbook.pdf',
        requiredFields: ['email'],
    },
    {
        name: 'Email Marketing Toolkit',
        templateId: 'blog-lead-magnet-3',
        title: 'Email Marketing Toolkit — Templates & Best Practices',
        description: 'Everything you need to launch high-converting email campaigns.',
        ctaButtonText: 'Download Toolkit',
        pdfUrl: 'https://example.com/email-toolkit.pdf',
        requiredFields: ['name', 'email', 'phone'],
    },
    {
        name: 'Weekly Newsletter',
        templateId: 'blog-lead-magnet-4',
        title: 'Join 10,000+ Marketers — Weekly Insights',
        description: 'Get the latest digital marketing tips delivered every Monday.',
        ctaButtonText: 'Subscribe Now',
        requiredFields: ['email'],
    },
    {
        name: 'Social Media Calendar',
        templateId: 'blog-lead-magnet-1',
        title: '90-Day Social Media Content Calendar',
        description: 'Never run out of post ideas with our ready-made calendar.',
        ctaButtonText: 'Grab My Calendar',
        pdfUrl: 'https://example.com/social-calendar.pdf',
        requiredFields: ['email'],
    },
    {
        name: 'Blogging Crash Course',
        templateId: 'blog-lead-magnet-2',
        title: 'From Zero to 10K Readers — Blogging Crash Course',
        description: 'Build a loyal audience and monetise your blog in 90 days.',
        ctaButtonText: 'Start Learning',
        pdfUrl: 'https://example.com/blog-course.pdf',
        requiredFields: ['name', 'email'],
    },
    {
        name: 'SaaS Growth Checklist',
        templateId: 'blog-lead-magnet-3',
        title: 'The SaaS Growth Checklist — 50 Actionable Steps',
        description: 'A practical checklist used by fast-growing SaaS companies.',
        ctaButtonText: 'Download Checklist',
        pdfUrl: 'https://example.com/saas-checklist.pdf',
        requiredFields: ['name', 'email'],
    },
    {
        name: 'Product Launch Newsletter',
        templateId: 'blog-lead-magnet-4',
        title: 'Be First to Know — Product Launch Updates',
        description: 'Subscribe and get early access to our newest features.',
        ctaButtonText: 'Notify Me',
        requiredFields: ['email'],
    },
    {
        name: 'Freelance Rate Calculator',
        templateId: 'blog-lead-magnet-1',
        title: 'Freelance Rate Calculator + Pricing Guide',
        description: 'Stop undercharging. Use our calculator to set the right rate.',
        ctaButtonText: 'Get the Calculator',
        pdfUrl: 'https://example.com/rate-calculator.pdf',
        requiredFields: ['name', 'email'],
    },
    {
        name: 'UX Research Templates',
        templateId: 'blog-lead-magnet-2',
        title: '15 UX Research Templates — Ready to Use',
        description: 'Save hours with battle-tested templates for user interviews & surveys.',
        ctaButtonText: 'Download Templates',
        pdfUrl: 'https://example.com/ux-templates.pdf',
        requiredFields: ['email'],
    },
    {
        name: 'Marketing Budget Planner',
        templateId: 'blog-lead-magnet-3',
        title: 'Annual Marketing Budget Planner 2024',
        description: 'Allocate your marketing budget with confidence using our planner.',
        ctaButtonText: 'Get Free Planner',
        pdfUrl: 'https://example.com/budget-planner.pdf',
        requiredFields: ['name', 'email', 'phone'],
    },
    {
        name: 'Startup Weekly Digest',
        templateId: 'blog-lead-magnet-4',
        title: 'Startup Weekly — Funding, Tools & Trends',
        description: 'Curated startup news and insights every Friday morning.',
        ctaButtonText: 'Join for Free',
        requiredFields: ['email'],
    },
];
