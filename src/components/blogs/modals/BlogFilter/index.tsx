'use client';

import { useState } from 'react';
import { filterFields } from './constant';
import { Input } from '@/components/common/Input';
import { useAppStore } from '@/store/useAppStore';
import { SlidersHorizontal } from 'lucide-react';
import FloatingModal from '@/components/common/Modals/FloatingModal';
import { categoriesApi } from '@/api/categories.api';
import { tagsApi } from '@/api/tags.api';
import { useQueries } from '@tanstack/react-query';
import { convertToSelectOptions } from '@/utils/format/string';

const BlogFilterModal = () => {
    const { filters, setFilters, resetFilters } = useAppStore();
    const [filterData, setFilterData] = useState<any>({});

    const handleFilterChange = (name: string, value: any) => {
        setFilterData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const {
        '0': { data: tags, isLoading: isGettingAllTags },
        '1': { data: categories, isLoading: isGettingAllCategories },
    } = useQueries({
        queries: [
            {
                queryKey: ['tags'],
                queryFn: () => tagsApi.handleGetAllTags(),
            },
            {
                queryKey: ['categories'],
                queryFn: () => categoriesApi.handleGetAllCategories(),
            },
        ],
    });

    const handleSaveFilters = () => {
        setFilters({ ...filters, ...filterData });
    };

    const getOptions = (name: string) => {
        switch (name) {
            case 'categories':
                return convertToSelectOptions(categories || [], 'category_id', 'category_name');
            case 'tags':
                return convertToSelectOptions(tags || [], 'tag_id', 'tag_name');
            default:
                return [];
        }
    };

    console.log('filters in blog filter modal', filters);
    const handleResetFilters = () => {
        setFilterData({});
        resetFilters();
    };

    return (
        <FloatingModal
            btnLabel='Filters'
            icon={<SlidersHorizontal size={18} />}
            primayBtnLabel='Apply Filter'
            secondaryBtnLabel='Reset Filter'
            onSave={() => handleSaveFilters()}
            onClose={() => handleResetFilters()}
        >
            <div className='flex flex-col'>
                {filterFields.map((field: any, index: number) => (
                    <Input
                        key={field?.name || index}
                        labelLineStyle
                        value={filterData[field?.name] || ''}
                        onChange={(value: any) => handleFilterChange(field?.name, value)}
                        options={getOptions(field?.name)}
                        {...field}
                        isLoading={isGettingAllTags || isGettingAllCategories}
                        isMulti={field?.variant === 'multi'}
                    />
                ))}
            </div>
        </FloatingModal>
    );
};

export default BlogFilterModal;
