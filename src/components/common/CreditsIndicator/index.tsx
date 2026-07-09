import { CoinsIcon } from '@/assets/icons';
import { cn } from '@/lib/utils';

type Props = {
    activeSubscription: ActiveSubscription;
    className?: string;
};

import { Sparkles } from 'lucide-react';

const CreditsIndicator = ({ activeSubscription, className }: Props) => {
    return (
        <div className={cn('flex items-center gap-2 z-50 p-2 px-3 rounded-lg bg-[#FFEEE5]', className)}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-500 uppercase tracking-widest">
                <Sparkles size={13} className="text-orange-400" />
                AI Credits:
            </div>
            <div className='text-[15px] flex items-center gap-1.5 text-primary font-black'>
                {activeSubscription?.total_ai_credits} <span className="text-[12px] font-semibold text-gray-500 lowercase tracking-wide">remaining</span> <CoinsIcon className="w-4 h-4 ml-0.5" />
            </div>
        </div>
    );
};

export default CreditsIndicator;
