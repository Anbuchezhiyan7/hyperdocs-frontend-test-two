'use client';

import Footer from '@/components/blog-templates/components/Footer';
import Navbar from '@/components/blog-templates/components/Navbar';
import TEMPLATE_CONFIG from '@/config/preview.config';
import { usePathname } from 'next/navigation';

export default function BlogDetailPage() {
    const pathname = usePathname();
    const currentTemplate = pathname.includes('template_001') ? 'template_001' : 'template_002';
    const userTemplate = { template_tag: currentTemplate };
    console.log('userTemplate', userTemplate);
    const templateData =
        TEMPLATE_CONFIG[userTemplate?.template_tag as keyof typeof TEMPLATE_CONFIG];
    const Component = templateData?.routes.find(route => route.path === 'author')?.component;
    if (!Component) return <div>Page Not Found</div>;
    return (
        <div>
            <Navbar isPreviewMode={true} />
            <Component />
            <Footer isPreviewMode={true} />
        </div>
    );
}