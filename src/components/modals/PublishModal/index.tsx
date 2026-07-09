'use client';

import React from 'react';
import { Button, Modal } from 'antd';
import { CloseOutlinedIcon } from '@/assets/icons';

interface RightModelProps {
    headerText: string;
    children: React.ReactNode;
    isModalOpen: boolean;
    onOk: () => void;
    onCancel: () => void;
    footerContent?: React.ReactNode;
    isLoading?: boolean;
}

const RightModel: React.FC<RightModelProps> = ({
    headerText,
    children,
    isModalOpen,
    onOk,
    onCancel,
    footerContent,
    isLoading,
}) => {
    const Footer = () => {
        if (footerContent) {
            return (
                <div className="flex w-full px-6 pt-4">
                    <Button
                        onClick={onOk}
                        type="primary"
                        className="w-full h-[48px] rounded-[15px] bg-[#FF4D00] hover:bg-[#FF4D00] text-[16px]"
                    >
                        View Site
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex w-full justify-between gap-2 px-6 ">
                <Button type="default" onClick={onCancel} className="w-full rounded-[15px]">
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={onOk}
                    className="w-full rounded-[15px]"
                    loading={isLoading}
                >
                    Publish
                </Button>
            </div>
        );
    };

    return (
        <Modal
            title={
                <div className="flex items-center px-6 py-2">
                    <span className="text-[20px] font-[700] text-[#333] ">{headerText}</span>
                </div>
            }
            open={isModalOpen}
            onOk={onOk}
            onCancel={onCancel}
            footer={<Footer />}
            closeIcon={
                <CloseOutlinedIcon/>
            }
            style={{ position: 'absolute', top: 100, right: 80 }}
            styles={{
                mask: {
                    background: 'rgba(255, 255, 255, 0.40)',
                    backdropFilter: 'blur(4px)',
                },
            }}
            wrapClassName="[&_.ant-modal-content]:rounded-[20px] [&_.ant-modal-content]:border-[1px] [&_.ant-modal-content]:border-[#E0E0E0] [&_.ant-modal-close:hover]:bg-transparent"
        >
            {children}
        </Modal>
    );
};

export default RightModel;
