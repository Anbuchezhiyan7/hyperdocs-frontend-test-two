'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import type { SidebarItem as SidebarItemType } from '@/interface/settings';
import {
    General,
    Advanced,
    Navigation,
    SeoSettings,
    Upgrade,
    ImportIcon,
    AuthorIcon,
    MembersIcon,
} from '@/assets/icons';

interface NavGroup {
    title?: string;
    items: SidebarItemType[];
}

const navGroups: NavGroup[] = [
    {
        title: 'Workspace',
        items: [
            { id: 'general', icon: General, label: 'General' },
            { id: 'author', icon: AuthorIcon, label: 'Author' },
            { id: 'navigation', icon: Navigation, label: 'Navigation & Footer' },
        ],
    },
    {
        title: 'Teams',
        items: [{ id: 'invite', icon: MembersIcon, label: 'Invite' }],
    },
    {
        title: 'Notifications',
        items: [{ id: 'notifications', icon: General, label: 'Email Notifications' }],
    },
    {
        title: 'Optimization',
        items: [
            { id: 'seo', icon: SeoSettings, label: 'SEO Settings' },
            { id: 'advanced', icon: Advanced, label: 'Advanced' },
        ],
    },
    {
        title: 'Data',
        items: [{ id: 'import', icon: ImportIcon, label: 'Import' }],
    },
    {
        title: 'Billing',
        items: [
            { id: 'upgrade', icon: Upgrade, label: 'Upgrade Plan', isUpgrade: true },
        ],
    },
];

const SettingsNav: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className='w-[220px] shrink-0 bg-[#FAFAFA] h-full py-6 px-3 border-l border-r border-[#E0E0E0] overflow-y-auto'>
            <div className='-mx-3 -mt-6 mb-5 px-6 py-4 border-b border-[#E0E0E0]'>
                <h1 className='text-[14px] font-[600] text-[#5D5D5D]'>Settings</h1>
            </div>

            <div className='flex flex-col gap-4'>
                {navGroups?.map?.((group, groupIdx) => (
                    <div key={groupIdx}>
                        {group?.title && (
                            <p className='px-3 mb-1.5 text-[0.62rem] font-extrabold uppercase tracking-wider text-[#9a9a9a]'>
                                {group.title}
                            </p>
                        )}
                        <div className='flex flex-col gap-[1px]'>
                            {group?.items?.map?.(item => {
                                const href = `/admin/settings/${item?.id}`;
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={item?.id}
                                        href={href}
                                        prefetch
                                        className={cn(
                                            'group relative w-full whitespace-nowrap flex items-center gap-3 px-3 py-2 rounded-lg text-[0.855rem] font-[600] transition-colors duration-300',
                                            isActive
                                                ? 'bg-[#E6E6E6] text-[#333]'
                                                : 'hover:bg-gray-100 text-[#5D5D5D]'
                                        )}
                                    >
                                        {isActive && (
                                            <span className='absolute left-0 top-[20%] bottom-[20%] w-[2.5px] rounded-sm bg-[#333]' />
                                        )}
                                        {item?.icon && (
                                            <span className='w-5 h-5 flex items-center shrink-0 [&_path]:fill-current'>
                                                {React.createElement(item.icon)}
                                            </span>
                                        )}
                                        <span>{item?.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SettingsNav;
