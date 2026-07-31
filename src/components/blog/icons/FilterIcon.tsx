import React from 'react';

/** Filter icon, sized by the surrounding text. */
const FilterIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M22 3H2l8 9.46V19l4 2v-8.54z' />
    </svg>
);

export default FilterIcon;
