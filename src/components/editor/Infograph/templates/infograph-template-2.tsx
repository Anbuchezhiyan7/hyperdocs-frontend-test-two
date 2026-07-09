// src/components/InfographTemplate2.tsx

import { useAppStore } from '@/store/useAppStore';
import { defaultColors } from '@/utils/editor';
import Image from 'next/image';
import React from 'react';
import { getLogoDimensions } from '@/utils/findAspectRatio';

// Define the Step interface
interface Step {
    id: number | string; // Allow string or number for ID display
    step_content: string;
}

// Define props interface for the component
interface InfographTemplate2Props {
    title: string;
    description: string;
    steps: Step[];
    logoSrc?: string;
}

const InfographTemplate2: React.FC<InfographTemplate2Props> = ({
    title,
    description,
    steps,
    logoSrc,
}) => {
    const { settings } = useAppStore();
    const logoAspectRatio = settings?.advanced?.logo?.aspect_ratio;
    const logoDimensions = getLogoDimensions(logoAspectRatio);

    return (
        <div className='w-full mx-auto p-6 md:p-12 bg-[#FFFFFF]'>
            <div className='text-center mb-12 md:mb-16'>
                <h2 className='text-3xl md:text-4xl font-semibold text-[#000000] mb-4'>{title}</h2>
                <p className='text-[#5D5D5D] max-w-3xl mx-auto text-base md:text-lg'>
                    {description}
                </p>
            </div>
            {/* Steps Container */}
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-16 mb-12 md:mb-16'>
                {/* Increased gap-y */}
                {steps.map((step, index) => {
                    const stepColor = defaultColors[index % defaultColors.length];
                    return (
                        <div
                            key={step.id}
                            className='relative w-full sm:w-[45%] md:w-[30%] lg:w-[16%] flex flex-col items-center'
                        >
                            {/* Adjusted width for 5 items */}
                            {/* Step Circle - Positioned above the card */}
                            <div
                                className='absolute -top-12 w-18 p-2 h-18 border-t-2 border-r-2 border-l-2 !border-b-0 rounded-full bg-[#FFFFFF]  flex items-center justify-center '
                                style={{ borderColor: stepColor }}
                            >
                                <div
                                    style={{ borderColor: stepColor }}
                                    className='text-[#000000] flex items-center justify-center border-4 border-[#000000] rounded-full w-14 h-14 font-semibold text-xl'
                                >
                                    {/* Format ID to have leading zero if it's a single digit number */}
                                    <span className='infograph-step-number text-[#000000] shadow-black shadow-sm w-[40px] h-[40px] rounded-full flex items-center justify-center font-semibold text-xl leading-none'>
                                        {index + 1}
                                    </span>
                                </div>
                            </div>
                            {/* Step Content Card */}
                            <div
                                className='bg-[#FFFFFF] p-5 pt-12 flex-1 rounded-xl shadow-sm w-full text-center border-[3px]' // Added pt-12 for circle overlap space, text-center
                                style={{ borderColor: stepColor }}
                            >
                                <h3 className='font-semibold text-base text-[#000000] mb-2'>
                                    Step {index + 1}
                                </h3>
                                <p className='text-[#5D5D5D] text-xs leading-relaxed'>
                                    {step.step_content}
                                </p>{' '}
                                {/* Adjusted text size */}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Bottom Line */}
            <div className='border-t border-[#F2F2F2] mt-8 md:mt-12'></div>
            {/* Logo Section */}
            <div className='flex justify-end pt-5 pb-4 pr-4'>
                <Image
                    className='object-cover'
                    src={settings?.advanced.logo?.url || ''}
                    alt='logo'
                    width={logoDimensions.width}
                    height={logoDimensions.height}
                />
            </div>
        </div>
    );
};

export default InfographTemplate2;
