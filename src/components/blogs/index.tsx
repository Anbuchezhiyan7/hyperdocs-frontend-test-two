'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import BlogItem from '@/components/blogs/BlogItem';
import { BlogsIcon } from '@/assets/icons';
import BlogSkeleton from '../common/Skeletons/BlogSkeleton';
import BlogTabs from './BlogList/BlogTabs';
import BlogTableHeader from './BlogList/BlogTableHeader';
import BlogPagination from './BlogList/BlogPagination';
import BlogSearchFilter from './BlogList/BlogSearchFilter';
import { BlogTabKey } from './constants';
import { FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useQueryState } from 'nuqs';
import { Button, Modal } from 'antd';
import { useBulkBlogSelection } from '@/hooks/useBulkBlogSelection';
import BulkActionBar from './BulkActionBar';
import blogApi from '@/api/blog.api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface BlogsProps {
    blogs: Blog[];
    isLoading: boolean;
    onMobileClick?: () => void;
}

const matchesTab = (blog: Blog, tab: BlogTabKey) => {
    if (tab === 'all') return true;
    return blog?.blog_status === tab;
};

const Blogs: React.FC<BlogsProps> = ({ blogs, isLoading, onMobileClick }) => {
    const { filters, resetFilters } = useAppStore();
    const [search, setSearch] = useQueryState('search');
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<BlogTabKey>('all');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isBulkLoading, setIsBulkLoading] = useState(false);
    const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

    const isFilterApplied =
        Object.values(filters || {})?.some((filter) => filter !== null) ||
        (search?.length || 0) > 0;

    const counts = useMemo(
        () => ({
            all: blogs?.length || 0,
            published: blogs?.filter((b) => b?.blog_status === 'published')?.length || 0,
            draft: blogs?.filter((b) => b?.blog_status === 'draft')?.length || 0,
            scheduled: blogs?.filter((b) => b?.blog_status === 'scheduled')?.length || 0,
        }),
        [blogs]
    );

    const filteredBlogs = useMemo(
        () => blogs?.filter((blog) => matchesTab(blog, activeTab)) || [],
        [blogs, activeTab]
    );

    const totalPages = Math.max(1, Math.ceil(filteredBlogs?.length / pageSize));

    // Keep the page in range when the filtered set or page size changes.
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [page, totalPages]);

    const paginatedBlogs = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredBlogs?.slice(start, start + pageSize);
    }, [filteredBlogs, page, pageSize]);

    // ── Bulk selection ──────────────────────────────────────────────────────
    const paginatedIds = useMemo(
        () => paginatedBlogs?.map((b: Blog) => b.blog_id).filter((id): id is string => Boolean(id)) || [],
        [paginatedBlogs]
    );

    const {
        selectedIds,
        isSelected,
        toggleOne,
        toggleAll,
        clearAll,
        count: selectedCount,
        isAllSelected,
        isPartiallySelected,
        hasSelection,
    } = useBulkBlogSelection(paginatedIds);

    // Clear selection when tab or page changes
    useEffect(() => { clearAll(); }, [activeTab, page, clearAll]);

    // ── Bulk actions ────────────────────────────────────────────────────────
    const handleBulkAction = useCallback(
        async (action: 'published' | 'draft' | 'delete') => {
            const ids = Array.from(selectedIds);
            if (!ids.length) return;

            setIsBulkLoading(true);
            try {
                if (action === 'delete') {
                    await blogApi.handleBulkDeleteBlogs(ids);
                    toast.success(`${ids.length} blog${ids.length > 1 ? 's' : ''} deleted`);
                } else {
                    await blogApi.handleBulkUpdateBlogs(ids, action);
                    toast.success(`${ids.length} blog${ids.length > 1 ? 's' : ''} moved to ${action}`);
                }
                clearAll();
                queryClient.invalidateQueries({ queryKey: ['blogs'] });
            } catch {
                toast.error('Bulk action failed. Please try again.');
            } finally {
                setIsBulkLoading(false);
                setBulkDeleteConfirmOpen(false);
            }
        },
        [selectedIds, clearAll, queryClient]
    );

    const handleTabChange = (tab: BlogTabKey) => {
        setActiveTab(tab);
        setPage(1);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch(null);
        resetFilters();
    };

    const renderBody = () => {
        if (isLoading) {
            return <BlogSkeleton />;
        }

        if (paginatedBlogs?.length > 0) {
            return paginatedBlogs?.map((blog: Blog) => (
                <BlogItem
                    key={blog?.blog_id}
                    blog={blog}
                    onMobileClick={onMobileClick}
                    isSelected={isSelected(blog?.blog_id)}
                    onToggleSelect={toggleOne}
                />
            ));
        }

        return (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <FileText className="w-6 h-6" />
                </div>
                <p className="text-[15px] font-semibold text-[#374151]">
                    {isFilterApplied ? 'No blogs found with these filters' : 'No posts found'}
                </p>
                <p className="text-[13px] text-[#9CA3AF]">
                    {isFilterApplied
                        ? 'Try different filters or clear them to see all posts.'
                        : 'There are no posts in this category yet.'}
                </p>
                {isFilterApplied && (
                    <Button type="primary" className="mt-2" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 bg-[#F7F8FA] min-h-full">
            <div className="flex items-center gap-2 mb-4">
                <BlogsIcon />
                <h3 className="text-[16px] font-semibold text-[#5D5D5D]">All Articles</h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 border-b border-gray-100">
                    <BlogTabs activeTab={activeTab} onChange={handleTabChange} counts={counts} />
                    <BlogSearchFilter />
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[1020px]">
                        <BlogTableHeader
                            isAllSelected={isAllSelected}
                            isPartiallySelected={isPartiallySelected}
                            onToggleAll={toggleAll}
                        />
                        {renderBody()}
                    </div>
                </div>

                <BlogPagination
                    total={filteredBlogs?.length}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>

            {/* ── Bulk Action Bar (Feature 2) ─────────────────────────────── */}
            <BulkActionBar
                count={selectedCount}
                onPublish={() => handleBulkAction('published')}
                onDraft={() => handleBulkAction('draft')}
                onDelete={() => setBulkDeleteConfirmOpen(true)}
                onClear={clearAll}
                isLoading={isBulkLoading}
            />

            {/* Bulk delete confirmation dialog */}
            <Modal
                title="Delete Selected Blogs"
                open={bulkDeleteConfirmOpen}
                onOk={() => handleBulkAction('delete')}
                onCancel={() => setBulkDeleteConfirmOpen(false)}
                okText={`Delete ${selectedCount} Blog${selectedCount > 1 ? 's' : ''}`}
                okType="danger"
                cancelText="Cancel"
                centered
                confirmLoading={isBulkLoading}
            >
                <p>
                    Are you sure you want to permanently delete <strong>{selectedCount}</strong> blog
                    {selectedCount > 1 ? 's' : ''}? This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
};

export default Blogs;
