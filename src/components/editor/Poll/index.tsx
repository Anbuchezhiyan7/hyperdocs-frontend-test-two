'use client';

import { cn, withRef } from '@udecode/cn';
import { PlateElement, withHOC, PlateRenderElementProps } from '@udecode/plate/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { useDraggable } from '@udecode/plate-dnd';
import { POLL_ELEMENT_TYPE } from './poll-plugin';
import { useEffect } from 'react';
import usePollService from '@/services/poll.service';
import { useAppStore } from '@/store/useAppStore';
import { AISuggestionBanner } from '@/components/plate-ui/ai-suggestion-banner';
import { toast } from 'react-hot-toast';
import { useSendData } from '@/config/query.config';
import { BannerSkeleton } from '@/components/common/Skeletons';
import PollComponent from './PollComponent';
import { useSuggestionService } from '@/services/suggestion.service';
export interface PollElementType extends PollElementAttributes {
    type: typeof POLL_ELEMENT_TYPE;
    children: { text: '' }[];
}

export const PollElement = withHOC(
    ResizableProvider,
    withRef<typeof PlateElement, PlateRenderElementProps>(({ className, ...props }, ref) => {
        const editor = props.editor;
        const element = props.element;
        console.log('POLL ELEMENT', element);
        const { blog } = useAppStore();
        const { handleAcceptOrDeclineSuggestion } = useSuggestionService();
        const { handleCreatePoll, handleDeletePoll, isError, isDeletingPoll } = usePollService(
            blog?.blog_id
        );

        const { mutate: createPoll, isPending: isCreatingPoll } = useSendData({
            fn: () => handleCreatePoll(),
            invalidateKey: ['poll'],
            success: data => {
                editor.tf.setNodes(
                    { is_ai_suggested: false, plugin_data_id: data.poll_id },
                    { at: editor.api.findPath(element) }
                );
            },
            error: error => {
                editor.tf.removeNodes({ at: editor.api.findPath(element) });
                const errorMessage = error?.message || error?.data?.detail || 'Error creating poll';
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
                blog_id: blog?.blog_id as string,
                suggestion_type: 'poll',
                accept: false,
                poll_id: element.plugin_data_id as string,
            }).catch(() => {});
        };

        const handleApplyAISuggestion = () => {
            const path = editor.api.findPath(element);
            editor.tf.setNodes(
                { is_ai_suggested: false, isEditing: true, plugin_data_id: element.plugin_data_id },
                { at: path }
            );

            handleAcceptOrDeclineSuggestion({
                blog_id: blog?.blog_id as string,
                suggestion_type: 'poll',
                accept: true,
                poll_id: element.plugin_data_id as string,
            }).catch(() => {});
        };

        useEffect(() => {
            if (element?.plugin_data_id === 'new') {
                createPoll({});
            }
        }, []);

        return (
            <PlateElement
                ref={ref}
                className={cn(className, 'relative py-2.5', isDragging && 'opacity-50 bg-white')}
                onKeyDown={handleKeyDown}
                contentEditable={false}
                data-tour="poll-block"
                {...props}
            >
                <div ref={handleRef} className='mx-auto p-2 bg-white' contentEditable={false}>
                    {isCreatingPoll ? (
                        <BannerSkeleton />
                    ) : element?.is_ai_suggested && !editor.api.isReadOnly() ? (
                        <AISuggestionBanner
                            type='poll'
                            onReject={handleRejectAISuggestion}
                            preview={
                                <PollComponent
                                    element={element}
                                    isPreview
                                    isReadOnly={editor.api.isReadOnly()}
                                />
                            }
                            onApply={handleApplyAISuggestion}
                        />
                    ) : (
                        <PollComponent
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
