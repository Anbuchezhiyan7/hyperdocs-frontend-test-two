import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'antd';
import { DeleteOutlinedIcon, PlusOutlinedIcon } from '@/assets/icons';

import { cn } from '@udecode/cn';
import usePollService from '@/services/poll.service';
import { CustomPluginHeader } from '@/components/common/CustomPluginHeader';

interface PollCreatorProps {
    poll?: Poll;
    onSave: (poll: Poll) => void;
    onDelete: () => void;
    isDeletingPoll: boolean;
}

export const PollCreator: React.FC<PollCreatorProps> = ({
    poll,
    onSave,
    onDelete,
    isDeletingPoll,
}) => {
    const [form] = Form.useForm();
    const { handleDeletePollOption, isError } = usePollService(poll?.blog_id, poll?.poll_id);
    const [pollData, setPollData] = useState<any>({
        poll_id: '',
        poll_title: '',
        poll_description: '',
        poll_question: '',
        poll_options: [],
        show_results_after_voting: false,
    });

    useEffect(() => {
        if (poll) {
            setPollData({
                ...poll,
                poll_options: poll?.poll_options || [],
            });
        }
    }, [poll]);

    // Handle form field changes
    const handleFieldChange = (field: keyof Poll, value: any) => {
        setPollData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
        form.setFieldsValue({ [field]: value });
    };

    // Handle option changes
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollData.poll_options];
        newOptions[index] = { ...newOptions[index], option_title: value };
        setPollData((prev: any) => ({
            ...prev,
            poll_options: newOptions,
        }));
        form.setFieldsValue({ poll_options: newOptions });
    };

    const handleSubmit = (values: any) => {
        const updatedPoll: Poll = {
            ...pollData,
            ...values,
        };
        onSave(updatedPoll);
    };

    const addOption = () => {
        const newOptions = [...pollData.poll_options, { option_title: '', option_votes: 0 }];
        setPollData((prev: any) => ({
            ...prev,
            poll_options: newOptions,
        }));
        form.setFieldsValue({ poll_options: newOptions });
    };

    const removeOption = (index: number) => {
        if (pollData.poll_options[index].option_id) {
            handleDeletePollOption({
                pollId: poll?.poll_id as string,
                optionId: pollData.poll_options[index].option_id as string,
            });
            if (isError) {
                return;
            }
        }
        const newOptions = pollData.poll_options.filter((_: any, i: number) => i !== index);
        setPollData((prev: any) => ({
            ...prev,
            poll_options: newOptions,
        }));
        form.setFieldsValue({ poll_options: newOptions });
    };

    // Sync form with state
    useEffect(() => {
        form.setFieldsValue(poll);
    }, []);

    console.log('POLL DATA', poll);

    return (
        <div className='w-full '>
            <Form form={form} layout='vertical' initialValues={pollData} onFinish={handleSubmit}>
                <CustomPluginHeader
                    title='Poll Creation'
                    showResultsAfterVoting={pollData.show_results_after_voting}
                    onShowResultsChange={(e: any) =>
                        handleFieldChange('show_results_after_voting', e)
                    }
                    onSave={() => form.submit()}
                    onDelete={onDelete}
                    isDeletingPoll={isDeletingPoll}
                    showCheckboxes={true}
                />

                <div className='space-y-4'>
                    <input
                        name='poll_title'
                        type='text'
                        placeholder='Poll Title'
                        value={pollData?.poll_title}
                        onChange={e => handleFieldChange('poll_title', e.target.value)}
                        className={cn(
                            'w-full text-2xl font-bold bg-transparent border-none outline-none',
                            'placeholder:text-gray-400 focus:ring-0'
                        )}
                    />

                    <input
                        name='poll_description'
                        type='text'
                        placeholder='Description (Optional)'
                        value={pollData?.poll_description}
                        onChange={e => handleFieldChange('poll_description', e.target.value)}
                        className={cn(
                            'w-full text-lg text-gray-500 bg-transparent border-none outline-none',
                            'placeholder:text-gray-400 focus:ring-0'
                        )}
                    />

                    <Card className='mt-8'>
                        <div className='space-y-3'>
                            <input
                                name='poll_question'
                                type='text'
                                placeholder='Poll Heading'
                                value={pollData?.poll_question}
                                onChange={e => handleFieldChange('poll_question', e.target.value)}
                                className={cn(
                                    'w-full text-xl font-semibold bg-transparent border-none outline-none',
                                    'placeholder:text-gray-200 focus:ring-0'
                                )}
                            />
                            {pollData?.poll_options?.map((option: any, index: number) => (
                                <div
                                    key={pollData?.poll_options[index].option_id}
                                    className='flex items-center pl-2 gap-2'
                                >
                                    <input
                                        name={`${option.option_id}`}
                                        type='text'
                                        placeholder={`Option ${index + 1}`}
                                        value={option.option_title}
                                        onChange={e => handleOptionChange(index, e.target.value)}
                                        className={cn(
                                            'w-full text-lg !bg-transparent !border-none',
                                            'placeholder:text-gray-400 outline-none',
                                            'transition-colors py-2'
                                        )}
                                    />

                                    <Button
                                        type='text'
                                        loading={isDeletingPoll}
                                        icon={<DeleteOutlinedIcon />}   
                                        onClick={() => removeOption(index)}
                                        className='text-gray-400 hover:text-red-500'
                                    />
                                </div>
                            ))}

                            <div className='flex items-center justify-center'>
                                <Button
                                    disabled={pollData?.poll_options?.length >= 6}
                                    type='text'
                                    onClick={addOption}
                                    block
                                    icon={<PlusOutlinedIcon />}
                                    className='mt-4 select-none w-full px-0 focus:!bg-transparent !border-none flex items-center justify-start hover:!bg-transparent hover:border-none'
                                >
                                    Add Option
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        </div>
    );
};
