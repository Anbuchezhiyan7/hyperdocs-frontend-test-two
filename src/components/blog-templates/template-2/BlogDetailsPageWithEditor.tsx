'use client';

/**
 * DASHBOARD/PREVIEW ONLY — Full Plate editor with TableOfContents.
 * Dynamically imported from BlogDetailsPage.tsx so Plate never lands in the public bundle.
 */

import blogApi from '@/api/blog.api';
import templatesApi from '@/api/templates.api';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import NotFound from '@/components/common/NotFound';
import { useCreateEditor } from '@/hooks/use-create-editor';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { transformBlogContent } from '@/utils/editor';
import { useIsRestoring, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import ReadingProgress from '../components/template2/ReadingProgress';
import ArticleHeader from './ArticleHeader';
import HeroImage from './HeroImage';
import RelatedPosts from './RelatedPosts';
import SocialShare from './SocialShare';
import TableOfContents from './TableOfContent';

const BlogContent = dynamic(() => import('../components/BlogContent'), {
    ssr: false,
    loading: () => null,
});

const MobileTableOfContents = dynamic(() => import('../components/MobileTableOfContents'), {
    ssr: false,
    loading: () => null,
});

interface Props {
    blog?: Blog;
}

const BlogDetailsPageWithEditor: React.FC<Props> = ({ blog: initialBlog }) => {
    const { id } = useParams<{ id: string }>();
    const contentContainerRef = useRef<HTMLDivElement>(null);
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

    const isRestoring = useIsRestoring();
    const { data: blog, isLoading } = useQuery<Blog>({
        queryKey: ['blog', id],
        queryFn: () =>
            handleGetBlogBySlug()?.then(res => {
                setBlog(res);
                return res;
            }),
        initialData: initialBlog,
        enabled: !!id,
        meta: { persist: true },
    });

    const { data: relatedBlogs, isLoading: isRelatedBlogsLoading } = useQuery<Blog[]>({
        queryKey: ['related-blogs', blog?.category?.category_id],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(blog?.category?.category_id),
        enabled: blog && !!blog?.category?.category_id,
        meta: { persist: true },
    });

    const content =
        transformBlogContent(blog)
            ?.slice(1)
            ?.filter((item: any) => !item?.is_ai_suggested || !item?.plugin_data_id)
            ?.map((item: any) => ({ ...item, isEditing: false })) || [];

    const editor = useCreateEditor({
        readOnly: true,
        value: content,
    });

    useEffect(() => {
        if (!isLoading && blog?.content) {
            editor.tf.setValue(content);
        }
    }, [isLoading, blog?.content]);

    const updateTheme = () => {
        document.documentElement.style.setProperty('--primary', template?.general?.accent_color);
    };

    useEffect(() => {
        updateTheme();
    }, [template]);

    if (isLoading || isRestoring) return <SpinnerLoader />;
    if (!blog) {
        return (
            <NotFound
                title="Blog Not Found"
                message="We couldn't find the blog post you're looking for. It might have been removed or the URL might be incorrect."
            />
        );
    }

    return (
        <div ref={contentContainerRef} className="min-h-screen bg-white">
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
                    <MobileTableOfContents editor={editor} />
                </div>
                {blog?.blog_info?.featured_image?.url && (
                    <HeroImage
                        src={blog?.blog_info?.featured_image?.url || undefined}
                        alt={blog?.blog_title}
                    />
                )}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
                            <TableOfContents editor={editor} />
                        </aside>
                        <div className="flex-1 order-1 lg:order-2 min-w-0">
                            {blog?.content ? (
                                <BlogContent value={blog?.content?.slice(1)} />
                            ) : (
                                <div className="min-h-[2000px] w-full bg-gray-100 animate-pulse rounded-xl" />
                            )}
                        </div>
                    </div>
                    {!template?.seo?.hide_social_sharing_icons && <SocialShare />}
                    <RelatedPosts posts={relatedBlogs || []} isLoading={isRelatedBlogsLoading} />
                </div>
            </div>
        </div>
    );
};

export default BlogDetailsPageWithEditor;
