import type { Metric } from 'web-vitals';
import { tagPerformanceCohort } from '@/lib/performanceCohorts';

/**
 * Reports Core Web Vitals metrics to PostHog as 'web_vital' events.
 *
 * PostHog is lazy-loaded on first user interaction (see instrumentation-client.ts),
 * so metrics that fire before init (e.g. FCP, LCP) are queued on the 'ph_ready'
 * event to ensure they are never silently dropped.
 *
 * Also tags each user with their LCP performance cohort (Phase 7) so PostHog
 * dashboards can correlate page speed with publish rate and conversion.
 *
 * Usage in Next.js App Router:
 *   export { reportWebVitals } from '@/lib/reportWebVitals';
 *   (place this in src/app/layout.tsx or any route segment)
 */
export function reportWebVitals(metric: Metric) {
    if (typeof window === 'undefined') return;

    // Phase 7: Tag the user's LCP cohort for PostHog cohort analysis
    if (metric.name === 'LCP') {
        tagPerformanceCohort(metric.value);
    }

    const send = () => {
        const ph = (window as any).posthog;
        if (!ph?.capture) return;

        ph.capture('web_vital', {
            metric_name: metric.name,       // CLS | FCP | FID | INP | LCP | TTFB
            // Normalise CLS to milliseconds so all values share the same unit in PostHog
            metric_value: Math.round(
                metric.name === 'CLS' ? metric.value * 1000 : metric.value
            ),
            metric_rating: metric.rating,   // 'good' | 'needs-improvement' | 'poor'
            metric_id: metric.id,
            navigation_type: metric.navigationType,
        });
    };

    if ((window as any).posthog?.capture) {
        send();
    } else {
        // PostHog fires 'ph_ready' once init completes — capture the metric then
        window.addEventListener('ph_ready', send, { once: true });
    }
}

