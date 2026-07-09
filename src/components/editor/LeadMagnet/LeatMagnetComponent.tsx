import { useDraggable } from '@udecode/plate-dnd';
import { cn } from '@/lib/utils';
import LeadMagnetTemplateView from './LeadMagnetTemplateView';
import { BannerSkeleton } from '@/components/common/Skeletons';
import { useQueryState } from 'nuqs';

interface LeadMagnetComponentProps {
    element: any;
    isPreview: boolean;
    readOnly: boolean;
    loading?: boolean;
    leadMagnet?: any;
    onDelete?: () => void;
}

const LeadMagnetComponent = ({
    element,
    isPreview,
    readOnly,
    leadMagnet,
    loading,
}: LeadMagnetComponentProps) => {
    console.log('LEAD MAGNET', leadMagnet);

    const [mode, setMode] = useQueryState('mode');
    const [type, setType] = useQueryState('type');
    const [id, setId] = useQueryState('id');
    const [, setLeadType] = useQueryState('leadType');
    // Only use drag and drop when not in read-only mode
    const dragDropHook = readOnly ? { isDragging: false, handleRef: undefined } : useDraggable({
        element: element,
    });
    const { isDragging, handleRef } = dragDropHook;

    const handleEdit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const isNewsletterEl =
            element?.lead_magnet_type === 'newsletter' ||
            element?.lead_magnet_type === 'news-letter';
        const isLeadFormEl = element?.lead_magnet_type === 'lead-form';
        setLeadType(isNewsletterEl ? 'news-letter' : isLeadFormEl ? 'lead-form' : 'lead-magnet');
        setMode('lead-magnet');
        setType('edit');
        setId(element?.plugin_data_id);
    };

    if (loading) {
        return <BannerSkeleton />;
    }

    return (
        <div
            ref={handleRef}
            contentEditable={false}
            className={cn('relative w-full rounded-lg overflow-hidden cursor-pointer group')}
        >
            <LeadMagnetTemplateView leadMagnet={leadMagnet} isDragging={isDragging} readOnly={readOnly} />
            {!isPreview && !readOnly && (
                <div className='absolute z-30 inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='flex items-center justify-center h-full'>
                        <span onClick={handleEdit} className='text-white'>
                            Click to edit
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadMagnetComponent;
