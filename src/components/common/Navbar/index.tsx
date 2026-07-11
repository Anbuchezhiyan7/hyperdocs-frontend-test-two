'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button, Dropdown } from 'antd';
import BlogFilterModal from '@/components/blogs/modals/BlogFilter';
import { useQueryState } from 'nuqs';
import { CaretDownIcon } from '@/assets/icons';
import SearchInput from '@/components/common/Input/SearchInput';
import ViewBlogButton from './ViewBlogButton';

interface NavbarProps {
    titleIcon?: React.ReactNode;
    title?: string;
    hideSearch?: boolean;
    btnLabel?: string;
    btnAction?: () => void;
    secondaryBtnLabel?: string;
    secondaryBtnAction?: () => void;
    secondaryBtnProps?: any;
    hideFilter?: boolean;
    isDropdown?: boolean;
    dropdownMenu?: any;
    extraComponent?: React.ReactNode;
    hideBtn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
    titleIcon,
    title = 'Blogs',
    hideSearch = false,
    btnLabel = 'Create New Blog',
    btnAction,
    secondaryBtnLabel,
    secondaryBtnAction,
    secondaryBtnProps,
    hideFilter = false,
    isDropdown = false,
    dropdownMenu,
    extraComponent,
    hideBtn = false,
}) => {
    const [paramSearch, setParamSearch] = useQueryState('search');

    return (
        <div className='flex items-center justify-between sticky top-0 px-6 h-[69px] shrink-0 border-b z-50 border-gray-200 bg-white'>
            <div className={`${title === 'Article' || title === 'Blogs' ? 'hidden md:flex' : 'flex'} items-center gap-2`}>
                {titleIcon}
                <h2 className='text-lg font-semibold text-[#5D5D5D]'>{title}</h2>
            </div>

            <div className='flex items-center space-x-4'>
                {!hideSearch && (
                    <>
                        <div className='relative'>
                            <SearchInput
                                value={paramSearch || ''}
                                onSearch={(val) => setParamSearch(val || null)}
                                placeholder='Search'
                                className='w-[180px] md:w-[300px] pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                            />
                            <Search
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                                size={18}
                            />
                        </div>
                        {!hideFilter && <BlogFilterModal />}
                    </>
                )}
                {!hideBtn && (
                    <div className='flex items-center gap-2'>

                        {secondaryBtnLabel && (
                            <Button onClick={secondaryBtnAction} {...secondaryBtnProps}>
                                {secondaryBtnLabel}
                            </Button>
                        )}
                        {isDropdown ? (
                            <span data-tour="create-blog-btn">
                                <Dropdown.Button
                                    type='primary'
                                    onClick={btnAction}
                                    overlay={dropdownMenu}
                                    placement='bottomRight'
                                    trigger={['click']}
                                    icon={<CaretDownIcon />}
                                    rootClassName='[&>.ant-dropdown-trigger]:!bg-white [&>.ant-dropdown-trigger]:!text-black [&>.ant-dropdown-trigger]:!border-gray-300 [&>.ant-dropdown-trigger]:!border'
                                >
                                    {btnLabel}
                                </Dropdown.Button>
                            </span>
                        ) : (
                            <Button type='primary' onClick={btnAction} data-tour="create-blog-btn">
                                {btnLabel}
                            </Button>
                        )}
                    </div>

                )}
                {extraComponent}
                <ViewBlogButton />
            </div>
        </div>
    );
};

export default Navbar;
