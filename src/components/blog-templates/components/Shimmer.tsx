import React from 'react';

interface ShimmerProps {
    className?: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className='bg-gray-200 rounded-lg h-full w-full'></div>
        </div>
    );
};

export default Shimmer;
