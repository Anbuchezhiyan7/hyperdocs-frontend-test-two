'use client';

import BlogsPageComponent from '@/components/blog-templates/preview';
import { useParams } from 'next/navigation';
import { useQueryState } from 'nuqs';

const TemplatePreviewPage = () => {
    const { template_id } = useParams();
    const [pageType, setPageType] = useQueryState('blog');
    console.log('TEMPLATE ID', template_id);
    return <BlogsPageComponent templateId={template_id as string} />;
};

export default TemplatePreviewPage;
