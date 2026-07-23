import { useEffect, useState } from 'react';

/**
 * Returns whether a PostHog feature flag is enabled for the current user.
 *
 * Defaults to `defaultValue` until PostHog has loaded and evaluated the flag.
 * This means optimizations gated behind a flag fail safely (to the old behaviour)
 * if PostHog is blocked or slow.
 *
 * @example
 * // Gate lazy Excalidraw behind a flag — roll out to 10% → 50% → 100%
 * const lazyExcalidraw = useFeatureFlag('excalidraw_lazy_load', false);
 *
 * @example
 * // New editor toolbar — default ON (new users get it, flag disables for rollback)
 * const newToolbar = useFeatureFlag('new_editor_toolbar', true);
 */
export function useFeatureFlag(flag: string, defaultValue = false): boolean {
    const [enabled, setEnabled] = useState(defaultValue);

    useEffect(() => {
        const checkFlag = () => {
            const ph = (window as any).posthog;
            if (!ph) return;
            const value = ph.isFeatureEnabled(flag);
            // isFeatureEnabled returns undefined while loading — keep defaultValue in that case
            if (value !== undefined) {
                setEnabled(value ?? defaultValue);
            }
        };

        // Check immediately in case PostHog already loaded
        checkFlag();

        // Also listen for when PostHog becomes ready (first-interaction lazy load)
        window.addEventListener('ph_ready', checkFlag, { once: true });
        return () => window.removeEventListener('ph_ready', checkFlag);
    }, [flag, defaultValue]);

    return enabled;
}
