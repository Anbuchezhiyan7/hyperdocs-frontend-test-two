import React from 'react';

const FieldSkeleton: React.FC<{ full?: boolean; tall?: boolean }> = ({ full, tall }) => (
    <div className={`flex flex-col gap-2 ${full ? 'col-span-2' : 'col-span-1'}`}>
        <div className='h-3 w-24 rounded bg-[#F3F3F3] animate-pulse' />
        <div
            className={`${tall ? 'h-20' : 'h-10'} w-full rounded-xl bg-[#EFEFEF] animate-pulse`}
        />
    </div>
);

const SectionSkeleton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className='w-full flex flex-col gap-3'>
        <div className='h-3 w-32 rounded bg-[#F3F3F3] animate-pulse' />
        <div className='grid grid-cols-2 w-full gap-x-4 gap-y-4'>{children}</div>
    </div>
);

const AuthorFormSkeleton: React.FC = () => {
    return (
        <div className='flex w-full flex-col gap-7'>
            <SectionSkeleton>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton full tall />
                <FieldSkeleton full tall />
            </SectionSkeleton>
            <SectionSkeleton>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
            </SectionSkeleton>
        </div>
    );
};

export default AuthorFormSkeleton;
