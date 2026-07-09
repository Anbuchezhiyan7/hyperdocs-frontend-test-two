import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';
import React from 'react';
import Image from 'next/image';

interface LeadMagnetTemplate4Props {
    image: string;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    placement?: string;
    readOnly?: boolean;
}

import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const LeadMagnetTemplate4Sticky: React.FC<LeadMagnetTemplate4Props> = ({
    title,
    description,
    buttonText,
    onClick,
    readOnly,
}) => {
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData('template');
    const background = template?.seo?.accent_color
        ? `!bg-[${template?.seo?.accent_color}]`
        : 'bg-[#cc4200]';

    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div 
            className={cn(
                'flex flex-col p-5 md:p-6 rounded-none md:rounded-t-xl rounded-b-none shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300',
                readOnly ? 'fixed bottom-0 left-0 md:left-auto right-0 md:right-6 z-[999] w-full md:w-[320px]' : 'relative w-full max-w-[320px] rounded-b-xl'
            )} 
            style={{ 
                backgroundColor: '#F8F1EA', 
                border: '1px solid #EBE2D9',
                borderTop: '6px solid #2E3178'
            }}
        >
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className='text-[#2E3178] font-inter font-bold text-sm md:text-base uppercase leading-tight my-0 flex-1 pr-2'>
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
                    {description && (
                        <p className='text-gray-800 font-inter text-xs md:text-sm mb-3 line-clamp-3'>
                            {description}
                        </p>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className={cn(
                            background,
                            "text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans'] shadow-md text-sm md:text-base w-full"
                        )}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LeadMagnetTemplate4Default: React.FC<LeadMagnetTemplate4Props> = ({
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
    const imageSource = image ? image : '/images/lead-magnets/placeholders/placeholder-4.webp';

    return (
        <div
            className='w-full max-h-[400px] md:max-h-[300px] p-4 md:p-6 rounded-xl shadow-md flex flex-col items-center justify-center mx-auto'
            style={{ backgroundColor: '#F8F1EA' }}
        >
            <h2 className='text-[#2E3178] font-inter font-bold text-[20px] md:text-[24px] mb-4 text-center line-clamp-2 my-0'>
                {title}
            </h2>
            <p className='text-gray-600 font-inter text-base md:text-lg mb-6 text-center max-w-2xl line-clamp-3'>
                {description}
            </p>
            <button
                onClick={onClick}
                className={cn(
                    background,
                    " text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans'] shadow-md"
                )}
            >
                {buttonText}
            </button>
        </div>
    );
};

const LeadMagnetTemplate4: React.FC<LeadMagnetTemplate4Props> = (props) => {
    if (props.placement === 'sticky_sidebar') {
        return <LeadMagnetTemplate4Sticky {...props} />;
    }
    return <LeadMagnetTemplate4Default {...props} />;
};

export default LeadMagnetTemplate4;