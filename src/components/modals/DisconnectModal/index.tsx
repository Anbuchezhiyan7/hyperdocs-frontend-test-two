import React from 'react';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import Button from '@/components/common/Buttons';

interface DisconnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDisconnect?: () => void;
}

const DisconnectModal: React.FC<DisconnectModalProps> = ({ isOpen, onClose, onDisconnect }) => {
    const footerComponent = (
        <div className="flex items-center  w-full gap-2">
            <Button type="default" onClick={onClose} className="rounded-xl h-[32px] w-full">
                Cancel
            </Button>
            <Button
                type="primary"
                onClick={onDisconnect}
                className="rounded-xl h-[32px] w-full !bg-[#DC3545] hover:!bg-[#f32c40]"
            >
                Disconnect
            </Button>
        </div>
    );

    return (
        <CenteredModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Disconnect?"
            footerComponent={footerComponent}
            width={400}
            hideDivider={true}
            contentClassName="!py-4"
        >
            <div className="text-center py-4">
                <p className="text-[#8F8F8F] text-[14px] font-[500]">
                    Are you sure? You can reconnect the domain again.
                </p>
            </div>
        </CenteredModal>
    );
};

export default DisconnectModal;
