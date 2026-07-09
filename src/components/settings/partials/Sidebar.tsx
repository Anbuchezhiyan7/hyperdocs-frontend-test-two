'use client';

import React from 'react';
import type { SidebarItem as SidebarItemType, SettingType } from '@/interface/settings';
import { useQueryParams } from '@/hooks/useQueryParams';
import {
    General,
    Advanced,
    Domain,
    Navigation,
    SeoSettings,
    Upgrade,
    ImportIcon,
    AuthorIcon,
} from '@/assets/icons';
import SideBarItem from './SidebarItem';

const sidebarItems: SidebarItemType[] = [
    { id: 'general', icon: General, label: 'General' },
    { id: 'author', icon: AuthorIcon, label: 'Author' },
    // { id: 'domain', icon: Domain, label: 'Domain' },
    { id: 'navigation', icon: Navigation, label: 'Navigation & Footer' },
    { id: 'advanced', icon: Advanced, label: 'Advanced' },
    { id: 'seo', icon: SeoSettings, label: 'SEO Settings' },
    { id: 'import', icon: ImportIcon, label: 'Import' },
];

const upgradeItem: SidebarItemType = {
    id: 'upgrade',
    icon: Upgrade,
    label: 'Upgrade Plan',
    isUpgrade: true,
};

const SettingsSidebar: React.FC = () => {
    const { settingType, setSettingType } = useQueryParams();

    const handleItemClick = (id: SettingType) => {
        setSettingType(id);
    };

    return (
        <div className='w-fit  bg-[#FAFAFA] h-full py-6 px-4 border-r border-[#E0E0E0]'>
            <div className='mb-5 px-2'>
                <h1 className='text-[14px] font-[600] text-[#5D5D5D]'>Settings</h1>
            </div>

            <div className='flex flex-col gap-1'>
                {sidebarItems.map(item => (
                    <SideBarItem
                        key={item.id}
                        item={item}
                        isActive={settingType === item.id}
                        onClick={handleItemClick}
                    />
                ))}
            </div>

            <div className='my-4 border-t border-[#E0E0E0]' />

            <SideBarItem
                item={upgradeItem}
                isActive={settingType === upgradeItem.id}
                onClick={handleItemClick}
            />
        </div>
    );
};

export default SettingsSidebar;
