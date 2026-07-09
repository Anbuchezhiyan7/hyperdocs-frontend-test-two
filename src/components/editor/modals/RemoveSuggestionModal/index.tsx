import { CenteredModal } from '@/components/common/Modals';

interface RemoveSuggestionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const RemoveSuggestionModal = ({
    open,
    onClose,
    onSubmit,
    isLoading,
}: RemoveSuggestionModalProps) => {
    const handleClose = () => {
        onClose();
    };

    return (
        <CenteredModal
            isOpen={open}
            title='Remove Suggestion'
            onClose={handleClose}
            defaultFooterClassName='w-full'
            width={450}
            childrenClassName='!min-h-[120px] pt-5'
            footerPriBtnLabel='Remove'
            footerPriBtnProps={{
                onClick: onSubmit,
                loading: isLoading,
                danger: true,
            }}
        >
            <p className='text-base'>Are you sure you want to reject this suggestion?</p>
        </CenteredModal>
    );
};

export default RemoveSuggestionModal;
