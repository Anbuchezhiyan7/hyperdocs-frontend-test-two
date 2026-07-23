import { useEffect, useRef } from 'react';

/**
 * Registers the HyperBlog Service Worker.
 *
 * Should be called once from the root layout or a top-level client component.
 * Handles:
 *  - Registration on first load
 *  - Update detection (shows refresh prompt when a new SW is waiting)
 *  - Graceful no-op on browsers that don't support SW (SSR, Firefox ESR, etc.)
 *
 * @example
 * // src/providers/index.tsx or any root client component:
 * useServiceWorker();
 */
export function useServiceWorker() {
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('serviceWorker' in navigator) ||
            process.env.NODE_ENV === 'development'
        ) {
            return;
        }

        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then(registration => {
                // Check for updates every 30 minutes
                const updateInterval = setInterval(() => {
                    registration.update().catch(() => {});
                }, 30 * 60 * 1000);

                // Notify when a new SW is waiting to take over
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            // Emit a custom event — the app can show a "Refresh to update" toast
                            window.dispatchEvent(new CustomEvent('sw-update-available'));
                        }
                    });
                });

                return () => clearInterval(updateInterval);
            })
            .catch(err => {
                // SW registration failure is non-fatal — app works without it
                console.warn('[SW] Registration failed:', err);
            });
    }, []);
}
