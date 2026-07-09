import { BannerAiIcon, ImageIcon, UploadBannerIcon, CoinsIcon } from '@/assets/icons';
import FileUploader from '@/components/common/Input/Upload';
import TabsModel from '@/components/modals/TabsModal';
import { useCallback, useEffect, useRef, useState } from 'react';
import TemplateList from '../TemplateList';
import { toast } from 'sonner';
import { useEditorRef } from '@udecode/plate/react';
import { useUploadFile } from '@/hooks/use-upload';
import BannerPlaceholder from '@/components/common/BannerPlaceholder';
import { useDraggable } from '@udecode/plate-dnd';
import { cn } from '@/lib/utils';
import { BannerSkeleton } from '@/components/common/Skeletons';
import useInfographService from '@/services/infograph.service';
import InfographTemplateView from './InfographTemplateView';
import InfographTemplates from './templates';
import { useSuggestionService } from '@/services/suggestion.service';
import { getAssetCredit, useCreditPricing } from '@/hooks/use-credit-pricing';
import html2canvas from 'html2canvas';
import commonApi from '@/api/common.api';

interface InfographComponentProps {
    element: any;
    isPreview: boolean;
    readOnly: boolean;
    loading?: boolean;
    infograph?: any;
    onDelete?: () => void;
}

const InfographComponent = ({
    element,
    isPreview,
    readOnly,
    loading,
    infograph,
    onDelete,
}: InfographComponentProps) => {
    const { isLoading, isError, handleUpdateInfograph, handleUpdateInfographAsync } = useInfographService(
        element?.plugin_data_id
    );
    const editor = useEditorRef();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const templateContainerRef = useRef<HTMLDivElement>(null);
    const [isCapturingTemplate, setIsCapturingTemplate] = useState(false);
    const [needsCapture, setNeedsCapture] = useState(false);

    // Only use drag and drop when not in read-only mode
    const dragDropHook = readOnly ? { isDragging: false, handleRef: undefined } : useDraggable({
        element: element,
    });
    const { isDragging, handleRef } = dragDropHook;

    const { checkIfCanUseAI } = useSuggestionService();
    const { data: creditPricing } = useCreditPricing();
    const aiInfographCredits = getAssetCredit(creditPricing, 'info_graphics');

    const handleUploadComplete = useCallback(
        (res: any) => {
            setIsDialogOpen(false);

            handleUpdateInfograph({
                infographId: element?.plugin_data_id,
                infograph: {
                    infograph_url: res.url,
                    infograph_template_id: null,
                    infograph_type: 'image',
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

    useEffect(() => {
        const isTemplate = infograph?.infograph_type === 'template';
        const hasContent =
            infograph?.infograph_title && infograph?.infograph_steps?.length > 0;
        const noUrl = !infograph?.infograph_url;

        if (isTemplate && hasContent && (noUrl || needsCapture) && !isCapturingTemplate && !isLoading) {
            setNeedsCapture(false);
            captureAndUploadTemplate();
        }
    }, [infograph, isLoading, needsCapture]);

    const captureAndUploadTemplate = async () => {
        setIsCapturingTemplate(true);
        // Off-screen host we render a fixed-width copy of the template into for capture.
        let captureHost: HTMLDivElement | null = null;
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (!templateContainerRef.current) return;

            // NEW APPROACH: instead of capturing the live in-editor node (whose width is
            // constrained by the editor layout / viewport and which html2canvas re-lays-out
            // at window width in its clone — causing the right-aligned logo to drift past the
            // capture box and get cropped on smaller screens), we render a *copy* of the
            // template markup into a detached, off-screen container with a FIXED width.
            // This decouples the capture from the current viewport entirely, so the output
            // is identical on every screen size and nothing overflows the capture box.
            const CAPTURE_WIDTH = 1000; // fixed design width, comfortably fits the template

            captureHost = document.createElement('div');
            captureHost.style.position = 'fixed';
            captureHost.style.top = '0';
            captureHost.style.left = '-100000px';
            captureHost.style.width = `${CAPTURE_WIDTH}px`;
            captureHost.style.background = '#FFFFFF';
            captureHost.style.pointerEvents = 'none';
            captureHost.style.zIndex = '-1';

            // Clone the rendered template markup (Tailwind classes resolve via global CSS).
            captureHost.innerHTML = templateContainerRef.current.innerHTML;
            document.body.appendChild(captureHost);

            // Normalize images (the logo) so next/image's srcset/sizes can't pick a larger
            // source and overflow; keep their intrinsic width/height attributes.
            captureHost.querySelectorAll('img').forEach(img => {
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
                img.style.setProperty('object-fit', 'contain', 'important');
                img.style.flexShrink = '0';
            });

            // html2canvas (v1.4.1) does NOT reliably center text via flexbox and ignores CSS
            // transforms, so flex-centered step numbers render pushed toward the bottom of
            // their circles in the exported image (a capture-only quirk — the live editor DOM
            // is centered correctly). Fix it with a purely LAYOUT-based centering that
            // html2canvas honors: for each number element, drop flex and set the text
            // line-height equal to the circle's actual pixel height with centered alignment,
            // so the glyph's own line box centers it vertically. The live UI is untouched.
            captureHost.querySelectorAll<HTMLElement>('.infograph-step-number').forEach(numEl => {
                const h = numEl.getBoundingClientRect().height;
                if (!h) return;
                numEl.style.setProperty('display', 'block', 'important');
                numEl.style.setProperty('text-align', 'center', 'important');
                numEl.style.setProperty('line-height', `${h}px`, 'important');
                // If the digit is wrapped in a span, center it the same way; otherwise the
                // rules above already apply to the text node directly.
                const span = numEl.querySelector('span') as HTMLElement | null;
                if (span) {
                    span.style.setProperty('display', 'block', 'important');
                    span.style.setProperty('width', '100%', 'important');
                    span.style.setProperty('text-align', 'center', 'important');
                    span.style.setProperty('line-height', `${h}px`, 'important');
                }
            });

            // Wait for all images in the off-screen copy to finish loading before capture.
            await Promise.all(
                Array.from(captureHost.querySelectorAll('img')).map(img =>
                    img.complete && img.naturalWidth > 0
                        ? Promise.resolve()
                        : new Promise<void>(resolve => {
                              img.onload = () => resolve();
                              img.onerror = () => resolve();
                          })
                )
            );

            // Let layout settle at the fixed width.
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            const captureHeight = Math.ceil(captureHost.scrollHeight);

            const canvas = await html2canvas(captureHost, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#FFFFFF',
                logging: false,
                allowTaint: true,
                width: CAPTURE_WIDTH,
                height: captureHeight,
                windowWidth: CAPTURE_WIDTH,
                windowHeight: captureHeight,
                scrollX: 0,
                scrollY: 0,
            });

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/webp', 0.95);
            });

            const file = new File([blob], 'infograph.webp', { type: 'image/webp' });
            const formData = new FormData();
            formData.append('image', file);

            const res = await commonApi.handleUploadFile('image', formData);

            if (res?.url) {
                await handleUpdateInfographAsync({
                    infographId: element?.plugin_data_id,
                    infograph: {
                        infograph_url: res.url,
                    },
                });
            }
        } catch (error) {
            console.error('Failed to capture infograph template as image:', error);
        } finally {
            if (captureHost && captureHost.parentNode) {
                captureHost.parentNode.removeChild(captureHost);
            }
            setIsCapturingTemplate(false);
        }
    };

    const handleSelectTemplate = (template: any) => {
        if (!checkIfCanUseAI()) {
            return;
        }

        handleUpdateInfograph({
            infographId: element?.plugin_data_id,
            infograph: {
                infograph_template_id: template.id,
                infograph_type: 'template',
                infograph_url: null,
            },
        });

        if (isError) {
            toast.error('Error updating infograph');
            return;
        }

        setNeedsCapture(true);
        setIsDialogOpen(false);
    };

    const tabs = [
        {
            key: '1',
            label: (
                <span className="flex items-center gap-2">
                    Infograph using AI
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FFEEE5] text-[#FF5200] rounded-full text-[10px] font-bold shadow-sm">
                        <CoinsIcon className="h-2.5 w-2.5 [&_path]:fill-[#FF5200]" />
                        {aiInfographCredits}
                    </span>
                </span>
            ),
            icon: <BannerAiIcon className='w-4 h-4' />,
            content: <TemplateList data={InfographTemplates} onSelect={handleSelectTemplate} />,
        },
        {
            key: '2',
            label: 'Upload Infograph',
            icon: <UploadBannerIcon className='w-4 h-4' />,
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

    const handleEdit = () => {
        setIsDialogOpen(true);
    };

    if ((isLoading || loading) && !isCapturingTemplate) {
        return <BannerSkeleton />;
    }

    return (
        <figure ref={handleRef} className='group relative m-0 ' contentEditable={false}>
            {!infograph?.infograph_url && !infograph?.infograph_type && !isPreview && !readOnly ? (
                <BannerPlaceholder
                    icon={ImageIcon}
                    text='Add infograph'
                    onAccept={handleEdit}
                    onReject={onDelete}
                />
            ) : (
                <div
                    ref={handleRef}
                    className={cn(
                        'relative w-full rounded-lg cursor-pointer group'
                    )}
                >
                    <div ref={templateContainerRef}>
                        <InfographTemplateView infograph={infograph} isDragging={isDragging} />
                    </div>
                    {!isPreview && !readOnly && (
                        <div className='absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <div className='flex items-center justify-center h-full'>
                                <span onClick={handleEdit} className='text-white'>
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

export default InfographComponent;
