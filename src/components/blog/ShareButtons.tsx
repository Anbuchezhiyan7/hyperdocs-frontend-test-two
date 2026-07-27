'use client';

import React from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
}

const NETWORKS = [
    {
        id: 'twitter',
        label: 'Share on X',
        href: (url: string, title: string) =>
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
        id: 'linkedin',
        label: 'Share on LinkedIn',
        href: (url: string) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
        id: 'facebook',
        label: 'Share on Facebook',
        href: (url: string) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
];

/**
 * A row of social share buttons shown under a published post so readers can
 * post it to X, LinkedIn, or Facebook in one click.
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    return (
        <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold text-[#5D5D5D]'>Share:</span>
            {NETWORKS.map(n => (
                <a
                    key={n.id}
                    href={n.href(url, title)}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={n.label}
                    className='rounded-lg border border-[#E0E0E0] px-3 py-1.5 text-xs font-semibold text-[#333] hover:bg-gray-50'
                >
                    {n.id === 'twitter' ? 'X' : n.id === 'linkedin' ? 'in' : 'f'}
                </a>
            ))}
        </div>
    );
};

export default ShareButtons;
