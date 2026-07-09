'use client';

import { cn, withRef } from '@udecode/cn';
import { PlateElement, withHOC } from '@udecode/plate/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { useMediaState, ImagePlugin } from '@udecode/plate-media/react';
import { MediaPopover } from '../../plate-ui/media-popover';
import useBannerService from '@/services/banner.service';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { AISuggestionBanner } from '@/components/plate-ui/ai-suggestion-banner';
import { useSendData } from '@/config/query.config';
import BannerComponent from './BannerComponent';
import BannerAlignment from '@/components/plate-ui/banner-alignment';
import bannersApi from '@/api/banner.api';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSuggestionService } from '@/services/suggestion.service';
import { useParams } from 'next/navigation';
import { handleConvertBannerComponentToImage } from './helper';
import useBlogService from '@/services/blog.service';

export const BannerElement = withHOC(
    ResizableProvider,
    withRef<typeof PlateElement>(({ className, ...props }, ref) => {
        const { id: blogId } = useParams();
        const editor = props.editor;
        const element = props.element as any;
        const bannerId = element?.plugin_data_id;
        const { blog } = useAppStore();
        const { updateBlog } = useBlogService();
        const {
            isError,
            handleDeleteBanner,
            handleUpdateBanner,
            isDeletingBanner,
            isLoading: isUpdating,
            handleCreateBanner,
        } = useBannerService(blog?.blog_id, bannerId);
        const { handleAcceptOrDeclineSuggestion } = useSuggestionService();

        useEffect(() => {
            if (element?.plugin_data_id === 'new') {
                createBanner({});
            }
        }, [bannerId]);

        const { data: banner, isLoading } = useQuery({
            queryKey: ['banner', bannerId],
            queryFn: () => bannersApi.handleGetBanner(bannerId),
            enabled: bannerId !== 'new',
        });

        const { mutate: createBanner, isPending: isCreatingBanner } = useSendData({
            fn: () => handleCreateBanner(),
            invalidateKey: ['banner'],
            success: data => {
                editor.tf.setNodes(
                    { is_ai_suggested: false, plugin_data_id: data.banner_id },
                    { at: editor.api.findPath(element) }
                );
            },
            error: error => {
                editor.tf.removeNodes({ at: editor.api.findPath(element) });
                const errorMessage =
                    error?.message || error?.data?.detail || 'Error creating banner';
                console.log('ERROR MESSAGE', errorMessage, error?.data?.detail, error?.message);
                toast.error(errorMessage);
            },
        });

        const { align = 'center', focused, readOnly, selected } = useMediaState();

        const handleDelete = async () => {
            await handleDeleteBanner({ bannerId: element?.plugin_data_id });

            if (isError) {
                toast.error('Error deleting banner');
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
                suggestion_type: 'banner',
                accept: false,
                banner_id: element.plugin_data_id,
            }).catch(() => {});
        };

        const handleApplyAISuggestion = () => {
            if (!element.is_ai_suggested) return;

            const path = editor.api.findPath(element);
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
                suggestion_type: 'banner',
                accept: true,
                banner_id: element.plugin_data_id,
            })
                .then(async () => {
                    const uploadedData = await handleConvertBannerComponentToImage(banner);

                    // Structure featured_image as object with url and image_id
                    let featuredImage: { url: string; image_id: string };
                    if (typeof uploadedData === 'string') {
                        featuredImage = {
                            url: uploadedData,
                            image_id: '',
                        };
                    } else if (uploadedData?.url) {
                        featuredImage = {
                            url: uploadedData.url,
                            image_id: uploadedData.image_id || uploadedData.id || '',
                        };
                    } else {
                        const url = uploadedData?.data?.url || uploadedData?.url || String(uploadedData);
                        featuredImage = {
                            url,
                            image_id: uploadedData?.data?.image_id || uploadedData?.image_id || uploadedData?.id || '',
                        };
                    }

                    updateBlog({
                        blog_info: {
                            ...blog?.blog_info,
                            featured_image: featuredImage,
                        },
                    });
                })
                .catch(() => {});
        };


        return (
            <PlateElement ref={ref} className={cn(className, 'py-2.5 !w-full')} data-tour="banner-block" {...props}>
                {element.is_ai_suggested && !readOnly ? (
                    <AISuggestionBanner
                        type="banner"
                        onApply={handleApplyAISuggestion}
                        onReject={handleRejectAISuggestion}
                        preview={
                            <BannerComponent
                                banner={banner}
                                readOnly={true}
                                element={element}
                                isPreview
                                loading={isLoading || isUpdating}
                            />
                        }
                    />
                ) : (
                    <MediaPopover
                        plugin={ImagePlugin}
                        hideOverlay={true}
                        onDelete={() => handleDelete()}
                    >
                        <figure className="group relative m-0 " contentEditable={false}>
                            <div className="relative w-full">
                                <BannerAlignment
                                    align={align}
                                    readOnly={
                                        readOnly || (!banner?.banner_url && !banner?.banner_type)
                                    }
                                    handleDelete={handleDelete}
                                    element={element}
                                />
                                <BannerComponent
                                    readOnly={readOnly}
                                    element={element}
                                    isPreview={false}
                                    loading={isCreatingBanner || isLoading || isUpdating}
                                    banner={banner}
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
