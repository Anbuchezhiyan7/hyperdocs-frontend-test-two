import React from 'react';
import CenteredModal from '../CenteredModal';

type DeleteModalProps = {
    title?: string;
    description?: string;
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
    isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    title = 'Are you sure to delete?',
    description,
    open = false,
    onClose,
    onAccept,
    isLoading = false,
}) => {
    return (
        <CenteredModal
            isOpen={open}
            onClose={onClose}
            title={title}
            width={450}
            hideDivider
            contentClassName='!py-2'
            defaultFooterClassName='!w-full'
            footerPriBtnLabel='Delete'
            footerSecBtnProps={{ onClick: onClose, disabled: isLoading }}
            footerPriBtnProps={{ onClick: onAccept, loading: isLoading, rootClassName: '!bg-red-500 hover:!bg-red-600' }}
        >
            <div className="text-base text-[#555]">
                {
                    description ||
                    'This action cannot be undone. Do you really want to delete this item?'
                }
            </div>
        </CenteredModal>
    );
}

export default DeleteModal;
