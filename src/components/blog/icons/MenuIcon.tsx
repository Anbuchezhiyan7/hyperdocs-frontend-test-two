import React from 'react';

/** Menu icon, sized by the surrounding text. */
const MenuIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M3 12h18M3 6h18M3 18h18' />
    </svg>
);

export default MenuIcon;
