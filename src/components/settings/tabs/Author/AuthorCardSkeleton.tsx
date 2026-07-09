import React from 'react';

interface AuthorCardSkeletonProps {
    count?: number;
}

const AuthorCardSkeleton: React.FC<AuthorCardSkeletonProps> = ({ count = 3 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className='flex flex-row justify-between items-center bg-white border border-[#EDEDED] rounded-2xl p-4 w-full min-h-[96px]'
                >
                    <div className='flex items-center gap-4 min-w-0 w-full'>
                        <div className='w-14 h-14 shrink-0 rounded-full bg-[#EFEFEF] animate-pulse' />
                        <div className='flex flex-col gap-2 min-w-0 w-full'>
                            <div className='h-3.5 w-1/2 rounded bg-[#EFEFEF] animate-pulse' />
                            <div className='h-4 w-20 rounded-full bg-[#F3F3F3] animate-pulse' />
                            <div className='h-3 w-1/3 rounded bg-[#F3F3F3] animate-pulse' />
                        </div>
                    </div>
                    <div className='flex items-center gap-2 shrink-0'>
                        <div className='w-9 h-9 rounded-full bg-[#EFEFEF] animate-pulse' />
                        <div className='w-9 h-9 rounded-full bg-[#EFEFEF] animate-pulse' />
                    </div>
                </div>
            ))}
        </>
    );
};

export default AuthorCardSkeleton;
