'use client';

import React from 'react';

const Template1Skeleton: React.FC = () => {
    return (
        <div className='container-custom py-16'>
            <div className='space-y-6'>
                <div className='space-y-4 flex flex-col items-center'>
                    <div className='h-12 w-1/5 rounded-xl bg-gray-200 animate-pulse'></div>
                    <div className='h-5 w-3/5 rounded-full bg-gray-200 animate-pulse'></div>
                            <div className='h-5 w-3/5 rounded-full bg-gray-200 animate-pulse'></div>
                </div>

                <div className='grid gap-6 lg:grid-cols-3'>
                    {[1, 2].map(index => (
                        <div
                            key={index}
                            className={`space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm ${
                                index === 1 ? 'lg:col-span-2' : 'lg:col-span-1'
                            }`}
                        >
                            <div className='h-48 rounded-3xl bg-gray-200 animate-pulse'></div>
                            <div className='space-y-3'>
                                <div className='h-5 w-3/4 rounded-full bg-gray-200 animate-pulse'></div>
                                <div className='h-4 w-1/2 rounded-full bg-gray-200 animate-pulse'></div>
                                <div className='h-4 w-1/3 rounded-full bg-gray-200 animate-pulse'></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='space-y-4'>
                    <div className='h-8 w-44 rounded-full bg-gray-200 animate-pulse'></div>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                        {[1, 2, 3, 4].map(index => (
                            <div key={index} className='space-y-3 rounded-3xl border border-gray-200 bg-white p-5'>
                                <div className='h-36 rounded-3xl bg-gray-200 animate-pulse'></div>
                                <div className='h-4 w-5/6 rounded-full bg-gray-200 animate-pulse'></div>
                                <div className='h-4 w-2/3 rounded-full bg-gray-200 animate-pulse'></div>
                                <div className='flex items-center gap-2'>
                                    <div className='h-8 w-8 rounded-full bg-gray-200 animate-pulse'></div>
                                    <div className='h-4 w-1/3 rounded-full bg-gray-200 animate-pulse'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Template1Skeleton;
