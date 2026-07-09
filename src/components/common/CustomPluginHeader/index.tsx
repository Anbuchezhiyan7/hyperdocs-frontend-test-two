import React from 'react';
import { Button } from 'antd';
import AntTabs from '@/components/common/AntTabs';
import { Input } from '@/components/common/Input';

interface CustomPluginHeaderProps {
    showResultsAfterVoting: boolean;
    onShowResultsChange: (e: any) => void;
    onSave: () => void;
    onDelete: () => void;
    isDeletingPoll: boolean;
    showCheckboxes: boolean;
    title: string;
    saveBtnText?: string;
    deleteBtnText?: string;
}

export const CustomPluginHeader: React.FC<CustomPluginHeaderProps> = ({
    showResultsAfterVoting,
    onShowResultsChange,
    onSave,
    onDelete,
    isDeletingPoll,
    showCheckboxes,
    title,
    saveBtnText,
    deleteBtnText,
}) => {
    return (
        <div className='flex mb-4 border-b border-gray-200 justify-between'>
            <AntTabs items={[{ key: '1', label: title }]} />
            <div className='flex items-center gap-2'>
                {showCheckboxes && (
                    <div className='flex items-center gap-2'>
                        <Input
                            variant='single'
                            value={showResultsAfterVoting}
                            onChange={onShowResultsChange}
                            name='show_results_after_voting'
                            inputType='checkbox'
                            label='Show results after voting'
                            className='!flex-row-reverse items-center !mb-0'
                        />
                    </div>
                )}
                <Button
                    type='default'
                    className='p-3 rounded-lg py-4 bg-error text-white !select-none'
                    htmlType='button'
                    size='small'
                    onClick={onDelete}
                    loading={isDeletingPoll}
                >
                    {deleteBtnText || 'Remove'}
                </Button>
                <Button
                    type='primary'
                    className='p-3 rounded-lg py-4 !select-none'
                    htmlType='submit'
                    size='small'
                    onClick={onSave}
                >
                    {saveBtnText || 'Save'}
                </Button>
            </div>
        </div>
    );
};
