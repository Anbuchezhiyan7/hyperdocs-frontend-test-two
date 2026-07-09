import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

type SuggestionLoaderProps = {
    label?: string;
    title?: string;
    rootClassName?: string;
    labelClassName?: string;
    subTitle?: string;
    loaderData?: Array<{ label: string; time: string }>;
};

const SuggestionLoader = ({
    label = 'Analyzing your content',
    title = 'Enhancing your post',
    rootClassName = '',
    labelClassName = '',
    subTitle = '',
    loaderData = [],
}: SuggestionLoaderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!loaderData || loaderData.length === 0) return;

        const timeouts: NodeJS.Timeout[] = [];

        const scheduleNext = (index: number) => {
            // Stop at the last step and hold there until the loader unmounts.
            if (index >= loaderData.length - 1) return;
            const timeout = setTimeout(() => {
                const next = index + 1;
                setCurrentIndex(next);
                scheduleNext(next);
            }, parseInt(loaderData[index].time));
            timeouts.push(timeout);
        };

        setCurrentIndex(0);
        scheduleNext(0);

        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    }, [loaderData]);

    const total = loaderData.length || 1;
    const progress = Math.round(((currentIndex + 1) / total) * 100);
    const currentLabel = loaderData[currentIndex]?.label ?? label;

    return (
        <div
            className={cn(
                'fixed inset-0 z-[100] flex items-center justify-center bg-white/20 backdrop-blur-md',
                rootClassName
            )}
        >
            <style>{`
                @keyframes dl-card-in { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: none; } }
                @keyframes dl-label-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
            `}</style>

            <div
                style={{ animation: 'dl-card-in 0.4s ease-out' }}
                className="relative w-[90%] max-w-[420px] overflow-hidden rounded-[24px] border border-[#FFE0CF] bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(255,82,0,0.25)] backdrop-blur-xl"
            >
                {/* Soft brand glows */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#FF5200]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#FF5200]/10 blur-3xl" />

                {/* Animated icon: pulsing halo + fading lucide sparkle */}
                <div className="relative mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#FF5200]/10" />
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EA]">
                        <Sparkles className="h-7 w-7 animate-pulse text-[#FF5200]" strokeWidth={2.2} />
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-center font-plus-jakarta text-lg font-bold text-[#1A1A1A]">
                    {title}
                </h3>

                {/* Rotating current step label (key swap replays the CSS fade-in) */}
                <div className="mt-1 flex h-6 items-center justify-center">
                    <p
                        key={currentLabel}
                        style={{ animation: 'dl-label-in 0.35s ease' }}
                        className={cn(
                            'text-center text-sm font-medium text-[#FF5200]',
                            labelClassName
                        )}
                    >
                        {currentLabel}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#FFE7DA]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF5200] to-[#FF8A4C] transition-[width] duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step checklist */}
                <div className="mt-5 space-y-2.5">
                    {loaderData.map((step, index) => {
                        const done = index < currentIndex;
                        const active = index === currentIndex;
                        return (
                            <div key={step.label} className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                                        done && 'border-[#FF5200] bg-[#FF5200] text-white',
                                        active && 'border-[#FF5200] text-[#FF5200]',
                                        !done && !active && 'border-[#E5E5E5]'
                                    )}
                                >
                                    {done ? (
                                        <Check className="h-3 w-3" strokeWidth={3} />
                                    ) : active ? (
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF5200]" />
                                    ) : null}
                                </span>
                                <span
                                    className={cn(
                                        'text-sm transition-colors duration-300',
                                        done && 'text-[#A3A3A3] line-through',
                                        active && 'font-semibold text-[#1A1A1A]',
                                        !done && !active && 'text-[#C4C4C4]'
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {subTitle && (
                    <p className="mt-4 text-center text-xs text-[#888]">{subTitle}</p>
                )}
            </div>
        </div>
    );
};

export default SuggestionLoader;
