/**
 * Storage for a reader's saved posts.
 *
 * Bookmarks belong to the browser, not to an account — a reader can save posts
 * without signing up, and the list survives a page reload. Everything is kept
 * under one localStorage key so the whole list can be read or cleared at once.
 */

const STORAGE_KEY = 'hyperblog:bookmarks';

export interface Bookmark {
    slug: string;
    title: string;
    savedAt: string;
}

/** Every saved post, newest first. Returns [] when storage is empty or unreadable. */
export function readBookmarks(): Bookmark[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((b) => b && typeof b.slug === 'string');
    } catch {
        // Corrupt or blocked storage should lose the list, not break the page.
        return [];
    }
}

function write(list: Bookmark[]): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        // Quota exceeded or storage disabled — saving silently does nothing.
    }
}

export function isBookmarked(slug: string): boolean {
    return readBookmarks().some((b) => b.slug === slug);
}

/** Save a post. Saving one already in the list refreshes its position, not a duplicate. */
export function addBookmark(slug: string, title: string): Bookmark[] {
    const list = readBookmarks().filter((b) => b.slug !== slug);
    const next = [{ slug, title, savedAt: new Date().toISOString() }, ...list];
    write(next);
    return next;
}

export function removeBookmark(slug: string): Bookmark[] {
    const next = readBookmarks().filter((b) => b.slug !== slug);
    write(next);
    return next;
}

export function clearBookmarks(): Bookmark[] {
    write([]);
    return [];
}
