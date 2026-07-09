'use client';

import BlogTemplate1 from './BlogTemplate1';
import BlogTemplate2 from './BlogTemplate2';

export const renderTemplate = (template_type: string) => {
    switch (template_type) {
        case 'template_001':
            return <BlogTemplate1 />;
        case 'template_002':
            return <BlogTemplate2 />;
        default:
            return <BlogTemplate1 />;
    }
};
