import React, { useRef } from 'react';
import SectionTitle from './SectionTitle';
import BlogCard from './BlogCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import DetailedBlogCard from './DetailedBlogCard';
import type { Swiper as SwiperType } from 'swiper';
import Shimmer from './Shimmer';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useQuery } from '@tanstack/react-query';
import templatesApi from '@/api/templates.api';

interface BlogSectionProps {
    title: string;
    blogs?: Blog[];
    mostPopularBlogs?: Blog[];
    showSeeAll?: boolean;
    pageType?: string;
    isLoading?: boolean;
    isPreview?: boolean;
    showMostPopular?: boolean;
}

const BlogSection: React.FC<BlogSectionProps> = ({
    title,
    blogs,
    mostPopularBlogs,
    showSeeAll = true,
    pageType,
    isLoading,
    isPreview,
    showMostPopular = true,
}) => {
    const swiperRef = useRef<SwiperType>();

    const { data: categorziedBlogs, isLoading: isCategorizedBlogsLoading } = useQuery({
        queryKey: ['categorzied-blogs', pageType],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(pageType as string),
        enabled: !!pageType && pageType !== 'featured',
    });

    const blogsData = pageType === 'featured' ? blogs : categorziedBlogs;
    const mostPopularData = mostPopularBlogs || blogsData;

    const renderFeaturedBlogs = () => {
        if (isLoading) {
            return (
                <Swiper
                    spaceBetween={15}
                    slidesPerView={1}
                    breakpoints={{
                        850: { slidesPerView: 1.7 },
                    }}
                    onBeforeInit={swiper => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerGroup={1}
                >
                    {[1, 2, 3].map((_, index) => (
                        <SwiperSlide key={index}>
                            <Shimmer className='h-[250px]' />
                        </SwiperSlide>
                    ))}
                </Swiper>
            );
        }

        return (
            <Swiper
                spaceBetween={15}
                slidesPerView={1}
                breakpoints={{
                    850: { slidesPerView: 1.7 },
                }}
                onBeforeInit={swiper => {
                    swiperRef.current = swiper;
                }}
                slidesPerGroup={1}
            >
                {blogsData?.map((blog: Blog) => (
                    <SwiperSlide key={blog?.blog_id}>
                        <DetailedBlogCard
                            className='h-[250px]'
                            key={blog?.blog_id}
                            post={blog}
                            isPreview={isPreview}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    const renderBlogGrid = () => {
        if (isCategorizedBlogsLoading) {
            return (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-0 border-t border-l border-gray-200 rounded-lg overflow-hidden'>
                    {[1, 2, 3, 4].map((_, index) => (
                        <Shimmer key={index} className='h-[300px] border-r border-b border-gray-200' />
                    ))}
                </div>
            );
        }

        return (
            < div className='pt-8 md:pt-20'>
                <h2 className='font-bold text-lg uppercase text-textPrimary'>
                    MOST POPULAR
                </h2>
                <div className='mt-5 grid grid-cols-1 gap-0 border-t border-l border-gray-200 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
                    {mostPopularData?.map((blog: Blog) => (
                        <BlogCard 
                            key={blog?.blog_id} 
                            post={blog} 
                            isPreview={isPreview} 
                            className="border-r border-b border-gray-200 rounded-none hover:shadow-none"
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className='py-8'>
            <SectionTitle
                swiperRef={swiperRef as React.RefObject<SwiperType>}
                pageType={pageType}
                title={title}
                showSeeAll={showSeeAll || blogsData?.length > 4}
            />
            {renderFeaturedBlogs()}
            {showMostPopular && renderBlogGrid()}
        </section>
    );
};

export default BlogSection;
