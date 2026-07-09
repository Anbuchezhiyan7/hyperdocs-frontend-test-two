import { useAppStore } from '@/store/useAppStore';
import { defaultColors } from '@/utils/editor';
import Image from 'next/image';
import React from 'react'; 
import { getLogoDimensions } from '@/utils/findAspectRatio';

// Define the Step interface
interface Step {
    id: number;
    step_content: string;
    color?: string;
}

// Define props interface for the component
interface InfographTemplate1Props {
    title: string;
    description: string;
    steps: Step[];
}

const InfographTemplate1: React.FC<InfographTemplate1Props> = ({ title, description, steps }) => {
    const { settings } = useAppStore();

    const logoAspectRatio = settings?.advanced?.logo?.aspect_ratio;
    const logoDimensions = getLogoDimensions(logoAspectRatio);

    return (
        <div className='max-w-6xl mx-auto p-6 md:p-12 bg-[#F8F8F8] h-fit'>
            {/* Header Section */}
            <div className='text-center mb-12 md:mb-16'>
                <h2 className='text-3xl md:text-4xl font-semibold text-[#000000] mb-4'>{title}</h2>
                <p className='text-[#5D5D5D] max-w-3xl mx-auto text-base md:text-lg'>
                    {description}
                </p>
            </div>

            {/* Steps Grid */}
            <div className='flex flex-row flex-wrap justify-center gap-x-[35px] gap-y-12 mb-12 md:mb-16 relative'>
                {/* Added relative positioning context */}
                {steps.map((step, index) => {
                    const stepColor = step.color || defaultColors[index % defaultColors.length];

                    return (
                        <div
                            key={index}
                            className='relative w-[30%] min-h-[196px] p-2 py-4 flex rounded-tl-md items-start bg-[#FFFFFF] rounded-md shadow-sm border border-gray-100 '
                        >
                            <div
                                className='absolute top-0 bottom-0 w-[4px] left-0'
                                style={{ backgroundColor: stepColor }}
                            />
                            <div
                                className='infograph-step-number text-xl absolute top-[38%] left-[-23px] flex items-center justify-center w-[50px] h-[50px] rounded-full text-white font-bold text-center'
                                style={{ backgroundColor: stepColor }}
                            >
                                <span className='text-xl leading-none'>{index + 1}</span>
                            </div>

                            {/* Adjusted top margin to align card content better with the circle's center */}
                            <div className='flex-1 ml-[38px]'>
                                <div className='font-semibold text-lg text-[#000000] mb-2'>
                                    Step {index + 1}
                                </div>
                                <p className='text-[#5D5D5D] text-sm leading-relaxed'>
                                    {step.step_content}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Line */}
            <div className='border-t border-gray-300 '></div>

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

export default InfographTemplate1;
