import { useQueryState } from 'nuqs';
import LeadMagnetTemplates from './templates';
import LeadMagnetDetailsModal from './LeadMagnetDetailsModal';

interface LeadMagnetTemplateViewProps {
    leadMagnet: any;
    isDragging?: boolean;
    readOnly?: boolean;
}

const LeadMagnetTemplateView = ({ leadMagnet, isDragging, readOnly }: LeadMagnetTemplateViewProps) => {
    const [leadMagnetId, setLeadMagnetId] = useQueryState('lead_id');
    console.log('ALL LEAD MAGNET TEMPLATES', LeadMagnetTemplates);
    console.log('LEAD MAGNET', leadMagnet?.details?.lead_magnet_template_id);

    const currentTemplate = LeadMagnetTemplates.find(
        template =>
            template.id === (leadMagnet?.details?.lead_magnet_template_id || 'blog-lead-magnet-1')
    );
    console.log('CURRENT TEMPLATE', currentTemplate);
    const TemplateComponent = currentTemplate?.component as any;
    return (
        <>
            <LeadMagnetDetailsModal
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

export default LeadMagnetTemplateView;
