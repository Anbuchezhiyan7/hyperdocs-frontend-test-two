'use client';

/**
 * PUBLIC BLOG POST (detail) page entry point for Template 3.
 *
 * When `visualContent` is provided (public page path), renders a lean cream-themed
 * layout with NO Plate editor — keeping Plate entirely out of the public JS bundle.
 *
 * When `visualContent` is absent (dashboard/preview), dynamically loads the
 * Template 2 editor page which contains useCreateEditor + TableOfContents.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import Cookie from 'js-cookie';
import dynamic from 'next/dynamic';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import templatesApi from '@/api/templates.api';
import NotFound from '@/components/common/NotFound';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { isValidUrl } from '@/utils/format/string';

import TableOfContents from './components/TableOfContents';
import ShareArticle from './components/ShareArticle';
import RelatedPosts from './components/RelatedPosts';
import PublicMobileTableOfContents from '../components/PublicMobileTableOfContents';
import { useTemplate3Bg } from './useTemplate3Bg';

const PLACEHOLDER = '/images/placeholder/no-image.webp';

const safeImage = (url?: string) => {
    if (!url) return PLACEHOLDER;
    if (isValidUrl(url) || url.startsWith('/')) return url;
    return PLACEHOLDER;
};

// Dashboard/preview path reuses Template 2's editor page (Plate never enters public bundle)
const BlogDetailsPageWithEditor = dynamic(
    () => import('../template-2/BlogDetailsPageWithEditor'),
    { ssr: false, loading: () => null }
);

interface BlogDetailsPageProps {
    blog?: Blog;
    visualContent?: React.ReactNode;
}

const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({ blog: initialBlog, visualContent }) => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { setBlog } = useAppStore();
    const template = useTemplateStore(state => state.templateData?.['template']);
    const pathname = usePathname();
    const isPreview = pathname?.includes('template');

    const blog = initialBlog;

    const accent = template?.general?.accent_color || '#FF5A1F';
    const bgColor = useTemplate3Bg();
    const hideAuthors = template?.seo?.hide_authors;
    const hidePostDates = template?.seo?.hide_post_dates;
    const font = template?.advanced?.blog_ui_font ? `!font-${template.advanced.blog_ui_font}` : '';

    const { data: relatedBlogs, isLoading: isRelatedBlogsLoading } = useQuery<Blog[]>({
        queryKey: ['related-blogs-t3', blog?.category?.category_id],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(blog?.category?.category_id),
        enabled: !!blog && !!blog?.category?.category_id,
        meta: { persist: true },
    });

    useEffect(() => {
        if (blog) setBlog(blog);
    }, [blog, setBlog]);

    useEffect(() => {
        document.documentElement.style.setProperty('--primary', accent);
    }, [accent]);

    // Blog home path is the parent of the current post URL (strip the last segment),
    // so it works under any multitenant mount point (e.g. example.com/blogs/slug → example.com/blogs).
    const blogsHref = (() => {
        const segments = pathname?.split('/').filter(Boolean) || [];
        return segments.length > 1 ? '/' + segments.slice(0, -1).join('/') : '/';
    })();

    const handleGetAuthorPath = () => {
        const author = blog?.author_details;
        if (!author) return;
        Cookie.set('author_id', author.author_id || '');
        const authorName = (author.author_name || '').toLowerCase().replace(' ', '_');
        const authorDesignation =
            (author.author_designation || '').toLowerCase().replace(' ', '_') || 'no_designation';
        router.push(`/blogs/author/${authorName}/${authorDesignation}`);
    };

    if (!blog) {
        return (
            <NotFound
                title="Blog Not Found"
                message="We couldn't find the blog post you're looking for. It might have been removed or the URL might be incorrect."
            />
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC BLOG PAGE PATH — visualContent = server-rendered HTML (no Plate).
    // ─────────────────────────────────────────────────────────────────────────
    if (visualContent) {
        const author = blog?.author_details;

        return (
            <div
                className={`min-h-screen ${font}`}
                style={{ ['--accent3' as string]: accent, backgroundColor: bgColor }}
            >
                <div className="mx-auto w-full max-w-[1500px] px-5 pb-20 pt-8 md:px-8 md:pt-12">
                    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12 xl:gap-16">
                        {/* TOC — left rail */}
                        <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0 xl:w-60">
                            <div className="sticky top-28">
                                <TableOfContents content={blog.content as any[]} />
                            </div>
                        </aside>

                        {/* Main column — header + content aligned together */}
                        <div className="min-w-0 flex-1">
                            {/* Breadcrumbs */}
                            <nav aria-label="Breadcrumb" className="mb-8">
                                <ol className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-[#9A8F7E]">
                                    <li>
                                        <Link
                                            href={blogsHref}
                                            className="transition-colors hover:text-[#1A1A1A]"
                                        >
                                            Blogs
                                        </Link>
                                    </li>
                                    <li aria-hidden className="text-[#C9BFAE]">
                                        <ChevronRight size={14} />
                                    </li>
                                    <li
                                        aria-current="page"
                                        className="max-w-[240px] truncate font-semibold text-[#1A1A1A]"
                                    >
                                        {blog.blog_title}
                                    </li>
                                </ol>
                            </nav>

                            {/* Header */}
                            <header className="mb-8">
                                {blog.category?.category_name && (
                                    <span
                                        className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                                        style={{ backgroundColor: accent }}
                                    >
                                        {blog.category.category_name}
                                    </span>
                                )}
                                <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-[#1A1A1A] md:text-5xl">
                                    {blog.blog_title}
                                </h1>
                                {blog.description && (
                                    <p className="mb-6 text-lg font-medium leading-relaxed text-[#6B6B6B]">
                                        {blog.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E7DECF] pt-5">
                                    {!hideAuthors && author?.author_name && (
                                        <button
                                            onClick={handleGetAuthorPath}
                                            className="flex items-center gap-3"
                                        >
                                            {author.author_image?.url && (
                                                <Image
                                                    src={safeImage(author.author_image.url)}
                                                    alt={author.author_name || 'Author'}
                                                    width={40}
                                                    height={40}
                                                    unoptimized
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            )}
                                            <div className="text-left leading-tight">
                                                <p className="text-sm font-semibold text-[#1A1A1A] hover:underline">
                                                    {author.author_name}
                                                </p>
                                                {author.author_designation && (
                                                    <p className="text-xs text-[#9A8F7E]">
                                                        {author.author_designation}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    )}
                                    {!hidePostDates && (
                                        <span className="ml-auto text-sm font-medium text-[#9A8F7E]">
                                            {dayjs(blog.created_at).format('DD MMMM YYYY')}
                                        </span>
                                    )}
                                </div>
                            </header>

                            {/* Mobile TOC */}
                            <div className="lg:hidden">
                                <PublicMobileTableOfContents content={blog.content as any[]} />
                            </div>

                            {/* Content */}
                            <div className="min-w-0">{visualContent}</div>

                            {/* Mobile share */}
                            {!template?.seo?.hide_social_sharing_icons && (
                                <div className="mt-12 border-t border-[#E7DECF] pt-8 lg:hidden">
                                    <ShareArticle blog={blog} />
                                </div>
                            )}

                            {/* Read next */}
                            <RelatedPosts
                                posts={relatedBlogs || []}
                                isLoading={isRelatedBlogsLoading}
                                hideAuthors={hideAuthors}
                            />
                        </div>

                        {/* Share — right rail */}
                        {!template?.seo?.hide_social_sharing_icons && (
                            <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0">
                                <div className="sticky top-28">
                                    <ShareArticle blog={blog} />
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DASHBOARD / PREVIEW PATH — full Plate editor, loaded lazily.
    // ─────────────────────────────────────────────────────────────────────────
    return <BlogDetailsPageWithEditor blog={blog} />;
};

export default BlogDetailsPage;
