'use client';

import React from 'react';
import { Copy, Linkedin, Mail, Facebook, Check } from 'lucide-react';
import { showToast } from '@/components/common/Toast';

interface ShareArticleProps {
    blog?: {
        blog_title?: string;
        blog_info?: { slug_url?: string | null };
    };
    className?: string;
}

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298l13.311 17.405Z" />
    </svg>
);

const ShareArticle: React.FC<ShareArticleProps> = ({ blog, className }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog?.blog_title || (typeof document !== 'undefined' ? document.title : '');
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            showToast('Link copied to clipboard', 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast('Failed to copy link', 'error');
        }
    };

    const open = (link: string) => window.open(link, '_blank', 'noopener,noreferrer');

    const options = [
        {
            icon: copied ? Check : Copy,
            label: 'Copy link',
            color: '#1A1A1A',
            action: handleCopy,
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            color: '#0A66C2',
            action: () =>
                open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
        },
        {
            icon: XIcon,
            label: 'X',
            color: '#000000',
            action: () =>
                open(
                    `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                ),
        },
        {
            icon: Facebook,
            label: 'Facebook',
            color: '#1877F2',
            action: () => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
        },
        {
            icon: Mail,
            label: 'Email',
            color: '#1A1A1A',
            action: () =>
                (window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`),
        },
    ];

    return (
        <div className={className}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#9A8F7E]">
                Share
            </h3>
            <div className="flex flex-row flex-wrap gap-3">
                {options.map((opt, i) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={i}
                            onClick={opt.action}
                            aria-label={opt.label}
                            title={opt.label}
                            style={{ ['--brand' as string]: opt.color }}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E1D9CE] bg-white/60 text-[#6B6B6B] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-white hover:shadow-md"
                        >
                            <Icon size={16} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ShareArticle;
