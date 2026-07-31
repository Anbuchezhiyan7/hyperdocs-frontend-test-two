import React from 'react';

/** List icon, sized by the surrounding text. */
const ListIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' />
    </svg>
);

export default ListIcon;
