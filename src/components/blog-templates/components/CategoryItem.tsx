import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/constants/blogs.constants';
import { useQueryState } from 'nuqs';

interface CategoryItemProps {
    category: Category;
    className?: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, className }) => {
    const [activeCategory, setActiveCategory] = useQueryState('category');
    const isSelected: boolean = activeCategory === category?.category_id;
    const[mode] = useQueryState('mode');
    const isPreview = mode === 'preview';
    return (
        <div
            onClick={() => {
                if (isPreview) {
                    return;
                }
                setActiveCategory(category.category_id);
            }}
            className={cn(
                'block py-2 cursor-pointer text-textSecondary hover:text-primary transition-colors',
                isSelected ? 'text-primary' : 'text-textSecondary',
                className
            )}
        >
            {category.category_name}
        </div>
    );
};

export default CategoryItem;
