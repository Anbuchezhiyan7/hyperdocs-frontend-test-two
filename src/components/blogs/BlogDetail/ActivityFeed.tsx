'use client';

import React from 'react';
import { ActivityEvent, ActivityEventType } from '@/utils/activity';
import {
    PlusCircle,
    Globe,
    FileText,
    CalendarClock,
    User,
    BarChart2,
    Pencil,
} from 'lucide-react';

const EVENT_META: Record<ActivityEventType, { icon: React.ReactNode; color: string; dot: string }> = {
    created: {
        icon: <PlusCircle className="w-4 h-4" />,
        color: 'text-blue-600',
        dot: 'bg-blue-500',
    },
    published: {
        icon: <Globe className="w-4 h-4" />,
        color: 'text-emerald-600',
        dot: 'bg-emerald-500',
    },
    unpublished: {
        icon: <FileText className="w-4 h-4" />,
        color: 'text-amber-600',
        dot: 'bg-amber-500',
    },
    scheduled: {
        icon: <CalendarClock className="w-4 h-4" />,
        color: 'text-purple-600',
        dot: 'bg-purple-500',
    },
    lead_captured: {
        icon: <User className="w-4 h-4" />,
        color: 'text-[#FF5200]',
        dot: 'bg-[#FF5200]',
    },
    seo_scored: {
        icon: <BarChart2 className="w-4 h-4" />,
        color: 'text-indigo-600',
        dot: 'bg-indigo-500',
    },
    updated: {
        icon: <Pencil className="w-4 h-4" />,
        color: 'text-gray-600',
        dot: 'bg-gray-400',
    },
};

interface ActivityFeedProps {
    events: ActivityEvent[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
    if (!events || events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-400">No activity recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="relative py-6 px-6 max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[2.85rem] top-0 bottom-0 w-px bg-gray-100" />

            <ol className="space-y-6">
                {events.map((event, idx) => {
                    const meta = EVENT_META[event.type] ?? EVENT_META.updated;
                    return (
                        <li key={event.id || idx} className="relative flex gap-4">
                            {/* Icon bubble */}
                            <div
                                className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border-2 border-gray-100 shrink-0 ${meta.color}`}
                            >
                                {meta.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[13px] font-bold text-gray-900">
                                        {event.label}
                                    </span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                    <span className="text-[11px] text-gray-400 font-medium">
                                        {event.relativeTime}
                                    </span>
                                </div>
                                <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default ActivityFeed;
