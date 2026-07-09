import React from 'react';
import { Twitter, Mail, Link, Facebook, Linkedin } from 'lucide-react';
import { showToast } from '@/components/common/Toast';

interface SocialShareProps {
    blog?: {
        blog_title?: string;
        blog_info?: { slug_url?: string | null };
    };
}

const SocialShare: React.FC<SocialShareProps> = ({ blog }) => {
    // Determine URL and Title
    let url = typeof window !== 'undefined' ? window.location.href : '';
    if (blog?.blog_info?.slug_url) {
        url = `${window.location.origin}/blog/${blog.blog_info.slug_url}`;
    }
    const title = blog?.blog_title || (typeof document !== 'undefined' ? document.title : '');

    const handleTweet = () => {
        const tweetUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    };

    const handleFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(fbUrl, '_blank', 'noopener,noreferrer');
    };

    const handleLinkedin = () => {
        const lnUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(lnUrl, '_blank', 'noopener,noreferrer');
    };

    const handleEmail = () => {
        const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        window.location.href = mailto;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            showToast('Link copied to clipboard', 'success');
        } catch (e) {
            showToast('Failed to copy link', 'error');
        }
    };

    // Custom X Icon SVG to match the new logo
    const XIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298l13.311 17.405Z" />
        </svg>
    );

    const shareOptions = [
        { icon: XIcon, label: 'Tweet', action: handleTweet },
        { icon: Facebook, label: 'Share', action: handleFacebook },
        { icon: Linkedin, label: 'Share', action: handleLinkedin },
        { icon: Mail, label: 'Email', action: handleEmail },
        { icon: Link, label: 'Copy', action: handleCopy },
    ];

    return (
        <div className='border-t border-stroke md:pt-12 pt-4 md:mt-12 mt-4 '>
            <div className='flex items-center justify-center gap-4 lg:flex-row flex-col'>
                <span className="text-base font-bold font-dm-sans text-[#5D5D5D] mr-2">SHARE:</span>
         
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {shareOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <button
                            key={index}
                            onClick={option.action}
                            className='flex items-center gap-2.5 px-6 py-1.5 bg-white border border-[#E0E0E0] rounded-full hover:bg-[#F9F9F9] transition-all duration-200'
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
