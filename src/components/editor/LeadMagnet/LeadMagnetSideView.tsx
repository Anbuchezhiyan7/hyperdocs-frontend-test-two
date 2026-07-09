import LeadMagnetTemplateView from './LeadMagnetTemplateView';
import { useQuery } from '@tanstack/react-query';
import leadMagnetsApi from '@/api/lead-magnet.api';
import { useAppStore } from '@/store/useAppStore';
import { FaXmarkIcon } from '@/assets/icons'; 
import Button from '@/components/common/Buttons';
import { useState } from 'react';

interface LeadMagnetSideViewProps {}

export const LeadMagnetSideView: React.FC<LeadMagnetSideViewProps> = () => {
    const { blog } = useAppStore();
    const [isOpen, setIsOpen] = useState(true);
    const { data: leadMagnets, isLoading } = useQuery({
        queryKey: ['lead-magnets', blog?.blog_id],
        queryFn: () => leadMagnetsApi.handleGetAllLeadMagnets(blog?.blog_id as string),
        enabled: !!blog?.blog_id,
    });

    console.log('leadMagnets in side view', leadMagnets);

    const sideViewLeadMagnet = leadMagnets?.find(
        (leadMagnet: any) => leadMagnet?.details?.cta_placement === 'sticky_sidebar'
    );

    console.log('leadMagnets in side view', leadMagnets);

    // Simple approach: always render the container with fixed dimensions
    return (
        <div className='fixed bottom-4 right-4 w-[700px] z-50'>
            {sideViewLeadMagnet && isOpen ? (
                <>
                    <Button
                        className='absolute !bg-transparent !border-none top-2 right-2'
                        onClick={() => setIsOpen(false)}
                        aria-label="Close lead magnet sidebar"
                    >
                        <FaXmarkIcon />
                    </Button>
                    <LeadMagnetTemplateView leadMagnet={sideViewLeadMagnet as any} />
                </>
            ) : null}
        </div>
    );
};
