'use client';

import { makeQueryClient } from '@/config/query.config';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren, useRef } from 'react';
import Cookies from 'js-cookie';

/**
 * Builds a localStorage persister scoped to the current tenant.
 *
 * Key format:  hyperblog-rq-cache-{userId}
 *   - Each tenant gets an isolated localStorage slot → no cross-tenant data leaks.
 *   - Falls back to a guest key when user_id cookie is absent.
 *   - Returns null when localStorage is unavailable (private browsing etc.)
 *     so the app degrades gracefully to in-memory only.
 */
function makePersister() {
    try {
        const userId = Cookies.get('user_id') ?? 'guest';
        return createSyncStoragePersister({
            storage: window.localStorage,
            // Key version bumped to v2: evicts older blobs that persisted the
            // ['template']/['user_template'] queries, which caused header/footer
            // edits to show stale on reload until the cache aged out.
            key: `hyperblog-rq-cache-v2-${userId}`,
            // Throttle writes to localStorage (ms) — avoids hammering storage on rapid updates
            throttleTime: 1000,
        });
    } catch {
        // localStorage blocked (e.g. Safari private mode) — fall back to memory-only
        return undefined;
    }
}

export const QueryProvider = ({ children }: PropsWithChildren) => {
    // Use a ref so the client + persister are created once and stable across re-renders
    const clientRef = useRef(makeQueryClient());
    const persisterRef = useRef(makePersister());

    return (
        <PersistQueryClientProvider
            client={clientRef.current}
            persistOptions={{
                persister: persisterRef.current as any,
                // Discard persisted cache older than 1 hour (matches server-side revalidate)
                maxAge: 60 * 60 * 1000,
                // Don't block render waiting for hydration from localStorage
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) =>
                        // Only persist successful, non-empty queries that have been explicitly whitelisted for persistence
                        // This prevents admin/admin data from being saved to disk while allowing targeted public cache.
                        query.state.status === 'success' && 
                        (query.meta as any)?.persist === true,
                },
            }}
        >
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
            )}
        </PersistQueryClientProvider>
    );
};
