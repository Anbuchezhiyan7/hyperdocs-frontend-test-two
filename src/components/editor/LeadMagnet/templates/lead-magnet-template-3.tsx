import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';
import React from 'react';

interface LeadMagnetTemplate3Props {
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

const LeadMagnetTemplate3Sticky: React.FC<LeadMagnetTemplate3Props> = ({
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
                background: 'linear-gradient(135deg, #EEF5EE 0%, #DFF0E4 100%)', 
                border: '1px solid #D5EAD9',
                borderTop: '6px solid #2D8A50'
            }}
        >
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className='text-[#2D8A50] font-inter font-bold text-sm md:text-base uppercase leading-tight my-0 flex-1 pr-2'>
                    {title}
                </h2>
                <div className="text-[#2D8A50]">
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
                        className="text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans'] shadow-md text-sm md:text-base w-full"
                        style={{ background: 'linear-gradient(135deg, #2D8A50 0%, #3DAA68 100%)' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LeadMagnetTemplate3Default: React.FC<LeadMagnetTemplate3Props> = ({
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
    const imageSource = image ? image : '/images/lead-magnets/placeholders/placeholder-3.webp';

    return (
        <div className='w-full max-h-[300px] p-4 md:p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center' style={{ background: 'linear-gradient(135deg, #EEF5EE 0%, #DFF0E4 100%)' }}>
            <div className='hidden md:flex md:w-[175px] shrink-0 mb-6 md:mb-0 md:mr-8 justify-center items-center'>
                {imageSource ? (
                    <img
                        src={imageSource}
                        alt='Blog Post Templates Preview'
                        className='rounded-lg w-full max-w-[175px] h-auto object-contain shadow-sm my-0'
                    />
                ) : (
                    <div className='w-full max-w-[175px] aspect-[4/5] rounded-lg shadow-md transform rotate-[-3deg] flex items-center justify-center p-2 text-center text-xs text-gray-500 bg-white/50 border border-dashed border-gray-300'>
                        Click to edit and upload image
                    </div>
                )}
            </div>
            <div className='flex-1 w-full text-left'>
                <h2 className='text-blog-card-title font-inter font-bold text-[20px] md:text-[24px] mb-3 line-clamp-2 my-0'>
                    {title}
                </h2>
                <p className='text-ebook-card-description font-inter text-base md:text-lg mb-6 line-clamp-3'>
                    {description}
                </p>
                <button
                    onClick={onClick}
                    className={cn(
                        background,
                        " text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-['Plus_Jakarta_Sans']"
                    )}
                    style={{ background: 'linear-gradient(135deg, #2D8A50 0%, #3DAA68 100%)' }}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

const LeadMagnetTemplate3: React.FC<LeadMagnetTemplate3Props> = (props) => {
    if (props.placement === 'sticky_sidebar') {
        return <LeadMagnetTemplate3Sticky {...props} />;
    }
    return <LeadMagnetTemplate3Default {...props} />;
};

export default LeadMagnetTemplate3;
