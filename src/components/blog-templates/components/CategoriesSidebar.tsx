import React from 'react';
import CategoryItem from './CategoryItem';
import { Category } from '@/constants/blogs.constants';

interface CategoriesSidebarProps {
    categories: Category[];
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({ categories }) => {
    const data = [
        {
            category_id: null,
            category_name: 'All',
        },
        ...categories,
    ];

    return (
        <div className='border-r border-border pr-8'>
            <h3 className='font-semibold text-lg uppercase tracking-wide text-textPrimary mb-4'>
                CATEGORIES
            </h3>
            <div className='space-y-1'>
                {data.map(category => (
                    <CategoryItem key={category.category_id} category={category as any} />
                ))}
            </div>
        </div>
    );
};

export default CategoriesSidebar;
