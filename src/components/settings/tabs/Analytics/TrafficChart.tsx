'use client';

import React from 'react';

interface TrafficChartProps {
    data: { day: string; visits: number }[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
    const max = Math.max(...data.map(d => d.visits), 1);
    // Show at most ~30 bars so a 90-day range stays readable.
    const step = Math.ceil(data.length / 30);
    const bars = data.filter((_, i) => i % step === 0);

    return (
        <div className='flex flex-col gap-2 rounded-xl border border-[#E0E0E0] bg-white p-4'>
            <span className='text-sm font-semibold text-[#333]'>Visits over time</span>
            <div className='flex items-end gap-1 h-40'>
                {bars.map((d, idx) => (
                    <div
                        key={idx}
                        className='flex-1 rounded-t bg-[#F26522] hover:bg-[#d9551a] transition-colors'
                        style={{ height: `${Math.max(4, (d.visits / max) * 100)}%` }}
                        title={`${d.day}: ${d.visits} visits`}
                    />
                ))}
            </div>
            <div className='flex justify-between text-xs font-medium text-[#8F8F8F]'>
                <span>{bars[0]?.day}</span>
                <span>today</span>
            </div>
        </div>
    );
};

export default TrafficChart;
