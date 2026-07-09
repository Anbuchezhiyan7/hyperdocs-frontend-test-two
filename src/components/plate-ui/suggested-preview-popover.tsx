'use client';

import Button from '../common/Buttons';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SparkleIcon } from '@/assets/icons';

interface SuggestedPreviewPopoverProps {
    onCancel: () => void;
    onApply: () => void;
    open: boolean;
    preview: React.ReactNode;
    isLoading?: boolean;
}

export function SuggestedPreviewPopover({
    onCancel,
    onApply,
    open,
    preview,
    isLoading,
}: SuggestedPreviewPopoverProps) {
    return (
        <>
            {preview}
            <Popover open={open} defaultOpen>
                <PopoverTrigger asChild>
                    <div className="w-full h-full"></div>
                </PopoverTrigger>
                {!isLoading && (
                    <PopoverContent
                        align="end"
                        className="w-fit border border-gray-200 rounded-lg "
                    >
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <SparkleIcon className="w-4 h-4" />
                                <h4 className="font-medium text-sm"> Suggested:</h4>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outlined"
                                    className="rounded-lg"
                                    size="large"
                                    rootClassName="!px-6"
                                    onClick={onCancel}
                                >
                                    Reject
                                </Button>
                                <Button
                                    size="large"
                                    type="primary"
                                    className="rounded-lg px-7"
                                    onClick={onApply}
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                )}
            </Popover>
        </>
    );
}
