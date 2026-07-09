import React from 'react';
import { Category } from '@/constants/blogs.constants';
import { cn } from '@/utils/cn';
import { useQueryState } from 'nuqs';

interface CategoryTabsProps {
    categories: Category[];
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories }) => {
    const [activeCategory, setActiveCategory] = useQueryState('category');
    
    const data = [
        {
            category_id: null,
            category_name: 'All Blogs',
        },
        ...categories,
    ];

    const isTabActive = (id: string | null) => {
        if (activeCategory === null && id === null) return true;
        return activeCategory === id;
    };

    return (
        <div className='flex items-center gap-2 border-b border-[#E0E0E0] 2xl:mb-12 mb-6 overflow-x-auto no-scrollbar'>
            {data.map(category => {
                const active = isTabActive(category?.category_id);
                return (
                    <div key={category?.category_id || 'all'} className='relative flex flex-col items-center'>
                        <button
                            onClick={() => setActiveCategory(category?.category_id)}
                            className={cn(
                                'px-6 py-1.5 text-base font-dm-sans font-bold transition-all duration-200 rounded-full mb-4 whitespace-nowrap',
                                active
                                    ? 'bg-[#F2F2F2] text-[#333333] border border-[#E0E0E0]'
                                    : 'text-[#5D5D5D] hover:text-[#333333] hover:bg-[#F9F9F9]'
                            )}
                        >
                            {category?.category_name}
                        </button>
                        {active && (
                            <div className='absolute bottom-0 w-10 h-[4px] bg-[#333333] rounded-t-md' />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryTabs;
