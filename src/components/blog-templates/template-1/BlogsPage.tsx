'use client';

import React, { useMemo, useTransition } from 'react';
import BlogSection from '../components/BlogSection';
import OtherTopicsSection from '../components/OtherTopicsSection';
import TagsSection from '../components/TagsSection';
import { useQueries } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import BlogHeader from '../components/BlogHeader';
import Cookies from 'js-cookie';
import templatesApi from '@/api/templates.api';
import { useTemplateStore } from '@/store/useTemplateStore';
import FeaturedBlogSlider from '../components/FeaturedBlogSlider';

interface HomePageProps {
    /**
     * Server-prefetched category blogs keyed by category_id.
     * Passed as React Query `initialData` to FeaturedBlogSlider to eliminate
     * per-category client-side API calls on first load.
     */
    initialCategoryBlogsMap?: Record<string, Blog[]>;
}

const HomePage: React.FC<HomePageProps> = ({ initialCategoryBlogsMap }) => {
    const { getTemplateData, setTemplateData } = useTemplateStore();
    const user_id = Cookies.get('user_id');
    const {
        0: { data: blogs, isLoading: isBlogsLoading },
        1: { data: tags, isLoading: isTagsLoading },
    } = useQueries({
        queries: [
            {
                queryKey: ['blogs', user_id],
                // staleTime: 0 — always background-refetch on mount so edits/new blogs appear immediately.
                // No spinner because of the `isBlogsLoading && !blogs` guard below.
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
                placeholderData: [],
                meta: { persist: true },
            },
        ],
    });

    const template = getTemplateData('template');
    const [category, setCategory] = useQueryState('category');
    const [search, setSearch] = useQueryState('search');
    const [isPending, startTransition] = useTransition();

    const searchResults = useMemo(() => {
        return blogs?.filter((blog: Blog) =>
            blog.blog_title.toLowerCase().includes(search?.toLowerCase() || '')
        );
    }, [blogs, search]);

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
                <BlogSection
                    showSeeAll={false}
                    title='SEARCH RESULTS'
                    blogs={searchResults}
                    pageType='search'
                />
            </div>
        );
    };

    const renderMainContent = () => (
        <div className='transition-all duration-300 ease-in-out'>
            <BlogSection
                isLoading={isBlogsLoading && !blogs}
                showSeeAll={false}
                title='FEATURED'
                blogs={blogs}
                pageType='featured'
            />

            {template?.advanced?.categories?.map((category: any) => (
                <FeaturedBlogSlider
                    key={category?.category_id}
                    id={category?.category_id}
                    isLoading={isBlogsLoading}
                    title={category?.category_name}
                    initialCategoryBlogs={initialCategoryBlogsMap?.[category?.category_id] ?? null}
                />
            ))}
            {/* {!isBlogsLoading && <OtherTopicsSection />} */}
            {/* <TagsSection tags={tags || []} isLoading={isTagsLoading} /> */}
        </div>
    );

    const font = `!font-${template?.advanced?.blog_ui_font}`;
    return (
        <div className={font}>
            <BlogHeader
                title={template?.advanced?.header_title}
                description={template?.advanced?.header_caption}
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
    );
};

export default HomePage;
