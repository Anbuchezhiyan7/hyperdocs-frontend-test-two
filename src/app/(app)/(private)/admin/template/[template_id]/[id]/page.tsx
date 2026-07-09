'use client';

import TEMPLATE_CONFIG from '@/config/preview.config';
import { useParams } from 'next/navigation';
export default function BlogDetailPage () {
    const { template_id } = useParams();
    const templateData = TEMPLATE_CONFIG[template_id as keyof typeof TEMPLATE_CONFIG];
    const Component = templateData?.routes.find(route => route.path === '/blogs/:id')?.component;
    if (!Component) return <div>Page Not Found</div>;
    return <Component />;
}
