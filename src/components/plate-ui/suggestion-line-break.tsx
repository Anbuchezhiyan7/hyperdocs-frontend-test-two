'use client';
import React, { useEffect } from 'react';

import { type RenderNodeWrapper, useEditorRef } from '@udecode/plate/react';

import { type SuggestionConfig } from '@/components/editor/plugins/suggestion-plugin';
import { SuggestionPopover } from './suggestion-popover';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { CUSTOM_BLOCKS } from './slash-input-element';
import { useParams } from 'next/navigation';
import { useSuggestionService } from '@/services/suggestion.service';

export const SuggestionBelowNodes: RenderNodeWrapper<SuggestionConfig> = ({ api, element }) => {
    const editor = useEditorRef();

    const isAiSuggestedAndNotCustomBlock =
        element?.is_ai_suggested &&
        !CUSTOM_BLOCKS.includes(element?.type as any) &&
        !api.isReadOnly();

    const { id } = useParams();
    const {
        handleAcceptOrDeclineSuggestion,
        isLoading,
        isError: isAcceptingOrDecliningError,
    } = useSuggestionService();

    useEffect(() => {
        if (!isAiSuggestedAndNotCustomBlock) return;
        editor.getApi(BlockSelectionPlugin).blockSelection.set(element?.id as string);
    }, [isAiSuggestedAndNotCustomBlock]);

    if (!isAiSuggestedAndNotCustomBlock) return;

    const handleApply = async (value: string) => {
        console.log('HANDLE APPLY', value, element);
        const values = editor.children;

        await handleAcceptOrDeclineSuggestion({
            blog_id: id as string,
            suggestion_type: element?.suggestion_type as string,
            accept: true,
        });
        if (isAcceptingOrDecliningError) {
            return;
        }
        editor.tf.setValue(
            values?.map((ele: any) => {
                if (ele?.id === element?.id) {
                    return {
                        ...ele,
                        children: [{ text: value }],
                        is_ai_suggested: false,
                        suggested_content: null,
                    };
                }
                return ele;
            })
        );
    };

    const handleReject = async () => {
        await handleAcceptOrDeclineSuggestion({
            blog_id: id as string,
            suggestion_type: element?.suggestion_type as string,
            accept: false,
        });

        if (isAcceptingOrDecliningError) {
            return;
        }

        if (element?.is_new_line) {
            editor.tf.removeNodes({ at: editor.api.findPath(element) });
        } else {
            editor.tf.setNodes(
                {
                    is_ai_suggested: false,
                    suggested_content: null,
                },
                { at: editor.api.findPath(element) }
            );
        }
    };

    return function Component ({ children }) {
        return (
            <React.Fragment>
                {children}
                <SuggestionPopover
                    content={element?.suggested_content as any}
                    onCancel={handleReject}
                    onApply={handleApply}
                    isLoading={isLoading}
                    open={!!isAiSuggestedAndNotCustomBlock}
                />
            </React.Fragment>
        );
    };
};
