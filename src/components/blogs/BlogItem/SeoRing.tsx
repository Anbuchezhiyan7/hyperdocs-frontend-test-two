import React from 'react';

interface SeoRingProps {
    score: number;
}

const SeoRing: React.FC<SeoRingProps> = ({ score }) => {
    const pct = Math.min(100, Math.max(0, Math.round(score)));
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const color = pct >= 80 ? '#28A745' : pct >= 50 ? '#FFC107' : '#FF5200';

    return (
        <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r={radius} fill="none" stroke="#EEF0F2" strokeWidth="3.5" />
                <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500"
                />
            </svg>
            <span
                className="absolute inset-0 flex items-center justify-center text-[12px] font-bold"
                style={{ color }}
            >
                {pct}
            </span>
        </div>
    );
};

export default SeoRing;
