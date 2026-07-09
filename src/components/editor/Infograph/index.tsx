'use client';

import { useEffect } from 'react';
import { cn, withRef } from '@udecode/cn';
import { PlateElement, withHOC } from '@udecode/plate/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { useMediaState, ImagePlugin } from '@udecode/plate-media/react';

import { MediaPopover } from '../../plate-ui/media-popover';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import useInfographService from '@/services/infograph.service';
import { AISuggestionBanner } from '@/components/plate-ui/ai-suggestion-banner';
import { useSendData } from '@/config/query.config';
import InfographComponent from './InfographComponent';
import BannerAlignment from '@/components/plate-ui/banner-alignment';
import { useQuery } from '@tanstack/react-query';
import infographsApi from '@/api/infograph.api';
import { useParams } from 'next/navigation';
import { useSuggestionService } from '@/services/suggestion.service';

export const InfographElement = withHOC(
    ResizableProvider,
    withRef<typeof PlateElement>(({ className, ...props }, ref) => {
        const editor = props.editor;
        const element = props.element as any;
        const { blog } = useAppStore();
        const {
            isError,
            handleDeleteInfograph,
            handleCreateInfograph,
            isDeletingInfograph,
            handleUpdateInfograph,
            isLoading: isUpdatingInfograph,
        } = useInfographService(element?.plugin_data_id);
        const { id: blogId } = useParams();
        const { handleAcceptOrDeclineSuggestion } = useSuggestionService();
        const infograph_id = element?.plugin_data_id;

        const { data: infograph, isLoading } = useQuery({
            queryKey: ['infograph', infograph_id],
            queryFn: () => infographsApi.handleGetInfograph(infograph_id as string),
            enabled: !!infograph_id && infograph_id !== 'new',
        });

        const { mutate: createInfograph, isPending: isCreatingInfograph } = useSendData({
            fn: () => handleCreateInfograph(),
            invalidateKey: ['infograph'],
            success: data => {
                editor.tf.setNodes(
                    { is_ai_suggested: false, plugin_data_id: data.infograph_id },
                    { at: editor.api.findPath(element) }
                );
            },
            error: error => {
                editor.tf.removeNodes({ at: editor.api.findPath(element) });
                const errorMessage = error?.message || error?.data?.detail || 'Error creating infograph';
                toast.error(errorMessage);
            },
        });

        useEffect(() => {
            if (element?.plugin_data_id === 'new') {
                createInfograph({});
            }
        }, []);

        const { align = 'center', focused, readOnly, selected } = useMediaState();

        const handleDelete = async () => {
            await handleDeleteInfograph({ infographId: element?.plugin_data_id });

            if (isError) {
                toast.error('Error deleting infograph');
                return;
            }

            const path = editor.api.findPath(element);
            editor.tf.removeNodes({ at: path });
        };

        const handleRejectAISuggestion = () => {
            const path = editor.api.findPath(element);
            editor.tf.removeNodes({ at: path });

            handleAcceptOrDeclineSuggestion({
                blog_id: blogId as string,
                suggestion_type: 'info_graph',
                accept: false,
                infograph_id: element.plugin_data_id,
            }).catch(() => {});
        };

        const handleApplyAISuggestion = () => {
            const path = editor.api.findPath(element);
            if (element.is_ai_suggested) {
                editor.tf.setNodes(
                    {
                        is_ai_suggested: false,
                        isEditing: false,
                        plugin_data_id: element.plugin_data_id,
                    },
                    { at: path }
                );

                handleAcceptOrDeclineSuggestion({
                    blog_id: blogId as string,
                    suggestion_type: 'info_graph',
                    accept: true,
                    infograph_id: element.plugin_data_id,
                }).catch(() => {});
                return;
            }

            createInfograph({});
        };

        return (
            <PlateElement ref={ref} className={cn(className, 'py-2.5')} data-tour="infograph-block" {...props}>
                {element.is_ai_suggested && !readOnly ? (
                    <AISuggestionBanner
                        type='infograph'
                        onApply={handleApplyAISuggestion}
                        onReject={handleRejectAISuggestion}
                        preview={
                            <InfographComponent
                                infograph={infograph}
                                readOnly={true}
                                element={element}
                                isPreview
                                loading={isLoading}
                            />
                        }
                    />
                ) : (
                    <MediaPopover
                        plugin={ImagePlugin}
                        hideOverlay={true}
                        onDelete={() => handleDelete()}
                    >
                        <figure className='group relative m-0 ' contentEditable={false}>
                            <div className='relative'>
                                <BannerAlignment
                                    align={align}
                                    readOnly={
                                        readOnly ||
                                        (!infograph?.infograph_url && !infograph?.infograph_type)
                                    }
                                    handleDelete={handleDelete}
                                    element={element}
                                />
                                <InfographComponent
                                    readOnly={readOnly}
                                    element={element}
                                    isPreview={false}
                                    loading={isCreatingInfograph || isLoading}
                                    infograph={infograph}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </figure>
                    </MediaPopover>
                )}
            </PlateElement>
        );
    })
);
