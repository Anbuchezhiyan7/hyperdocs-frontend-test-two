'use client';

import { cn, withRef } from '@udecode/cn';
import { PlateElement, withHOC, PlateRenderElementProps } from '@udecode/plate/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { useDraggable } from '@udecode/plate-dnd';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'react-hot-toast';
import { useSendData } from '@/config/query.config';
import { FAQ_ELEMENT } from './faq-plugin';
import useFAQService from '@/services/faq.service';
import FAQComponent from './FAQComponent';
import { AISuggestionBanner } from '@/components/plate-ui/ai-suggestion-banner';
import { BannerSkeleton } from '@/components/common/Skeletons';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSuggestionService } from '@/services/suggestion.service';
export interface FAQElementType extends FAQElementAttributes {
    type: typeof FAQ_ELEMENT;
    children: { text: '' }[];
}

export const FAQElement = withHOC(
    ResizableProvider,
    withRef<typeof PlateElement, PlateRenderElementProps>(({ className, ...props }, ref) => {
        const { id: blogId } = useParams();
        const editor = props.editor;
        const element = props.element;
        const readOnly = editor.api.isReadOnly();
        const { blog } = useAppStore();
        const { handleCreateFAQ, handleDeleteFAQ, isError, isDeletingFAQ } = useFAQService(
            blog?.blog_id
        );
        const { handleAcceptOrDeclineSuggestion } = useSuggestionService();

        const { mutate: createFAQ, isPending: isCreatingFAQ } = useSendData({
            fn: () => handleCreateFAQ(),
            invalidateKey: ['faq'],
            success: data => {
                editor.tf.setNodes(
                    { is_ai_suggested: false, plugin_data_id: data.faq_id },
                    { at: editor.api.findPath(element) }
                );
            },
            error: error => {
                editor.tf.removeNodes({ at: editor.api.findPath(element) });
                const errorMessage = error?.message || error?.data?.detail || 'Error creating faq';
                toast.error(errorMessage);
            },
        });

        // Only use drag and drop when not in read-only mode
        const dragDropHook = editor.api.isReadOnly() ? { isDragging: false, handleRef: undefined } : useDraggable({
            element: props.element,
        });
        const { isDragging, handleRef } = dragDropHook;

        const handleKeyDown = (e: React.KeyboardEvent) => {
            // If the event target is an input field, let it handle the event
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                e.stopPropagation();
            }
        };

        const handleRejectAISuggestion = () => {
            const path = editor.api.findPath(element);
            editor.tf.removeNodes({ at: path });

            handleAcceptOrDeclineSuggestion({
                blog_id: blogId as string,
                suggestion_type: 'faq',
                accept: false,
                faq_id: element.plugin_data_id as string,
            }).catch(() => {});
        };

        const handleApplyAISuggestion = () => {
            const path = editor.api.findPath(element);
            editor.tf.setNodes(
                { is_ai_suggested: false, isEditing: true, plugin_data_id: element.plugin_data_id },
                { at: path }
            );

            handleAcceptOrDeclineSuggestion({
                blog_id: blogId as string,
                suggestion_type: 'faq',
                accept: true,
                faq_id: element.plugin_data_id as string,
            }).catch(() => {});
        };

        useEffect(() => {
            if (element?.plugin_data_id === 'new') {
                createFAQ({});
            }
        }, []);

        return (
            <PlateElement
                ref={ref}
                className={cn(className, 'relative py-2.5', isDragging && 'opacity-50 bg-white')}
                onKeyDown={handleKeyDown}
                contentEditable={false}
                data-tour="faq-block"
                {...props}
            >
                <div ref={handleRef} className='mx-auto p-2 bg-white' contentEditable={false}>
                    {isCreatingFAQ ? (
                        <BannerSkeleton />
                    ) : element?.is_ai_suggested && !editor.api.isReadOnly() ? (
                        <AISuggestionBanner
                            type='faq'
                            onReject={handleRejectAISuggestion}
                            preview={
                                <FAQComponent
                                    element={element}
                                    isPreview={true}
                                    isReadOnly={editor.api.isReadOnly()}
                                />
                            }
                            onApply={handleApplyAISuggestion}
                        />
                    ) : (
                        <FAQComponent
                            element={element}
                            isPreview={false}
                            isReadOnly={editor.api.isReadOnly()}
                        />
                    )}
                </div>
            </PlateElement>
        );
    })
);
