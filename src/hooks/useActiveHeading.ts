'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which heading the reader is currently under, so the contents panel can
 * highlight their position in a long post.
 *
 * Uses IntersectionObserver rather than a scroll handler: scroll fires on every
 * frame and forces a layout read each time, which is the usual cause of janky
 * scrolling on article pages.
 *
 * @param ids   Anchor ids to watch, in document order.
 * @param offset Pixels from the top of the viewport treated as "current". Should
 *               roughly match the height of any sticky header, or the heading
 *               under it never registers as active.
 */
export function useActiveHeading(ids: string[], offset = 96): string | null {
    const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

    useEffect(() => {
        if (typeof window === 'undefined' || !ids.length) return;
        if (typeof IntersectionObserver === 'undefined') return;

        const elements = ids
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (!elements.length) return;

        // Track visibility separately from the callback: the observer only
        // reports what changed, but we need the topmost of everything currently
        // on screen, which requires remembering the others.
        const visible = new Set<string>();

        const observer = new IntersectionObserver(
            entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visible.add(entry.target.id);
                    else visible.delete(entry.target.id);
                }

                const topmost = ids.find(id => visible.has(id));
                if (topmost) {
                    setActiveId(topmost);
                    return;
                }

                // Nothing on screen — this happens mid-section when a heading has
                // scrolled past the top and the next is still below the fold. The
                // last heading above the viewport is the one we are reading under.
                let candidate: string | null = null;
                for (const el of elements) {
                    if (el.getBoundingClientRect().top <= offset) candidate = el.id;
                }
                if (candidate) setActiveId(candidate);
            },
            {
                // Shrink the top of the viewport by the sticky-header height and
                // the bottom heavily, so "active" means near the top of the screen
                // rather than anywhere in view.
                rootMargin: `-${offset}px 0px -70% 0px`,
                threshold: 0,
            },
        );

        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [ids.join('|'), offset]);

    return activeId;
}

/**
 * Smoothly scroll to a heading and put its anchor in the address bar without
 * adding a history entry — otherwise the browser Back button walks the reader
 * back through every heading they clicked instead of leaving the post.
 */
export function scrollToHeading(id: string, offset = 96): void {
    if (typeof window === 'undefined') return;

    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
}
