'use client';

import BlogTemplateLayout from '@/components/blog-templates/layouts';
import TEMPLATE_CONFIG from '@/config/template.config';
import { useTemplateStore } from '@/store/useTemplateStore';

export default function AuthorPage() {
    const { getTemplateData } = useTemplateStore();
    const userTemplate = getTemplateData('user_template');
    const templateData =
        TEMPLATE_CONFIG[userTemplate?.template_tag as keyof typeof TEMPLATE_CONFIG];
    const Component = templateData?.routes.find(route => route.path === 'author')?.component;
    if (!Component) return <div>Page Not Found</div>;
    return (
        <BlogTemplateLayout>
            <Component />
        </BlogTemplateLayout>
    );
}
