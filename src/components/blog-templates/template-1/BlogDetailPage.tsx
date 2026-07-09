'use client';

/**
 * PUBLIC BLOG PAGE entry point for Template 1.
 *
 * When `visualContent` is provided (public page path), this component renders
 * a minimal shell with NO Plate editor — keeping the entire Plate library out
 * of the public page JS bundle and eliminating the ~15 s TBT.
 *
 * When `visualContent` is absent (dashboard/preview path), it dynamically loads
 * BlogDetailPageWithEditor which contains useCreateEditor + TableOfContents.
 */

import SpinnerLoader from '@/components/common/SpinnerLoader';
import { useTemplateStore } from '@/store/useTemplateStore';
import dayjs from 'dayjs';
import Cookie from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import ReadingProgress from '../components/ReadingProgress';
import { useAppStore } from '@/store/useAppStore';
import PublicTableOfContents from '../components/PublicTableOfContents';
import PublicMobileTableOfContents from '../components/PublicMobileTableOfContents';

// Dynamically imported so Plate never enters the public page's JS bundle
const BlogDetailPageWithEditor = dynamic(() => import('./BlogDetailPageWithEditor'), {
    ssr: false,
    loading: () => null,
});

const ShareArticle = dynamic(() => import('../components/ShareArticle'), {
    ssr: false,
    loading: () => null,
});

interface BlogDetailPageProps {
    blog?: Blog;
    visualContent?: React.ReactNode;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ blog, visualContent }) => {
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData(`template`);
    const { setBlog } = useAppStore();
    const router = useRouter();
    const contentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setBlog(blog as Blog);
    }, [setBlog]);

      const handleGetAuthorPath = () => {
        Cookie.set('author_id', blog?.author_details?.author_id || '');
        let AuthorName = (blog?.author || '').toLowerCase().replace(" ", "_");
        let AuthorDesignation = (blog?.author_details?.designation || '').toLowerCase().replace(" ", "_") || 'no_designation';
        router.push(
            `/blogs/author/${AuthorName}/${AuthorDesignation}`
        );
    };

    if (!blog) {
        return <SpinnerLoader />;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC BLOG PAGE PATH
    // visualContent = server-rendered HTML from RenderServerElements (no Plate).
    // We render a minimal layout shell — Plate is never loaded or executed.
    // ─────────────────────────────────────────────────────────────────────────
    if (visualContent) {
        return (
            <div>
                {template?.seo?.show_post_progress_bar_on_scroll && (
                    <ReadingProgress containerRef={contentContainerRef} />
                )}
                <div className="grid grid-cols-1 lg:grid-cols-12 md:px-8 px-2 h-auto">
                    {/* Left sidebar — Table of Contents */}
                    <div className="lg:col-span-2 hidden lg:block sticky top-0 h-fit no-scrollbar">
                        <PublicTableOfContents content={blog.content} />
                    </div>

                    {/* Main content */}
                    <div
                        ref={contentContainerRef}
                        className="lg:col-span-8 px-2 md:px-6 lg:border-l lg:border-r"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-[#333333] leading-tight mb-4 mt-6">
                            {blog?.blog_title}
                        </h1>
                        <div className="flex items-center justify-between mb-8 mt-4 text-sm text-textTertiary">
                            <div hidden={template?.seo?.hide_authors}>
                                <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">Author:</span>
                                <span
                                    className="font-jakarta font-semibold text-sm text-[#333333] underline hover:text-black"
                                    onClick={handleGetAuthorPath}
                                >
                                    {blog?.author_details?.author_name}
                                </span>
                            </div>
                            <div hidden={template?.seo?.hide_post_dates}>
                                <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">Date:</span>
                                <span className="font-jakarta font-semibold text-sm text-[#333333]">
                                    {dayjs(blog?.created_at).format('MMM D, YYYY')}
                                </span>
                            </div>
                        </div>
                        <PublicMobileTableOfContents content={blog.content} />
                        {visualContent}
                    </div>

                    {/* Right sidebar */}
                    {!template?.seo?.hide_social_sharing_icons && (
                        <div className="lg:col-span-2 sticky top-0 h-fit px-4 lg:px-0 mt-0 pt-0">
                            <ShareArticle className="pl-0 lg:pl-8" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DASHBOARD / PREVIEW PATH
    // Full Plate editor with TableOfContents — loaded lazily via dynamic().
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <BlogDetailPageWithEditor
            blog={blog}
            template={template}
            handleGetAuthorPath={handleGetAuthorPath}
        />
    );
};

export default BlogDetailPage;
