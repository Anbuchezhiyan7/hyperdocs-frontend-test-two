'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, SendHorizontal } from 'lucide-react';
import { TabType } from '@/assets/types';
import { useRouter, usePathname } from 'next/navigation';
import { Modal } from 'antd';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import HyperblogLogo from '@/assets/icons/HyperblogLogo';
import {
    BlogsIcon,
    CategoriesIcon,
    LeadsIcon,
    SettingsIcon,
    TagsIcon,
    TemplatesIcon,
    DashboardIcon,
    GlobeIcon,
    LeadMagnet,
} from '@/assets/icons';
import { apiGetSettings } from '@/api/settings';
import { logoutUser } from '@/utils/auth';
import Cookies from 'js-cookie';
import CreditsIndicator from '../CreditsIndicator';
import { subscriptionApi } from '@/api/subscription.api';

const Sidebar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { settings, setSettings, user } = useAppStore();
    const { data: activeSubscription } = useQuery({
        queryKey: ['active_subscription'],
        queryFn: () => subscriptionApi.handleGetActiveSubscription(),
    });
    const { data: settingsData } = useQuery({
        queryKey: ['settings'],
        queryFn: () =>
            apiGetSettings().then(res => {
                setSettings(res);
                return res;
            }),
        meta: { persist: true },
    });


    const handleLogout = () => {
        Cookies.remove('token');
        router.replace('/');
    };

    const menuGroups = [
        {
            items: [
                { icon: <BlogsIcon />, label: 'Blog Posts', path: '/blogs' },
            ]
        },
        {
            title: 'Insights',
            items: [
                { icon: <DashboardIcon />, label: 'Analytics', path: '/analytics' },
            ]
        },
        {
            title: 'Lead Generation',
            items: [
                { icon: <LeadsIcon />, label: 'Leads', path: '/leads' },
                { icon: <LeadMagnet />, label: 'Lead Library', path: '/lead-library' },
                { icon: <SendHorizontal size={18} />, label: 'Newsletter', path: '/newsletter' },
            ]
        },
        {
            title: 'Manage',
            items: [
                { icon: <TagsIcon />, label: 'Tags', path: '/tags' },
                { icon: <CategoriesIcon />, label: 'Categories', path: '/categories' },
            ]
        },
        {
            title: 'Config',
            items: [
                { icon: <GlobeIcon />, label: 'Custom Domain', path: '/custom-domain' },
                { icon: <TemplatesIcon />, label: 'Templates', path: '/template' },
                { icon: <SettingsIcon />, label: 'Settings', path: '/settings', navPath: '/settings/general' },
            ]
        }
    ];

    const [isSignoutModalOpen, setIsSignoutModalOpen] = React.useState(false);

    const initials =
        user?.name
            ?.split(' ')
            ?.map((n: string) => n?.[0])
            ?.join('')
            ?.slice(0, 2)
            ?.toUpperCase() || 'A';

    return (
        <div className='w-full bg-[#fdfdfd] h-full flex flex-col justify-between shadow-[1px_0_10px_rgba(0,0,0,0.01)]'>
            <div className='h-[69px] px-7 flex items-center border-b border-gray-200'>
                <div className='flex items-center transition-transform active:scale-95 cursor-pointer' onClick={() => router.push('/admin/analytics')}>
                    <HyperblogLogo />
                </div>
            </div>

            <div className='flex-1 overflow-y-auto border-r border-gray-200/50'>
                <div className='flex flex-col gap-4 mt-6 pb-8'>
                    {menuGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className='px-4'>
                            {group.title && (
                                <p className='px-3 mb-1.5 text-[0.62rem] font-extrabold uppercase tracking-wider text-[#3a3a3a]'>
                                    {group.title}
                                </p>
                            )}
                            <div className='flex flex-col gap-[1px]'>
                                {group.items.map(item => {
                                    const isActive = pathname === `/admin${item.path}` || (item.path !== '/analytics' && pathname.includes(item.path));
                                    return (
                                        <Link
                                            key={item.label}
                                            href={`/admin${(item as { navPath?: string }).navPath ?? item.path}`}
                                            prefetch
                                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 group ${
                                                isActive
                                                    ? 'bg-gray-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className={`mr-2.5 transition-all duration-300 ${isActive ? 'scale-110' : 'text-gray-400 group-hover:text-gray-900'}`}>
                                                {React.cloneElement(item.icon as React.ReactElement, {
                                                    size: 17,
                                                    fill: 'currentColor',
                                                    className: 'shrink-0 transition-colors duration-300'
                                                })}
                                            </span>
                                            <span className={`text-[0.855rem] font-semibold tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='p-4 mt-auto border-r border-gray-200/50'>
                <div className='relative bg-gradient-to-br from-orange-50 to-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(255,138,76,0.08)] border border-orange-100 mb-3 overflow-hidden'>
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-xl pointer-events-none" />
                    <CreditsIndicator
                        className='w-full !flex-col !items-start !bg-transparent !p-0 relative z-10 !gap-1.5'
                        activeSubscription={activeSubscription as ActiveSubscription}
                    />
                </div>

                <button
                    onClick={() => setIsSignoutModalOpen(true)}
                    className='group flex items-center gap-3 w-full px-2 py-2 rounded-2xl transition-all duration-300 hover:bg-red-50/70'
                >
                    {user?.picture ? (
                        <Image
                            src={user?.picture}
                            alt={user?.name || 'User'}
                            width={40}
                            height={40}
                            className='w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0'
                        />
                    ) : (
                        <div className='w-10 h-10 rounded-full bg-orange-50 text-[#FF5200] flex items-center justify-center text-[13px] font-bold shrink-0'>
                            {initials}
                        </div>
                    )}
                    <div className='flex-1 min-w-0 text-left'>
                        <p className='text-[0.855rem] font-bold text-gray-900 group-hover:text-[#FF5200] truncate leading-tight transition-colors duration-300'>
                            {user?.name || 'Account'}
                        </p>
                        <p className='text-[0.72rem] text-gray-500 truncate mt-0.5'>
                            {user?.email || ''}
                        </p>
                    </div>
                    <LogOut
                        size={16}
                        className='shrink-0 text-gray-400 group-hover:text-[#FF5200] transition-colors duration-300'
                    />
                </button>
            </div>

            <Modal
                title="Sign Out"
                open={isSignoutModalOpen}
                onOk={() => {
                    setIsSignoutModalOpen(false);
                    logoutUser();
                }}
                onCancel={() => setIsSignoutModalOpen(false)}
                okText="Sign Out"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
                centered
            >
                <p>Are you sure you want to sign out?</p>
            </Modal>
        </div>
    );
};

export default Sidebar;