'use client';

import React, { useState } from 'react';

import { cn } from '@/utils/cn';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import {
    buildShareTargets,
    shareViaSystemSheet,
    DEFAULT_SHARE_NETWORKS,
    type ShareNetwork,
} from '@/utils/share-links';

interface ShareButtonsProps {
    /** Absolute URL of the post being shared. */
    url: string;
    title: string;
    /** Longer text for destinations that support it (email, WhatsApp). */
    summary?: string;
    networks?: ShareNetwork[];
    className?: string;
}

/**
 * Share links for a published post.
 *
 * These are plain anchors, not embedded network widgets — nothing third-party
 * loads on the page, so a reader who never shares is never tracked. On devices
 * with a native share sheet we hand off to it instead, since that lists the apps
 * the reader actually uses.
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({
    url,
    title,
    summary,
    networks = DEFAULT_SHARE_NETWORKS,
    className,
}) => {
    const targets = buildShareTargets({ url, title, summary }, networks);
    const { copied, copy } = useCopyToClipboard();
    const [sheetPending, setSheetPending] = useState(false);

    const handleNativeShare = async () => {
        setSheetPending(true);
        const shared = await shareViaSystemSheet({ url, title, summary });
        setSheetPending(false);
        // If the sheet is unavailable the link row below is already visible,
        // so there is nothing further to do when this returns false.
        return shared;
    };

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            <span className='text-sm opacity-60 mr-1'>Share</span>

            {targets.map(target => (
                <a
                    key={target.network}
                    href={target.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`Share on ${target.label}`}
                    className='rounded-md border border-black/10 dark:border-white/15 px-2.5 py-1 text-sm transition-opacity hover:opacity-70'
                >
                    {target.label}
                </a>
            ))}

            <button
                type='button'
                onClick={() => copy(url)}
                aria-label='Copy link to this post'
                className='rounded-md border border-black/10 dark:border-white/15 px-2.5 py-1 text-sm transition-opacity hover:opacity-70'
            >
                {copied ? 'Copied' : 'Copy link'}
            </button>

            <button
                type='button'
                onClick={handleNativeShare}
                disabled={sheetPending}
                aria-label='Open your device share options'
                className='sm:hidden rounded-md border border-black/10 dark:border-white/15 px-2.5 py-1 text-sm transition-opacity hover:opacity-70 disabled:opacity-40'
            >
                More
            </button>
        </div>
    );
};

export default ShareButtons;
