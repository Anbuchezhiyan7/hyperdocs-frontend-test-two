import React from 'react';

/** Twitter icon, sized by the surrounding text. */
const TwitterIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M23 3a10.9 10.9 0 01-3.1 1.5 4.5 4.5 0 00-7.9 3v1A10.7 10.7 0 013 4s-4 9 5 13a11.6 11.6 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.1-.8A7.7 7.7 0 0023 3z' />
    </svg>
);

export default TwitterIcon;
