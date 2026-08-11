'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Tooltip } from 'antd';

import type { HealthReport } from '@/utils/content-health';
import { healthBand, healthSummary } from '@/utils/content-health';

interface HealthBadgeProps {
    report: HealthReport;
}

const BAND_STYLES = {
    good: { bg: 'bg-emerald-50', text: 'text-emerald-600', Icon: CheckCircle2 },
    fair: { bg: 'bg-amber-50', text: 'text-amber-600', Icon: Info },
    poor: { bg: 'bg-red-50', text: 'text-red-500', Icon: AlertTriangle },
} as const;

/**
 * Pre-publish status for a post, shown beside the readability grade.
 *
 * The badge only reports a count — the tooltip carries the detail, because the
 * list view is scanned rather than read, and an author who wants specifics is
 * about to open the post anyway.
 */
const HealthBadge: React.FC<HealthBadgeProps> = ({ report }) => {
    const band = healthBand(report);
    const { bg, text, Icon } = BAND_STYLES[band];

    const tooltip = report.clean ? (
        'No issues found'
    ) : (
        <div className='flex flex-col gap-1'>
            {report.issues.map(issue => (
                <div key={issue.id} className='text-[11px] leading-snug'>
                    <span className='font-semibold'>
                        {issue.count > 1 ? `${issue.count}x ` : ''}
                        {issue.title}
                    </span>
                    <br />
                    <span className='opacity-80'>{issue.detail}</span>
                </div>
            ))}
        </div>
    );

    return (
        <Tooltip title={tooltip} placement='left'>
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide cursor-help ${bg} ${text}`}
                aria-label={`Content checks: ${healthSummary(report)}`}
            >
                <Icon className='w-3 h-3 shrink-0' />
                {report.clean ? 'Ready' : healthSummary(report)}
            </span>
        </Tooltip>
    );
};

export default HealthBadge;
