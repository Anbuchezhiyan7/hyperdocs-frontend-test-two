'use client';

/**
 * PREVIEW (dashboard) blog-post page for Template 3.
 * Mirrors the production Template 3 detail layout but renders the SHARED preview
 * dummy content (same data templates 1 & 2 previews consume) via <BlogContent />
 * instead of the server-rendered visualContent.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { useTemplateStore } from '@/store/useTemplateStore';
import { isValidUrl } from '@/utils/format/string';

import Navbar3 from '../../template-3/components/Navbar';
import Footer3 from '../../template-3/components/Footer';
import TableOfContents from '../../template-3/components/TableOfContents';
import ShareArticle from '../../template-3/components/ShareArticle';
import RelatedPosts from '../../template-3/components/RelatedPosts';
import PublicMobileTableOfContents from '../../components/PublicMobileTableOfContents';
import BlogContent from '../../components/BlogContent';
import { dummyBlogContent } from '../dummyBlogContent';
import { blogData } from '../dummyData';
import { useTemplate3Bg } from '../../template-3/useTemplate3Bg';

const PLACEHOLDER = '/images/placeholder/no-image.webp';
const safeImage = (url?: string) => {
    if (!url) return PLACEHOLDER;
    if (isValidUrl(url) || url.startsWith('/')) return url;
    return PLACEHOLDER;
};

const BlogDetailsPage: React.FC = () => {
    const template = useTemplateStore(state => state.templateData?.['template']);

    const accent = template?.general?.accent_color || '#FF5A1F';
    const bgColor = useTemplate3Bg();
    const hideAuthors = template?.seo?.hide_authors;
    const hidePostDates = template?.seo?.hide_post_dates;
    const font = template?.advanced?.blog_ui_font ? `!font-${template.advanced.blog_ui_font}` : '';

    const blog: any = dummyBlogContent;
    const author = blog?.author_details;
    const content = blog?.content as any[];
    const featuredImageUrl = blog?.blog_info?.featured_image?.url || null;

    // Blog home is the parent of the current post URL (strip the last segment),
    // so it works under any multitenant mount point.
    const pathname = usePathname();
    const blogsHref = (() => {
        const segments = pathname?.split('/')?.filter(Boolean) || [];
        return segments?.length > 1 ? '/' + segments?.slice(0, -1)?.join('/') : '/';
    })();

    useEffect(() => {
        document.documentElement.style.setProperty('--primary', accent);
    }, [accent]);

    return (
        <div className={`min-h-screen ${font}`} style={{ ['--accent3' as string]: accent, backgroundColor: bgColor }}>
            <Navbar3 />
            <div className="mx-auto w-full max-w-[1500px] px-5 pb-20 pt-8 md:px-8 md:pt-12">
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-12 xl:gap-16">
                    {/* TOC — left rail */}
                    <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0 xl:w-60">
                        <div className="sticky top-28">
                            <TableOfContents content={content} />
                        </div>
                    </aside>

                    {/* Main column */}
                    <div className="min-w-0 flex-1">
                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="mb-8">
                            <ol className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-[#9A8F7E]">
                                <li>
                                    <Link href={blogsHref} className="transition-colors hover:text-[#1A1A1A]">
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
                                    {blog?.blog_title}
                                </li>
                            </ol>
                        </nav>

                        {/* Header */}
                        <header className="mb-8">
                            {blog?.category?.category_name && (
                                <span
                                    className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                                    style={{ backgroundColor: accent }}
                                >
                                    {blog.category.category_name}
                                </span>
                            )}
                            <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-[#1A1A1A] md:text-5xl">
                                {blog?.blog_title}
                            </h1>
                            {blog?.blog_description && (
                                <p className="mb-6 text-lg font-medium leading-relaxed text-[#6B6B6B]">
                                    {blog.blog_description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E7DECF] pt-5">
                                {!hideAuthors && author?.author_name && (
                                    <div className="flex items-center gap-3">
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
                                            <p className="text-sm font-semibold text-[#1A1A1A]">
                                                {author.author_name}
                                            </p>
                                            {author.designation && (
                                                <p className="text-xs text-[#9A8F7E]">
                                                    {author.designation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {!hidePostDates && (
                                    <span className="ml-auto text-sm font-medium text-[#9A8F7E]">
                                        {dayjs(blog?.created_at).format('DD MMMM YYYY')}
                                    </span>
                                )}
                            </div>
                        </header>

                        {/* Hero image (preview renders it since there's no server banner) */}
                        {featuredImageUrl && (
                            <div className="relative mb-10 h-[260px] w-full overflow-hidden rounded-[24px] shadow-xl sm:h-[360px] md:h-[460px]">
                                <Image
                                    src={safeImage(featuredImageUrl)}
                                    alt={blog?.blog_title || 'Featured'}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="(max-width: 1120px) 100vw, 1120px"
                                />
                            </div>
                        )}

                        {/* Mobile TOC */}
                        <div className="lg:hidden">
                            <PublicMobileTableOfContents content={content} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0">
                            <BlogContent value={content} />
                        </div>

                        {/* Mobile share */}
                        {!template?.seo?.hide_social_sharing_icons && (
                            <div className="mt-12 border-t border-[#E7DECF] pt-8 lg:hidden">
                                <ShareArticle blog={blog} />
                            </div>
                        )}

                        {/* Read next */}
                        <RelatedPosts posts={blogData as any} hideAuthors={hideAuthors} />
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
            <Footer3 />
        </div>
    );
};

export default BlogDetailsPage;
