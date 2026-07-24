'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { EditIcon, Trash2Icon, EyeIcon, BarChart3 } from 'lucide-react';
import useBlogService from '@/services/blog.service';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/timezone';
import { extractPercentageScore } from '@/utils/seo-score';
import { Tooltip, Modal } from 'antd';
import { BLOG_GRID } from '@/components/blogs/constants';
import SeoRing from './SeoRing';
import StatusPill from './StatusPill';
import ReadabilityBadge from './ReadabilityBadge';
import { analyseReadability } from '@/utils/readability';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface BlogItemProps {
    blog: Blog;
    onMobileClick?: () => void;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog, onMobileClick, isSelected = false, onToggleSelect }) => {
    const { deleteBlog, isDeletingBlog, generatePublishedURL } = useBlogService(blog?.blog_id);
    const router = useRouter();
    const { settings } = useAppStore();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Compute readability from the blog content (memoised so it runs once per render)
    const readability = useMemo(
        () => analyseReadability(Array.isArray(blog?.content) ? blog.content : []),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [blog?.blog_id, blog?.updated_at]
    );

    const handleNavigateToEditBlog = () => {
        if (window?.innerWidth < 768) {
            onMobileClick?.();
        } else {
            router?.push(`/admin/editor/${blog?.blog_id}`);
        }
    };

    const handleNavigateToBlogStat = () => router?.push(`/admin/blogs/${blog?.blog_id}`);

    const showDeleteConfirm = () => setIsDeleteModalOpen(true);

    const handleDeleteOk = async () => {
        try {
            await deleteBlog(undefined as any);
            setIsDeleteModalOpen(false);
        } catch (error) {
            // Error is handled in the service
        }
    };

    const handleDeleteCancel = () => setIsDeleteModalOpen(false);

    const isPublished = blog?.blog_status === 'published';
    const publishedURL = generatePublishedURL(blog?.blog_info?.slug_url || '');

    const seoScore =
        typeof blog?.seo_score === 'number'
            ? blog?.seo_score
            : extractPercentageScore(blog?.seo_score);

    const isDomainConnected =
        settings?.domain?.domain_connected || settings?.domain?.default_connected;
    const canView = isPublished && isDomainConnected;

    const updatedDate = formatDateTime(
        blog?.updated_at || '',
        settings?.general?.time_zone,
        'DD MMM YYYY'
    );

    const openPublishedBlog = () => {
        if (canView && publishedURL) window?.open(`https://${publishedURL}`, '_blank');
    };

    return (
        <div
            className={cn(
                BLOG_GRID,
                'px-5 py-4 border-b border-gray-100 last:border-b-0 transition-colors group',
                isSelected ? 'bg-orange-50/60 hover:bg-orange-50/80' : 'hover:bg-[#FAFAFB]'
            )}
        >
            {/* CHECKBOX */}
            <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => blog?.blog_id && onToggleSelect?.(blog.blog_id)}
                    aria-label={`Select "${blog?.blog_title}"`}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#FF5200]"
                />
            </div>

            {/* TITLE */}
            <div className="min-w-0 pr-4">
                <Link
                    href={`/admin/editor/${blog?.blog_id}`}
                    onClick={(e) => {
                        if (window?.innerWidth < 768) {
                            e?.preventDefault();
                            onMobileClick?.();
                        }
                    }}
                >
                    <h3 className="text-[15px] font-semibold text-[#1F2937] truncate cursor-pointer group-hover:text-[#FF5200] transition-colors">
                        {blog?.blog_title || 'Untitled'}
                    </h3>
                </Link>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5 text-[12px] text-[#9CA3AF]">
                    {blog?.category?.category_name && (
                        <span className="inline-flex items-center rounded-md bg-[#F3F0FF] px-2 py-0.5 text-[11px] font-semibold text-[#7C5CFC]">
                            {blog?.category?.category_name}
                        </span>
                    )}
                    <span className="hidden sm:inline">Updated {updatedDate}</span>
                    {blog?.author_details?.author_name && (
                        <>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="hidden sm:inline-flex items-center gap-1">
                                {blog?.author_details?.author_image?.url && (
                                    <Image
                                        className="rounded-full w-6 h-6 object-cover"
                                        width={48}
                                        height={48}
                                        src={blog?.author_details?.author_image?.url}
                                        alt={blog?.author_details?.author_name}
                                    />
                                )}
                                By {blog?.author_details?.author_name}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* STATUS */}
            <div className="flex justify-start">
                <StatusPill status={blog?.blog_status} />
            </div>

            {/* RESULTS */}
            <div className="flex justify-center">
                <Tooltip title={isPublished ? 'View Responses' : 'Publish the blog to view responses'}>
                    <button
                        onClick={handleNavigateToBlogStat}
                        disabled={!isPublished}
                        className={cn(
                            'w-9 h-9 flex items-center justify-center rounded-lg border transition-all',
                            isPublished
                                ? 'border-gray-200 text-[#FF5200] hover:bg-[#FFF1EA] hover:border-[#FFD3BF] cursor-pointer'
                                : 'border-gray-100 text-gray-300 cursor-not-allowed'
                        )}
                    >
                        <BarChart3 className="w-[18px] h-[18px]" />
                    </button>
                </Tooltip>
            </div>

            {/* SEO SCORE */}
            <div className="flex justify-center">
                <SeoRing score={seoScore} />
            </div>

            {/* READING TIME + READABILITY */}
            <div className="flex justify-start">
                {readability.wordCount > 0 ? (
                    <ReadabilityBadge
                        readingTime={readability.readingTime}
                        gradeLabel={readability.gradeLabel}
                        fleschScore={readability.fleschScore}
                    />
                ) : (
                    <span className="text-[12px] text-gray-300">—</span>
                )}
            </div>

            {/* UPDATED */}
            <div className="text-[13px] font-medium text-[#6B7280]">{updatedDate}</div>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-1.5">
                <Tooltip title={!isPublished ? 'Blog is not published' : 'View Blog'}>
                    <button
                        onClick={openPublishedBlog}
                        className={cn(
                            'w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 transition-all',
                            canView
                                ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-300 text-gray-600'
                                : 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
                        )}
                    >
                        <EyeIcon className="w-[18px] h-[18px]" />
                    </button>
                </Tooltip>

                <Tooltip title="Edit">
                    <button
                        onClick={handleNavigateToEditBlog}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <EditIcon className="w-[18px] h-[18px]" />
                    </button>
                </Tooltip>

                <Tooltip title="Delete">
                    <button
                        onClick={showDeleteConfirm}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                    >
                        <Trash2Icon className="w-[18px] h-[18px]" />
                    </button>
                </Tooltip>
            </div>

            <Modal
                title="Delete Blog"
                open={isDeleteModalOpen}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
                centered
                confirmLoading={isDeletingBlog}
                cancelButtonProps={{ disabled: isDeletingBlog }}
                closable={!isDeletingBlog}
                maskClosable={!isDeletingBlog}
            >
                <p>
                    Are you sure you want to delete "{blog?.blog_title || 'this blog'}"? This action
                    cannot be undone.
                </p>
            </Modal>
        </div>
    );
};

export default BlogItem;
