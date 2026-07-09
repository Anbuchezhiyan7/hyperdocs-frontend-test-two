'use client';

import React from 'react';
import { Button, Tooltip } from 'antd';
import { GlobeIcon } from '@/assets/icons';
import { useQuery } from '@tanstack/react-query';
import { apiGetSettings } from '@/api/settings';
import { useAppStore } from '@/store/useAppStore';
import { AllSettings } from '@/interface/settings';

const resolveDomainInfo = (settingsData?: AllSettings, settings?: AllSettings) => {
    const domainSettings = settings?.domain ?? settingsData?.domain;
    if (!domainSettings) return { domain: '', isConnected: false };

    const { 
        main_domain, 
        sub_domain, 
        sub_folder, 
        sub_folder_domain,
        sub_folder_connected,
        default: defaultDomain, 
        domain_connected, 
        default_connected 
    } = domainSettings as any;

    if (main_domain) return { domain: main_domain, isConnected: true };
    if (sub_domain) return { domain: sub_domain, isConnected: true };
    if (sub_folder && sub_folder_domain) {
        const path = sub_folder.startsWith('/') ? sub_folder : `/${sub_folder}`;
        const cleanDomain = sub_folder_domain.endsWith('/') ? sub_folder_domain.slice(0, -1) : sub_folder_domain;
        return { domain: `${cleanDomain}${path}`, isConnected: !!sub_folder_connected };
    }
    if (defaultDomain) return { domain: defaultDomain, isConnected: !!default_connected };

    return { domain: '', isConnected: false };
};

const ViewBlogButton: React.FC = () => {
    const { settings, setSettings } = useAppStore();

    const { data: settingsData } = useQuery<AllSettings>({
        queryKey: ['settings'],
        queryFn: () => apiGetSettings().then(res => {
            setSettings(res);
            return res;
        }),
        meta: { persist: true },
    });

    const { domain: resolvedDomain, isConnected } = resolveDomainInfo(settingsData, settings);
    const hasDomain = Boolean(resolvedDomain && resolvedDomain.trim().length > 0);
    const isPending = hasDomain && !isConnected;

    const handleClick = () => {
        if (!resolvedDomain || typeof window === 'undefined') return;
        window.open(`https://${resolvedDomain}`, '_blank');
    };

    if (!hasDomain) return null;

    return (
        <Tooltip title={isPending ? "Your site is being provisioned. This usually takes 2-5 minutes for DNS and SSL to propagate." : ""}>
            <span>
                <Button
                    type='default'
                    onClick={handleClick}
                    disabled={isPending}
                    className='flex items-center gap-2 h-9 px-4 rounded-lg font-medium text-[#5D5D5D] border-[#E0E0E0] hover:!text-[#FF5200] hover:!border-[#FFC7A8] hover:!bg-[#FFF9F5] transition-colors'
                >
                    <GlobeIcon />
                    View Blog
                </Button>
            </span>
        </Tooltip>
    );
};

export default ViewBlogButton;
