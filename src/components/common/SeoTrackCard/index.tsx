import React from 'react';
import { TickIcon, WrongIcon, CoinsIcon } from '@/assets/icons';
import { Button } from 'antd';
import { cn } from '@/utils/cn';
import { useQueryState } from 'nuqs';
import { ArrowUpRight } from 'lucide-react';
import { queryClient } from '@/config/query.config';
interface SeoTrackCardProps {
    isDone: boolean;
    label: string;
    current: number;
    score: number;
    onViewSuggestions: () => void;
    showAIButton?: boolean;
    isLoading?: boolean;
    credits?: number;
}

const SeoTrackCard: React.FC<SeoTrackCardProps> = ({
    isDone,
    label,
    current,
    score,
    onViewSuggestions,
    showAIButton = true,
    isLoading,
    credits = 2,
}) => {
    const [type, setType] = useQueryState('model-type');
    const isPlanUpgraded = false;
    const activeSubscription = queryClient.getQueryData<ActiveSubscription>([
        'active_subscription',
    ]) as ActiveSubscription;
    const totalCredits = activeSubscription?.total_ai_credits || 0;
    const showUpgrade = totalCredits === 0;
    
    const handleUpgrade = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isPlanUpgraded) return;
        setType('pricing');
    };
    return (
        <div className='flex justify-between flex-col w-full border-b-[1px] pb-4'>
            <div className='flex items-center gap-2'>
                <span className='!w-5 !h-5'>
                    {isDone ? <TickIcon className='w-5 h-5' /> : <WrongIcon className='w-5 h-5' />}
                </span>
                <p className='text-[#333] text-base font-semibold'>{label}</p>
            </div>
            <div className='flex justify-between items-center mt-2'>
                <span
                    className={cn(
                        'text-sm font-semibold',
                        isDone ? 'text-green-600' : 'text-red-600'
                    )}
                >
                    {score} Pts
                </span>
                <p className='flex items-center gap-2 text-[#333] text-sm font-normal ml-auto'>
                    Current: <span className='font-semibold'>{current}</span>
                </p>
            </div>
            <div className='flex justify-end items-center '>
                {!isDone && showAIButton && (
                    <Button
                        onClick={onViewSuggestions}
                        variant='outlined'
                        loading={isLoading}
                        className='!px-2 !h-8 font-medium text-sm  bg-white !gap-1 mt-2'
                    >
                        <span className="flex items-center gap-1.5">
                            {isLoading ? 'Creating...' : 'Create Using AI'}
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FFEEE5] text-[#FF5200] rounded-full text-xs font-semibold">
                                <span className="inline-flex items-center [&_svg_path]:!fill-[#FF5200]">
                                    <CoinsIcon className="h-3 w-3" />
                                </span>
                                {credits}
                            </span>
                        </span>
                        {showUpgrade && (
                            <span
                                onClick={handleUpgrade}
                                className='text-[10px] flex items-center gap-0.5 font-semibold rounded-md ml-2 px-2 py-0.2 bg-[#FFEEE5] text-[#FF5200]'
                            >
                                UPGRADE
                                <ArrowUpRight className='w-4 h-4' />
                            </span>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SeoTrackCard;
