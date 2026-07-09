import React from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';

import { EmptyBar } from '@/assets/images/index';
import { cn } from '@udecode/cn';
import { Button } from '@/components/plate-ui/button';

interface BannerPlaceholderProps {
    icon?: React.ComponentType<{ className?: string }>;
    text?: string;
    onAccept?: (e: any) => void;
    onReject?: () => void;
}

const BannerPlaceholder: React.FC<BannerPlaceholderProps> = ({
    icon: Icon,
    text,
    onAccept,
    onReject,
}) => {
    return (
        <div
            className={cn(
                'w-full cursor-pointer my-[10px] relative flex flex-col rounded-lg justify-center items-start p-5 gap-[10px]',
                'h-auto min-h-[64px] group'
            )}
            contentEditable={false}
        >
            <Image
                src={EmptyBar.src}
                alt='Empty bar'
                className='absolute object-cover object-center rounded-xl inset-0 w-full h-full'
                priority
                width={100}
                height={100}
            />
            <div className='flex items-center justify-between w-full z-10'>
                <div className='flex flex-row items-center gap-2'>
                    {Icon && <Icon className='text-white w-[24px] h-[24px]' />}
                    <p className='text-white text-[20px] select-none leading-normal font-[600]'>
                        {text}
                    </p>
                </div>
                <div className='flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={e => {
                            e.stopPropagation();
                            onAccept?.(e);
                        }}
                        contentEditable={false}
                        className='hover:bg-green-100 hover:text-green-600 bg-white/90'
                    >
                        <Plus className='h-4 w-4 ' />
                        Add
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        contentEditable={false}
                        className='hover:bg-red-100 hover:text-red-600 bg-white/90'
                        onClick={e => {
                            e.stopPropagation();
                            onReject?.();
                        }}
                    >
                        <Trash2 className='h-4 w-4 ' />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BannerPlaceholder;
