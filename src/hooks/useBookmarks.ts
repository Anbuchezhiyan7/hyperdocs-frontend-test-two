'use client';

import { useCallback, useEffect, useState } from 'react';

import {
    Bookmark,
    addBookmark,
    clearBookmarks,
    readBookmarks,
    removeBookmark,
} from '@/utils/bookmarks';

/**
 * React state over the reader's saved posts.
 *
 * The list is read after mount rather than during render, because localStorage
 * does not exist on the server and reading it during render would make the
 * markup differ between server and client.
 *
 * Also listens for `storage` events so saving a post in one tab updates the
 * list in every other open tab.
 */
export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setBookmarks(readBookmarks());
        setReady(true);

        const sync = () => setBookmarks(readBookmarks());
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const save = useCallback((slug: string, title: string) => {
        setBookmarks(addBookmark(slug, title));
    }, []);

    const remove = useCallback((slug: string) => {
        setBookmarks(removeBookmark(slug));
    }, []);

    const toggle = useCallback((slug: string, title: string) => {
        setBookmarks((current) =>
            current.some((b) => b.slug === slug) ? removeBookmark(slug) : addBookmark(slug, title),
        );
    }, []);

    const clear = useCallback(() => {
        setBookmarks(clearBookmarks());
    }, []);

    const has = useCallback(
        (slug: string) => bookmarks.some((b) => b.slug === slug),
        [bookmarks],
    );

    return { bookmarks, ready, save, remove, toggle, clear, has };
}
