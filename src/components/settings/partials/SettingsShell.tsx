'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGetSettings } from '@/api/settings';
import { useAppStore } from '@/store/useAppStore';
import Navbar from '@/components/common/Navbar';
import { SettingsIcon } from '@/assets/icons';
import SettingsNav from './SettingsNav';
import SettingsSkeleton from './SettingsSkeleton';

const SettingsShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setSettings, setIsDomainNull } = useAppStore();
    const pathname = usePathname();

    // Wide comparison tables (Upgrade/plans) need full width; form tabs stay centered.
    const isFullWidth =
        pathname?.includes('/settings/upgrade') || pathname?.includes('/settings/invite');

    // These routes fetch and render their own data (and skeletons), so the generic
    // settings skeleton is irrelevant noise on them.
    const selfLoadingRoutes = ['/settings/author', '/settings/upgrade', '/settings/invite'];
    const usesShellSkeleton = !selfLoadingRoutes.some(route => pathname?.includes(route));

    const { isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: () =>
            apiGetSettings().then(res => {
                setIsDomainNull(res?.domain === null);
                setSettings(res);
                return res;
            }),
    });

    const showSkeleton = isLoading && usesShellSkeleton;

    return (
        <div className='flex flex-col h-full w-full overflow-hidden bg-white'>
            <Navbar title='Settings' titleIcon={<SettingsIcon />} hideSearch hideBtn />
            <div className='flex flex-1 min-h-0 w-full overflow-hidden'>
                <SettingsNav />
                <main className='h-full flex-1 min-w-0 bg-white px-6 py-8 overflow-y-auto'>
                    <div className={`${isFullWidth ? 'max-w-none' : 'max-w-[760px]'} mx-auto h-full w-full`}>
                        {showSkeleton ? <SettingsSkeleton /> : children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsShell;
