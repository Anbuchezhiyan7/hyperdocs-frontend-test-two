import React from 'react';
import { Typography, Collapse, Empty } from 'antd';
import { PollSkeleton } from '@/components/common/Skeletons';
import { CustomPluginHeader } from '@/components/common/CustomPluginHeader';

const { Title, Text } = Typography;

interface FAQDisplayProps {
    faq: FAQ;
    className?: string;
    handleEdit: () => void;
    isLoading: boolean;
    isPreview?: boolean;
    onDelete: () => void;
    isDeleting: boolean;
}

export const FAQDisplay: React.FC<FAQDisplayProps> = ({
    faq,
    className,
    handleEdit,
    isLoading,
    isPreview,
    onDelete,
    isDeleting,
}) => {
    return (
        <div className="my-4 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                {!isPreview ? (
                    <CustomPluginHeader
                        title='Frequently Asked Questions'
                        showResultsAfterVoting={false}
                        onShowResultsChange={() => {}}
                        onSave={handleEdit}
                        onDelete={onDelete}
                        isDeletingPoll={isDeleting}
                        showCheckboxes={false}
                        saveBtnText='Edit'
                        deleteBtnText='Remove'
                    />
                ) : (
                    <h3 className="text-xl font-bold m-0 text-gray-800 tracking-tight">Frequently Asked Questions</h3>
                )}
            </div>

            <div className="p-1">
                {isLoading ? (
                    <PollSkeleton />
                ) : faq?.faq_data?.length > 0 ? (
                    <Collapse 
                        className="faq-collapse-editor border-none bg-transparent" 
                        accordion 
                        bordered={false}
                        expandIcon={({ isActive }) => (
                            <span className={`transition-transform duration-200 mt-1 ${isActive ? 'rotate-180' : ''}`}>
                                <svg fill="none" height="18" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        )}
                        expandIconPosition="end"
                        items={faq?.faq_data?.map((faqItem, idx) => ({
                            key: idx,
                            label: <span className="font-semibold text-[1.05rem] text-gray-800 leading-snug">{faqItem?.question}</span>,
                            children: (
                                <div className="text-gray-600 prose prose-sm max-w-none pb-2 pl-1">
                                    <p>{faqItem?.answer}</p>
                                </div>
                            ),
                            className: 'border-b border-gray-50 last:border-none px-2',
                            style: { background: 'white' }
                        }))}
                    />
                ) : null}
            </div>
        </div>
    );
};
