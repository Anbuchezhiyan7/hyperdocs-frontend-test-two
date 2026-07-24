'use client';

import React from 'react';
import { computeLeadScore } from '@/utils/lead-scoring';
import { Flame, Thermometer, Snowflake } from 'lucide-react';
import { Tooltip } from 'antd';

interface LeadScoreBadgeProps {
    lead: {
        user_name?: string;
        user_email?: string;
        phone?: string;
        lead_type?: string;
        created_date?: string;
    };
}

const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ lead }) => {
    const { score, temperature, label } = computeLeadScore(lead);

    const styles = {
        hot: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100',
            icon: <Flame className="w-3 h-3" />,
        },
        warm: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-100',
            icon: <Thermometer className="w-3 h-3" />,
        },
        cold: {
            bg: 'bg-blue-50',
            text: 'text-blue-500',
            border: 'border-blue-100',
            icon: <Snowflake className="w-3 h-3" />,
        },
    };

    const s = styles[temperature];

    return (
        <Tooltip
            title={`Lead Score: ${score}/100 — ${label}`}
            placement="top"
        >
            <div className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${s.bg} ${s.text} ${s.border}`}>
                    {s.icon}
                    {label}
                </div>
                <span className="text-[12px] font-black text-gray-700 tabular-nums">
                    {score}
                </span>
            </div>
        </Tooltip>
    );
};

export default LeadScoreBadge;
