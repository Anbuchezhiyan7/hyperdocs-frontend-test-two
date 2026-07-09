'use client';

import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

interface AntTabsProps extends Omit<TabsProps, 'className'> {
    customClassName?: string;
    extraContent?: React.ReactNode;
}

const defaultClassName =
    '[&_.ant-tabs-tab]:text-[#5d5d5d]  [&_.ant-tabs-tab]:!text-[15px] \
    [&_.ant-tabs-tab:hover]:text-[#333] \
    [&_.ant-tabs-tab.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#333] \
    [&_.ant-tabs-ink-bar]:bg-[#333] [&_.ant-tabs-ink-bar]:rounded-t-[4px] [&_.ant-tabs-ink-bar]:!h-[4px] \
    [&_.ant-tabs-nav]:bg-white \
    [&_.ant-tabs-tab]:focus:!text-[#333] [&_.ant-tabs-tab]:focus:font-semibold [&_.ant-tabs-tab]:focus:text-[14px] \
    [&_.ant-tabs-tab-btn]:focus:!text-[#333] [&_.ant-tabs-tab-btn]:active:!text-[#333] [&_.ant-tabs-tab-btn]:[&:focus,:active]:font-semibold [&_.ant-tabs-tab-btn]:[&:focus,:active]:text-[14px] \
    [&_.ant-tabs-tab-btn]:!text-inherit [&_.ant-tabs-tab-btn]:flex [&_.ant-tabs-tab-btn]:items-center ';

const AntTabs: React.FC<AntTabsProps> = ({ customClassName = '', extraContent, ...props }) => {
    return (
        <div className="relative">
            <Tabs {...props} className={`${defaultClassName} ${customClassName}`} />
            {extraContent && (
                <div className="absolute right-0 top-0 h-[46px] flex items-center">
                    {extraContent}
                </div>
            )}
        </div>
    );
};

export default AntTabs;
