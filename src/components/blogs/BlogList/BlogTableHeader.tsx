import React from 'react';
import { cn } from '@/utils/cn';
import { BLOG_GRID } from '@/components/blogs/constants';

interface BlogTableHeaderProps {
    isAllSelected?: boolean;
    isPartiallySelected?: boolean;
    onToggleAll?: () => void;
}

const BlogTableHeader: React.FC<BlogTableHeaderProps> = ({
    isAllSelected = false,
    isPartiallySelected = false,
    onToggleAll,
}) => {
    return (
        <div
            className={cn(
                BLOG_GRID,
                'px-5 py-3 bg-[#F9FAFB] border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]'
            )}
        >
            {/* Checkbox — Select All */}
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={el => { if (el) el.indeterminate = isPartiallySelected; }}
                    onChange={onToggleAll}
                    aria-label="Select all blogs"
                    className="w-4 h-4 rounded border-gray-300 text-[#FF5200] cursor-pointer accent-[#FF5200]"
                />
            </div>
            {/* Remaining columns */}
            {[
                { label: 'Title', align: 'text-left' },
                { label: 'Status', align: 'text-left' },
                { label: 'Results', align: 'text-center' },
                { label: 'SEO Score', align: 'text-center' },
                { label: 'Reading', align: 'text-left' },
                { label: 'Updated', align: 'text-left' },
                { label: 'Actions', align: 'text-right' },
            ].map(col => (
                <div key={col.label} className={col.align}>
                    {col.label}
                </div>
            ))}
        </div>
    );
};

export default BlogTableHeader;

