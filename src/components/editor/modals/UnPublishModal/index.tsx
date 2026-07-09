import { useQueryState } from 'nuqs';
import { CenteredModal } from '@/components/common/Modals';
import { message } from 'antd';

interface UnPublishModalProps {
    onSubmit: () => void;
    isLoading: boolean;
}

const UnPublishModal = ({ onSubmit, isLoading }: UnPublishModalProps) => {
    const [paramMode, setParamMode] = useQueryState('mode');

    const isOpen = paramMode === 'unpublish';

    const handleClose = () => {
        setParamMode(null);
    };

    const handleSubmit = async () => {
        try {
            await onSubmit();
            handleClose();
        } catch (error: any) {
            message.error(error.message || 'An error occurred while processing your request');
        }
    };

    return (
        <CenteredModal
            isOpen={isOpen}
            title='Unpublish Blog'
            onClose={handleClose}
            defaultFooterClassName='w-full'
            width={450}
            childrenClassName='!min-h-[120px] pt-5'
            footerPriBtnLabel='Remove'
            footerPriBtnProps={{
                onClick: handleSubmit,
                loading: isLoading || false,
                danger: true,
            }}
        >
            <p className='text-base'>Are you sure you want to unpublish this blog?</p>
        </CenteredModal>
    );
};

export default UnPublishModal;
