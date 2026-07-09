'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
import { Button } from 'antd';

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

    const [activeTab, setActiveTab] = useState<BlogTabKey>('all');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
                <BlogItem key={blog?.blog_id} blog={blog} onMobileClick={onMobileClick} />
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
                <h3 className="text-[16px] font-semibold text-[#5D5D5D]">All Blog Posts</h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 border-b border-gray-100">
                    <BlogTabs activeTab={activeTab} onChange={handleTabChange} counts={counts} />
                    <BlogSearchFilter />
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[920px]">
                        <BlogTableHeader />
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
        </div>
    );
};

export default Blogs;
