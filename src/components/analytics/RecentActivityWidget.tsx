'use client';

import React from 'react';
import { Activity, ArrowRight, Globe, FileText, PlusCircle, Pencil } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface RecentActivityWidgetProps {
    blogs: any[];
    isLoading: boolean;
}

const STATUS_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    published: {
        icon: <Globe className="w-3.5 h-3.5" />,
        color: 'text-emerald-600 bg-emerald-50',
        label: 'Published',
    },
    draft: {
        icon: <FileText className="w-3.5 h-3.5" />,
        color: 'text-amber-600 bg-amber-50',
        label: 'Draft',
    },
    scheduled: {
        icon: <PlusCircle className="w-3.5 h-3.5" />,
        color: 'text-purple-600 bg-purple-50',
        label: 'Scheduled',
    },
};

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
    blogs,
    isLoading,
}) => {
    // Sort by updated_at desc, take last 5
    const recent = [...(blogs || [])]
        .sort((a, b) => dayjs(b.updated_at).valueOf() - dayjs(a.updated_at).valueOf())
        .slice(0, 5);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
                        <Activity size={18} strokeWidth={2.2} />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-gray-900 leading-tight">
                            Recent Activity
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Your 5 most recently updated blogs
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/blogs"
                    className="text-xs font-bold text-[#FF5200] hover:underline flex items-center gap-1"
                >
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* Body */}
            {isLoading ? (
                <div className="p-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 animate-pulse"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="w-8 h-8 rounded-xl bg-gray-100 shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 w-3/4 bg-gray-100 rounded" />
                                <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-gray-100 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : recent.length === 0 ? (
                <div className="py-14 flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                        <Pencil size={18} />
                    </div>
                    <span className="text-sm text-gray-400">No blogs yet. Create your first one!</span>
                </div>
            ) : (
                <ol className="divide-y divide-gray-50">
                    {recent.map((blog, i) => {
                        const meta = STATUS_META[blog.blog_status] ?? STATUS_META.draft;
                        return (
                            <li key={blog.blog_id || i}>
                                <Link
                                    href={`/admin/editor/${blog.blog_id}`}
                                    className="flex items-center gap-3 px-6 py-4 group hover:bg-orange-50/40 transition-colors"
                                >
                                    {/* Rank */}
                                    <span className="w-6 text-[11px] font-black text-gray-300 tabular-nums shrink-0">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    {/* Title + date */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-gray-800 truncate group-hover:text-[#FF5200] transition-colors">
                                            {blog.blog_title || 'Untitled'}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Updated {dayjs(blog.updated_at).fromNow()}
                                        </p>
                                    </div>

                                    {/* Status pill */}
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${meta.color}`}
                                    >
                                        {meta.icon}
                                        {meta.label}
                                    </span>

                                    {/* Hover arrow */}
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#FF5200] group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
};

export default RecentActivityWidget;
