'use client';

import templatesApi from '@/api/templates.api';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useQueries } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useQueryState } from 'nuqs';
import React, { useMemo, useTransition } from 'react';
import BlogHeader from '../../components/BlogHeader';
import BlogSection from '../../components/BlogSection';
import FeaturedBlogSlider from '../../components/FeaturedBlogSlider';
import OtherTopicsSection from '../../components/OtherTopicsSection';
import TagsSection from '../../components/TagsSection';
import { blogData, dummyTags, previewTemplateContent } from '../../preview/dummyData';

const HomePage: React.FC = () => {
    const [mode, setMode] = useQueryState('mode');
    const isPreview = mode === 'preview';
    const { getTemplateData, setTemplateData } = useTemplateStore();
    const template = getTemplateData('template');
    const [category, setCategory] = useQueryState('category');
    const [search, setSearch] = useQueryState('search');
    const [isPending, startTransition] = useTransition();
    const headerTitle = isPreview ? previewTemplateContent.title : template?.advanced?.header_title;
    const headerCaption = isPreview
        ? previewTemplateContent.caption
        : template?.advanced?.header_caption;
    const headerCtaButton = isPreview
        ? previewTemplateContent.ctaButton
        : template?.advanced?.header_cta_button;

    const searchResults = useMemo(() => {
        return blogData?.filter((blog: any) =>
            blog.blog_title.toLowerCase().includes(search?.toLowerCase() || '')
        );
    }, [blogData, search]);


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
                <BlogSection
                    showSeeAll={false}
                    title="SEARCH RESULTS"
                    //@ts-ignore
                    blogs={searchResults}
                    pageType="featured"
                />
            </div>
        );
    };

    const renderMainContent = () => (
        <div className="transition-all duration-300 ease-in-out">
            <BlogSection
                isLoading={false}
                showSeeAll={false}
                title="FEATURED BLOGS"
                //@ts-ignore
                blogs={blogData?.slice(0, 4)}
                //@ts-ignore
                mostPopularBlogs={blogData?.slice(0, 5)}
                pageType="featured"
            />

            {template?.advanced?.categories?.map((category: any) => (
                <FeaturedBlogSlider
                    key={category?.category_id}
                    id={category?.category_id}
                    isLoading={false}
                    title={category?.category_name}
                />
            ))}
             {/* <OtherTopicsSection /> */}
            {/* <TagsSection tags={dummyTags} isLoading={false} /> */}
        </div>
    );

    const font = `!font-${template?.advanced?.blog_ui_font}`;
    return (
        <div className={font}>
            <BlogHeader
                title={headerTitle}
                description={headerCaption}
                headerButtonDetails={headerCtaButton}
                isPreview={isPreview}
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
