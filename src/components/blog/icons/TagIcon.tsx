import React from 'react';

/** Tag icon, sized by the surrounding text. */
const TagIcon: React.FC<{ size?: number; className?: string }> = ({
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
        <path d='M20.6 13.4L12 22l-9-9V3h10zM7 7h.01' />
    </svg>
);

export default TagIcon;
