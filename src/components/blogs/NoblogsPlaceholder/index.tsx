import React from 'react';
import { Button } from 'antd';
import { MdArrowOutwardIcon } from '@/assets/icons';    
import Image from 'next/image';
import { blogimage } from '@/assets/images';
import { queryClient } from '@/config/query.config';
import { useQueryState } from 'nuqs';
import { useAppStore } from '@/store/useAppStore';

interface NoBlogsPlaceholderProps {
    onAction?: () => void;
    isLoading?: boolean;
}

const NoBlogsPlaceholder: React.FC<NoBlogsPlaceholderProps> = ({ onAction, isLoading }) => {
    const { filters, resetFilters } = useAppStore();

    const activeSubscription = () =>
        queryClient.getQueryData<ActiveSubscription>(['active_subscription']);
    const remainingBlogs = () => queryClient.getQueryData<any>(['remaining-blogs']);
    const [modelType, setModelType] = useQueryState('model-type');
    const [search, setSearch] = useQueryState('search');

    const isFreePlan = activeSubscription()?.plan_details?.plan_id === 'free_plan';
    const remainingBlogsAvailable = remainingBlogs()?.remaining_blogs;
    const isFilterApplied =
        Object.values(filters).some(filter => filter !== null) || (search?.length || 0) > 0;

    const handleClearFilters = () => {
        setSearch(null);
        resetFilters();
    };

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center h-full gap-[24px] w-[30%] mx-auto '>
                <h3 className='text-[20px] font-[700] text-[#333]'>
                    {isFilterApplied
                        ? 'No blogs found with this filters'
                        : 'Start Your Blogging Journey!'}
                </h3>

                <div
                    hidden={isFilterApplied}
                    className='relative w-full aspect-[3/1] rounded-lg overflow-hidden'
                >
                    <Image src={blogimage} alt='blogimage' className='object-cover' fill />
                    <div className='absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-white via-white/50 to-transparent'></div>
                </div>

                <p hidden={isFilterApplied} className='text-[14px] font-[500] text-[#333]'>
                    {isFilterApplied
                        ? 'No blogs found for this filters'
                        : "There's nothing here yet—but your ideas deserve to be heard! Share your insights, experiences, and stories by creating your first blog. Inspire, inform, and connect with your audience."}
                </p>
                <p className='text-[14px] font-[500] text-[#333]'>
                    {isFilterApplied
                        ? 'Try with different filters or clear the filters'
                        : 'Tap "Create Blog" and start writing now! ✍️'}
                </p>

                {isFilterApplied ? (
                    <Button type='primary' className=' w-full' onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                ) : (
                    <>
                        <Button
                            loading={isLoading}
                            type='primary'
                            className=' w-full'
                            onClick={onAction}
                        >
                            Create Blog
                        </Button>
                        {isFreePlan && (
                            <div className='flex items-center justify-center w-full gap-2'>
                                <p
                                    className='bg-[#FFEEE5] text-[#FF5200] cursor-pointer text-[12px] font-[600] rounded-[5px] px-2 py-1 flex items-center gap-1'
                                    onClick={() => setModelType('pricing')}
                                >
                                    UPGRADE <MdArrowOutwardIcon />
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NoBlogsPlaceholder;
