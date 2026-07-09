'use client';

/**
 * PUBLIC-ONLY lead-magnet view — antd-free counterpart of
 * editor/LeadMagnet/LeadMagnetTemplateView.
 *
 * Reuses the (antd-free) CTA template cards but swaps the antd
 * LeadMagnetDetailsModal for the plain-Tailwind PublicLeadMagnetModal, so the
 * public blog page never bundles antd's Modal/Input/Button (and their
 * transitive Upload/Select/DatePicker deps).
 */

import React from 'react';
import { useQueryState } from 'nuqs';
import LeadMagnetTemplates from '@/components/editor/LeadMagnet/templates';
import PublicLeadMagnetModal from './PublicLeadMagnetModal';

interface PublicLeadMagnetViewProps {
    leadMagnet: any;
    readOnly?: boolean;
}

const PublicLeadMagnetView = ({ leadMagnet, readOnly }: PublicLeadMagnetViewProps) => {
    const [leadMagnetId, setLeadMagnetId] = useQueryState('lead_id');

    const currentTemplate = LeadMagnetTemplates.find(
        template =>
            template.id === (leadMagnet?.details?.lead_magnet_template_id || 'blog-lead-magnet-1')
    );
    const TemplateComponent = currentTemplate?.component as any;
    if (!TemplateComponent) return null;

    return (
        <>
            <PublicLeadMagnetModal
                isOpen={leadMagnetId === leadMagnet?.lead_magnet_id}
                onClose={() => setLeadMagnetId(null)}
                allowedFields={leadMagnet?.details?.details_required || []}
                leadMagnet={leadMagnet}
            />
            <TemplateComponent
                buttonText={leadMagnet?.details?.cta_button || 'Subscribe'}
                placeholderText={leadMagnet?.details?.placeholder_text || 'Enter Your Email Address'}
                bgColor={leadMagnet?.details?.bg_color}
                buttonColor={leadMagnet?.details?.button_color}
                image={leadMagnet?.details?.image_url}
                title={leadMagnet?.details?.title || 'NEWSLETTER'}
                description={leadMagnet?.details?.description || 'Stay up to date with our latest news'}
                readOnly={readOnly}
                leadMagnet={leadMagnet}
                placement={leadMagnet?.details?.cta_placement}
                onClick={() => {
                    setLeadMagnetId(leadMagnet?.lead_magnet_id);
                }}
            />
        </>
    );
};

export default PublicLeadMagnetView;
