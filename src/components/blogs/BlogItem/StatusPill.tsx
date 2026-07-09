import React from 'react';
import { cn } from '@/utils/cn';

interface StatusPillProps {
    status?: string;
}

const STATUS_MAP: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    published: { label: 'Published', dot: 'bg-[#28A745]', text: 'text-[#1B873B]', bg: 'bg-[#E9F8EE]' },
    draft: { label: 'Draft', dot: 'bg-[#F5A623]', text: 'text-[#B7791F]', bg: 'bg-[#FEF6E7]' },
    scheduled: { label: 'Scheduled', dot: 'bg-[#3B82F6]', text: 'text-[#2563EB]', bg: 'bg-[#EAF2FE]' },
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
    const s = STATUS_MAP[status || ''] || {
        label: status || 'Unknown',
        dot: 'bg-gray-400',
        text: 'text-gray-500',
        bg: 'bg-gray-100',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize',
                s?.bg,
                s?.text
            )}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full', s?.dot)} />
            {s?.label}
        </span>
    );
};

export default StatusPill;
