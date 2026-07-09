import { cn } from '@/utils/cn';
import { Button } from 'antd';
import dayjs from 'dayjs';

interface ActivePlanProps {
    activeSubscription: ActiveSubscription;
}

const ActivePlan = ({ activeSubscription }: ActivePlanProps) => {
    return (
        <div className='flex flex-col justify-center items-start gap-3 w-full'>
            <h2 className='text-[16px]  font-[600] text-[#333]'>ActivePlan</h2>
            <div className='border-[1px] border-[#E0E0E0] rounded-[10px] p-[20px] w-full flex flex-row justify-between items-center'>
                <div className='flex flex-col justify-center items-start gap-2'>
                    <h2 className='text-[24px] capitalize font-[700] text-[#000]'>
                        {activeSubscription?.plan_details?.plan_name}
                    </h2>
                    <p className='text-[#8F8F8F] text-[12px] font-[600]'>
                        <span className='text-[#333]'>
                            ${activeSubscription?.plan_details?.plan_amount}
                        </span>{' '}
                        per {activeSubscription?.plan_details?.billing_period} billed annually
                    </p>
                </div>
                <div
                    className={cn(
                        'flex flex-row justify-center items-center gap-2',
                        !activeSubscription?.expiry_date && '!hidden'
                    )}
                >
                    <p className='text-[#8F8F8F] text-[12px] font-[600]'>
                        Next Payment:{' '}
                        <span className='text-[#333]'>
                            {dayjs(activeSubscription?.expiry_date).format('DD MMM, YYYY')}
                        </span>{' '}
                    </p>
                    <Button type='primary' className='w-[135px] h-[32px] rounded-[10px]'>
                        Upgrade Plan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ActivePlan;
