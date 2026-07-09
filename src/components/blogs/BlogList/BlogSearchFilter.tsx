'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useQueryState } from 'nuqs';
import SearchInput from '@/components/common/Input/SearchInput';
import BlogFilterModal from '@/components/blogs/modals/BlogFilter';

const BlogSearchFilter: React.FC = () => {
    const [paramSearch, setParamSearch] = useQueryState('search');

    return (
        <div className="flex items-center gap-2 py-2">
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                />
                <SearchInput
                    value={paramSearch || ''}
                    onSearch={(val) => setParamSearch(val || null)}
                    placeholder="Search posts..."
                    className="w-[180px] md:w-[240px] !pl-9 !pr-3 !h-[38px] !bg-white !border !border-gray-200 !rounded-lg focus:!border-[#FF5200]"
                />
            </div>
            <BlogFilterModal />
        </div>
    );
};

export default BlogSearchFilter;
