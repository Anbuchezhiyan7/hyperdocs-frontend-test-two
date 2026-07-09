'use client';

/**
 * PUBLIC-ONLY blog detail page for Template 2.
 *
 * Renders ONLY the static `visualContent` (server-serialized HTML from
 * RenderServerElements). Contains NO reference to the Plate editor, so the
 * public route never bundles @udecode/plate.
 *
 * The editor-capable component (BlogDetailsPage.tsx) is untouched and used by
 * the dashboard/preview paths via TEMPLATE_CONFIG.
 */

import templatesApi from '@/api/templates.api';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import NotFound from '@/components/common/NotFound';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import ReadingProgress from '../components/template2/ReadingProgress';
import ArticleHeader from './ArticleHeader';
import HeroImage from './HeroImage';
import RelatedPosts from './RelatedPosts';
import SocialShare from './SocialShare';
import PublicTableOfContentsTemplate2 from './PublicTableOfContentsTemplate2';
import PublicMobileTableOfContents from '../components/PublicMobileTableOfContents';

interface BlogDetailsPagePublicProps {
    blog?: Blog;
    visualContent?: React.ReactNode;
}

const BlogDetailsPagePublic: React.FC<BlogDetailsPagePublicProps> = ({
    blog,
    visualContent,
}) => {
    const { setBlog } = useAppStore();
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData(`template`);

    const { data: relatedBlogs, isLoading: isRelatedBlogsLoading } = useQuery<Blog[]>({
        queryKey: ['related-blogs', blog?.category?.category_id],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(blog?.category?.category_id),
        enabled: !!blog && !!blog?.category?.category_id,
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

    if (!blog) {
        return (
            <NotFound
                title="Blog Not Found"
                message="We couldn't find the blog post you're looking for. It might have been removed or the URL might be incorrect."
            />
        );
    }

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
                    const featuredImageUrl: string | null =
                        (typeof fi === 'string' ? fi : fi?.url) || null;
                    return featuredImageUrl ? (
                        <HeroImage src={featuredImageUrl} alt={blog?.blog_title} />
                    ) : null;
                })()}

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
                            <PublicTableOfContentsTemplate2 content={blog.content} />
                        </aside>
                        <div className="flex-1 order-1 lg:order-2 min-w-0">{visualContent}</div>
                    </div>
                    {!template?.seo?.hide_social_sharing_icons && <SocialShare />}
                    <RelatedPosts posts={relatedBlogs || []} isLoading={isRelatedBlogsLoading} />
                </div>
            </div>
        </div>
    );
};

export default BlogDetailsPagePublic;
