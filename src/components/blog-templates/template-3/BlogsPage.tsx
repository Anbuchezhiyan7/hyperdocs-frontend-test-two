'use client';

import React, { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import templatesApi from '@/api/templates.api';
import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';
import { isValidUrl } from '@/utils/format/string';
import { optimizeCloudinaryImage, cloudinaryLoader } from '@/utils/cloudinary';
import { getPath } from '@/utils/format/api';
import { Category } from '@/constants/blogs.constants';
import { SearchIcon } from '@/assets/icons';
import Shimmer from '../components/Shimmer';
import { TEMPLATE3_DEFAULT_BG } from './useTemplate3Bg';

const PLACEHOLDER = '/images/placeholder/no-image.webp';

// width caps the delivered Cloudinary width (cards ship 1600px files into ~400–725px
// slots). The <Image> here uses `unoptimized`, so Next's optimizer never resizes them —
// baking f_auto,q_auto,w_ into the URL is what shrinks the bytes. Non-Cloudinary URLs
// and the local placeholder pass through untouched.
const safeImage = (url?: string, width = 800) => {
    if (!url) return PLACEHOLDER;
    if (isValidUrl(url) || url.startsWith('/')) return optimizeCloudinaryImage(url, width);
    return PLACEHOLDER;
};

// Raw (untransformed) src for <Image loader={cloudinaryLoader}> — the loader
// injects f_auto,q_auto,w_<candidate> per srcset entry, so the browser fetches
// only the width it needs instead of one oversized fixed-width file.
const rawImage = (url?: string) => {
    if (!url) return PLACEHOLDER;
    if (isValidUrl(url) || url.startsWith('/')) return url;
    return PLACEHOLDER;
};

/* ------------------------------------------------------------------ */
/* Inline icons                                                        */
/* ------------------------------------------------------------------ */
const Chevron: React.FC<{ dir: 'left' | 'right' }> = ({ dir }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={dir === 'left' ? 'rotate-180' : ''}>
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface BlogsPageComponentProps {
    initialCategoryBlogsMap?: Record<string, Blog[]>;
    initialBlogs?: Blog[];
    initialTemplate?: any;
    initialUserTemplate?: any;
}

/* ------------------------------------------------------------------ */
/* Featured hero card (right side)                                     */
/* ------------------------------------------------------------------ */
export const FeaturedHeroCard: React.FC<{ post: Blog; accent: string; hideAuthors?: boolean }> = ({
    post,
    accent,
    hideAuthors,
}) => {
    const path = getPath(post?.blog_info?.slug_url || '');
    return (
        <Link href={path} className="group relative block h-full w-full overflow-hidden rounded-[28px] shadow-2xl">
            <div className="relative aspect-[16/9] w-full">
                <Image
                    src={rawImage(post?.blog_info?.featured_image?.url)}
                    loader={cloudinaryLoader}
                    alt={post?.blog_title || 'Featured'}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h2 className="mb-4 hidden max-w-md text-2xl font-bold leading-tight text-white md:block md:text-3xl">
                    {post?.blog_title}
                </h2>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    {!hideAuthors && post?.author_details?.author_name && (
                        <div className="flex items-center gap-2.5">
                            <Image
                                src={safeImage(post.author_details?.author_image?.url, 96)}
                                alt={post.author_details?.author_name || 'Author'}
                                width={36}
                                height={36}
                                unoptimized
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/40"
                            />
                            <div className="leading-tight">
                                <p className="text-sm font-semibold text-white">
                                    By {post.author_details.author_name}
                                </p>
                                {post.author_details?.author_designation && (
                                    <p className="text-xs text-white/70">
                                        {post.author_details.author_designation}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    {post?.description && (
                        <p className="line-clamp-2 max-w-xs rounded-2xl bg-white/10 p-3 text-xs leading-relaxed text-white/80 backdrop-blur-sm">
                            {post.description}
                        </p>
                    )}
                </div>
            </div>
            <span
                className="absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: accent }}
            >
                Featured
            </span>
        </Link>
    );
};

/* ------------------------------------------------------------------ */
/* Category pills with scroll arrows                                   */
/* ------------------------------------------------------------------ */
export const CategoryRail: React.FC<{ categories: Category[] }> = ({ categories }) => {
    console.log("🚀 ~ CategoryRail ~ categories:", categories)
    const [active, setActive] = useQueryState('category');
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollBy = (amount: number) =>
        scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

    return (
        <div className="mb-14 flex items-center gap-3">
            <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
                <button
                    type="button"
                    aria-label="Scroll categories left"
                    onClick={() => scrollBy(-240)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1D9CE] text-[#6B6B6B] transition-colors hover:bg-white"
                >
                    <Chevron dir="left" />
                </button>
                <button
                    type="button"
                    aria-label="Scroll categories right"
                    onClick={() => scrollBy(240)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1D9CE] text-[#6B6B6B] transition-colors hover:bg-white"
                >
                    <Chevron dir="right" />
                </button>
            </div>

            <div ref={scrollRef} className="no-scrollbar flex items-center gap-3 overflow-x-auto">
                <button
                    onClick={() => setActive(null)}
                    className={cn(
                        'whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200',
                        !active
                            ? 'border-transparent bg-[#1A1A1A] text-white'
                            : 'border-[#E1D9CE] bg-white/60 text-[#3A3A3A] hover:border-[#1A1A1A]'
                    )}
                >
                    All
                </button>

                {categories.map((cat, i) => {
                    const isActive = active === cat.category_id;
                    return (
                        <button
                            key={cat.category_id || i}
                            onClick={() => setActive(cat.category_id)}
                            className={cn(
                                'whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200',
                                isActive
                                    ? 'border-transparent bg-[#1A1A1A] text-white'
                                    : 'border-[#E1D9CE] bg-white/60 text-[#3A3A3A] hover:border-[#1A1A1A]'
                            )}
                        >
                            {cat.category_name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* Save for later button                                               */
/* ------------------------------------------------------------------ */
const CategoryChip: React.FC<{ label?: string }> = ({ label }) =>
    label ? (
        <span className="rounded-md bg-[#EFE8DE] px-2.5 py-1 text-[11px] font-semibold text-[#6B6B6B]">
            {label}
        </span>
    ) : null;

/* ------------------------------------------------------------------ */
/* Popular article card                                                */
/* ------------------------------------------------------------------ */
export const ArticleCard: React.FC<{ post: Blog; hideAuthors?: boolean }> = ({ post, hideAuthors }) => {
    const path = getPath(post?.blog_info?.slug_url || '');
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#ECE4D8] bg-white/70 p-3">
            <Link href={path} className="relative mb-4 block overflow-hidden rounded-xl">
                <div className="relative aspect-[16/9] w-full">
                    <Image
                        src={rawImage(post?.blog_info?.featured_image?.url)}
                        loader={cloudinaryLoader}
                        alt={post.blog_title || 'Blog'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            </Link>
            <div className="mb-3 px-1">
                <CategoryChip label={post.category?.category_name} />
            </div>
            <Link href={path}>
                <h3 className="mb-3 line-clamp-2 px-1 text-xl font-bold leading-snug text-[#1A1A1A] transition-colors group-hover:text-[color:var(--accent3)]">
                    {post.blog_title}
                </h3>
            </Link>
            <div className="mt-auto flex items-center justify-between gap-2 px-1">
                {!hideAuthors && post.author_details?.author_name ? (
                    <div className="flex items-center gap-2">
                        <Image
                            src={safeImage(post.author_details?.author_image?.url, 96)}
                            alt={post.author_details?.author_name || 'Author'}
                            width={28}
                            height={28}
                            unoptimized
                            className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-[#3A3A3A]">
                            {post.author_details.author_name}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-[#9A9A9A]">
                        {dayjs(post.created_at).format('DD MMM YYYY')}
                    </span>
                )}
            </div>
        </article>
    );
};

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */
const BlogsPage: React.FC<BlogsPageComponentProps> = ({ initialBlogs, initialTemplate, initialUserTemplate }) => {
    const { setTemplateData } = useTemplateStore();
    const user_id = Cookies.get('user_id');
    const storeTemplate = useTemplateStore(state => state.templateData?.['template']);
    // Prefer the server-fetched template on first paint. The persisted store
    // rehydrates differently for returning visitors (synchronous localStorage),
    // so reading it during the now-SSR'd render would cause a hydration mismatch
    // that discards the server-rendered LCP hero. initialTemplate is identical on
    // server + first client render; the store stays as a fallback for later navs.
    const template = initialTemplate ?? storeTemplate;

    const [category] = useQueryState('category');
    const [search, setSearch] = useQueryState('search');

    const {
        0: { data: blogs, isLoading: isBlogsLoading },
    } = useQueries({
        queries: [
            {
                queryKey: ['blogs', user_id],
                staleTime: 0,
                // Seed with the server-fetched list so blogs[0] (the featured hero,
                // the LCP element) ships in the initial server HTML instead of
                // waiting on the client fetch. Still refetches on mount (staleTime 0)
                // so edits surface immediately after hydration.
                initialData: initialBlogs && initialBlogs.length ? initialBlogs : undefined,
                queryFn: () =>
                    templatesApi.handleGetAllBlogs(user_id as string).then(res => {
                        setTemplateData('blogs', res);
                        return res;
                    }),
                meta: { persist: true },
            },
        ],
    });

    const { data: categorizedBlogs, isLoading: isCategorizedLoading } = useQuery({
        queryKey: ['categorzied-blogs', category],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(category as string),
        enabled: !!category,
        meta: { persist: true },
    });

    const { data: categories } = useQuery({
        queryKey: ['all-categories', user_id],
        queryFn: () => templatesApi.handleGetAllCategories(user_id as string),
        enabled: !!user_id,
        meta: { persist: true },
    });

    const accent = template?.general?.accent_color || '#FF5A1F';
    // Mirror useTemplate3Bg's precedence but from server-fresh props, so the
    // outer bg-color style is identical on server + first client render.
    const bgColor =
        initialUserTemplate?.bg_color ||
        initialTemplate?.bg_color ||
        TEMPLATE3_DEFAULT_BG;
    const hideAuthors = template?.seo?.hide_authors;
    const showSearch = template?.seo?.show_searchbar_on_homepage;
    const font = template?.advanced?.blog_ui_font ? `!font-${template.advanced.blog_ui_font}` : '';

    const blogsData: Blog[] = (category ? categorizedBlogs : blogs) || [];

    const searchResults = useMemo(() => {
        if (!search) return [];
        return (blogs || []).filter((b: Blog) =>
            b.blog_title?.toLowerCase().includes(search.toLowerCase())
        );
    }, [blogs, search]);

    const loading = category ? isCategorizedLoading : isBlogsLoading && !blogsData.length;

    const featured = (blogs || initialBlogs || [])[0];
    const popular = blogsData;

    const renderPopularGrid = (list: Blog[]) => {
        if (!list.length) return null;
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map(post => (
                    <ArticleCard key={post.blog_id} post={post} hideAuthors={hideAuthors} />
                ))}
            </div>
        );
    };

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
                            {template?.advanced?.header_title || 'Exploring the Frontiers of Design & Tech.'}
                        </h1>
                        <p className="max-w-md text-lg font-medium text-[#6B6B6B]">
                            {template?.advanced?.short_description ||
                                template?.advanced?.header_caption ||
                                'Insights updated daily for creatives and builders. New ideas, case studies, and trends.'}
                        </p>

                        {showSearch && (
                            <div className="mt-7 max-w-sm">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                                        <SearchIcon />
                                    </span>
                                    <input
                                        type="search"
                                        name="search"
                                        placeholder="Search articles"
                                        value={search || ''}
                                        onChange={e => setSearch(e.target.value || null)}
                                        className="h-12 w-full rounded-full border border-[#E1D9CE] bg-white/70 pl-11 pr-4 text-sm text-[#1A1A1A] outline-none placeholder:text-[#9A9A9A] focus:border-[#1A1A1A]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:-mt-4">
                        {loading && !featured ? (
                            <Shimmer className="h-[440px] rounded-[28px]" />
                        ) : (
                            featured && (
                                <FeaturedHeroCard post={featured} accent={accent} hideAuthors={hideAuthors} />
                            )
                        )}
                    </div>
                </section>

                {search ? (
                    <div>
                        <div className="mb-8 text-sm font-bold uppercase tracking-wide text-[#9A9A9A]">
                            {searchResults.length
                                ? `Search results for “${search}”`
                                : 'No results found'}
                        </div>
                        {renderPopularGrid(searchResults)}
                    </div>
                ) : (
                    <>
                        <CategoryRail categories={categories || []} />

                        {loading ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Shimmer key={i} className="h-[300px] rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            renderPopularGrid(popular)
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;
