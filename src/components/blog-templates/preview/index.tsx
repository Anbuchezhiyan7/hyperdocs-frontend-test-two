'use client';

import TEMPLATE_CONFIG from '@/config/preview.config';

export default function BlogsPageComponent ({ templateId }: { templateId: string }) {
    const templateData = TEMPLATE_CONFIG[templateId as keyof typeof TEMPLATE_CONFIG];
    const Component = templateData?.routes.find(route => route.path === '/blogs')?.component;

    if (!Component) return <div>Page Not Found</div>;

    return <Component />;
}
