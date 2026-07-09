'use client';

import React, { useMemo, useTransition, useRef } from 'react';
import BlogHeader from '../components/template2/BlogHeader';
import CategoryTabs from '../components/template2/CategoryTabs';
import FeaturedPost from '../components/template2/FeaturedPost';
import BlogCard from '../components/template2/BlogCard';
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
import Shimmer from '../components/Shimmer';
import { useTemplateStore } from '@/store/useTemplateStore';
const BlogsPage: React.FC = () => {
    const { setTemplateData } = useTemplateStore();
    const user_id = Cookies.get('user_id');
    const template = useTemplateStore(state => state.templateData?.['template']);
    const [category, setCategory] = useQueryState('category');
    const [search, setSearch] = useQueryState('search');
    const [isPending, startTransition] = useTransition();
    const swiperRef = useRef<SwiperType>();

    const {
        0: { data: blogs, isLoading: isBlogsLoading },
        1: { data: tags, isLoading: isTagsLoading },
    } = useQueries({
        queries: [
            {
                queryKey: ['blogs', user_id],
                // staleTime: 0 — always background-refetch so edits/new blogs appear on refresh.
                // No loading spinner because of the `isBlogsLoading && !blogs` guard in the render.
                staleTime: 0,
                queryFn: () =>
                    templatesApi.handleGetAllBlogs(user_id as string).then(res => {
                        setTemplateData('blogs', res);
                        return res;
                    }),
                meta: { persist: true },
            },
            {
                queryKey: ['tags', user_id],
                staleTime: 0,
                queryFn: () =>
                    templatesApi.handleGetAllTags(user_id as string).then(res => {
                        setTemplateData('tags', res);
                        return res;
                    }),
                meta: { persist: true },
            },
        ],
    });

    const { data: categorziedBlogs, isLoading: isCategorizedBlogsLoading } = useQuery({
        queryKey: ['categorzied-blogs', category],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(category as string),
        enabled: !!category,
        meta: { persist: true },
    });

    const blogsData = category ? categorziedBlogs : blogs;
    const searchResults = useMemo(() => {
        return blogs?.filter((blog: Blog) =>
            blog.blog_title.toLowerCase().includes(search?.toLowerCase() || '')
        );
    }, [blogs, search]);
    const font = `!font-${template?.advanced?.blog_ui_font}`;

    const renderSearchResults = () => {
        if (!searchResults?.length) {
            return (
                <div className='mb-8 transition-all duration-300 ease-in-out'>
                    <div className='uppercase text-sm font-medium text-[#5D5D5D] mb-4'>
                        NO RESULTS FOUND
                    </div>
                </div>
            );
        }

        return (
            <div className='transition-all duration-300 ease-in-out'>
                <div className='mb-8'>
                    <div className='uppercase text-sm font-medium text-[#5D5D5D] mb-4'>
                        SEARCH RESULTS
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {searchResults.map((post: Blog) => (
                        <BlogCard key={post.blog_id} post={post} />
                    ))}
                </div>
            </div>
        );
    };

    const renderMainContent = () => (
        <div className='transition-all duration-300 ease-in-out'>
            <div className='md:mb-8 mb-0 mt-5'>
                <div className='uppercase border-b border-stroke pb-2 flex items-center justify-between text-[#5D5D5D] mb-7 font-dm-sans'>
                    <span className='font-bold font-dm-sans text-base'>FEATURED</span>
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
                    {(isBlogsLoading && !blogs)
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <SwiperSlide key={index}>
                                  <Shimmer className='h-[250px]' />
                              </SwiperSlide>
                          ))
                        : blogs?.map((blog: Blog) => (
                              <SwiperSlide key={blog.blog_id}>
                                  <FeaturedPost post={blog} />
                              </SwiperSlide>
                          ))}
                </Swiper>
            </div>

            <CategoryTabs categories={template?.advanced?.categories || []} />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 mb-8'>
                {(isCategorizedBlogsLoading || (isBlogsLoading && !blogsData))
                    ? Array.from({ length: 6 }).map((_, index) => (
                          <div className='col-span-1' key={index}>
                              <Shimmer className='h-[250px]' />
                          </div>
                      ))
                    : blogsData?.map((post: Blog) => <BlogCard key={post.blog_id} post={post} />)}
            </div>
        </div>
    );

    return (
        <div className={font}>
            <div className='container-custom'>
                <BlogHeader
                    title={template?.advanced?.header_title}
                    description={template?.advanced?.short_description}
                    headerButtonDetails={template?.advanced?.header_cta_button}
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
