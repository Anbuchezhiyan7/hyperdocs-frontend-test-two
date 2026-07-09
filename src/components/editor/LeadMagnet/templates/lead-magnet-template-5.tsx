'use client';
import { cn } from '@/utils/cn';
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LeadMagnetTemplate5Props {
    title: string;
    description: string;
    buttonText: string;
    bgColor?: string;
    buttonColor?: string;
    readOnly?: boolean;
    onClick: () => void;
    leadMagnet?: any;
}

const LeadMagnetTemplate5: React.FC<LeadMagnetTemplate5Props> = ({
    title,
    description,
    buttonText,
    bgColor,
    buttonColor,
    readOnly,
    onClick,
}) => {
    const brandColor = '#FF5200';

    const containerStyle = bgColor
        ? { backgroundColor: bgColor }
        : { backgroundImage: `linear-gradient(135deg, ${brandColor} 0%, #FF7E47 100%)` };

    const btnBg = buttonColor || '#fff';
    const btnText = buttonColor ? '#fff' : brandColor;

    return (
        <div
            onClick={readOnly ? onClick : undefined}
            className={cn(
                'flex flex-col md:flex-row w-full mx-auto p-6 md:p-8 gap-6 items-center justify-between rounded-2xl shadow-xl relative overflow-hidden transition-all duration-300',
                readOnly ? 'cursor-pointer hover:brightness-105' : 'cursor-pointer hover:shadow-orange-500/20'
            )}
            style={containerStyle}
        >
            {/* Background glow */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left: text content */}
            <div className="flex flex-col gap-2 z-10 flex-1">
                <h2 className="text-white text-xl md:text-3xl font-extrabold leading-tight my-0 drop-shadow-sm">
                    {title}
                </h2>
                <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed max-w-lg">
                    {description}
                </p>
            </div>

            {/* Right: CTA button */}
            <div className="z-10 flex-shrink-0">
                <button
                    type="button"
                    onClick={e => {
                        e.stopPropagation();
                        if (readOnly) onClick();
                    }}
                    style={{ backgroundColor: btnBg, color: btnText }}
                    className="flex items-center gap-2 whitespace-nowrap font-bold text-sm md:text-base px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/30"
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default LeadMagnetTemplate5;
