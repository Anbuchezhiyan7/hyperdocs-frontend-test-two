'use client';
import React, { useRef, useState, useLayoutEffect } from 'react';
import LeadMagnetTemplates from '@/components/editor/LeadMagnet/templates';
import { LeadMagnetLibraryItem } from '@/api/lead-magnet-library.api';

interface LeadMagnetTemplatePreviewProps {
    magnet: LeadMagnetLibraryItem;
    /** Height of the preview thumbnail area in px. Defaults to 160. */
    height?: number;
}

/**
 * Renders the actual template component scaled down to fit the card thumbnail.
 * Accepts the API schema (LeadMagnetLibraryItem) directly.
 */
const INNER_WIDTH = 780;

// Maps API template_number / template_id → template list id
const TEMPLATE_ID_MAP: Record<string, string> = {
    template_1: 'blog-lead-magnet-1',
    template_2: 'blog-lead-magnet-2',
    template_3: 'blog-lead-magnet-3',
    template_4: 'blog-lead-magnet-4',
};

// All valid internal IDs (used to detect when the value is already resolved)
const INTERNAL_IDS = new Set([
    'blog-lead-magnet-1',
    'blog-lead-magnet-2',
    'blog-lead-magnet-3',
    'blog-lead-magnet-4',
]);

const resolveTemplateId = (magnet: LeadMagnetLibraryItem): string => {
    // Already a valid internal ID (e.g. from TemplateSelector mock objects)
    if (INTERNAL_IDS.has(magnet.template_id)) return magnet.template_id;
    if (INTERNAL_IDS.has(magnet.template_number)) return magnet.template_number;
    // API value like 'template_1' → 'blog-lead-magnet-1'
    return (
        TEMPLATE_ID_MAP[magnet.template_number] ??
        TEMPLATE_ID_MAP[magnet.template_id] ??
        magnet.template_id ??
        magnet.template_number ??
        ''
    );
};

const LeadMagnetTemplatePreview: React.FC<LeadMagnetTemplatePreviewProps> = ({
    magnet,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.38);
    const [renderedHeight, setRenderedHeight] = useState(160);

    useLayoutEffect(() => {
        const el = containerRef.current;
        const innerEl = innerRef.current;
        if (!el || !innerEl) return;

        const update = () => {
            const w = el.offsetWidth || el.clientWidth || el.getBoundingClientRect().width;
            const currentInnerWidth = 780;
            const currentScale = w > 0 ? w / currentInnerWidth : 0.38;
            setScale(currentScale);

            const innerH = innerEl.offsetHeight || innerEl.clientHeight || 160;
            setRenderedHeight(innerH * currentScale);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        ro.observe(innerEl);
        return () => ro.disconnect();
    }, []);

    const resolvedId = resolveTemplateId(magnet);
    const template = LeadMagnetTemplates.find(t => t.id === resolvedId);
    const TemplateComponent = template?.component as any;

    if (!TemplateComponent) {
        // Fallback: show cover image or gradient placeholder
        return (
            <div
                style={{ height: 160 }}
                className="w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 text-orange-300 text-xs"
            >
                {magnet.cover_image?.url
                    ? <img src={magnet.cover_image.url} alt="cover" className="w-full h-full object-cover" />
                    : <span className="font-medium">{magnet.template_number || 'Template'}</span>
                }
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{ height: renderedHeight, overflow: 'hidden', position: 'relative' }}
            className="w-full bg-[#FDF6EE] lead-magnet-preview-override"
        >
            <style>{`
                .lead-magnet-preview-override .hidden.md\\:flex {
                    display: flex !important;
                }
                .lead-magnet-preview-override .flex-col.md\\:flex-row {
                    flex-direction: row !important;
                }
                .lead-magnet-preview-override .order-2.md\\:order-1 {
                    order: 1 !important;
                }
                .lead-magnet-preview-override .order-1.md\\:order-2 {
                    order: 2 !important;
                }
                .lead-magnet-preview-override .mb-6.md\\:mb-0 {
                    margin-bottom: 0px !important;
                }
                .lead-magnet-preview-override .md\\:mr-8 {
                    margin-right: 2rem !important;
                }
                .lead-magnet-preview-override .md\\:pr-8 {
                    padding-right: 2rem !important;
                }
                .lead-magnet-preview-override .mt-6.md\\:mt-0 {
                    margin-top: 0px !important;
                }
            `}</style>
            <div
                ref={innerRef}
                style={{
                    width: 780,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    overflow: 'hidden',
                }}
            >
                <TemplateComponent
                    title={magnet.lead_magnet_instance_title || magnet.lead_magnet_instance_name || 'Untitled'}
                    description={magnet.description || ''}
                    buttonText={magnet.cta_button_text || 'Get it'}
                    image={magnet.cover_image?.url || ''}
                    requiredFields={magnet.required_form_fields}
                    readOnly={false}
                    onClick={() => {}}
                />
            </div>
        </div>
    );
};

export default LeadMagnetTemplatePreview;
