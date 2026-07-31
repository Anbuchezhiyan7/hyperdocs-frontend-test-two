import React from 'react';

/** Lock icon, sized by the surrounding text. */
const LockIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M5 11h14v11H5zM8 11V7a4 4 0 118 0v4' />
    </svg>
);

export default LockIcon;
