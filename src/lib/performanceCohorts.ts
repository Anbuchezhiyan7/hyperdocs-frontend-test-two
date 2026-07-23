/**
 * Performance Cohort Intelligence
 *
 * Tags each user in PostHog with their measured LCP cohort so we can:
 *   - Build PostHog dashboards: "Blog publish rate by LCP cohort"
 *   - Correlate page speed with subscription conversion
 *   - Quantify the revenue impact of performance improvements
 *
 * Usage — wire into reportWebVitals:
 *
 *   import { reportWebVitals } from '@/lib/reportWebVitals';
 *   import { tagPerformanceCohort } from '@/lib/performanceCohorts';
 *
 *   export function reportWebVitals(metric: Metric) {
 *     if (metric.name === 'LCP') tagPerformanceCohort(metric.value);
 *     // ... rest of reportWebVitals
 *   }
 */

type LCPCohort = 'fast' | 'moderate' | 'slow';

type PerformancePersonProps = {
    lcp_cohort: LCPCohort;
    lcp_ms: number;
    lcp_rating: string;
    connection_type?: string;
    device_memory_gb?: number;
};

/**
 * Google's Core Web Vitals LCP thresholds (milliseconds):
 *   Good:             < 1200ms
 *   Needs Improvement: 1200–2500ms
 *   Poor:             > 2500ms
 */
const LCP_THRESHOLDS = { good: 1200, needsImprovement: 2500 } as const;

function getLCPCohort(lcpMs: number): LCPCohort {
    if (lcpMs < LCP_THRESHOLDS.good) return 'fast';
    if (lcpMs < LCP_THRESHOLDS.needsImprovement) return 'moderate';
    return 'slow';
}

/**
 * Reads the Network Information API if available (Chrome/Android).
 * Returns undefined on Safari/Firefox where the API is not supported.
 */
function getConnectionType(): string | undefined {
    const nav = navigator as any;
    return nav.connection?.effectiveType ?? nav.mozConnection?.type ?? undefined;
}

/**
 * Tags the current user in PostHog with their LCP performance cohort.
 *
 * Sets `person` properties so the data persists across sessions
 * and is queryable in PostHog cohorts and dashboards.
 *
 * @param lcpMs - Largest Contentful Paint in milliseconds (from web-vitals)
 */
export function tagPerformanceCohort(lcpMs: number): void {
    try {
        const ph = (window as any).posthog;
        if (!ph?.setPersonProperties) return;

        const cohort = getLCPCohort(lcpMs);

        const props: PerformancePersonProps = {
            lcp_cohort: cohort,
            lcp_ms: Math.round(lcpMs),
            lcp_rating: cohort === 'fast'
                ? 'good'
                : cohort === 'moderate'
                    ? 'needs-improvement'
                    : 'poor',
        };

        // Enrich with device context if available
        const connectionType = getConnectionType();
        if (connectionType) props.connection_type = connectionType;

        const deviceMemory = (navigator as any).deviceMemory;
        if (typeof deviceMemory === 'number') props.device_memory_gb = deviceMemory;

        ph.setPersonProperties(props);

        // Also capture a one-time event for funnel analysis
        ph.capture('performance_cohort_assigned', {
            ...props,
            url: window.location.pathname,
        });
    } catch {
        // Never let analytics crash the app
    }
}
