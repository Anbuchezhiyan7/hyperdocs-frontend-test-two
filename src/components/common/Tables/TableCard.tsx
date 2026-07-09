'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Skeleton } from 'antd';
import Button from '@/components/common/Buttons';
import SearchInput from '@/components/common/Input/SearchInput';
import Table from './index';

interface TableCardProps {
    title?: string;
    icon?: React.ReactNode;
    searchValue?: string;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
    addLabel?: string;
    onAdd?: () => void;
    secondaryButton?: React.ReactNode;
    subHeader?: React.ReactNode;
    columns: TableColumn[];
    data: Record<string, any>[];
    isLoading?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({
    title,
    icon,
    searchValue,
    onSearch,
    searchPlaceholder = 'Search...',
    addLabel,
    onAdd,
    secondaryButton,
    subHeader,
    columns,
    data,
    isLoading,
}) => {
    return (
        <div className='p-4 md:p-6 bg-[#F7F8FA] min-h-full'>
            <div className='max-w-5xl mx-auto'>
                <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
                    <div className='flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100'>
                        {title && (
                            <div className='flex items-center gap-2'>
                                {icon}
                                <h3 className='text-[16px] font-semibold text-[#5D5D5D]'>{title}</h3>
                            </div>
                        )}

                        <div className='flex flex-wrap items-center gap-2 ml-auto'>
                            {onSearch && (
                                <div className='relative'>
                                    <Search
                                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                                        size={16}
                                    />
                                    <SearchInput
                                        value={searchValue || ''}
                                        onSearch={onSearch}
                                        placeholder={searchPlaceholder}
                                        className='w-[180px] md:w-[240px] !pl-9 !pr-3 !h-[38px] !bg-white !border !border-gray-200 !rounded-lg focus:!border-[#FF5200]'
                                    />
                                </div>
                            )}

                            {secondaryButton}
                            {addLabel && (
                                <Button type='primary' onClick={onAdd} className='!rounded-lg'>
                                    {addLabel}
                                </Button>
                            )}
                        </div>
                    </div>

                    {subHeader}

                    <div className='overflow-x-auto'>
                        {isLoading ? (
                            <div className='p-4'>
                                <Skeleton active />
                            </div>
                        ) : (
                            <Table columns={columns} data={data} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableCard;
