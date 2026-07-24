'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    X,
    Tag,
    Link2,
    Lightbulb,
    RefreshCw,
    Copy,
    Check,
    ChevronRight,
    AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import blogApi from '@/api/blog.api';
import { useContentSuggestions } from '@/hooks/useContentSuggestions';
import { useEditorAnalytics } from '@/hooks/useEditorAnalytics';
import { analyseReadability } from '@/utils/readability';
import { Tooltip } from 'antd';

// Extract excerpt from Plate content
function extractExcerpt(content: any[], maxChars = 400): string {
    const text = (content || [])
        .flatMap(n => (n.children || []).map((c: any) => c.text || ''))
        .join(' ')
        .trim();
    return text.slice(0, maxChars);
}

const SuggestionsPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const { blog } = useAppStore();
    const { track } = useEditorAnalytics();

    const { data: allBlogs } = useQuery({
        queryKey: ['blogs', {}],
        queryFn: () => blogApi.handleGetAllBlogs({}),
        staleTime: 5 * 60 * 1000,
    });

    const { suggestions, isLoading, error, fetchSuggestions, reset } =
        useContentSuggestions();

    const handleOpen = useCallback(() => {
        setIsOpen(true);
        if (!suggestions && !isLoading) {
            const excerpt = extractExcerpt(blog?.content || []);
            fetchSuggestions({
                title: blog?.blog_title || '',
                excerpt,
                blogs: (allBlogs || []).filter((b: any) => b.blog_id !== blog?.blog_id),
            });
        }
    }, [suggestions, isLoading, blog, allBlogs, fetchSuggestions]);

    const handleRefresh = () => {
        reset();
        const excerpt = extractExcerpt(blog?.content || []);
        fetchSuggestions({
            title: blog?.blog_title || '',
            excerpt,
            blogs: (allBlogs || []).filter((b: any) => b.blog_id !== blog?.blog_id),
        });
    };

    const copyText = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedKey(key);
            track('editor_ai_triggered', { action: 'copy_keyword', keyword: text });
            setTimeout(() => setCopiedKey(null), 1500);
        });
    };

    // Readability from current blog content
    const readability = analyseReadability(blog?.content || []);

    return (
        <>
            {/* Toggle button — fixed bottom-right of the editor area */}
            <Tooltip title="AI Content Suggestions" placement="left">
                <button
                    id="suggestions-panel-toggle"
                    onClick={handleOpen}
                    className="fixed bottom-24 right-6 z-[100] w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-[#FF5200] shadow-[0_6px_20px_rgba(100,60,255,0.35)] hover:scale-105 active:scale-95 transition-transform text-white"
                    aria-label="Open AI Suggestions"
                >
                    <Sparkles className="w-5 h-5" />
                </button>
            </Tooltip>

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[149] bg-black/10 backdrop-blur-[1px]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                            className="fixed right-0 top-0 h-full w-[360px] z-[150] bg-white shadow-[-12px_0_40px_-8px_rgba(0,0,0,0.15)] border-l border-gray-100 flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-orange-50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-[#FF5200] flex items-center justify-center text-white">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-[13px] font-black text-gray-900">
                                            AI Suggestions
                                        </h3>
                                        <p className="text-[10px] text-gray-400">
                                            Powered by GPT-4o-mini
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Tooltip title="Refresh suggestions">
                                        <button
                                            onClick={handleRefresh}
                                            disabled={isLoading}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/60 text-gray-400 hover:text-violet-600 transition-all disabled:opacity-40"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </Tooltip>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/60 text-gray-400 hover:text-gray-700 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Readability bar */}
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            Readability
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-600">
                                            {readability.gradeLabel}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-[#FF5200] transition-all duration-700"
                                            style={{ width: `${readability.fleschScore}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-[13px] font-black text-gray-900 tabular-nums">
                                        {readability.readingTime} min
                                    </div>
                                    <div className="text-[10px] text-gray-400">read</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

                                {/* Error */}
                                {error && (
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <p className="text-[12px]">{error}</p>
                                    </div>
                                )}

                                {/* Loading skeleton */}
                                {isLoading && !error && (
                                    <div className="space-y-4 animate-pulse">
                                        {[60, 80, 50, 70, 65].map((w, i) => (
                                            <div key={i} className="h-8 rounded-xl bg-gray-100" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                )}

                                {/* Keywords */}
                                {!isLoading && suggestions?.keywords && suggestions.keywords.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Tag className="w-3.5 h-3.5 text-violet-500" />
                                            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                Target Keywords
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.keywords.map((kw, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => copyText(kw, `kw_${i}`)}
                                                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-[12px] font-semibold hover:bg-violet-100 hover:border-violet-200 transition-all"
                                                >
                                                    {copiedKey === `kw_${i}` ? (
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                    {kw}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Internal Links */}
                                {!isLoading && suggestions?.internalLinks && suggestions.internalLinks.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Link2 className="w-3.5 h-3.5 text-[#FF5200]" />
                                            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                Internal Links to Add
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            {suggestions.internalLinks.map((link, i) => {
                                                const matchedBlog = (allBlogs || []).find(
                                                    (b: any) => b.blog_title?.toLowerCase().includes(link.title.toLowerCase().slice(0, 20))
                                                );
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50 border border-orange-100"
                                                    >
                                                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-[#FF5200] shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-[12px] font-bold text-gray-800 truncate">
                                                                {link.title}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                                {link.reason}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}

                                {/* Content Gaps */}
                                {!isLoading && suggestions?.contentGaps && suggestions.contentGaps.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                            <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                                                Content Gaps
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            {suggestions.contentGaps.map((gap, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 rounded-xl bg-amber-50 border border-amber-100"
                                                >
                                                    <p className="text-[11px] font-bold text-amber-700 mb-0.5">
                                                        + {gap.section}
                                                    </p>
                                                    <p className="text-[12px] text-gray-600">
                                                        {gap.prompt}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Empty state when loaded with no results */}
                                {!isLoading && !error && !suggestions && (
                                    <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                                        <Sparkles className="w-8 h-8 text-gray-200" />
                                        <p className="text-sm text-gray-400">
                                            Click refresh to generate suggestions.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 text-center">
                                    Suggestions are generated from your blog title and content.
                                    Always review before using.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SuggestionsPanel;
