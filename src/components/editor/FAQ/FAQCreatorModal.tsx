import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import Button from '@/components/common/Buttons';
import { Input } from '@/components/common/Input';
import { DeleteIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';

interface FAQCreatorModalProps {
    isOpen: boolean;
    initialFAQs?: FAQItem[];
    onSave: (faqs: FAQItem[]) => void;
    onClose: () => void;
}

export const FAQCreatorModal: React.FC<FAQCreatorModalProps> = ({
    isOpen,
    initialFAQs = [],
    onSave,
    onClose,
}) => {
    console.log('INITIAL', initialFAQs);

    const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs ? initialFAQs : []);
    const [form] = Form.useForm();

    const handleFieldChange = (index: number, field: keyof FAQItem, value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFaqs(newFaqs);
    };

    const addFAQ = () => {
        setFaqs((prevFaqs: any) => [...prevFaqs, { question: '', answer: '' }]);
    };

    const removeFAQ = (index: number) => {
        setFaqs((prevFaqs: Array<any>) => prevFaqs.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        const filteredFaqs = faqs.filter((faq: any) => faq.question.trim() && faq.answer.trim());
        console.log('Filtered', filteredFaqs);

        await onSave(filteredFaqs);
    };

    useEffect(() => {
        setFaqs(initialFAQs || []);
    }, [isOpen]);

    const headerComponent = (
        <div className='flex items-center justify-between w-[95%]'>
            <div className='text-lg font-bold'>Frequently asked questions</div>
            <Button
                type='primary'
                size='small'
                color='primary'
                onClick={addFAQ}
                className='text-sm rounded-lg h-[32px] w-fit px-4'
                title='Add new'
            />
        </div>
    );

    return (
        <CenteredModal
            isOpen={isOpen}
            onClose={onClose}
            title='Frequently asked questions'
            width={800}
            contentClassName='!h-full !p-0'
            childrenClassName='!h-full !p-0'
            headerComponent={headerComponent}
            footerPriBtnProps={{
                onClick: handleSave,
            }}
        >
            <Form className='max-h-[300px] overflow-y-auto' form={form} layout='vertical'>
                {faqs?.length > 0 ? (
                    faqs?.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                'border-b border-gray-200 p-6 !flex gap-2',
                                index === faqs.length - 1 && 'border-b-0'
                            )}
                        >
                            <div className='flex flex-1 flex-col gap-2 items-center justify-between'>
                                <Input
                                    name='question'
                                    inputType='text'
                                    placeholder='Enter question'
                                    value={faq.question}
                                    onChange={value => handleFieldChange(index, 'question', value)}
                                    label='Question'
                                />
                                <Input
                                    name='answer'
                                    inputType='textarea'
                                    placeholder='Enter answer'
                                    value={faq.answer}
                                    onChange={value => handleFieldChange(index, 'answer', value)}
                                    label='Answer'
                                />
                            </div>
                            <Button
                                type='text'
                                icon={<DeleteIcon />}
                                onClick={() => removeFAQ(index)}
                                className='bg-none !p-0'
                            />
                        </div>
                    ))
                ) : (
                    <div className='flex items-center justify-center h-full'>
                        <div className='text-gray-500'>No FAQs</div>
                    </div>
                )}
            </Form>
        </CenteredModal>
    );
};
