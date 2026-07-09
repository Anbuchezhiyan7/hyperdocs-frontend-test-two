import { useSendData } from '@/config/query.config';
import leadMagnetsApi from '@/api/lead-magnet.api';
import { cn } from '@/lib/utils';
import useLeadMagnetService from '@/services/lead-magnet.service';
import { useQuery } from '@tanstack/react-query';
import { ResizableProvider } from '@udecode/plate-resizable';
import { PlateElement, withHOC, withRef } from '@udecode/plate/react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { AISuggestionBanner } from '@/components/plate-ui/ai-suggestion-banner';
import LeadMagnetComponent from './LeatMagnetComponent';
import { useQueryState } from 'nuqs';
import { useSuggestionService } from '@/services/suggestion.service';
import { useParams } from 'next/navigation';

const LeadMagnetElement = withHOC(
    ResizableProvider,
    withRef<typeof PlateElement>(({ className, ...props }, ref) => {
        const editor = props.editor;
        const element = props.element as any;
        const [mode, setMode] = useQueryState('mode');
        const [idParam, setLeadMagnetId] = useQueryState('id');
        const { id } = useParams();
        const leadMagnetId = element?.plugin_data_id;

        const {
            isError,
            handleDeleteLeadMagnet,
            handleCreateLeadMagnet,
            isDeletingLeadMagnet,
            handleUpdateLeadMagnet,
            isLoading: isUpdatingLeadMagnet,
        } = useLeadMagnetService(leadMagnetId as string);

        const { handleAcceptOrDeclineSuggestion } = useSuggestionService();

        const {
            data: leadMagnet,
            isLoading,
            refetch,
            isRefetching,
        } = useQuery({
            queryKey: ['lead-magnet', leadMagnetId],
            queryFn: () => leadMagnetsApi.handleGetLeadMagnet(leadMagnetId as string),
            enabled: leadMagnetId !== 'new',
        });

        const { mutate: createLeadMagnet, isPending: isCreatingLeadMagnet } = useSendData({
            fn: () => handleCreateLeadMagnet(),
            invalidateKey: ['lead-magnet'],
            success: data => {
                editor.tf.setNodes(
                    { is_ai_suggested: false, plugin_data_id: data.lead_magnet_id, lead_magnet_type: data.template_type },
                    { at: editor.api.findPath(element) }
                );
            },
            error: error => {
                editor.tf.removeNodes({ at: editor.api.findPath(element) });
                toast.error(error || 'Error creating banner');
            },
        });

        useEffect(() => {
            if (leadMagnet) {
                const actualType = leadMagnet.template_type === 'newsletter' || 
                                  leadMagnet.template_type === 'news-letter' || 
                                  leadMagnet?.details?.lead_magnet_template_id === 'blog-lead-magnet-4'
                                    ? 'newsletter'
                                    : (leadMagnet.template_type || 'upload_pdf');

                if (element.lead_magnet_type !== actualType) {
                    editor.tf.setNodes(
                        { lead_magnet_type: actualType },
                        { at: editor.api.findPath(element) }
                    );
                }
            }
        }, [leadMagnet, element.lead_magnet_type]);

        useEffect(() => {
            if (element?.plugin_data_id === 'new') {
                createLeadMagnet({});
            }
        }, []);

        const handleRejectAISuggestion = () => {
            handleModifySuggestion('reject');

            handleAcceptOrDeclineSuggestion({
                blog_id: id as string,
                suggestion_type: 'lead_magnet',
                accept: false,
                lead_magnet_id: element.plugin_data_id as string,
            }).catch(() => {});
        };

        const handleApplyAISuggestion = () => {
            if (element.is_ai_suggested) {
                handleModifySuggestion('accept');
                setMode('lead-magnet-ai');
                setLeadMagnetId(element.plugin_data_id as string);

                handleAcceptOrDeclineSuggestion({
                    blog_id: id as string,
                    suggestion_type: 'lead_magnet',
                    accept: true,
                    lead_magnet_id: element.plugin_data_id as string,
                }).catch(() => {});

                return;
            }

            createLeadMagnet({});
        };

        const handleModifySuggestion = (type: 'accept' | 'reject') => {
            const nodes = editor.children;
            const LeadMagnetNodes = nodes.filter(
                (node: any) =>
                    node.type === 'lead_magnet' && node.plugin_data_id === element.plugin_data_id
            );

            if (LeadMagnetNodes.length > 0 && type === 'accept') {
                LeadMagnetNodes.forEach((node: any) => {
                    editor.tf.setNodes(
                        {
                            is_ai_suggested: false,
                            isEditing: false,
                            plugin_data_id: element.plugin_data_id,
                        },
                        { at: editor.api.findPath(node) }
                    );
                });
            }

            if (LeadMagnetNodes.length > 0 && type === 'reject') {
                editor.tf.setValue(
                    nodes.filter(
                        (node: any) =>
                            node.type !== 'lead_magnet' &&
                            node?.plugin_data_id !== element.plugin_data_id
                    )
                );
            }
        };

        console.log('LEAD MAGNET', element);
        return (
            <PlateElement ref={ref} className={cn(className, 'py-2.5')} data-tour="lead-magnet-block" {...props}>
                {element.is_ai_suggested ? (
                    <AISuggestionBanner
                        type='lead-magnet'
                        onApply={handleApplyAISuggestion}
                        onReject={handleRejectAISuggestion}
                        preview={
                            <LeadMagnetComponent
                                element={element}
                                isPreview={true}
                                readOnly={editor.api.isReadOnly()}
                                loading={isLoading}
                                leadMagnet={leadMagnet}
                            />
                        }
                    />
                ) : (
                    <LeadMagnetComponent
                        element={element}
                        isPreview={false}
                        readOnly={editor.api.isReadOnly()}
                        leadMagnet={leadMagnet}
                        loading={isLoading}
                    />
                )}
            </PlateElement>
        );
    })
);

export default LeadMagnetElement;
