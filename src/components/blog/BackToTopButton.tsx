'use client';

import React from 'react';

import { useScrollThreshold } from '@/hooks/useScrollThreshold';

/**
 * A floating button that appears once the reader is a few screens into a post
 * and returns them to the top when clicked. Hidden near the top of the page so
 * it never covers content the reader is already looking at.
 */
const BackToTopButton: React.FC<{ threshold?: number }> = ({ threshold = 400 }) => {
    const visible = useScrollThreshold(threshold);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            type='button'
            onClick={scrollToTop}
            aria-label='Back to top'
            title='Back to top'
            className='fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#F26522] text-white shadow-lg transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:ring-offset-2'
        >
            <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden='true'
            >
                <path d='M12 19V5' />
                <path d='M5 12l7-7 7 7' />
            </svg>
        </button>
    );
};

export default BackToTopButton;
