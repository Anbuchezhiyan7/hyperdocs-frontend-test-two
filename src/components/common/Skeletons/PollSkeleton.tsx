import React from 'react';
import { Skeleton } from 'antd';

const PollSkeleton: React.FC = () => {
    return (
        <div className='flex flex-col gap-4 w-full !p-0'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <Skeleton.Input
                        active
                        size='large'
                        style={{ width: '100%', marginBottom: '4px' }}
                    />
                    <Skeleton.Input
                        active
                        size='large'
                        style={{ width: '100%', marginBottom: '4px' }}
                    />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <Skeleton.Input
                        active
                        size='large'
                        style={{ width: '100%', marginBottom: '4px' }}
                    />
                    <Skeleton.Input
                        active
                        size='large'
                        style={{ width: '100%', marginBottom: '4px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PollSkeleton;
