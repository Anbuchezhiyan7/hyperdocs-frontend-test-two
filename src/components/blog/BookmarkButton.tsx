'use client';

import React from 'react';

import { BookmarkIcon } from '@/components/blog/icons';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkButtonProps {
    slug: string;
    title: string;
    /** Show the word "Save" beside the icon. Off in tight spaces like a post card. */
    withLabel?: boolean;
}

/**
 * Saves the current post to the reader's reading list, or removes it if it is
 * already there. Renders nothing until the stored list has been read, so the
 * button never flashes the wrong state on first paint.
 */
const BookmarkButton: React.FC<BookmarkButtonProps> = ({ slug, title, withLabel = false }) => {
    const { ready, has, toggle } = useBookmarks();

    if (!ready) return null;

    const saved = has(slug);

    return (
        <button
            type='button'
            onClick={() => toggle(slug, title)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from reading list' : 'Save to reading list'}
            title={saved ? 'Remove from reading list' : 'Save to reading list'}
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:ring-offset-1 ${
                saved ? 'text-[#F26522]' : 'text-gray-500 hover:text-[#F26522]'
            }`}
        >
            <BookmarkIcon size={16} className={saved ? 'fill-current' : undefined} />
            {withLabel && <span>{saved ? 'Saved' : 'Save'}</span>}
        </button>
    );
};

export default BookmarkButton;
