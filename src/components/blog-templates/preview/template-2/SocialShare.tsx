import React from 'react';
import { Twitter, Mail, Link, Facebook, Linkedin } from 'lucide-react';

interface SocialShareProps {
    blog?: {
        blog_title?: string;
        blog_info?: { slug_url?: string | null };
    };
    isPreview?: boolean;
}

const SocialShare: React.FC<SocialShareProps> = () => {
    // Custom X Icon SVG
    const XIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298l13.311 17.405Z" />
        </svg>
    );

    const shareOptions = [
        { icon: XIcon, label: 'Tweet' },
        { icon: Facebook, label: 'Share' },
        { icon: Linkedin, label: 'Share' },
        { icon: Mail, label: 'Email' },
        { icon: Link, label: 'Copy' },
    ];

    return (
        <div className='border-t border-stroke md:pt-12 pt-4 md:mt-12 mt-4'>
                <div className='flex items-center justify-center gap-4 lg:flex-row flex-col'>
                <span className="text-base font-bold font-dm-sans text-[#5D5D5D] mr-2">SHARE:</span>
         
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {shareOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <button
                            key={index}
                            className='flex items-center gap-2.5 px-6 py-1.5 bg-white border border-[#E0E0E0] rounded-full hover:bg-[#F9F9F9] transition-all duration-200 cursor-default'
                        >
                            <div className="flex items-center justify-center text-[#333333]">
                                <Icon size={18} />
                            </div>
                            <span className='font-dm-sans font-bold text-base text-[#333333]'>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
                 </div>
        </div>
    );
};

export default SocialShare;
