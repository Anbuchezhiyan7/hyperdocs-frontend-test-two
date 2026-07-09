'use client';

import React from 'react';
import { Modal, ModalProps } from 'antd';
import { CloseOutlinedIcon } from '@/assets/icons';
import { cn } from '@/utils/cn';

interface CenterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    title?: string;
    topContent?: React.ReactNode;
    titleColor?: string;
    width?: number | string;
    height?: number | string;
    zIndex?: number;
    children: React.ReactNode;
    customClassName?: string;
    titleClassName?: string;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    topContentClassName?: string;
    closeIcon?: React.ReactNode;
    maskClosable?: boolean;
    disableSaveBtn?: boolean;
    isLoading?: boolean;
}
const CenterModal: React.FC<CenterModalProps> = ({
    isOpen,
    onClose = () => {},
    onSave,
    title = '',
    topContent = '',
    titleColor = '#1a1a1a',
    width = 520,
    zIndex,
    height,
    children,
    customClassName = '',
    titleClassName = '',
    headerComponent,
    footerComponent,
    topContentClassName = '',
    closeIcon = (
        <CloseOutlinedIcon  />
    ),
    maskClosable,
    disableSaveBtn = false,
    isLoading = false,
}) => {
    const header =
        headerComponent ||
        (title && (
            <div
                className={cn(
                    'flex p-4 gap-2 w-full border-b border-stroke items-start justify-between mb-4 ',
                    topContentClassName
                )}
            >
                <h3 className={`text-[16px] text-[${titleColor}] font-semibold ${titleClassName}`}>
                    {title}
                </h3>
                {topContent && topContent}
            </div>
        ));

    const classNames: ModalProps['classNames'] = {
        footer: cn(
            'flex items-center justify-end w-full h-fit !rounded-b-lg !p-4 !border-t !border-stroke !border',
            footerComponent === false && '!hidden'
        ),
        content: 'flex flex-col !p-0 h-full',
        mask: '!bg-gray/40 !backdrop-blur-sm',
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            onOk={onSave}
            footer={footerComponent}
            width={width}
            zIndex={zIndex}
            className={`custom-modal ${customClassName}`}
            classNames={classNames}
            closeIcon={closeIcon}
            maskClosable={maskClosable}
            centered
            height={height}
            okButtonProps={{
                size: 'middle',
                className: 'text-[12px] h-fit px-4 py-1',
                disabled: disableSaveBtn,
                loading: isLoading,
            }}
            cancelButtonProps={{
                size: 'middle',
                className: 'text-[12px] h-fit px-4 py-1',
            }}
            okText='Save'
            cancelText='Cancel'
        >
            <div className={`flex w-full h-full flex-col`}>
                {header}
                <div
                    className={cn(
                        'px-4 h-full w-full no-scrollbar',
                        footerComponent === false && '!pb-0'
                    )}
                >
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export default CenterModal;
