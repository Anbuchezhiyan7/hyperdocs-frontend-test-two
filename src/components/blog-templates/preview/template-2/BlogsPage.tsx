'use client';

import React, { useMemo, useTransition, useRef } from 'react';
import BlogHeader from '../../components/template2/BlogHeader';
import CategoryTabs from '../../components/template2/CategoryTabs';
import FeaturedPost from '../../components/template2/FeaturedPost';
import BlogCard from '../../components/template2/BlogCard';
import { useQueries, useQuery } from '@tanstack/react-query';
import templatesApi from '@/api/templates.api';
import { useQueryState } from 'nuqs';
import Scroller from '@/components/common/Scroller';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Cookies from 'js-cookie';
import Shimmer from '../../components/Shimmer';
import { useTemplateStore } from '@/store/useTemplateStore';
import { blogData, dummyTags, previewTemplateContent } from '../../preview/dummyData';

const BlogsPage: React.FC = () => {
    const { getTemplateData, setTemplateData } = useTemplateStore();
    const user_id = Cookies.get('user_id');
    const [mode, setMode] = useQueryState('mode');
    const isPreview = mode === 'preview';
    const template = getTemplateData('template');
    const [category, setCategory] = useQueryState('category');
    const [search, setSearch] = useQueryState('search');
    const [isPending, startTransition] = useTransition();
    const swiperRef = useRef<SwiperType>();
    const headerTitle = isPreview ? previewTemplateContent.title : template?.advanced?.header_title;
    const headerCaption = isPreview
        ? previewTemplateContent.caption
        : template?.advanced?.header_caption;
    const headerCtaButton = isPreview
        ? previewTemplateContent.ctaButton
        : template?.advanced?.header_cta_button;

    const searchedBlog = category ? blogData : blogData;
    const searchResults = useMemo(() => {
        return blogData?.filter((blog: any) =>
            blog.blog_title.toLowerCase().includes(search?.toLowerCase() || '')
        );
    }, [blogData, search]);
    const font = `!font-${template?.advanced?.blog_ui_font}`;

    const renderSearchResults = () => {
        if (!searchResults?.length) {
            return (
                <div className="mb-8 transition-all duration-300 ease-in-out">
                    <div className="uppercase text-sm font-medium text-[#5D5D5D] mb-4">
                        NO RESULTS FOUND
                    </div>
                </div>
            );
        }

        return (
            <div className="transition-all duration-300 ease-in-out">
                <div className="mb-8">
                    <div className="uppercase text-sm font-medium text-[#5D5D5D] mb-4">
                        SEARCH RESULTS
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchResults.map((post: any) => (
                        <BlogCard key={post.blog_id} post={post} />
                    ))}
                </div>
            </div>
        );
    };

    const renderMainContent = () => (
        <div className="transition-all duration-300 ease-in-out">
            <div className="md:mb-8 mb-0 mt-5">
                <div className="uppercase border-b border-stroke pb-2 flex items-center justify-between text-[#5D5D5D] mb-7">
                    <span className="font-bold font-dm-sans text-base">FEATURED</span> 
                    <Scroller
                        handlePrevious={() => swiperRef.current?.slidePrev()}
                        handleNext={() => swiperRef.current?.slideNext()}
                    />
                </div>

                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    onBeforeInit={swiper => {
                        swiperRef.current = swiper;
                    }}
                >
                        {blogData?.map((blog: any) => (
                              <SwiperSlide key={blog.blog_id}>
                                  <FeaturedPost post={blog} isPreview/>
                              </SwiperSlide>
                          ))}
                </Swiper>
            </div>

            <CategoryTabs categories={template?.advanced?.categories || []} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 mb-8">
                {searchedBlog?.map((post: any) => <BlogCard key={post.blog_id} post={post} isPreview/>)} 
            </div>
        </div>
    );

    return (
        <div className={font}>
            <div className="container-custom">
                <BlogHeader
                    title={headerTitle}
                    description={headerCaption}
                    headerButtonDetails={headerCtaButton}
                    isPreview
                />
                <div
                    className={`transition-opacity duration-300 ${
                        isPending ? 'opacity-50' : 'opacity-100'
                    }`}
                >
                    {search ? renderSearchResults() : renderMainContent()}
                </div>
            </div>
        </div>
    );
};

export default BlogsPage;
