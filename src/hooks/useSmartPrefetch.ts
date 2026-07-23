import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Route transition probability map.
 *
 * Generated offline from PostHog path analysis and shipped as a
 * static constant — zero runtime ML inference cost.
 *
 * Keys   = current pathname (Next.js App Router format)
 * Values = ordered list of likely next routes (highest probability first)
 *
 * Update this map periodically by querying:
 *   PostHog → Insights → Paths → "What do users do after visiting X?"
 */
const ROUTE_PREDICTIONS: Record<string, string[]> = {
    '/admin/blogs':            ['/admin/blogs/new', '/admin/leads'],
    '/admin/leads':            ['/admin/blogs'],
    '/admin/settings':         ['/admin/blogs'],
    '/admin/analytics':        ['/admin/blogs', '/admin/leads'],
    '/site-details':           ['/admin/blogs'],
    '/login':                  ['/admin/blogs'],
};

/**
 * Silently prefetches the user's most likely next routes based on
 * historical navigation patterns.
 *
 * - Prefetches are staggered (500ms apart) to avoid competing with
 *   LCP resources on the current page.
 * - Only runs once per `currentPath` change.
 * - No-ops gracefully if the router is not available (SSR / tests).
 *
 * @param currentPath - The current pathname (e.g. '/admin/blogs')
 *
 * @example
 * // In any admin page layout or page component:
 * useSmartPrefetch('/admin/blogs');
 *
 * @example
 * // With dynamic path from next/navigation:
 * const pathname = usePathname();
 * useSmartPrefetch(pathname);
 */
export function useSmartPrefetch(currentPath: string): void {
    const router = useRouter();

    useEffect(() => {
        const predictedRoutes = ROUTE_PREDICTIONS[currentPath];
        if (!predictedRoutes?.length) return;

        const timers: ReturnType<typeof setTimeout>[] = [];

        predictedRoutes.forEach((route, index) => {
            // Stagger: 500ms base + 300ms per subsequent route
            const delay = 500 + index * 300;
            timers.push(
                setTimeout(() => {
                    try {
                        router.prefetch(route);
                    } catch {
                        // Prefetch failure is silent — never block the page
                    }
                }, delay)
            );
        });

        return () => timers.forEach(clearTimeout);
    }, [currentPath, router]);
}
