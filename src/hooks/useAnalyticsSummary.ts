'use client';

import { useMemo, useState } from 'react';

export type AnalyticsRange = '7d' | '30d' | '90d';

export interface AnalyticsMetric {
    id: string;
    label: string;
    value: number;
    previous: number;
    format: 'number' | 'percent' | 'duration';
}

export interface AnalyticsSummary {
    range: AnalyticsRange;
    setRange: (r: AnalyticsRange) => void;
    metrics: AnalyticsMetric[];
    traffic: { day: string; visits: number }[];
    isLoading: boolean;
}

const RANGE_DAYS: Record<AnalyticsRange, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
};

// Deterministic pseudo-data so the dashboard renders without a backend. Values
// scale with the selected range so switching ranges visibly changes the numbers.
function buildTraffic(days: number): { day: string; visits: number }[] {
    const out: { day: string; visits: number }[] = [];
    for (let i = days - 1; i >= 0; i -= 1) {
        const base = 120 + ((i * 37) % 90);
        const weekendDip = i % 7 === 0 || i % 7 === 6 ? 0.7 : 1;
        out.push({ day: `-${i}d`, visits: Math.round(base * weekendDip) });
    }
    return out;
}

function sum(nums: number[]): number {
    return nums.reduce((a, b) => a + b, 0);
}

export function useAnalyticsSummary(): AnalyticsSummary {
    const [range, setRange] = useState<AnalyticsRange>('30d');

    const traffic = useMemo(() => buildTraffic(RANGE_DAYS[range]), [range]);

    const metrics = useMemo<AnalyticsMetric[]>(() => {
        const totalVisits = sum(traffic.map(t => t.visits));
        const days = traffic.length;
        const avgDaily = Math.round(totalVisits / Math.max(days, 1));
        const prevVisits = Math.round(totalVisits * 0.88);
        return [
            { id: 'visits', label: 'Total visits', value: totalVisits, previous: prevVisits, format: 'number' },
            { id: 'avg', label: 'Avg. daily visits', value: avgDaily, previous: Math.round(avgDaily * 0.9), format: 'number' },
            { id: 'bounce', label: 'Bounce rate', value: 42, previous: 47, format: 'percent' },
            { id: 'time', label: 'Avg. time on page', value: 96, previous: 88, format: 'duration' },
        ];
    }, [traffic]);

    return { range, setRange, metrics, traffic, isLoading: false };
}
