import React from 'react';

const Bar: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse rounded-lg bg-[#EDEDED] ${className || ''}`} />
);

const SettingsSkeleton: React.FC = () => (
    <div className='flex flex-col gap-7 pt-1'>
        <div className='flex flex-col gap-2'>
            <Bar className='h-6 w-48' />
            <Bar className='h-4 w-72' />
        </div>

        <div className='flex items-center gap-5'>
            <div className='animate-pulse rounded-full bg-[#EDEDED] w-24 h-24 shrink-0' />
            <div className='flex-1 flex flex-col gap-2'>
                <Bar className='h-4 w-32' />
                <Bar className='h-11 w-full' />
            </div>
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex flex-col gap-2'>
                <Bar className='h-4 w-40' />
                <Bar className='h-11 w-full' />
            </div>
        ))}
    </div>
);

export default SettingsSkeleton;
