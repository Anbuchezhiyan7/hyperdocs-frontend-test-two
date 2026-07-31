import React from 'react';

/** Search icon, sized by the surrounding text. */
const SearchIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3' />
    </svg>
);

export default SearchIcon;
