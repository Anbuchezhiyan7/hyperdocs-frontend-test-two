'use client';

import React, { useMemo } from 'react';
import { LayoutGrid } from 'lucide-react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

interface BlogEngagementHeatmapProps {
    leads: {
        blog_title?: string;
        created_date?: string;
        lead_type?: string;
    }[];
}

const MAX_WEEKS = 12;
const MAX_BLOGS = 8;

type HeatCell = {
    blogTitle: string;
    weekLabel: string;
    count: number;
};

function getIntensityClass(count: number, max: number): string {
    if (count === 0 || max === 0) return 'bg-gray-100';
    const ratio = count / max;
    if (ratio >= 0.8) return 'bg-[#FF5200] opacity-90';
    if (ratio >= 0.6) return 'bg-orange-400 opacity-80';
    if (ratio >= 0.4) return 'bg-orange-300 opacity-70';
    if (ratio >= 0.2) return 'bg-orange-200 opacity-70';
    return 'bg-orange-100';
}

const BlogEngagementHeatmap: React.FC<BlogEngagementHeatmapProps> = ({ leads }) => {
    const { blogs, weeks, matrix, maxCount } = useMemo(() => {
        // Build list of last N weeks
        const weekList: string[] = [];
        for (let i = MAX_WEEKS - 1; i >= 0; i--) {
            weekList.push(dayjs().subtract(i, 'week').startOf('isoWeek').format('MMM D'));
        }

        // Count leads per blog per week
        const blogMap: Record<string, Record<string, number>> = {};
        (leads || []).forEach(lead => {
            const title = (lead.blog_title || 'Unknown').slice(0, 30);
            const week = dayjs(lead.created_date || dayjs().toISOString())
                .startOf('isoWeek')
                .format('MMM D');
            if (!blogMap[title]) blogMap[title] = {};
            blogMap[title][week] = (blogMap[title][week] || 0) + 1;
        });

        // Pick top blogs by total leads
        const sorted = Object.entries(blogMap)
            .map(([title, weekCounts]) => ({
                title,
                total: Object.values(weekCounts).reduce((a, b) => a + b, 0),
                weekCounts,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, MAX_BLOGS);

        let max = 0;
        sorted.forEach(b =>
            Object.values(b.weekCounts).forEach(c => { if (c > max) max = c; })
        );

        return {
            blogs: sorted,
            weeks: weekList,
            matrix: sorted.map(b =>
                weekList.map(w => b.weekCounts[w] || 0)
            ),
            maxCount: max,
        };
    }, [leads]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
                    <LayoutGrid size={18} />
                </div>
                <div>
                    <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                        Blog Engagement Heatmap
                    </h3>
                    <p className="text-xs text-gray-400">
                        Leads captured per blog, per week — last {MAX_WEEKS} weeks
                    </p>
                </div>
            </div>

            {blogs.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    No lead data to display yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="text-left text-[11px]" style={{ borderCollapse: 'separate', borderSpacing: '3px' }}>
                        <thead>
                            <tr>
                                {/* Blog title column header */}
                                <th className="pr-3 pb-2 text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                                    Blog
                                </th>
                                {weeks.map(w => (
                                    <th
                                        key={w}
                                        className="pb-2 text-center text-gray-400 font-semibold whitespace-nowrap px-0.5"
                                        style={{ minWidth: 36 }}
                                    >
                                        {w}
                                    </th>
                                ))}
                                <th className="pl-3 pb-2 text-gray-400 font-bold uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, bi) => (
                                <tr key={blog.title}>
                                    <td className="pr-3 py-0.5 font-semibold text-gray-700 truncate max-w-[160px]" title={blog.title}>
                                        {blog.title.length > 22
                                            ? `${blog.title.slice(0, 22)}…`
                                            : blog.title}
                                    </td>
                                    {matrix[bi].map((count, wi) => (
                                        <td key={wi} className="p-0.5 text-center">
                                            <div
                                                className={`w-8 h-8 rounded-md flex items-center justify-center cursor-default transition-transform hover:scale-110 ${getIntensityClass(count, maxCount)}`}
                                                title={count > 0 ? `${count} lead${count > 1 ? 's' : ''} on week of ${weeks[wi]}` : 'No leads'}
                                            >
                                                {count > 0 && (
                                                    <span className={`text-[10px] font-black ${count / maxCount >= 0.5 ? 'text-white' : 'text-orange-700'}`}>
                                                        {count}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                    <td className="pl-3 py-0.5 text-right font-black text-[#FF5200] tabular-nums">
                                        {blog.total}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                        <span className="text-[11px] text-gray-400 mr-1">Fewer</span>
                        {['bg-gray-100', 'bg-orange-100', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-[#FF5200]'].map((cls, i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-sm ${cls}`}
                            />
                        ))}
                        <span className="text-[11px] text-gray-400 ml-1">More</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogEngagementHeatmap;
