import { useState } from 'react';
import { Input, Button } from 'antd';
import { CREDIT_PRICE } from '@/constants/definitions';

interface AllCredictsProps {
    activeSubscription: ActiveSubscription;
}

const AllCredicts = ({ activeSubscription }: AllCredictsProps) => {
    const [selectedCredits, setSelectedCredits] = useState<number>(100);
    const creditOptions = [50, 100, 500];
    const price = selectedCredits * CREDIT_PRICE;

    const handleCreditsChange = (value: any) => {
        if (value && !isNaN(Number(value)) && Number(value) >= 25) {
            setSelectedCredits(Number(value));
        } else {
            setSelectedCredits(25);
        }
    };
    return (
        <div className='flex flex-col justify-center items-start gap-3 w-full'>
            <h2 className='text-[16px] font-[600] text-[#333]'>All Credits</h2>
            <div className='border-[1px] border-[#E0E0E0] rounded-[10px] p-[20px] w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-6'>
                <div className='flex flex-col justify-center items-center md:items-start gap-3 w-full md:w-auto text-center md:text-left'>
                    <p className='text-[#8F8F8F] text-[14px] font-[600]'>
                        <span className='text-[#333] font-[700] text-[24px]'>
                            {activeSubscription?.total_ai_credits}
                        </span>{' '}
                        AI Credits remaining
                    </p>
                    <div className='flex flex-col sm:flex-row items-center gap-4 mt-2 w-full justify-center md:justify-start'>
                        <p className='text-[#000] text-[14px] font-[500]'>Topup : </p>
                        <div className='flex items-center gap-2 flex-wrap justify-center sm:justify-start'>
                            <div className='flex gap-2'>
                                {creditOptions.map(credit => (
                                    <button
                                        key={credit}
                                        onClick={() => setSelectedCredits(credit)}
                                        className={`px-4 py-2 rounded-lg transition-all
                                            bg-[#FFEEE5] text-[#FF5200]
                                            ${
                                                selectedCredits === credit
                                                    ? 'border-[1px] border-[#FF5200]'
                                                    : 'border-[1px] border-transparent'
                                            }`}
                                    >
                                        {credit}
                                    </button>
                                ))}
                            </div>
                            <Input
                                placeholder='Enter credit count'
                                className='w-[140px] rounded-lg'
                                min={25}
                                value={selectedCredits}
                                onChange={e => handleCreditsChange(e.target.value)}
                                type='number'
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-3 py-2 justify-center items-center shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100'>
                    <p className='text-[#8F8F8F] text-[14px] font-[600]'>
                        <span className='text-[#FF5200] text-[24px] font-[700]'>
                            $ {price?.toFixed(2)}
                        </span>{' '}
                        for
                        {' ' + selectedCredits + ' '}
                        credits
                    </p>
                    <Button type='primary' className='w-[135px] h-[32px] rounded-[10px]'>
                        Buy now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AllCredicts;
