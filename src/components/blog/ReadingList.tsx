'use client';

import React from 'react';
import Link from 'next/link';

import { BookmarkIcon, TrashIcon } from '@/components/blog/icons';
import { useBookmarks } from '@/hooks/useBookmarks';

/**
 * The reader's saved posts, newest first.
 *
 * Shown on its own page and in the sidebar. Each entry links back to the post
 * and can be removed individually; "Clear all" empties the list in one step.
 */
const ReadingList: React.FC<{ limit?: number }> = ({ limit }) => {
    const { bookmarks, ready, remove, clear } = useBookmarks();

    if (!ready) return null;

    if (bookmarks.length === 0) {
        return (
            <div className='flex flex-col items-center gap-2 py-10 text-center text-gray-500'>
                <BookmarkIcon size={24} />
                <p className='text-sm'>
                    No saved posts yet. Use the bookmark button on any post to add one.
                </p>
            </div>
        );
    }

    const shown = typeof limit === 'number' ? bookmarks.slice(0, limit) : bookmarks;

    return (
        <section aria-label='Reading list'>
            <header className='mb-3 flex items-center justify-between'>
                <h2 className='text-sm font-semibold text-gray-900'>
                    Reading list ({bookmarks.length})
                </h2>
                <button
                    type='button'
                    onClick={clear}
                    className='text-xs text-gray-500 underline-offset-2 hover:text-[#F26522] hover:underline'
                >
                    Clear all
                </button>
            </header>

            <ul className='divide-y divide-gray-100'>
                {shown.map((b) => (
                    <li key={b.slug} className='flex items-center justify-between gap-3 py-2'>
                        <Link
                            href={`/blog/${b.slug}`}
                            className='truncate text-sm text-gray-800 hover:text-[#F26522]'
                        >
                            {b.title}
                        </Link>
                        <button
                            type='button'
                            onClick={() => remove(b.slug)}
                            aria-label={`Remove ${b.title} from reading list`}
                            className='shrink-0 text-gray-400 hover:text-[#F26522]'
                        >
                            <TrashIcon size={14} />
                        </button>
                    </li>
                ))}
            </ul>

            {typeof limit === 'number' && bookmarks.length > limit && (
                <p className='mt-2 text-xs text-gray-500'>
                    and {bookmarks.length - limit} more
                </p>
            )}
        </section>
    );
};

export default ReadingList;
