/**
 * Sentry-ready error reporting hook.
 *
 * Currently sends to PostHog. To migrate to Sentry:
 *   1. npm install @sentry/nextjs
 *   2. Uncomment the Sentry line below
 *   3. Remove or keep the PostHog capture for dual-reporting
 *
 * @example
 * const reportError = useErrorReporter();
 *
 * <ErrorBoundary
 *   fallback={<div>Something went wrong</div>}
 *   onError={(err) => reportError(err, { component: 'PlateEditor', blogId })}
 * >
 *   <PlateEditor />
 * </ErrorBoundary>
 */

type ErrorMeta = {
    /** Which component threw (e.g. 'PlateEditor', 'BlogContent') */
    component?: string;
    /** ID of the blog being edited, if relevant */
    blogId?: string;
    /** Authenticated user ID, if available */
    userId?: string;
    /** Any additional key–value context */
    extras?: Record<string, unknown>;
};

export function useErrorReporter() {
    return function reportError(error: Error, meta: ErrorMeta = {}) {
        // Always log to console in all environments for quick debugging
        console.error('[HyperBlog Error]', error.message, meta);

        try {
            const ph = (window as any).posthog;
            ph?.capture('frontend_error', {
                error_message: error.message,
                // Truncate stack to stay within PostHog event size limits
                error_stack: error.stack?.slice(0, 500),
                component: meta.component,
                blog_id: meta.blogId,
                user_id: meta.userId,
                url: typeof window !== 'undefined' ? window.location.pathname : undefined,
                ...meta.extras,
            });
        } catch {
            // Never let the reporter itself throw
        }

        // ── Sentry (uncomment when @sentry/nextjs is installed) ──────────────
        // import * as Sentry from '@sentry/nextjs';
        // Sentry.captureException(error, {
        //   extra: { ...meta, ...meta.extras },
        //   tags: { component: meta.component ?? 'unknown' },
        // });
    };
}
