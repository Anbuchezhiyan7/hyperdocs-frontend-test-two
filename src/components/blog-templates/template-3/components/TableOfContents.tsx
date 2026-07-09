'use client';

import React, { useState, useEffect } from 'react';
import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';

interface Heading {
    id: string;
    title: string;
    depth: number;
}

const hexToRgba = (hex: string, alpha: number): string => {
    let h = hex?.replace('#', '');
    if (h?.length === 3) {
        h = h
            ?.split('')
            ?.map(c => c + c)
            ?.join('');
    }
    const r = parseInt(h?.slice(0, 2), 16);
    const g = parseInt(h?.slice(2, 4), 16);
    const b = parseInt(h?.slice(4, 6), 16);
    if ([r, g, b]?.some(Number.isNaN)) return `rgba(0,0,0,${alpha})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const extractHeadings = (content: any[]): Heading[] => {
    if (!content || !Array.isArray(content)) return [];
    const headings: Heading[] = [];
    content?.forEach(block => {
        if (block?.type === 'h1' || block?.type === 'h2' || block?.type === 'h3') {
            const depth = parseInt(block?.type?.replace('h', ''), 10);
            const title = block?.children?.map((c: any) => c?.text || '')?.join('') || '';
            if (title?.trim()) {
                headings.push({ id: block?.id, title, depth });
            }
        }
    });
    return headings;
};

const TableOfContents: React.FC<{ content: any[] }> = ({ content }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const headingList = extractHeadings(content);
    const accent =
        useTemplateStore(state => state.templateData?.['template'])?.general?.accent_color ||
        '#FF5A1F';

    const tocColors = {
        ['--toc-accent' as string]: accent,
        ['--toc-active-bg' as string]: hexToRgba(accent, 0.12),
        ['--toc-hover-bg' as string]: hexToRgba(accent, 0.06),
    } as React.CSSProperties;

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries?.forEach(entry => {
                    if (entry?.isIntersecting) {
                        const id = entry?.target?.getAttribute('data-block-id');
                        if (id) setActiveSection(id);
                    }
                });
            },
            { rootMargin: '-10% 0px -85% 0px', threshold: 0 }
        );

        const observedIds = new Set<string>();
        const attachObservers = () => {
            headingList?.forEach(item => {
                if (!observedIds.has(item.id)) {
                    const element = document.querySelector(`[data-block-id="${item.id}"]`);
                    if (element) {
                        observer.observe(element);
                        observedIds.add(item.id);
                    }
                }
            });
        };

        attachObservers();
        const interval = setInterval(() => {
            attachObservers();
            if (headingList && observedIds.size >= headingList.length) clearInterval(interval);
        }, 500);
        const timeout = setTimeout(() => clearInterval(interval), 5000);

        return () => {
            observer.disconnect();
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [headingList]);

    const handleSectionClick = (item: Heading) => {
        setActiveSection(item?.id);
        const element = document.querySelector(`[data-block-id="${item?.id}"]`);
        if (element) element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (headingList?.length === 0) return null;

    return (
        <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#9A8F7E]">
                Table of Contents
            </h3>
            <nav style={tocColors}>
                <ul className="max-h-[calc(100vh-180px)] space-y-1 overflow-y-auto pr-1">
                    {headingList?.map(item => {
                        const active = activeSection === item?.id;
                        return (
                            <li key={item?.id}>
                                <button
                                    onClick={() => handleSectionClick(item)}
                                    className={cn(
                                        'w-full rounded-lg border-l-2 py-1.5 pr-2 text-left text-sm font-medium leading-snug transition-all',
                                        active
                                            ? 'border-l-[color:var(--toc-accent)] bg-[color:var(--toc-active-bg)] text-[color:var(--toc-accent)]'
                                            : 'border-transparent text-[#6B6B6B] hover:bg-[color:var(--toc-hover-bg)] hover:text-[color:var(--toc-accent)]'
                                    )}
                                    style={{
                                        paddingLeft: `${(item?.depth - 1) * 12 + 12}px`,
                                    }}
                                >
                                    {item?.title}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default TableOfContents;
