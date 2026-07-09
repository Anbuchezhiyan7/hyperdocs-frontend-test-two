'use client';

import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SparkleIcon } from '@/assets/icons';
import { Input } from '../common/Input';

interface SuggestionPopoverProps {
    content: string;
    onCancel: () => void;
    onApply: (content: string) => void;
    open: boolean;
    isLoading: boolean;
}

export function SuggestionPopover ({
    content,
    onCancel,
    onApply,
    open,
    isLoading,
}: SuggestionPopoverProps) {
    const [inputValue, setInputValue] = useState(content);

    console.log('SUGGESTION POPOVER', content);

    return (
        <Popover open={open} defaultOpen>
            <PopoverTrigger asChild>
                <div className='w-full h-full'></div>
            </PopoverTrigger>
            <PopoverContent
                align='start'
                className='!min-w-[800px] border border-gray-200 rounded-lg p-4 mt-4'
            >
                <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                        <SparkleIcon className='w-5 h-5' />
                        <h4 className='font-medium'> Suggested</h4>
                    </div>
                    <Input
                        inputType='textarea'
                        name='suggestion'
                        value={inputValue}
                        onChange={value => setInputValue(value)}
                        placeholder='Enter your suggestion'
                        rows={6}
                        disabled={isLoading}
                    />
                    <div className='flex justify-end space-x-2'>
                        <Button disabled={isLoading} variant='outline' onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={() => onApply(inputValue)}>
                            {isLoading ? 'Applying...' : 'Make Changes'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
