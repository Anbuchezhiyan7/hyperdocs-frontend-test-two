'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    BarChart3, Eye, CalendarDays, Users, FileText, Search,
    ChevronLeft, ChevronRight, ExternalLink, User, List, Folder, Tag, FileText as FileIcon,
    TrendingUp, Globe,
} from 'lucide-react';
import analyticsApi from '@/api/analytics.api';
import ViewsChart from '@/components/analytics/ViewsChart';
import StatCard from '@/components/analytics/StatCard';
import { apiGetSettings } from '@/api/settings';
import { useAppStore } from '@/store/useAppStore';
import Navbar from '@/components/common/Navbar';
import RecentActivityWidget from '@/components/analytics/RecentActivityWidget';
import blogApi from '@/api/blog.api';

const RANGES: { label: string; value: AnalyticsRange }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 1 Year', value: '1y' },
    { label: 'All Time', value: 'all' },
];

const PAGE_SIZE = 10;

/** Resolve the tenant's public site domain (mirrors the View Blog button logic). */
const resolveSiteDomain = (s?: any): string => {
    const d = s?.domain;
    if (!d) return '';
    if (d?.main_domain) return d.main_domain;
    if (d?.sub_domain) return d.sub_domain;
    if (d?.sub_folder && d?.sub_folder_domain) {
        const path = d.sub_folder.startsWith('/') ? d.sub_folder : `/${d.sub_folder}`;
        const clean = d.sub_folder_domain.endsWith('/') ? d.sub_folder_domain.slice(0, -1) : d.sub_folder_domain;
        return `${clean}${path}`;
    }
    if (d?.default) return d.default;
    return '';
};

/** Prettify a url slug: "no-designation" → "No Designation". */
const prettify = (s: string): string =>
    s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();

/** Drop a trailing " | Brand" suffix from a page title. */
const stripBrand = (t: string): string => {
    const i = t.lastIndexOf('|');
    return (i > 0 ? t.slice(0, i) : t).trim();
};

type PageKind = 'Listing' | 'Author' | 'Category' | 'Tag' | 'Blog';

/** Classify a tracked path into a friendly kind + label. */
const derivePageMeta = (path: string, title: string): { kind: PageKind; label: string } => {
    const segs = path.split('/').filter(Boolean);

    const authorIdx = segs.indexOf('author');
    if (authorIdx !== -1 && segs[authorIdx + 1]) {
        return { kind: 'Author', label: prettify(segs[authorIdx + 1]) };
    }

    const catIdx = segs.indexOf('category');
    if (catIdx !== -1 && segs[catIdx + 1]) {
        return { kind: 'Category', label: prettify(segs[catIdx + 1]) };
    }

    const tagIdx = segs.indexOf('tag');
    if (tagIdx !== -1 && segs[tagIdx + 1]) {
        return { kind: 'Tag', label: prettify(segs[tagIdx + 1]) };
    }

    if (segs.length === 0 || (segs.length === 1 && (segs[0] === 'blogs' || segs[0] === 'blog'))) {
        return { kind: 'Listing', label: 'Blog Listing' };
    }

    const cleanTitle = stripBrand(title || '');
    return { kind: 'Blog', label: cleanTitle || prettify(segs[segs.length - 1]) };
};

const KIND_META: Record<PageKind, { icon: React.ReactNode; cls: string }> = {
    Listing: { icon: <List size={12} />, cls: 'bg-blue-50 text-blue-600' },
    Author: { icon: <User size={12} />, cls: 'bg-purple-50 text-purple-600' },
    Category: { icon: <Folder size={12} />, cls: 'bg-emerald-50 text-emerald-600' },
    Tag: { icon: <Tag size={12} />, cls: 'bg-amber-50 text-amber-600' },
    Blog: { icon: <FileIcon size={12} />, cls: 'bg-orange-50 text-[#FF5200]' },
};

const AnalyticsPage = () => {
    const [range, setRange] = useState<AnalyticsRange>('7d');

    const { data, isLoading } = useQuery({
        queryKey: ['analytics_overview', range],
        queryFn: () => analyticsApi.handleGetOverview(range),
        // Always refetch on visit — overrides the global 5-min staleTime so
        // fresh analytics load every time the page is opened.
        staleTime: 0,
        refetchOnMount: 'always',
    });

    const overview = data as AnalyticsOverview | undefined;
    const series = overview?.series ?? [];

    // ── Pages table: search + pagination (independent of the range filter) ──
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [pageNum, setPageNum] = useState(1);
    // True from the first keystroke until fresh search results arrive — drives
    // the table skeleton while searching (pagination stays smooth instead).
    const [searchLoading, setSearchLoading] = useState(false);

    // Debounce the search box; reset to first page whenever the term changes.
    useEffect(() => {
        const next = searchInput.trim();
        if (next === search) return;
        setSearchLoading(true);
        const t = setTimeout(() => {
            setSearch(next);
            setPageNum(1);
        }, 350);
        return () => clearTimeout(t);
    }, [searchInput, search]);

    const { data: pagesData, isLoading: pagesLoading, isFetching: pagesFetching } = useQuery({
        queryKey: ['analytics_pages', search, pageNum],
        queryFn: () => analyticsApi.handleGetPages({ search, page: pageNum, limit: PAGE_SIZE }),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: 'always',
    });

    // Drop the search skeleton once the term has settled and its fetch is done.
    useEffect(() => {
        if (!pagesFetching && searchInput.trim() === search) {
            setSearchLoading(false);
        }
    }, [pagesFetching, searchInput, search]);

    const pages = pagesData?.pages ?? [];
    const totalPages = pagesData?.total ?? 0;
    const pageCount = Math.max(1, Math.ceil(totalPages / PAGE_SIZE));
    const showTableSkeleton = pagesLoading || searchLoading;

    // ── Resolve the public site origin so page rows can open the live page ──
    const { settings, setSettings } = useAppStore();
    const { data: settingsData } = useQuery({
        queryKey: ['settings'],
        queryFn: () => apiGetSettings().then(res => { setSettings(res); return res; }),
    });
    const siteDomain = resolveSiteDomain(settingsData ?? settings);

    // ── Blogs list for Recent Activity widget (Feature 3) ─────────────────
    const { data: allBlogs, isLoading: blogsLoading } = useQuery({
        queryKey: ['blogs', {}],
        queryFn: () => blogApi.handleGetAllBlogs({}),
        staleTime: 2 * 60 * 1000,
    });

    const buildPageUrl = (path: string): string => {
        if (siteDomain) return `https://${siteDomain}${path}`;
        if (typeof window !== 'undefined') return `${window.location.origin}${path}`;
        return path;
    };

    const openPage = (path: string) => {
        if (typeof window !== 'undefined') {
            window.open(buildPageUrl(path), '_blank', 'noopener,noreferrer');
        }
    };

    const rangeLabel = RANGES.find(r => r.value === range)?.label;

    return (
        <div className="flex flex-col w-full h-full">
            <Navbar
                title="Dashboard"
                titleIcon={<BarChart3 className="w-5 h-5 text-[#5D5D5D]" strokeWidth={2.2} />}
                hideSearch
                hideBtn
            />
            <div className="flex-1 min-h-0 w-full overflow-y-auto bg-gradient-to-b from-[#f6f7f9] to-[#fafafa] px-4 md:px-10 py-6 md:py-8">
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-gray-500 text-sm">
                            Page views across your published blogs.
                        </p>
                    </div>

                    {/* Range filter */}
                    <div className="inline-flex flex-wrap items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm self-start">
                        {RANGES.map(r => (
                            <button
                                key={r.value}
                                onClick={() => setRange(r.value)}
                                className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${range === r.value
                                    ? 'bg-gray-900 text-white shadow'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Stat cards ────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        label="Total Views"
                        value={overview?.total_views ?? 0}
                        icon={<Eye size={20} />}
                        loading={isLoading}
                        tone="orange"
                        caption={`Across ${rangeLabel}`}
                    />
                    <StatCard
                        label="Today's Views"
                        value={overview?.today_views ?? 0}
                        icon={<CalendarDays size={20} />}
                        loading={isLoading}
                        tone="orange"
                        caption=""
                    />
                    <StatCard
                        label="Unique Visitors"
                        value={overview?.unique_views ?? 0}
                        icon={<Users size={20} />}
                        loading={isLoading}
                        tone="orange"
                        caption=""
                    />
                </div>

                {/* ── Recent Activity Widget (Feature 3) ──────────────────── */}
                <RecentActivityWidget blogs={allBlogs || []} isLoading={blogsLoading} />

                {/* ── Chart ─────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.12)]">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
                                <TrendingUp size={18} strokeWidth={2.4} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Views Over Time</h2>
                                <p className="text-[11px] text-gray-400">{range === '1y' || range === 'all' ? 'Monthly breakdown' : 'Daily breakdown'}</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FF5200]" />
                            {rangeLabel}
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-[260px] bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-2xl animate-pulse" />
                    ) : series.length === 0 ? (
                        <div className="h-[260px] flex flex-col items-center justify-center text-gray-300 gap-2">
                            <BarChart3 size={34} strokeWidth={1.5} />
                            <span className="text-sm text-gray-400">No view data yet for this period.</span>
                        </div>
                    ) : (
                        <ViewsChart data={series} range={range} />
                    )}
                </div>

                {/* ── All pages — searchable + paginated ───────────────────── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.12)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
                                <Globe size={18} strokeWidth={2.2} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 leading-tight">
                                    Blog Posts
                                    {totalPages > 0 && (
                                        <span className="text-[11px] font-bold text-[#FF5200] bg-orange-50 rounded-full px-2 py-0.5">
                                            {totalPages.toLocaleString()}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">Search and browse all tracked blogs</p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-80 group">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5200] transition-colors" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search by title or path..."
                                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FF5200] focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {showTableSkeleton ? (
                        <div className="p-4 space-y-2">
                            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 px-2 py-3 animate-pulse"
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    <div className="h-5 w-16 bg-gray-100 rounded-md shrink-0" />
                                    <div className="h-4 flex-1 bg-gray-100 rounded" />
                                    <div className="h-4 w-12 bg-gray-100 rounded" />
                                    <div className="h-4 w-12 bg-gray-100 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                <Search size={22} />
                            </div>
                            <span className="text-sm text-gray-400">
                                {search ? `No blogs match "${search}".` : 'No pages tracked yet.'}
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className={`overflow-x-auto transition-opacity ${pagesFetching ? 'opacity-60' : 'opacity-100'}`}>
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="px-6 py-3 font-bold text-gray-400 text-[11px] uppercase tracking-wider">Page</th>
                                            <th className="px-6 py-3 font-bold text-gray-400 text-[11px] uppercase tracking-wider text-right">Views</th>
                                            <th className="px-6 py-3 font-bold text-gray-400 text-[11px] uppercase tracking-wider text-right">Unique</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pages.map((p, i) => {
                                            const meta = derivePageMeta(p.path, p.title);
                                            const kindMeta = KIND_META[meta.kind];
                                            return (
                                                <tr
                                                    key={i}
                                                    onClick={() => openPage(p.path)}
                                                    className="group relative border-b border-gray-50 last:border-0 hover:bg-orange-50/40 transition-colors cursor-pointer"
                                                    title={`Open ${buildPageUrl(p.path)}`}
                                                >
                                                    <td className="px-6 py-4 relative">
                                                        {/* hover accent bar */}
                                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[3px] bg-[#FF5200] rounded-r group-hover:h-3/5 transition-all duration-200" />
                                                        <div className="flex items-center gap-2.5">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${kindMeta.cls}`}>
                                                                {kindMeta.icon}
                                                                {meta.kind}
                                                            </span>
                                                            <span className="font-semibold text-gray-800 truncate max-w-[300px] group-hover:text-[#FF5200] transition-colors">
                                                                {meta.label}
                                                            </span>
                                                            <ExternalLink
                                                                size={14}
                                                                className="text-[#FF5200] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
                                                            />
                                                        </div>
                                                        <div className="text-xs text-gray-400 truncate max-w-[360px] mt-1">{p.path}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right align-middle">
                                                        <div className="font-black text-gray-900">{p.views.toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="inline-flex items-center gap-1 text-gray-600 font-semibold">
                                                            <Users size={13} className="text-gray-300" />
                                                            {p.unique_views.toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                                <span className="text-xs text-gray-400 font-medium">
                                    Showing <span className="text-gray-700 font-bold">{(pageNum - 1) * PAGE_SIZE + 1}</span>
                                    {'–'}
                                    <span className="text-gray-700 font-bold">{Math.min(pageNum * PAGE_SIZE, totalPages)}</span> of <span className="text-gray-700 font-bold">{totalPages.toLocaleString()}</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setPageNum(p => Math.max(1, p - 1))}
                                        disabled={pageNum <= 1}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:border-[#FF5200] hover:text-[#FF5200] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-sm font-bold text-gray-700 px-3 tabular-nums">
                                        {pageNum} <span className="text-gray-300">/</span> {pageCount}
                                    </span>
                                    <button
                                        onClick={() => setPageNum(p => Math.min(pageCount, p + 1))}
                                        disabled={pageNum >= pageCount}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:border-[#FF5200] hover:text-[#FF5200] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
