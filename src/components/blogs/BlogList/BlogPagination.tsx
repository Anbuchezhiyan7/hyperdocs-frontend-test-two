import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BLOG_PAGE_SIZE_OPTIONS } from '@/components/blogs/constants';

interface BlogPaginationProps {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
                <div className="relative">
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e?.target?.value))}
                        className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-[#374151] outline-none cursor-pointer hover:border-gray-300 focus:border-[#FF5200]"
                    >
                        {BLOG_PAGE_SIZE_OPTIONS?.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                    <ChevronRight className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 w-3.5 h-3.5 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[13px] text-[#6B7280]">
                    {start}-{end} of {total}
                </span>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                        className={cn(
                            'w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 transition-all',
                            page <= 1
                                ? 'opacity-40 cursor-not-allowed text-gray-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                        )}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFF1EA] text-[#FF5200] text-[13px] font-bold">
                        {page}
                    </span>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        className={cn(
                            'w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 transition-all',
                            page >= totalPages
                                ? 'opacity-40 cursor-not-allowed text-gray-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                        )}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogPagination;
