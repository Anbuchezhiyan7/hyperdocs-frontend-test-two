'use client';

import React, { useState } from 'react';
import { Modal } from 'antd';
import AntTabs from '@/components/common/AntTabs';
import CreditsIndicator from '@/components/common/CreditsIndicator';
import { queryClient } from '@/config/query.config';
interface TabsModelProps {
    isOpen: boolean;
    onClose: () => void;
    tabs: {
        key: string;
        label: React.ReactNode;
        content: React.ReactNode;
        icon?: React.ReactNode;
    }[];
}

const TabsModel: React.FC<TabsModelProps> = ({ isOpen, onClose, tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].key);
    const activeSubscription = queryClient.getQueryData<ActiveSubscription>([
        'active_subscription',
    ]);

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
            className='[&_.ant-modal-close-x]:!text-[#5d5d5d] [&_.ant-modal-close]:mt-2 relative  [&_.ant-modal-close-x:hover]:!text-[#333]'
        >
            <AntTabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabs.map(tab => ({
                    key: tab.key,
                    label: tab.label,
                    icon: tab.icon,
                    className: '[&_.ant-tabs-tab-btn]:flex min-h-[250px]',
                    children: <div className='p-4'>{tab.content}</div>,
                }))}
            />
            <CreditsIndicator
                className='w-fit absolute top-5 right-12 !items-start rounded-lg !p-2 !px-4'
                activeSubscription={activeSubscription as ActiveSubscription}
            />
        </Modal>
    );
};

export default TabsModel;
