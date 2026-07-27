'use client';

import React from 'react';

import type { AnalyticsMetric } from '@/hooks/useAnalyticsSummary';

const formatValue = (metric: AnalyticsMetric): string => {
    switch (metric.format) {
        case 'percent':
            return `${metric.value}%`;
        case 'duration':
            return `${Math.floor(metric.value / 60)}m ${metric.value % 60}s`;
        default:
            return metric.value.toLocaleString();
    }
};

const StatCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => {
    const delta =
        metric.previous === 0
            ? 0
            : Math.round(((metric.value - metric.previous) / metric.previous) * 100);
    // For bounce rate, a decrease is good — invert the color meaning.
    const lowerIsBetter = metric.id === 'bounce';
    const isPositive = lowerIsBetter ? delta < 0 : delta > 0;
    const deltaColor = delta === 0 ? '#8F8F8F' : isPositive ? '#16a34a' : '#dc2626';

    return (
        <div className='flex flex-col gap-1 rounded-xl border border-[#E0E0E0] bg-white p-4'>
            <span className='text-xs font-semibold uppercase tracking-wider text-[#8F8F8F]'>
                {metric.label}
            </span>
            <span className='text-2xl font-bold text-[#333]'>{formatValue(metric)}</span>
            <span className='text-xs font-semibold' style={{ color: deltaColor }}>
                {delta > 0 ? '↑' : delta < 0 ? '↓' : '–'} {Math.abs(delta)}% vs. previous
            </span>
        </div>
    );
};

export default StatCard;
