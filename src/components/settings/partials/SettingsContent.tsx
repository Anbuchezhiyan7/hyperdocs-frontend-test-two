'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { apiGetSettings } from '@/api/settings';
import { useAppStore } from '@/store/useAppStore';
import { useQueryParams } from '@/hooks/useQueryParams';

import {
    GeneralSettings,
    DomainSettings,
    MembersSettings,
    NavAndFooterSettings,
    AdvancedSettings,
    SeoSettings,
    Upgrade,
} from '../tabs';
import ImportTab from '../tabs/Import';
import Author from '../tabs/Author';

const SettingsContent: React.FC = () => {
    const { setSettings, setIsDomainNull } = useAppStore();
    const { settingType } = useQueryParams();

    const { isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: () =>
            apiGetSettings().then(res => {
                setIsDomainNull(res?.domain === null);
                setSettings(res);
                return res;
            }),
    });

    const renderContent = () => {
        switch (settingType) {
            case 'general':
                return <GeneralSettings />;
            case 'members':
                return <MembersSettings />;
            case 'domain':
                return <DomainSettings />;
            case 'navigation':
                return <NavAndFooterSettings />;
            case 'advanced':
                return <AdvancedSettings />;
            case 'seo':
                return <SeoSettings />;
            case 'import':
                return <ImportTab />;
            case 'upgrade':
                return <Upgrade />;
            case 'author':
                return <Author />;
            default:
                return <div className='p-8'>Select a setting from the sidebar</div>;
        }
    };

    if (isLoading) {
        return (
            <div className='h-full w-full flex-center'>
                <Image
                    src='/images/loading/settings.webp'
                    width={120}
                    height={120}
                    alt='Settings Loading'
                />
            </div>
        );
    }

    return <>{renderContent()}</>;
};

export default SettingsContent;
