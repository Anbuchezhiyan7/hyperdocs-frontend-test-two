'use client';
import { cn } from '@/utils/cn';
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LeadMagnetTemplate6Props {
    title: string;
    description: string;
    buttonText: string;
    bgColor?: string;
    buttonColor?: string;
    readOnly?: boolean;
    onClick: () => void;
    leadMagnet?: any;
}

const LeadMagnetTemplate6: React.FC<LeadMagnetTemplate6Props> = ({
    title,
    description,
    buttonText,
    bgColor,
    buttonColor,
    readOnly,
    onClick,
}) => {
    const containerStyle = bgColor
        ? { backgroundColor: bgColor }
        : { background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)' };

    const btnBg = buttonColor || 'linear-gradient(135deg, #FF5200 0%, #FF7E47 100%)';

    return (
        <div
            onClick={readOnly ? onClick : undefined}
            className={cn(
                'flex flex-col md:flex-row w-full mx-auto p-6 md:p-8 gap-6 items-center rounded-2xl shadow-xl relative overflow-hidden transition-all duration-300',
                readOnly ? 'cursor-pointer hover:brightness-110' : 'cursor-pointer'
            )}
            style={containerStyle}
        >
            {/* Decorative circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-0 right-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Left: text */}
            <div className="flex flex-col gap-2 z-10 flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Free Resource</span>
                <h2 className="text-white text-xl md:text-3xl font-extrabold leading-tight my-0">
                    {title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg">
                    {description}
                </p>
            </div>

            {/* Right: CTA */}
            <div className="z-10 flex-shrink-0">
                <button
                    type="button"
                    onClick={e => {
                        e.stopPropagation();
                        if (readOnly) onClick();
                    }}
                    className="flex items-center gap-2 whitespace-nowrap font-bold text-sm md:text-base px-6 py-3 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    style={buttonColor ? { backgroundColor: buttonColor } : { background: 'linear-gradient(135deg, #FF5200 0%, #FF7E47 100%)' }}
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default LeadMagnetTemplate6;
