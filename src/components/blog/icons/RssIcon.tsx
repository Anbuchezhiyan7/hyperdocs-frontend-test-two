import React from 'react';

/** Rss icon, sized by the surrounding text. */
const RssIcon: React.FC<{ size?: number; className?: string }> = ({
    size = 16,
    className,
}) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
        aria-hidden='true'
    >
        <path d='M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 20a1 1 0 100-2 1 1 0 000 2z' />
    </svg>
);

export default RssIcon;
