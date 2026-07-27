'use client';

import React from 'react';

import { useScrollProgress } from '@/hooks/useScrollProgress';

/**
 * A thin bar fixed to the top of the viewport that fills as the reader scrolls
 * through a blog post, giving a visual sense of how much is left.
 */
const ScrollProgressBar: React.FC = () => {
    const progress = useScrollProgress();

    return (
        <div className='fixed top-0 left-0 right-0 z-50 h-1 bg-transparent'>
            <div
                className='h-full bg-[#F26522] transition-[width] duration-75 ease-out'
                style={{ width: `${progress}%` }}
                role='progressbar'
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
};

export default ScrollProgressBar;
