import React from 'react';

/** Clock icon, sized by the surrounding text. */
const ClockIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z' />
    </svg>
);

export default ClockIcon;
