import React from 'react';
import { Copy, X, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { showToast } from '@/components/common/Toast';
import { cn } from '@/utils/cn';

interface ShareArticleProps {
    isPreview?: boolean;
    className?: string;
}

const ShareArticle: React.FC<ShareArticleProps> = ({ isPreview, className }) => {
    const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';

    const handleCopyLink = () => {
        if (isPreview) return;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showToast('Link copied to clipboard', 'success');
        });
    };

 const baseClass =
  'group flex items-center cursor-pointer text-textSecondary transition-all duration-300 w-full overflow-hidden hover:underline';

    const innerClass =
        'flex items-center transition-all duration-300 group-hover:-ml-6';

    const iconClass =
        'h-4 w-4 mr-2 transition-all duration-300 group-hover:opacity-0 group-hover:scale-0';

    const textClass =
        'whitespace-nowrap transition-all duration-300';

    return (
        <div className={cn("pl-0 pt-0 lg:pt-8 h-full", className)}>
            <h3 className="font-jakarta font-bold text-sm text-[#333] uppercase mb-0 border-b pb-6 tracking-widest">
                SHARE ARTICLE
            </h3>

            <div className="flex flex-col">

                {/* Copy */}
                <button
                    onClick={!isPreview ? handleCopyLink : undefined}
                    className={`${baseClass} border-b py-6`}
                >
                    <div className={innerClass}>
                        <Copy className={iconClass} />
                        <span className={textClass}>Copy Link</span>
                    </div>
                </button>

                {/* LinkedIn */}
                <Link
                    href={
                        !isPreview
                            ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
                            : '#'
                    }
                    onClick={isPreview ? (e) => e.preventDefault() : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClass} border-b py-6`}
                >
                    <div className={innerClass}>
                        <Linkedin className={iconClass} />
                        <span className={textClass}>Post on LinkedIn</span>
                    </div>
                </Link>

                {/* X */}
                <a
                    href={
                        !isPreview
                            ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`
                            : '#'
                    }
                    onClick={isPreview ? (e) => e.preventDefault() : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClass} py-6`}
                >
                    <div className={innerClass}>
                        <X className={iconClass} />
                        <span className={textClass}>Post on X</span>
                    </div>
                </a>

            </div>
        </div>
    );
};

export default ShareArticle;