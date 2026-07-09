'use client';

import React from 'react';
import { Modal, ModalProps } from 'antd';
import { CloseOutlinedIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Buttons';

interface CenteredModalProps {
    isOpen: boolean;
    onClose: () => void;
    width?: number | string;
    height?: number | string;
    children: React.ReactNode;
    title?: string;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    hideCloseIcon?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    hideDivider?: boolean;
    maskClassName?: string;
    rootClassName?: string;
    contentClassName?: string;
    childrenClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    defaultFooterClassName?: string;
    footerSecBtnLabel?: string;
    footerSecBtnProps?: any;
    footerPriBtnLabel?: string;
    footerPriBtnProps?: any;
    zIndex?: number;
}

const CenteredModal: React.FC<CenteredModalProps> = ({
    isOpen,
    onClose,
    width = 520,
    height,
    children,
    title = 'Modal Title',
    headerComponent = null,
    footerComponent = null,
    hideCloseIcon = false,
    hideHeader = false,
    hideFooter = false,
    hideDivider = false,
    maskClassName = '',
    rootClassName = '',
    contentClassName = '',
    childrenClassName = '',
    headerClassName = '',
    footerClassName = '',
    defaultFooterClassName = '',
    footerSecBtnLabel = 'Cancel',
    footerPriBtnLabel = 'Save',
    footerSecBtnProps = {},
    footerPriBtnProps = {},
    zIndex = 2000,
}) => {
    const classNames: ModalProps['classNames'] = {
        mask: cn('!bg-gray-500/40 !backdrop-blur-sm', maskClassName),
        content: cn('!p-0 overflow-hidden ', contentClassName),
    };

    const DefaultHeader = () => (
        <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{title}</div>
        </div>
    );

    const DefaultFooter = () => (
        <div className="flex items-center justify-end w-full gap-2">
            <Button
                type="default"
                onClick={onClose}
                className={cn('rounded-xl h-9', defaultFooterClassName)}
                {...footerSecBtnProps}
            >
                {footerSecBtnLabel}
            </Button>
            <Button
                type="primary"
                className={cn('rounded-xl h-9', defaultFooterClassName)}
                {...footerPriBtnProps}
                loading={footerPriBtnProps?.loading}
            >
                {footerPriBtnLabel}
            </Button>
        </div>
    );

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            height={height}
            width={width}
            centered
            classNames={classNames}
            closeIcon={hideCloseIcon ? null : <CloseOutlinedIcon />}
            footer={null}
            zIndex={zIndex}
        >
            <div
                onMouseDown={e => e.stopPropagation()}
                className={cn(
                    'h-full w-full flex flex-col max-h-[90vh] max-w-[95vw]',
                    !hideDivider && 'divide-y divide-gray-200',
                    rootClassName
                )}
            >
                {!hideHeader && (
                    <div className={cn('px-6 py-3', headerClassName)}>
                        {headerComponent || <DefaultHeader />}
                    </div>
                )}
                <div
                    className={cn(
                        'flex-1 h-full w-full overflow-y-auto no-scrollbar px-6 py-3',
                        childrenClassName
                    )}
                >
                    {children}
                </div>
                {!hideFooter && (
                    <div className={cn('px-6 py-3', footerClassName)}>
                        {footerComponent || <DefaultFooter />}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CenteredModal;
