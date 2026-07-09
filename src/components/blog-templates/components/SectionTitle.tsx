import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useQueryState } from 'nuqs';
import type { Swiper as SwiperType } from 'swiper';
import Scroller from '@/components/common/Scroller';
interface SectionTitleProps {
    title: string;
    showSeeAll?: boolean;
    pageType?: string;
    className?: string;
    swiperRef?: React.RefObject<SwiperType>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    showSeeAll = false,
    className,
    pageType,
    swiperRef,
}) => {
    const [_, setPageType] = useQueryState('page-type');
    const [category, setCategory] = useQueryState('category');

    const handleSeeAll = () => {
        if (pageType === 'featured') {
            setPageType(pageType as string);
        } else {
            setCategory(pageType as string);
            setPageType('category');
        }
    };

    return (
        <div className={cn('flex items-center justify-between mb-6', className)}>
            <h2 className='font-bold text-lg uppercase text-textPrimary'>
                {title}
            </h2>
<div className='flex gap-5'>            {swiperRef && pageType === 'featured' && (
                <Scroller
                    handlePrevious={() => swiperRef.current?.slidePrev()}
                    handleNext={() => swiperRef.current?.slideNext()}
                />
            )}

            {/* {showSeeAll && (
                <div
                    onClick={handleSeeAll}
                    className='cursor-pointer text-primary font-medium flex items-center hover:underline transition-all'
                >
                    See all
                    <ArrowRight className='ml-1 h-4 w-4' />
                </div>
            )} */}
            </div>

        </div>
    );
};

export default SectionTitle;
