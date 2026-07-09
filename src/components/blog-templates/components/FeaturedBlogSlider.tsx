import React, { useRef } from 'react';
import FeaturedBlogCard from './FeaturedBlogCard';
import SectionTitle from './SectionTitle';
import type { Swiper as SwiperType } from 'swiper';
import Shimmer from './Shimmer';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useQuery } from '@tanstack/react-query';
import templatesApi from '@/api/templates.api';
import { Swiper, SwiperSlide } from 'swiper/react';

interface FeaturedBlogSliderProps {
    blogs?: Blog[];
    isLoading: boolean;
    title?: string;
    id?: string;
    isPreview?: boolean;
    /** Server-prefetched category blogs — avoids a client-side API round-trip on first load. */
    initialCategoryBlogs?: Blog[] | null;
}

const FeaturedBlogSlider: React.FC<FeaturedBlogSliderProps> = ({
    blogs,
    isLoading,
    title,
    id,
    isPreview,
    initialCategoryBlogs,
}) => {
    const swiperRef = useRef<SwiperType>();

    const { data: categorziedBlogs, isLoading: isCategorizedBlogsLoading } = useQuery({
        queryKey: ['categorzied-blogs', id],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(id as string),
        enabled: !!id && !isPreview,
        // Use server-prefetched data as the initial value — no loading spinner on first render.
        initialData: (initialCategoryBlogs ?? undefined) as Blog[] | undefined,
        meta: { persist: true },
    });

    const blogData = id && !isPreview ? categorziedBlogs : blogs;

    const renderFeaturedBlogs = () => {
        if (isLoading || isCategorizedBlogsLoading) {
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
                            <Shimmer className="h-[250px]" />
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
                {blogData?.map((blog: Blog) => (
                    <SwiperSlide key={blog?.blog_id}>
                            <FeaturedBlogCard className="h-fit" blog={blog} isPreview={isPreview} />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    return (
        <section className="py-8">
            <SectionTitle
                swiperRef={swiperRef as React.RefObject<SwiperType>}
                pageType={'featured'}
                title={title || 'BEST OF THE BLOG'}
                showSeeAll={false}
            />

            {renderFeaturedBlogs()}
        </section>
    );
};

export default FeaturedBlogSlider;