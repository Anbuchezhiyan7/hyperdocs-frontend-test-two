import React from 'react';

/** Zap icon, sized by the surrounding text. */
const ZapIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M13 2L3 14h9l-1 8 10-12h-9z' />
    </svg>
);

export default ZapIcon;
