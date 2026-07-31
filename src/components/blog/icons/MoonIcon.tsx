import React from 'react';

/** Moon icon, sized by the surrounding text. */
const MoonIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z' />
    </svg>
);

export default MoonIcon;
