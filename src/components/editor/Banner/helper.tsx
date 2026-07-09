import html2canvas from 'html2canvas';
import { createRoot, Root } from 'react-dom/client';
import { apiUploadFile } from '@/api/common';
import React from 'react';
import templates from './templates';

const mockRouter = { push: () => {}, replace: () => {} };
// Pathname without 'template' so template uses real logo/author/colors from store (isPreview = false)
const MOCK_PATHNAME_EDIT = '/blog/edit';

function BannerConversionTarget({ data }: { data: any }) {
    if (data?.banner_type === 'template') {
        const template = templates.find(t => t.id === data?.banner_template_id);
        const TemplateComponent = template?.component as React.ComponentType<{
            title?: string;
            onAuthorClick?: () => void;
            hideButtons?: boolean;
            mockPathname?: string;
            mockRouter?: any;
        }> | undefined;
        if (TemplateComponent) {
            return (
                <TemplateComponent
                    title={data?.banner_title ?? ''}
                    onAuthorClick={() => {}}
                    hideButtons={false}
                    mockPathname={MOCK_PATHNAME_EDIT}
                    mockRouter={mockRouter}
                />
            );
        }
    }
    return (
        <img
            src={data?.banner_url ?? ''}
            alt={data?.alt_text ?? ''}
            style={{ width: '100%', height: 'auto', display: 'block' }}
        />
    );
}

export const handleConvertBannerComponentToImage = async (data: any) => {
    let tempDiv: HTMLDivElement | null = null;
    let root: Root | null = null;

    try {
        tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '1000px';
        tempDiv.style.minHeight = '520px';
        document.body.appendChild(tempDiv);

        root = createRoot(tempDiv);
        root.render(
            <React.StrictMode>
                <BannerConversionTarget data={data} />
            </React.StrictMode>
        );

        await new Promise(resolve => setTimeout(resolve, 1500));

        const imgs = tempDiv.querySelectorAll('img');
        if (imgs.length > 0) {
            await Promise.race([
                Promise.all(
                    Array.from(imgs).map(
                        (img) =>
                            new Promise<void>((resolve) => {
                                if (img.complete) {
                                    resolve();
                                    return;
                                }
                                img.onload = () => resolve();
                                img.onerror = () => resolve();
                                setTimeout(resolve, 3000);
                            })
                    )
                ),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image load timeout')), 8000)),
            ]).catch(() => {});
        }

        // next/image sizes via srcset/sizes which html2canvas doesn't reliably honor,
        // letting images render larger than their box and overflow/crop. Strip them so
        // each image renders at its intrinsic/CSS size.
        tempDiv.querySelectorAll('img').forEach(img => {
            img.removeAttribute('srcset');
            img.removeAttribute('sizes');
        });

        await new Promise(resolve => setTimeout(resolve, 400));

        // Some banner templates (e.g. template 1) use `h-full` on their root and an
        // absolutely positioned inset-0 background. `height: 100%` only resolves against a
        // parent with a DEFINITE height — the wrapper only has `minHeight`, so in the
        // html2canvas clone the background collapses and leaves empty (white) space below.
        // Convert the wrapper's min-height into an explicit height so the h-full chain and
        // the background fill correctly. Templates that size themselves (e.g. template 2 via
        // min-h-[500px]) are unaffected.
        tempDiv.style.height = `${tempDiv.offsetHeight}px`;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        // Capture the actual banner element, not the wrapper. The wrapper has a fixed
        // minHeight (520px) so if the banner content is shorter, capturing the wrapper adds
        // empty white space below the banner. Target the wrapper's first child (the rendered
        // banner) so the capture height matches the real content.
        const captureTarget = (tempDiv.firstElementChild as HTMLElement) || tempDiv;

        // The target has a fixed 1000px width, but html2canvas defaults its clone viewport to
        // window.innerWidth. On smaller screens that viewport is narrower than 1000px, so the
        // clone re-lays-out and the right side of the banner gets cropped. Pin the capture box
        // AND the clone's virtual window to the target's actual pixel size so the export is
        // identical and un-cropped on every screen size.
        const captureWidth = Math.ceil(Math.max(captureTarget.scrollWidth, captureTarget.offsetWidth));
        const captureHeight = Math.ceil(Math.max(captureTarget.scrollHeight, captureTarget.offsetHeight));

        const canvas = await html2canvas(captureTarget, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true,
            width: captureWidth,
            height: captureHeight,
            windowWidth: captureWidth,
            windowHeight: captureHeight,
            scrollX: 0,
            scrollY: 0,
        });

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/webp', 1.0);
        });

        if (!blob) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const retryBlob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/webp', 1.0);
            });
            if (!retryBlob) {
                throw new Error('Blob conversion returned null. The banner may be too large or unsupported in this browser.');
            }
            const file = new File([retryBlob], 'banner.webp', { type: 'image/webp' });
            
            // --- Auto-download for testing ---
            // const url = URL.createObjectURL(retryBlob);
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'ai-banner-debug.webp';
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
            // URL.revokeObjectURL(url);
            // ---------------------------------

            const res = await apiUploadFile('image', file);
            return res.data;
        }

        const file = new File([blob], 'banner.webp', { type: 'image/webp' });

        // --- Auto-download for testing ---
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'ai-banner-debug.webp';
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
        // ---------------------------------

        const res = await apiUploadFile('image', file);
        return res.data;
    } catch (error: any) {
        console.error('Error generating image:', error);
        throw error;
    } finally {
        if (root) {
            root.unmount();
        }
        if (tempDiv && document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
        }
    }
};
