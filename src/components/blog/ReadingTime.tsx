'use client';

import React from 'react';

interface ReadingTimeProps {
    content: string;
    wordsPerMinute?: number;
}

/**
 * Shows an estimated reading time for a post based on its word count.
 * Readers see e.g. "4 min read" next to the post meta.
 */
const ReadingTime: React.FC<ReadingTimeProps> = ({ content, wordsPerMinute = 220 }) => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / wordsPerMinute));

    return (
        <span className='inline-flex items-center gap-1 text-sm text-[#8F8F8F]'>
            <span aria-hidden>🕐</span>
            {minutes} min read
        </span>
    );
};

export default ReadingTime;
