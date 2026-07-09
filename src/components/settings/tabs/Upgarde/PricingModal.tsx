'use client';

import CenteredModal from '@/components/common/Modals/CenteredModal';
import { useQueryState } from 'nuqs';
import AllPlans from './AllPlans';

const PricingModal = () => {
    const [type, setType] = useQueryState('model-type');

    return (
        <CenteredModal
            isOpen={type === 'pricing'}
            onClose={() => setType(null)}
            title='Pricing'
            width='80vw'
            height='90vh'
            hideFooter
            childrenClassName='!p-0 overflow-hidden '
            headerClassName='!hidden'
        >
            <div className='h-[calc(100vh-100px)] relative overflow-y-auto p-6 mt-6'>
                <AllPlans />
            </div>
        </CenteredModal>
    );
};

export default PricingModal;
