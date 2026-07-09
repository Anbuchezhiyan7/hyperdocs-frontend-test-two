'use client';

import { useState } from 'react';
import { filterFields } from './constant';
import { Input } from '@/components/common/Input';
import FloatingModal from '@/components/common/Modals/FloatingModal';
import { FilterIcon } from '@/assets/icons';
import { useAppStore } from '@/store/useAppStore';

const BlogLeadsFilterModal = () => {
    const { leadFilters, setLeadFilters, resetLeadFilters } = useAppStore();
    const [filterData, setFilterData] = useState<any>(leadFilters);

    const handleFilterChange = (name: string, value: any) => {
        setFilterData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveFilters = () => {
        setLeadFilters(filterData);
    };

    const handleResetFilters = () => {
        setFilterData({});
        resetLeadFilters();
    };

    return (
        <FloatingModal
            btnLabel='Filters'
            icon={<FilterIcon />}
            primayBtnLabel='Apply Filter'
            onSave={() => handleSaveFilters()}
            onClose={() => handleResetFilters()}
        >
            <div className='flex flex-col'>
                {filterFields.map((field: any, index: number) => (
                    <Input
                        key={field?.name || index}
                        value={filterData[field?.name] || ''}
                        labelLineStyle
                        onChange={(value: any) => handleFilterChange(field?.name, value)}
                        {...field}
                    />
                ))}
            </div>
        </FloatingModal>
    );
};

export default BlogLeadsFilterModal;
