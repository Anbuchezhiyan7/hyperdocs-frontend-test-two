import React from 'react';

const Bar: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse rounded-lg bg-[#EDEDED] ${className || ''}`} />
);

interface InviteSkeletonProps {
    count?: number;
}

const InviteSkeleton: React.FC<InviteSkeletonProps> = ({ count = 3 }) => {
    return (
        <div className="w-full max-w-[1200px] mx-auto">
            <div className="mb-6 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <Bar className="h-6 w-40" />
                    <Bar className="h-4 w-72" />
                </div>
                <Bar className="h-9 w-36 rounded-[10px]" />
            </div>

            <div className="rounded-xl border border-[#E0E0E0]">
                <div className="grid grid-cols-[1fr_140px_140px_140px_48px] items-center border-b border-[#E0E0E0] bg-[#FAFAFA] px-5 py-3">
                    <Bar className="h-3 w-20" />
                    <Bar className="h-3 w-16" />
                    <Bar className="h-3 w-16" />
                    <Bar className="h-3 w-16" />
                    <span />
                </div>

                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_140px_140px_140px_48px] items-center border-b border-[#E0E0E0] px-5 py-4 last:border-b-0"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] animate-pulse" />
                            <Bar className="h-4 w-48" />
                        </div>
                        <Bar className="h-6 w-20 rounded-full" />
                        <Bar className="h-4 w-24" />
                        <Bar className="h-4 w-24" />
                        <Bar className="h-8 w-8 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InviteSkeleton;
