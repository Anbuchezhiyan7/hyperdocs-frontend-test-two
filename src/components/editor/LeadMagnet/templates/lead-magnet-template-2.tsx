import { useTemplateStore } from '@/store/useTemplateStore';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/utils/cn';

interface LeadMagnetTemplate2Props {
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

const LeadMagnetTemplate2Sticky: React.FC<LeadMagnetTemplate2Props> = ({
    title,
    description,
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
                background: 'linear-gradient(135deg, #EEF2F8 0%, #E4EDF8 100%)', 
                border: '1px solid #D6E4F0',
                borderTop: '6px solid #3A6EA8' 
            }}
        >
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-[#D14500] font-inter font-bold text-sm md:text-base uppercase leading-tight my-0 flex-1 pr-2">
                    {title}
                </h2>
                <div className="text-[#D14500]">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </div>
            </div>
            
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    {description && (
                        <p className="text-gray-800 font-inter text-xs md:text-sm mb-3 line-clamp-3">
                            {description}
                        </p>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans'] shadow-md text-sm md:text-base w-full"
                        style={{ background: 'linear-gradient(135deg, #3A6EA8 0%, #4F8EC8 100%)' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LeadMagnetTemplate2Default: React.FC<LeadMagnetTemplate2Props> = ({
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
    const imageSource = image ? image : '/images/lead-magnets/template-2-lead-magnet.png';

    return (
        <div className="w-full p-4 md:p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between" style={{ background: 'linear-gradient(135deg, #EEF2F8 0%, #E4EDF8 100%)' }}>
            <div className="flex-1 w-full text-left md:pr-8 order-2 md:order-1 mt-6 md:mt-0">
                <h2 className="text-[#D14500] font-inter font-bold text-[20px] md:text-[24px] uppercase mb-4 line-clamp-2 my-0">
                    {title}
                </h2>
                <p className="text-gray-800 font-inter text-sm sm:text-base mb-6 line-clamp-3">{description}</p>
                <button
                    onClick={onClick}
                    className={cn(
                        background,
                        " text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans']"
                    )}
                    style={{ background: 'linear-gradient(135deg, #3A6EA8 0%, #4F8EC8 100%)' }}
                >
                    {buttonText}
                </button>
            </div>
            <div className="hidden md:flex md:w-[175px] shrink-0 h-full order-1 md:order-2 items-center justify-center">
                {imageSource ? (
                    <div className="w-full flex justify-center items-center">
                        <Image
                            src={imageSource}
                            alt="Ebook Cover"
                            className="w-full max-w-[175px] rounded-xl object-contain my-0"
                            width={175}
                            height={250}
                            priority
                            onError={e => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/lead-magnets/placeholders/placeholder-2.webp';
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full max-w-[175px] aspect-[4/5] rounded-lg shadow-md transform rotate-[-3deg] flex items-center justify-center p-2 text-center text-xs text-gray-500 bg-white/50 border border-dashed border-gray-300">
                        Click to edit and upload image
                    </div>
                )}
            </div>
        </div>
    );
};

const LeadMagnetTemplate2: React.FC<LeadMagnetTemplate2Props> = (props) => {
    if (props.placement === 'sticky_sidebar') {
        return <LeadMagnetTemplate2Sticky {...props} />;
    }
    return <LeadMagnetTemplate2Default {...props} />;
};

export default LeadMagnetTemplate2;
