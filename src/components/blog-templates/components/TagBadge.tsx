import React from 'react';
import { cn } from '@/lib/utils';
import { useQueryState } from 'nuqs';

interface TagBadgeProps {
    tag: Tag;
    className?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, className, icon, onClick }) => {
    const [_, setTagQuery] = useQueryState('tag');
    const [mode, setMode] = useQueryState('mode');
    const isPreview = mode === 'preview';
    
    const handleClick = () => {
        if (isPreview) return;
        if (onClick) {
            onClick();
        } else {
            setTagQuery(tag.tag_id);
        }
    };
    return (
        <div
            onClick={handleClick}
            className={cn(
                'inline-block bg-secondary text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer',
                className
            )}
        >
            {icon && icon}
            {tag.tag_name}
        </div>
    );
};

export default TagBadge;
