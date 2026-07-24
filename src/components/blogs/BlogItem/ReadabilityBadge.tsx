'use client';

import React from 'react';
import { GradeLabel } from '@/utils/readability';
import { Clock } from 'lucide-react';

interface ReadabilityBadgeProps {
    readingTime: number;
    gradeLabel: GradeLabel;
    fleschScore: number;
}

const GRADE_COLORS: Record<GradeLabel, { bg: string; text: string }> = {
    'Very Easy': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    'Easy': { bg: 'bg-green-50', text: 'text-green-600' },
    'Fairly Easy': { bg: 'bg-teal-50', text: 'text-teal-600' },
    'Standard': { bg: 'bg-blue-50', text: 'text-blue-600' },
    'Fairly Difficult': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'Difficult': { bg: 'bg-orange-50', text: 'text-orange-600' },
    'Very Difficult': { bg: 'bg-red-50', text: 'text-red-500' },
};

const ReadabilityBadge: React.FC<ReadabilityBadgeProps> = ({
    readingTime,
    gradeLabel,
    fleschScore,
}) => {
    const colors = GRADE_COLORS[gradeLabel] ?? GRADE_COLORS['Standard'];

    return (
        <div className="flex flex-col gap-1">
            {/* Reading time */}
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="font-medium">{readingTime} min</span>
            </div>
            {/* Grade label */}
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${colors.bg} ${colors.text}`}
                title={`Flesch score: ${fleschScore}/100`}
            >
                {gradeLabel}
            </span>
        </div>
    );
};

export default ReadabilityBadge;
