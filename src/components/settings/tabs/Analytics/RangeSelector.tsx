'use client';

import React from 'react';

import type { AnalyticsRange } from '@/hooks/useAnalyticsSummary';

const OPTIONS: { value: AnalyticsRange; label: string }[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
];

interface RangeSelectorProps {
    range: AnalyticsRange;
    onChange: (r: AnalyticsRange) => void;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ range, onChange }) => {
    return (
        <div className='inline-flex rounded-lg border border-[#E0E0E0] bg-white p-1'>
            {OPTIONS.map(opt => (
                <button
                    key={opt.value}
                    type='button'
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        range === opt.value
                            ? 'bg-[#333] text-white'
                            : 'text-[#5D5D5D] hover:bg-gray-50'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default RangeSelector;
