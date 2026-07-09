'use client';

/**
 * PREVIEW (dashboard) home page for Template 3.
 * Mirrors the production Template 3 home layout but is fed the SHARED preview
 * dummy data (same data templates 1 & 2 previews consume) instead of the API.
 */

import React from 'react';
import { useQueryState } from 'nuqs';

import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';
import {
    FeaturedHeroCard,
    CategoryRail,
    ArticleCard,
} from '../../template-3/BlogsPage';
import { blogData, dummyCategories, previewTemplateContent } from '../dummyData';
import { useTemplate3Bg } from '../../template-3/useTemplate3Bg';

const BlogsPage: React.FC = () => {
    const template = useTemplateStore(state => state.templateData?.['template']);
    const [category] = useQueryState('category');

    const accent = template?.general?.accent_color || '#FF5A1F';
    const bgColor = useTemplate3Bg();
    const hideAuthors = template?.seo?.hide_authors;
    const font = template?.advanced?.blog_ui_font ? `!font-${template.advanced.blog_ui_font}` : '';

    const headerTitle = template?.advanced?.header_title || previewTemplateContent.title;
    const headerCaption =
        template?.advanced?.short_description ||
        template?.advanced?.header_caption ||
        previewTemplateContent.caption;

    const blogs = blogData as any[];
    const featured = blogs[0];
    // In preview the category ids are dummy, so just show all when one is "selected"
    const popular = category
        ? blogs.filter(b => b.category?.category_id === category)
        : blogs;
    const list = popular.length ? popular : blogs;

    return (
        <div
            className={cn('relative min-h-screen', font)}
            style={{ ['--accent3' as string]: accent, backgroundColor: bgColor }}
        >
            <div className="relative mx-auto w-full max-w-[1368px] px-5 pb-24 pt-10 md:pt-16">
                {/* HERO */}
                <section className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight text-[#1A1A1A] md:text-6xl xl:text-7xl">
                            {headerTitle}
                        </h1>
                        <p className="max-w-md text-lg font-medium text-[#6B6B6B]">{headerCaption}</p>
                    </div>

                    <div className="lg:-mt-4">
                        {featured && (
                            <FeaturedHeroCard post={featured} accent={accent} hideAuthors={hideAuthors} />
                        )}
                    </div>
                </section>

                <CategoryRail categories={dummyCategories as any} />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map(post => (
                        <ArticleCard key={post.blog_id} post={post} hideAuthors={hideAuthors} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogsPage;
