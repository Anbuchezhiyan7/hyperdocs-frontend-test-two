'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true once the reader has scrolled past `threshold` pixels.
 * Used to reveal controls that only make sense part-way down a post.
 */
export function useScrollThreshold(threshold = 400): boolean {
    const [passed, setPassed] = useState(false);

    useEffect(() => {
        const onScroll = () => setPassed(window.scrollY > threshold);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return passed;
}
