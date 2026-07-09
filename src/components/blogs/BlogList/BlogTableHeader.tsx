import React from 'react';
import { cn } from '@/utils/cn';
import { BLOG_GRID } from '@/components/blogs/constants';

const COLUMNS = [
    { label: 'Title', align: 'text-left' },
    { label: 'Status', align: 'text-left' },
    { label: 'Results', align: 'text-center' },
    { label: 'SEO Score', align: 'text-center' },
    { label: 'Updated', align: 'text-left' },
    { label: 'Actions', align: 'text-right' },
];

const BlogTableHeader: React.FC = () => {
    return (
        <div
            className={cn(
                BLOG_GRID,
                'px-5 py-3 bg-[#F9FAFB] border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]'
            )}
        >
            {COLUMNS?.map((col) => (
                <div key={col?.label} className={col?.align}>
                    {col?.label}
                </div>
            ))}
        </div>
    );
};

export default BlogTableHeader;
