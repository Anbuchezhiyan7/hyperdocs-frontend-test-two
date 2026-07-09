import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { cn } from '@/utils/cn';
import { CloseOutlinedIcon } from '@/assets/icons';

const FloatingModal: React.FC<FloatingModalProps> = ({
    icon,
    btnLabel,
    title,
    children,
    primayBtnLabel = 'Save',
    secondaryBtnLabel = 'Cancel',
    hideHeader = false,
    hideFooter = false,
    btnClassName = '',
    rootClassName = '',
    headerClassName = '',
    titleClassName = '',
    bodyClassName = '',
    footerClassName = '',
    header,
    footer,
    onSave,
    onClose,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    const renderHeader = () => {
        if (hideHeader) return null;
        return (
            <div className="px-4 py-3">
                {header ?? (
                    <div className={cn('flex items-center justify-between gap-2', headerClassName)}>
                        <h6 className={cn('text-lg font-bold', titleClassName)}>
                            {title || btnLabel}
                        </h6>
                        <span onClick={handleClose}>
                            <CloseOutlinedIcon />
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const renderFooter = () => {
        if (hideFooter) return null;
        return (
            <div className="px-4 py-3">
                {footer ?? (
                    <div
                        className={cn(
                            'flex items-center justify-end w-full gap-2',
                            footerClassName
                        )}
                    >
                        <Button type="default" onClick={onClose} className="rounded-xl h-9">
                            {secondaryBtnLabel}
                        </Button>
                        <Button
                            type="primary"
                            onClick={onSave || onClose}
                            className="rounded-xl h-9"
                        >
                            {primayBtnLabel}
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    const popoverContent = (
        <div className={cn('min-w-[400px] flex flex-col divide-y', rootClassName)}>
            {renderHeader()}
            <div className={cn('px-4 py-3', bodyClassName)}>{children}</div>
            {renderFooter()}
        </div>
    );

    return (
        <Popover
            content={popoverContent}
            trigger="click"
            open={isOpen}
            onOpenChange={setIsOpen}
            placement="bottomRight"
            styles={{ body: { padding: 0 } }}
        >
            <Button className={cn('flex items-center gap-2', btnClassName)}>
                {icon} {btnLabel}
            </Button>
        </Popover>
    );
};

export default FloatingModal;
