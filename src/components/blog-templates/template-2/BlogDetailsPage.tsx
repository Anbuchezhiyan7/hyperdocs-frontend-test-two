'use client';

/**
 * PUBLIC BLOG PAGE entry point for Template 2.
 *
 * When `visualContent` is provided (public page path), renders a lean layout
 * with NO Plate editor — keeping Plate entirely out of the public JS bundle.
 *
 * When `visualContent` is absent (dashboard/preview), dynamically loads
 * BlogDetailsPageWithEditor which contains useCreateEditor + TableOfContents.
 */

import blogApi from '@/api/blog.api';
import templatesApi from '@/api/templates.api';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import NotFound from '@/components/common/NotFound';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useIsRestoring, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import ReadingProgress from '../components/template2/ReadingProgress';
import ArticleHeader from './ArticleHeader';
import HeroImage from './HeroImage';
import RelatedPosts from './RelatedPosts';
import SocialShare from './SocialShare';
import PublicTableOfContentsTemplate2 from './PublicTableOfContentsTemplate2';
import PublicMobileTableOfContents from '../components/PublicMobileTableOfContents';

// Dynamically imported so Plate + useCreateEditor never enter the public bundle
const BlogDetailsPageWithEditor = dynamic(() => import('./BlogDetailsPageWithEditor'), {
    ssr: false,
    loading: () => null,
});

interface BlogDetailsPageProps {
    blog?: Blog;
    visualContent?: React.ReactNode;
}

const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({ blog: initialBlog, visualContent }) => {
    const { id } = useParams<{ id: string }>();
    const { setBlog } = useAppStore();
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData(`template`);
    const pathname = usePathname();
    const isPreview = pathname.includes('template');

    const handleGetBlogBySlug = async () => {
        const visitorId = Cookies.get('visitor_id');
        const userId = Cookies.get('user_id');
        if (isPreview) {
            const response = await blogApi.handleGetBlog(id as string);
            return response?.data;
        }
        const response = await blogApi.handleGetBlogBySlug(id, visitorId || null, userId || null);
        return response?.blog;
    };

    const blog = initialBlog;
    const isLoading = false;
    const isRestoring = false;

    const { data: relatedBlogs, isLoading: isRelatedBlogsLoading } = useQuery<Blog[]>({
        queryKey: ['related-blogs', blog?.category?.category_id],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(blog?.category?.category_id),
        enabled: blog && !!blog?.category?.category_id,
        meta: { persist: true },
    });

    const updateTheme = () => {
        document.documentElement.style.setProperty('--primary', template?.general?.accent_color);
    };

    useEffect(() => {
        if (blog) setBlog(blog);
    }, [blog, setBlog]);

    useEffect(() => {
        updateTheme();
    }, [template]);

    // isRestoring is true while PersistQueryClientProvider is hydrating cache
    if (isLoading || isRestoring) return <SpinnerLoader />;

    if (!blog) {
        return (
            <NotFound
                title="Blog Not Found"
                message="We couldn't find the blog post you're looking for. It might have been removed or the URL might be incorrect."
            />
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC BLOG PAGE PATH
    // visualContent = server-rendered HTML from RenderServerElements (no Plate).
    // Render minimal layout — Plate is never loaded or executed.
    // ─────────────────────────────────────────────────────────────────────────
    if (visualContent) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto">
                    {template?.seo?.show_post_progress_bar_on_scroll && <ReadingProgress />}
                    <ArticleHeader
                        category={blog.category?.category_name}
                        date={dayjs(blog.created_at).format('DD MMMM YYYY')}
                        title={blog.blog_title}
                        author={blog?.author_details || {}}
                        description={blog.description}
                    />
                    <div className="px-4">
                        <PublicMobileTableOfContents content={blog.content} />
                    </div>
                    {(() => {
                        const fi = blog?.blog_info?.featured_image as any;
                        const featuredImageUrl: string | null = (typeof fi === 'string' ? fi : fi?.url) || null;
                        return featuredImageUrl ? (
                            <HeroImage
                                src={featuredImageUrl}
                                alt={blog?.blog_title}
                            />
                        ) : null;
                    })()}

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
                                <PublicTableOfContentsTemplate2 content={blog.content} />
                            </aside>
                            <div className="flex-1 order-1 lg:order-2 min-w-0">
                                {visualContent}
                            </div>
                        </div>
                        {!template?.seo?.hide_social_sharing_icons && <SocialShare />}
                        <RelatedPosts posts={relatedBlogs || []} isLoading={isRelatedBlogsLoading} />
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DASHBOARD / PREVIEW PATH
    // Full Plate editor with TableOfContents — loaded lazily via dynamic().
    // ─────────────────────────────────────────────────────────────────────────
    return <BlogDetailsPageWithEditor blog={blog} />;
};

export default BlogDetailsPage;
