'use client';

/**
 * PUBLIC-ONLY blog detail page for Template 3.
 *
 * Renders ONLY the static `visualContent` (server-serialized HTML from
 * RenderServerElements). Contains NO reference to the Plate editor, so the
 * public route never bundles @udecode/plate.
 *
 * The editor-capable component (BlogDetailsPage.tsx) is untouched and used by
 * the dashboard/preview paths via TEMPLATE_CONFIG.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import Cookie from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import templatesApi from '@/api/templates.api';
import NotFound from '@/components/common/NotFound';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { isValidUrl } from '@/utils/format/string';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

import TableOfContents from './components/TableOfContents';
import ShareArticle from './components/ShareArticle';
import RelatedPosts from './components/RelatedPosts';
import PublicMobileTableOfContents from '../components/PublicMobileTableOfContents';
import { useTemplate3Bg } from './useTemplate3Bg';

const PLACEHOLDER = '/images/placeholder/no-image.webp';

// Author avatar renders into a ~40px slot; cap the delivered width to 96px
// (retina headroom) instead of shipping the full-resolution upload.
const safeImage = (url?: string) => {
    if (!url) return PLACEHOLDER;
    if (isValidUrl(url) || url.startsWith('/')) return optimizeCloudinaryImage(url, 96);
    return PLACEHOLDER;
};

interface BlogDetailsPagePublicProps {
    blog?: Blog;
    visualContent?: React.ReactNode;
}

const BlogDetailsPagePublic: React.FC<BlogDetailsPagePublicProps> = ({
    blog,
    visualContent,
}) => {
    const router = useRouter();
    const { setBlog } = useAppStore();
    const template = useTemplateStore(state => state.templateData?.['template']);
    const pathname = usePathname();

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
    // so it works under any multitenant mount point.
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

                        {/* Featured banner image (native — mirrors template 2's HeroImage) */}
                        {(() => {
                            const fi = blog?.blog_info?.featured_image as any;
                            const featuredImageUrl: string | null =
                                (typeof fi === 'string' ? fi : fi?.url) || null;
                            return featuredImageUrl ? (
                                <div className="mb-8 overflow-hidden rounded-2xl border border-[#E7DECF]">
                                    <Image
                                        src={optimizeCloudinaryImage(featuredImageUrl, 1200)}
                                        alt={blog?.blog_title || 'Banner'}
                                        width={1200}
                                        height={630}
                                        priority
                                        fetchPriority="high"
                                        className="h-auto w-full object-cover"
                                        sizes="(max-width: 1024px) 100vw, 1200px"
                                    />
                                </div>
                            ) : null;
                        })()}

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
};

export default BlogDetailsPagePublic;
