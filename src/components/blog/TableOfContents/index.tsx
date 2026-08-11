'use client';

import React, { useMemo } from 'react';

import { cn } from '@/utils/cn';
import { buildOutline, hasUsefulOutline, estimateReadingMinutes } from '@/utils/content-outline';
import { useActiveHeading, scrollToHeading } from '@/hooks/useActiveHeading';

interface TableOfContentsProps {
    /** The post's editor content, from which headings are derived. */
    content: any[] | null | undefined;
    /** Hide the panel below this many headings — short posts don't need one. */
    minimumHeadings?: number;
    /** Pixels of sticky-header offset to allow for when scrolling. */
    scrollOffset?: number;
    className?: string;
}

/**
 * A navigable outline of the current post.
 *
 * Long posts are usually read in parts — a reader arrives from search looking
 * for one section. The outline lets them jump straight to it and shows how much
 * is left below.
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({
    content,
    minimumHeadings = 3,
    scrollOffset = 96,
    className,
}) => {
    const entries = useMemo(() => buildOutline(content), [content]);
    const ids = useMemo(() => entries.map(e => e.id), [entries]);
    const activeId = useActiveHeading(ids, scrollOffset);
    const minutes = useMemo(() => estimateReadingMinutes(content), [content]);

    if (!hasUsefulOutline(entries, minimumHeadings)) return null;

    return (
        <nav aria-label='Table of contents' className={cn('text-sm', className)}>
            <div className='flex items-baseline justify-between gap-3 pb-3'>
                <h2 className='font-semibold tracking-tight'>On this page</h2>
                <span className='text-xs opacity-60 whitespace-nowrap'>{minutes} min read</span>
            </div>

            <ul className='space-y-1 border-l border-black/10 dark:border-white/15'>
                {entries.map(entry => {
                    const isActive = entry.id === activeId;
                    return (
                        <li key={entry.id}>
                            <a
                                href={`#${entry.id}`}
                                aria-current={isActive ? 'location' : undefined}
                                onClick={event => {
                                    // Let modified clicks (new tab, download) behave normally.
                                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                                    event.preventDefault();
                                    scrollToHeading(entry.id, scrollOffset);
                                }}
                                className={cn(
                                    '-ml-px block border-l-2 py-1 pr-2 transition-colors',
                                    entry.level === 1 && 'pl-3',
                                    entry.level === 2 && 'pl-6',
                                    entry.level >= 3 && 'pl-9 text-[0.8125rem]',
                                    isActive
                                        ? 'border-current font-medium opacity-100'
                                        : 'border-transparent opacity-60 hover:opacity-100',
                                )}
                            >
                                {entry.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default TableOfContents;
