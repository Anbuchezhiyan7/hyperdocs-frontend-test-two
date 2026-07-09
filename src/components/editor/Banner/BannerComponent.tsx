import { BannerAiIcon, ImageIcon, UploadBannerIcon, CoinsIcon } from '@/assets/icons';
import FileUploader from '@/components/common/Input/Upload';
import TabsModel from '@/components/modals/TabsModal';
import useBannerService from '@/services/banner.service';
import { useCallback, useRef, useState } from 'react';
import TemplateList from '../TemplateList';
import { toast } from 'sonner';
import { useEditorRef } from '@udecode/plate/react';
import { useUploadFile } from '@/hooks/use-upload';
import BannerPlaceholder from '@/components/common/BannerPlaceholder';
import BannerTemplateView from './BannerTemplateView';
import { useDraggable } from '@udecode/plate-dnd';
import { cn } from '@/lib/utils';
import { BannerSkeleton } from '@/components/common/Skeletons';
import templates from './templates';
import { useAppStore } from '@/store/useAppStore';
import { handleConvertBannerComponentToImage } from './helper';
import { useParams, useRouter } from 'next/navigation';
import { useSuggestionService } from '@/services/suggestion.service';
import { getPath } from '@/utils/format/api';
import useBlogService from '@/services/blog.service';
import { v4 as uuidv4 } from 'uuid';
import { getAssetCredit, useCreditPricing } from '@/hooks/use-credit-pricing';

interface BannerComponentProps {
    element: any;
    isPreview: boolean;
    readOnly: boolean;
    loading?: boolean;
    banner?: any;
    onDelete?: () => void;
}

const BannerComponent = ({
    element,
    isPreview,
    readOnly,
    loading,
    banner,
    onDelete,
}: BannerComponentProps) => {
    const { isLoading, isError, handleUpdateBanner } = useBannerService();
    const editor = useEditorRef();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { blog } = useAppStore();
    const templateRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { id: slug } = useParams();
    const [isUpdating, setIsUpdating] = useState(false);
    // Only use drag and drop when not in read-only mode
    const dragDropHook = readOnly
        ? { isDragging: false, handleRef: undefined }
        : useDraggable({
              element: element,
          });
    const { isDragging, handleRef } = dragDropHook;
    const { checkIfCanUseAI } = useSuggestionService();
    const { updateBlog, isUpdatingBlog } = useBlogService();
    const { data: creditPricing } = useCreditPricing();
    const aiBannerCredits = getAssetCredit(creditPricing, 'ai_banner');

    const handleUploadComplete = useCallback(
        (res: any) => {
            setIsDialogOpen(false);
            let randomID = uuidv4();
            handleUpdateBanner({
                bannerId: element?.plugin_data_id,
                banner: {
                    banner_url: res.url,
                    banner_title: blog?.blog_title || '',
                    banner_template_id: null,
                    banner_type: 'image',
                },
            });
            updateBlog({
                blog_info: {
                    ...blog?.blog_info,
                    featured_image: {url: res.url, image_id: randomID},
                },
            });

            if (isError) {
                toast.error('Error updating banner');
                return;
            }

            editor.tf.setNodes(
                {
                    width: '100%',
                },
                { at: editor.api.findPath(element) }
            );
        },
        [editor, element]
    );

    const { uploadFile, isUploading } = useUploadFile({
        onUploadComplete: handleUploadComplete,
    });

    const handleSelectTemplate = async (template: any) => {
        if (!checkIfCanUseAI()) {
            return;
        }

        setIsUpdating(true);
        await handleUpdateBanner({
            bannerId: element?.plugin_data_id,
            banner: {
                banner_template_id: template.id,
                banner_type: 'template',
                // banner_title: blog?.blog_title || '',
            },
        }).then(async (res: any) => {
            const uploadedData = await handleConvertBannerComponentToImage(res);            
            updateBlog({
                blog_info: {
                    ...blog?.blog_info,
                    featured_image: uploadedData,
                },
            });
        });

        if (isError) {
            return;
        }

        setIsDialogOpen(false);
        setIsUpdating(false);
    };

    const tabs = [
        {
            key: '1',
            label: (
                <span className="flex items-center gap-2">
                    Banner using AI
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FFEEE5] text-[#FF5200] rounded-full text-[10px] font-bold shadow-sm">
                        <CoinsIcon className="h-2.5 w-2.5 [&_path]:fill-[#FF5200]" />
                        {aiBannerCredits}
                    </span>
                </span>
            ),
            icon: <BannerAiIcon className="w-4 h-4" />,
            content: <TemplateList data={templates} onSelect={handleSelectTemplate} />,
        },
        {
            key: '2',
            label: 'Upload Banner',
            icon: <UploadBannerIcon className="w-4 h-4" />,
            content: (
                <FileUploader
                    value={element.url}
                    hideBorder
                    isUploading={isUploading}
                    onUpload={file => uploadFile(file, 'image')}
                />
            ),
        },
    ];

    const handleEdit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDialogOpen(true);
    };

    const handleAuthorClick = () => {
        router.push(getPath(`/${blog?.author_details?.author_id}`));
    };

    if (isLoading || isUpdating || loading) {
        return <BannerSkeleton />;
    }

    console.log('BANNER-2', templateRef);
    return (
        <figure ref={handleRef} className="group relative m-0 " contentEditable={false}>
            {!banner?.banner_url && !banner?.banner_type && !isPreview && !readOnly ? (
                <BannerPlaceholder
                    icon={ImageIcon}
                    text="Add banner"
                    onAccept={handleEdit}
                    onReject={onDelete}
                />
            ) : (
                <div
                    ref={handleRef}
                    className={cn(
                        'relative w-full rounded-lg overflow-hidden cursor-pointer group'
                    )}
                >
                    <div ref={templateRef}>
                        <BannerTemplateView
                            banner={banner}
                            isDragging={isDragging}
                            onAuthorClick={handleAuthorClick}
                        />
                    </div>
                    {!isPreview && !readOnly && (
                        <div className="absolute z-30 inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-center h-full">
                                <span
                                    onClick={handleEdit}
                                    className="text-white bg-black/80 px-4 py-2 hover:bg-black/60 transition-all duration-300 rounded-lg"
                                >
                                    Click to edit
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <TabsModel isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} tabs={tabs} />
        </figure>
    );
};

export default BannerComponent;
