'use client';

import React from 'react';

import { useAnalyticsSummary } from '@/hooks/useAnalyticsSummary';
import SettingsHeader from '../partials/SettingsHeader';
import StatCard from './StatCard';
import TrafficChart from './TrafficChart';
import RangeSelector from './RangeSelector';

const AnalyticsSettings: React.FC = () => {
    const { range, setRange, metrics, traffic, isLoading } = useAnalyticsSummary();

    return (
        <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
            <div className='flex items-start justify-between gap-4'>
                <SettingsHeader
                    title='Analytics'
                    description='See how your blog is performing — visits, engagement, and trends over time.'
                />
                <RangeSelector range={range} onChange={setRange} />
            </div>

            {isLoading ? (
                <p className='text-sm font-medium text-[#8F8F8F]'>Loading analytics…</p>
            ) : (
                <>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                        {metrics.map(metric => (
                            <StatCard key={metric.id} metric={metric} />
                        ))}
                    </div>

                    <TrafficChart data={traffic} />

                    <p className='text-xs font-medium text-[#8F8F8F]'>
                        Figures update daily. Choose a longer range to spot trends, or a shorter one
                        to see recent activity.
                    </p>
                </>
            )}
        </div>
    );
};

export default AnalyticsSettings;
