import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';

interface LeadMagnetTemplate1Props {
    image: string;
    title: string;
    buttonText: string;
    onClick: () => void;
    placement?: string;
    readOnly?: boolean;
    description: string;
}

import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const LeadMagnetTemplate1Sticky: React.FC<LeadMagnetTemplate1Props> = ({
    title,
    buttonText,
    onClick,
    readOnly,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div 
            className={cn(
                'flex flex-col p-5 md:p-6 rounded-none md:rounded-t-xl rounded-b-none shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300',
                readOnly ? 'fixed bottom-0 left-0 md:left-auto right-0 md:right-6 z-[999] w-full md:w-[320px]' : 'relative w-full max-w-[320px] rounded-b-xl'
            )} 
            style={{ 
                background: 'linear-gradient(135deg, #FDF6EE 0%, #FAE8D8 100%)', 
                border: '1px solid #F5E0CD',
                borderTop: '6px solid #E8601A' 
            }}
        >
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className='text-[#2E3178] text-sm md:text-base font-extrabold leading-tight my-0 uppercase flex-1 pr-2'>
                    {title}
                </h2>
                <div className="text-[#2E3178]">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </div>
            </div>
            
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans'] shadow-md text-sm md:text-base w-full"
                        style={{ background: 'linear-gradient(135deg, #E8601A 0%, #F5802A 100%)' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LeadMagnetTemplate1Default: React.FC<LeadMagnetTemplate1Props> = ({
    image,
    title,
    description,
    buttonText,
    onClick,
}) => {
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData('template');
    const background = template?.seo?.accent_color
        ? `!bg-[${template?.seo?.accent_color}]`
        : 'bg-[#cc4200]';

    const imageSource = image ? image : '/images/lead-magnets/template-1-lead-magnet.png';

    return (
        <div className='p-4 md:p-6 flex flex-col md:flex-row gap-4 md:max-h-[300px] max-h-auto items-center w-full' style={{ background: 'linear-gradient(135deg, #FDF6EE 0%, #FAE8D8 100%)', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div className='hidden md:flex md:w-[175px] shrink-0 justify-center items-center'>
                {imageSource ? (
                    <Image
                        src={imageSource}
                        alt='PDF Guide'
                        className='w-full max-w-[175px] h-auto rounded-lg transform my-0'
                        width={175}
                        height={250}
                    />
                ) : (
                    <div className='w-full max-w-[175px] aspect-[4/5] rounded-lg shadow-md transform rotate-[-3deg] flex items-center justify-center p-2 text-center text-xs text-gray-500 bg-white/50 border border-dashed border-gray-300'>
                        Click to edit and upload image
                    </div>
                )}
            </div>

            <div className='flex-1 bg-white h-full p-6 rounded-lg shadow-md'>
                <h2 className='text-[#2E3178] text-[20px] md:text-[24px] font-extrabold leading-tight mb-4 line-clamp-2 my-0'>
                    {title}
                </h2>
                {description && (
                    <p className='text-gray-600 font-inter text-sm md:text-base mb-6 line-clamp-3'>
                        {description}
                    </p>
                )}
                <button
                    onClick={onClick}
                    className={cn(
                        background,
                        " text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans']"
                    )}
                    style={{ background: 'linear-gradient(135deg, #E8601A 0%, #F5802A 100%)' }}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

const LeadMagnetTemplate1: React.FC<LeadMagnetTemplate1Props> = (props) => {
    if (props.placement === 'sticky_sidebar') {
        return <LeadMagnetTemplate1Sticky {...props} />;
    }
    return <LeadMagnetTemplate1Default {...props} />;
};

export default LeadMagnetTemplate1;
