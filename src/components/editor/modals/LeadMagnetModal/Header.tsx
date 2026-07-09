import Button from '@/components/common/Buttons';
import { CloseOutlinedIcon } from '@/assets/icons';
import { useQueryState } from 'nuqs';

type ModalHeaderProps = {
    leadMagnets: any[];
    allFormData: any;
    activeLead: number;
    setActiveLead: (step: 1 | 2) => void;
    handleAdd: () => void;
    onClose: () => void;
    isLoading: boolean;
};

const MAX_LEAD_MAGNET = 3;

const ModalHeader = ({
    leadMagnets,
    allFormData,
    activeLead,
    setActiveLead,
    handleAdd,
    onClose,
    isLoading,
}: ModalHeaderProps) => {
    const [leadMagnetId, setLeadMagnetId] = useQueryState('id');
    const [leadType] = useQueryState('leadType');
    const currentLead = allFormData?.[leadMagnetId as string];
    const isNewsletter = leadType === 'lead-form' || leadType === 'news-letter' || currentLead?.template_type === 'newsletter';

    const handleClick = (id: string) => {
        setLeadMagnetId(id);
        setActiveLead(1);
    };

    const selectedIndex = leadMagnets?.findIndex(d => d.lead_magnet_id === leadMagnetId);
    const LEAD_FORM_IDS = ['blog-lead-magnet-5', 'blog-lead-magnet-6'];
    const selectedLabel = (() => {
        const type = currentLead?.template_type;
        const templateId = currentLead?.lead_magnet_template_id;
        
        if (type === 'newsletter' || type === 'news-letter' || leadType === 'news-letter') return 'Newsletter';
        if (type === 'lead_form' || leadType === 'lead-form' || LEAD_FORM_IDS.includes(templateId)) return 'Lead Form';
        
        return 'Lead Magnet';
    })();

    return (
        <div className='flex justify-between items-center w-full'>
            <div className='flex items-center gap-3'>
                {/* Selected lead magnet label */}
                <span className='text-sm font-bold text-gray-800'>{selectedLabel}</span>

                {/* Add New — only when not newsletter/lead-form and under limit */}
                {/* {!isNewsletter && leadMagnets?.length < MAX_LEAD_MAGNET && (
                    <Button
                        loading={isLoading}
                        title={isLoading ? 'Adding...' : '+ Add New'}
                        onClick={handleAdd}
                        htmlType='button'
                        className='rounded-xl h-8 !text-black !font-medium'
                    />
                )} */}
            </div>
            <span onClick={onClose} className='cursor-pointer'>
                <CloseOutlinedIcon />
            </span>
        </div>
    );
};

export default ModalHeader;
