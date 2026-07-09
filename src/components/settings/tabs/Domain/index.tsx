'use client';
import {
    apiConnectdomain,
    apiDisconnectdomain,
    apiGetSubFolderSelectedTypes,
    apiGetSubFolderTypes,
} from '@/api/settings';
import Loader from '@/components/common/Loader';
import { DOMAIN_URL } from '@/constants/definitions';
import { useAppStore } from '@/store/useAppStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import RefreshUI from './RefreshUI';
import SubFolderInstructions from './SubFolderInstructions';
import Urls from './Urls';
import ConnectView from './ConnectView';
import SubDomainInstruction from './SubDomainInstruction';
import MainDomainInstructionCard from './MainDomainInstructionCard';
import SubFolderIntegration from './SubFolder/SubFolderIntegration';
import DomainWarning from './DomainWarning';
import { Globe, FolderOpen, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DOMAIN_LABELS: Record<string, string> = {
    sub_domain: 'Subdomain',
    main_domain: 'Domain',
    sub_folder: 'Subfolder',
};

const Domain = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(false);
    const [subDomainLoading, setSubDomainLoading] = useState(false);
    const [mainDomainLoading, setMainDomainLoading] = useState(false);
    const [inputValue, setInputValue] = useState({
        main_domain: '',
        sub_domain: '',
        sub_folder: '',
    });
    const [error, setError] = useState({
        main_domain: '',
        sub_domain: '',
        sub_folder: '',
    });
    const { settings, isDomainNull, setSettings } = useAppStore();
    const [mainDomain, setMainDomain] = useState<string | null>(null);
    const [connected, setConnected] = useState<boolean | null>(false);
    const [showRefreshUI, setShowRefreshUI] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [showSubDomain, setShowSubDomain] = useState(false);

    const isSubDomainPresent = !!(
        settings?.domain?.sub_domain &&
        typeof settings.domain.sub_domain === 'string' &&
        settings.domain.sub_domain.trim().length > 0
    );
    const isMainDomainPresent = !!(
        settings?.domain?.main_domain &&
        typeof settings.domain.main_domain === 'string' &&
        settings.domain.main_domain.trim().length > 0
    );
    const isSubFolderPresent = !!(
        settings?.domain?.sub_folder &&
        typeof settings.domain.sub_folder === 'string' &&
        settings.domain.sub_folder.trim().length > 0
    );

    const isSubDomainRestricted = isSubFolderPresent || isMainDomainPresent;
    const isMainDomainRestricted = isSubFolderPresent || isSubDomainPresent;
    const isSubFolderRestricted = isSubDomainPresent || isMainDomainPresent;

    const getSubFolderTypes = async () => {
        if (selectedType === '') {
            return;
        }
        const res = await apiGetSubFolderTypes(selectedType);
        setSelectedType(res.data.type);
        return res;
    };

    const getSubFolderSelectedTypes = async () => {
        const res: any = await apiGetSubFolderSelectedTypes();
        console.log(res.data, 'res in getSubFolderSelectedTypes');
        if (res.data !== null) {
            setSelectedType(res.data);
        }
        return res;
    };

    const { data: subFolderTypes, refetch } = useQuery({
        queryKey: ['sub_folder_types', selectedType],
        queryFn: () => getSubFolderTypes(),
        enabled: !!selectedType && selectedType !== '',
    });

    const { data: subFolderSelectedTypes } = useQuery({
        queryKey: ['sub_folder_selected_types'],
        queryFn: () => getSubFolderSelectedTypes(),
        enabled: settings.domain.sub_folder !== '',
    });

    const handleInputChange = (key: string, value: string) => {
        setInputValue(prev => ({ ...prev, [key]: value }));
        setError(prev => ({ ...prev, [key]: '' }));
    };

    const handleTrimEnteredValue = (value: string, type: string) => {
        if (type === 'sub_domain') {
            return value.toLowerCase().trim().replace(/\s+/g, '');
        } else if (type === 'main_domain') {
            return value.toLowerCase().trim().replace(/\s+/g, '');
        } else {
            return value.toLowerCase().trim().replace(/\s+/g, '');
        }
    };

    const handleConnect = async (payload: any, type: string) => {
        if (type === 'sub_domain') {
            setSubDomainLoading(true);
        } else if (type === 'main_domain') {
            setMainDomainLoading(true);
        } else {
            setLoading(true);
        }
        await apiConnectdomain(payload)
            .then(async res => {
                console.log('CONNECT RES', res);
                if (type === 'main_domain') {
                    await queryClient.invalidateQueries({ queryKey: ['settings'] });
                    setMainDomain(res.data.domain.main_domain);
                    setConnected(res.data.domain.domain_connected);
                    toast.success(`${DOMAIN_LABELS[type]} connected successfully`);
                }
                if (type === 'sub_domain') {
                    await queryClient.invalidateQueries({ queryKey: ['settings'] });
                    setConnected(res.data.domain.domain_connected);
                    setInputValue(prev => ({ ...prev, sub_domain: payload.sub_domain }));
                    toast.success(`${DOMAIN_LABELS[type]} connected successfully`);
                    if (!res.data?.domain?.domain_connected) {
                        setShowRefreshUI(true);
                    }
                } else if (type === 'sub_folder' && !res.data?.domain?.domain_connected) {
                    setShowRefreshUI(true);
                } else if (type === 'sub_folder' && res.data?.domain?.domain_connected) {
                    setSelectedType('');
                    await queryClient.invalidateQueries({ queryKey: ['settings'] });
                    setConnected(res.data.domain.domain_connected);
                }
            })
            .catch(err => {
                console.log('ERR', err);
                if (err?.status === 400) {
                    setError(prev => ({ ...prev, [type]: err.message }));
                }
                if (type === 'sub_domain' || type === 'main_domain') {
                    toast.error(
                        err?.message || `Failed to connect ${DOMAIN_LABELS[type]?.toLowerCase()}`
                    );
                }
            })
            .finally(() => {
                if (type === 'sub_domain') {
                    setSubDomainLoading(false);
                } else if (type === 'main_domain') {
                    setMainDomainLoading(false);
                } else {
                    setLoading(false);
                }
            });
    };

    const handleSubdomain = async () => {
        if (isSubDomainRestricted) return;
        const trimmedValue = handleTrimEnteredValue(inputValue.sub_domain, 'sub_domain');
        if (trimmedValue.toLowerCase().includes('.hyperblog.cloud')) {
            setError(prev => ({
                ...prev,
                sub_domain: 'Subdomain cannot contain .hyperblog.cloud',
            }));
            return;
        }
        handleConnect({ sub_domain: trimmedValue }, 'sub_domain');
    };

    const handleMainDomain = async () => {
        if (isMainDomainRestricted) return;
        handleConnect({ main_domain: handleTrimEnteredValue(inputValue.main_domain, 'main_domain') }, 'main_domain');
    };

    const handleSubFolder = async () => {
        handleConnect({ sub_folder: handleTrimEnteredValue(inputValue.sub_folder, 'sub_folder') }, 'sub_folder');
    };

    const handleDisconnect = async (type: string) => {
        if (type === 'sub_domain') {
            setSubDomainLoading(true);
        } else if (type === 'main_domain') {
            setMainDomainLoading(true);
        } else {
            setLoading(true);
        }
        await apiDisconnectdomain(type)
            .then(async () => {
                await queryClient.invalidateQueries({ queryKey: ['settings'] });
                setConnected(false);
                setMainDomain(null);
                setShowRefreshUI(false);
                setInputValue({ main_domain: '', sub_domain: '', sub_folder: '' });
                toast.success(`${DOMAIN_LABELS[type] || 'Domain'} disconnected successfully`);
            })
            .catch((err: any) => {
                toast.error(
                    err?.message || `Failed to disconnect ${DOMAIN_LABELS[type]?.toLowerCase() || 'domain'}`
                );
            })
            .finally(() => {
                if (type === 'sub_domain') {
                    setSubDomainLoading(false);
                } else if (type === 'main_domain') {
                    setMainDomainLoading(false);
                } else {
                    setLoading(false);
                }
            });
    };

    const handleSubdomainDisconnect = () => handleDisconnect('sub_domain');
    const handleMainDomainDisconnect = () => handleDisconnect('main_domain');

    const isOnlyDefaultDomain = !!(
        settings?.domain?.main_domain === null &&
        settings?.domain?.sub_domain === null &&
        settings?.domain?.sub_folder === null
    );

    const effectiveConnected = isOnlyDefaultDomain
        ? settings?.domain?.default_connected === true
        : connected || false;

    const shouldShowPendingMessage = !!(
        settings?.domain?.main_domain === null &&
        settings?.domain?.sub_domain === null &&
        settings?.domain?.sub_folder === null &&
        settings?.domain?.domain_connected === false &&
        settings?.domain?.default &&
        typeof settings.domain.default === 'string' &&
        settings.domain.default.trim().length > 0 &&
        settings?.domain?.default_connected === false
    );

    const handleRefresh = () => {
        setLoading(true);
        queryClient.invalidateQueries({ queryKey: ['settings'] }).then(() => {
            setLoading(false);
            setShowRefreshUI(false);
        });
    };

    useEffect(() => {
        if (isDomainNull) {
            setConnected(null);
        } else if (!settings.domain.domain_connected && settings?.domain?.sub_domain && typeof settings.domain.sub_domain === 'string' && settings.domain.sub_domain.length > 0) {
            setShowRefreshUI(true);
            setInputValue(prev => ({
                ...prev,
                sub_domain: settings.domain.sub_domain || prev.sub_domain,
            }));
        } else {
            setConnected(settings.domain.domain_connected);
            setMainDomain(settings.domain.main_domain);
            setShowRefreshUI(false);
            setInputValue(prev => ({
                ...prev,
                main_domain: settings.domain.main_domain || prev.main_domain,
                sub_domain: settings.domain.sub_domain || prev.sub_domain,
            }));
        }
    }, [settings, isDomainNull]);

    useEffect(() => {
        if (settings?.domain?.sub_folder) {
            setShowSubDomain(false);
        } else {
            setShowSubDomain(true);
        }
    }, [settings?.domain?.sub_folder]);

    useEffect(() => {
        if (isSubDomainPresent) {
            setActiveTab('1');
        } else if (isMainDomainPresent) {
            setActiveTab('3');
        }
    }, [isSubDomainPresent, isMainDomainPresent]);

    const isSubDomainConnected = isSubDomainPresent;
    const isMainDomainConnected = isMainDomainPresent;

    const tabConfig = [
        { key: '1', icon: <Globe size={15} />, label: 'Sub Domain', badge: null },
        { key: '2', icon: <FolderOpen size={15} />, label: 'Sub Folder', badge: 'Recommended' },
        { key: '3', icon: <Link2 size={15} />, label: 'Main Domain', badge: null },
    ];

    const tabContent: Record<string, React.ReactNode> = {
        '1': (
            <div className="flex flex-col gap-3">
                <DomainWarning isVisible={isSubDomainRestricted} />
                <div className="relative">
                    {isSubDomainRestricted && (
                        <div className="absolute inset-0 z-50 bg-white/40 cursor-not-allowed rounded-xl" />
                    )}
                    <Urls
                        addonBefore={`https://${DOMAIN_URL}/`}
                        onConnect={handleSubdomain}
                        onDisconnect={handleSubdomainDisconnect}
                        value={inputValue.sub_domain || settings?.domain?.sub_domain || ''}
                        onChange={value => handleInputChange('sub_domain', value)}
                        loading={subDomainLoading}
                        disabled={isSubDomainConnected}
                        isConnected={isSubDomainConnected}
                        error={error.sub_domain}
                        placeholder="example.subdomain.com"
                        hideAddonAfter={true}
                    />
                </div>
            </div>
        ),
        '2': (
            <div className="flex flex-col h-full">
                <DomainWarning isVisible={isSubFolderRestricted} />
                <div className="relative">
                    {isSubFolderRestricted && (
                        <div className="absolute inset-0 z-50 bg-white/40 cursor-not-allowed rounded-xl" />
                    )}
                    <SubFolderIntegration />
                </div>
            </div>
        ),
        '3': (
            <div className="flex flex-col gap-3">
                <DomainWarning isVisible={isMainDomainRestricted} />
                <div className="relative">
                    {isMainDomainRestricted && (
                        <div className="absolute inset-0 z-50 bg-white/40 cursor-not-allowed rounded-xl" />
                    )}
                    <Urls
                        addonBefore="https://"
                        onConnect={handleMainDomain}
                        onDisconnect={handleMainDomainDisconnect}
                        value={inputValue.main_domain || settings?.domain?.main_domain || ''}
                        onChange={value => handleInputChange('main_domain', value)}
                        loading={mainDomainLoading}
                        disabled={isMainDomainConnected || false}
                        isConnected={isMainDomainConnected || false}
                        error={error.main_domain}
                        placeholder="example.com"
                        hideAddonAfter={true}
                    />
                </div>
            </div>
        ),
    };

    return (
        <div className="h-full">
            {loading && <Loader />}

            <ConnectView connected={effectiveConnected} />

            {shouldShowPendingMessage && (
                <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0 animate-pulse" />
                    <p className="text-[13px] text-[#333] font-medium leading-relaxed">
                        We're connecting your domain to your Hyperblog account. Please wait—this
                        will be configured within an hour.
                    </p>
                </div>
            )}

            {/* Section Header */}
            <div className="mb-5">
                <h2 className="text-[22px] font-bold text-[#111]">Custom Domains</h2>
                <p className="text-[13px] text-[#8F8F8F] font-medium mt-1">
                    Connect your own domain to Hyperblog in any format you like.
                </p>
            </div>

            {/* Custom Pill Tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-2xl w-fit mb-6">
                {tabConfig.map(tab => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 whitespace-nowrap',
                                isActive
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            )}
                        >
                            <span className={isActive ? 'text-[#FF5200]' : ''}>{tab.icon}</span>
                            {tab.label}
                            {tab.badge && (
                                <span className="absolute -top-2 -right-2 text-[9px] font-bold text-white bg-[#FF5200] rounded-full px-1.5 py-0.5 leading-none">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    {tabContent[activeTab]}
                </div>

                {connected === false && isSubDomainPresent && activeTab === '1' && (
                    <div className="mt-4">
                        <SubDomainInstruction />
                    </div>
                )}
                {connected === false && isMainDomainPresent && activeTab === '3' && (
                    <div className="mt-4">
                        <MainDomainInstructionCard />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Domain;
