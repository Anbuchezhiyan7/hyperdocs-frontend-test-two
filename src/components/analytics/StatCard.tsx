import React from 'react';

export type StatTone = 'orange' | 'blue' | 'emerald';

const TONES: Record<StatTone, string> = {
    orange: 'bg-orange-50 text-[#FF5200]',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
};

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    loading: boolean;
    caption: string;
    tone: StatTone;
}

const StatCard = ({ label, value, icon, loading, caption, tone }: StatCardProps) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.08)] hover:border-gray-200 hover:shadow-[0_10px_28px_-14px_rgba(0,0,0,0.18)] transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 pt-1">{label}</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TONES?.[tone]}`}>
                {icon}
            </div>
        </div>

        {loading ? (
            <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse mt-3" />
        ) : (
            <h3 className="text-[2.25rem] leading-none font-black text-gray-900 tracking-tight tabular-nums mt-3">
                {value?.toLocaleString()}
            </h3>
        )}

        <p className="text-xs text-gray-400 mt-2.5">{caption}</p>
    </div>
);

export default StatCard;
