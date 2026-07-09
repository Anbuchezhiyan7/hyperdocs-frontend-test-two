'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { getPath } from '@/utils/format/api';
import { isValidUrl } from '@/utils/format/string';
import Shimmer from '../../components/Shimmer';

const PLACEHOLDER = '/images/placeholder/no-image.webp';

const safeImage = (url?: string) => {
    if (!url) return PLACEHOLDER;
    if (isValidUrl(url) || url.startsWith('/')) return url;
    return PLACEHOLDER;
};

interface RelatedPostsProps {
    posts: Blog[];
    isLoading?: boolean;
    hideAuthors?: boolean;
}

const ReadNextCard: React.FC<{ post: Blog; hideAuthors?: boolean }> = ({ post, hideAuthors }) => {
    const path = getPath(post?.blog_info?.slug_url || '');
    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#ECE4D8] bg-white/70 p-3">
            <Link href={path} className="relative mb-4 block overflow-hidden rounded-xl">
                <div className="relative h-48 w-full">
                    <Image
                        src={safeImage(post?.blog_info?.featured_image?.url)}
                        alt={post.blog_title || 'Blog'}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            </Link>
            {post.category?.category_name && (
                <div className="mb-3 px-1">
                    <span className="rounded-md bg-[#EFE8DE] px-2.5 py-1 text-[11px] font-semibold text-[#6B6B6B]">
                        {post.category.category_name}
                    </span>
                </div>
            )}
            <Link href={path}>
                <h3 className="mb-3 line-clamp-2 px-1 text-lg font-bold leading-snug text-[#1A1A1A] transition-colors group-hover:text-[color:var(--accent3)]">
                    {post.blog_title}
                </h3>
            </Link>
            <div className="mt-auto flex items-center justify-between gap-2 px-1">
                {!hideAuthors && post.author_details?.author_name ? (
                    <div className="flex items-center gap-2">
                        <Image
                            src={safeImage(post.author_details?.author_image?.url)}
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

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, isLoading, hideAuthors }) => {
    if (!isLoading && (!posts || posts.length === 0)) return null;

    return (
        <section className="mt-16 border-t border-[#E7DECF] pt-12">
            <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.18em] text-[#9A8F7E]">
                Read Next
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <Shimmer key={i} className="h-[280px] rounded-2xl" />
                    ))
                    : posts.map(post => (
                        <ReadNextCard key={post.blog_id} post={post} hideAuthors={hideAuthors} />
                    ))}
            </div>
        </section>
    );
};

export default RelatedPosts;
