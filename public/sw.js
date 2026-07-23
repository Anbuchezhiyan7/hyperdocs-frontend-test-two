/**
 * HyperBlog Service Worker — Phase 8: Smart Caching Architecture
 *
 * Responsibilities:
 *  1. Cache blog draft auto-saves to IndexedDB so they survive network drops
 *  2. Background sync: replay failed draft saves when connectivity resumes
 *  3. Cache static assets (fonts, icons) for instant repeat loads
 *
 * Registration: see src/hooks/useServiceWorker.ts
 * Recovery UI:  see src/hooks/useDraftRecovery.ts
 *
 * Cache versioning: bump CACHE_VERSION whenever the SW logic changes.
 * Old caches are deleted on activate so stale SW never serves outdated assets.
 */

const CACHE_VERSION = 'v1';
const DRAFT_CACHE   = `hyperblog-drafts-${CACHE_VERSION}`;
const STATIC_CACHE  = `hyperblog-static-${CACHE_VERSION}`;
const SYNC_TAG      = 'sync-drafts';

/** Static assets worth caching for offline/fast repeat loads */
const PRECACHE_URLS = [
    '/favicon.ico',
    '/manifest.json',
];

// ── Install: precache known static assets ────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    const allowedCaches = [DRAFT_CACHE, STATIC_CACHE];
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => !allowedCaches.includes(key))
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: intercept draft save requests ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Intercept draft auto-save API calls
    if (
        url.pathname.startsWith('/api/') &&
        url.pathname.includes('draft') &&
        event.request.method === 'POST'
    ) {
        event.respondWith(
            fetch(event.request.clone())
                .then(response => {
                    // Save successful draft to cache for recovery
                    if (response.ok) {
                        saveDraftToCache(event.request.clone(), url.pathname);
                    }
                    return response;
                })
                .catch(async () => {
                    // Network failed — save draft locally and schedule sync
                    await saveDraftToCache(event.request.clone(), url.pathname);
                    await registerBackgroundSync();
                    // Return a synthetic "saved locally" response so the UI doesn't break
                    return new Response(
                        JSON.stringify({ success: true, offline: true, message: 'Draft saved locally' }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                })
        );
        return;
    }

    // Serve static assets from cache-first strategy
    if (PRECACHE_URLS.some(u => url.pathname === u)) {
        event.respondWith(
            caches.match(event.request).then(cached => cached ?? fetch(event.request))
        );
    }
});

// ── Background Sync: replay pending drafts ───────────────────────────────────
self.addEventListener('sync', (event) => {
    if (event.tag === SYNC_TAG) {
        event.waitUntil(syncPendingDrafts());
    }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function saveDraftToCache(request, pathname) {
    try {
        const body = await request.json();
        const blogId = body?.blogId ?? body?.blog_id ?? pathname.split('/').pop();
        const cacheKey = `draft-${blogId}`;

        const cache = await caches.open(DRAFT_CACHE);
        await cache.put(
            cacheKey,
            new Response(
                JSON.stringify({ ...body, savedAt: Date.now(), syncPending: true }),
                { headers: { 'Content-Type': 'application/json' } }
            )
        );
    } catch (err) {
        console.warn('[SW] Failed to cache draft:', err);
    }
}

async function registerBackgroundSync() {
    try {
        const reg = await self.registration;
        if ('sync' in reg) {
            await reg.sync.register(SYNC_TAG);
        }
    } catch {
        // Background Sync not supported (e.g. Safari) — draft is still cached locally
    }
}

async function syncPendingDrafts() {
    const cache = await caches.open(DRAFT_CACHE);
    const keys  = await cache.keys();

    await Promise.allSettled(
        keys.map(async (request) => {
            const response = await cache.match(request);
            if (!response) return;

            const draft = await response.json();
            if (!draft.syncPending) return;

            const apiUrl = draft.blogId
                ? `/api/blogs/${draft.blogId}/draft`
                : '/api/blogs/draft';

            const res = await fetch(apiUrl, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ ...draft, syncPending: undefined }),
            });

            if (res.ok) {
                // Draft synced — update cache entry to mark as clean
                await cache.put(
                    request,
                    new Response(
                        JSON.stringify({ ...draft, syncPending: false, syncedAt: Date.now() }),
                        { headers: { 'Content-Type': 'application/json' } }
                    )
                );
            }
        })
    );
}
