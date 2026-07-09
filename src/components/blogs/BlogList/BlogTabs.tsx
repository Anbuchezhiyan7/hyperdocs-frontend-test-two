import React from 'react';
import { cn } from '@/utils/cn';
import { BlogTabKey } from '@/components/blogs/constants';

interface BlogTabsProps {
    activeTab: BlogTabKey;
    onChange: (tab: BlogTabKey) => void;
    counts: Record<BlogTabKey, number>;
}

const TABS: { key: BlogTabKey; label: string }[] = [
    { key: 'all', label: 'All Posts' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
    { key: 'scheduled', label: 'Scheduled' },
];

const BlogTabs: React.FC<BlogTabsProps> = ({ activeTab, onChange, counts }) => {
    return (
        <div className="flex items-center gap-1 overflow-x-auto">
            {TABS?.map((tab) => {
                const isActive = activeTab === tab?.key;
                return (
                    <button
                        key={tab?.key}
                        onClick={() => onChange(tab?.key)}
                        className={cn(
                            'relative flex items-center gap-2 px-3 py-3 text-[14px] font-semibold whitespace-nowrap transition-colors',
                            isActive ? 'text-[#FF5200]' : 'text-[#6B7280] hover:text-[#374151]'
                        )}
                    >
                        {tab?.label}
                        <span
                            className={cn(
                                'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold',
                                isActive
                                    ? 'bg-[#FFE6DA] text-[#FF5200]'
                                    : 'bg-gray-100 text-gray-500'
                            )}
                        >
                            {counts?.[tab?.key] ?? 0}
                        </span>
                        {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5200] rounded-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default BlogTabs;
