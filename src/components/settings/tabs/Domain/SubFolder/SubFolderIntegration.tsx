'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import FrameworkSelector from './FrameworkSelector';
import IntegrationStep from './IntegrationStep';
import { useAppStore } from '@/store/useAppStore';
import { Button, Tooltip, Modal } from 'antd';
import { toast } from 'sonner';
import { apiSubFolderIntegration, apiDisconnectdomain } from '@/api/settings';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

const SubFolderIntegration = () => {
    const { settings } = useAppStore();
    const queryClient = useQueryClient();
    
    const [isApiConnected, setIsApiConnected] = useState(!!settings.domain.sub_folder);
    const [isDisconnectModalVisible, setIsDisconnectModalVisible] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFramework, setSelectedFramework] = useState<'wordpress' | 'nextjs' | null>(!!settings.domain.sub_folder ? ((settings.domain as any).sub_folder_framework || 'nextjs') : null);
    const [subFolder, setSubFolder] = useState('blogs');
    const [isLoading, setIsLoading] = useState(false);

    const domain = settings.domain.main_domain || 
                   settings.domain.sub_domain || 
                   settings.domain.sub_folder || 
                   settings.domain.default || '';
    const hasDomain = domain && domain.trim().length > 0;

    const [domainInput, setDomainInput] = useState(isApiConnected ? (domain || 'example.com') : '');
    const [domainError, setDomainError] = useState('');

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
        setDomainInput(val);
        
        if (val) {
            const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
            if (!domainRegex.test(val)) {
                setDomainError("Enter a valid domain name");
            } else {
                setDomainError("");
            }
        } else {
            setDomainError("");
        }
    };

    const isUrlValid = domainInput.trim().length > 0 && domainError === '';

    const handleNext = async () => {
        if (settings.domain?.main_domain || settings.domain?.sub_domain) {
            return;
        }

        if (currentStep < 2 && selectedFramework && hasDomain && isUrlValid && subFolder.trim().length > 0) {
            setIsLoading(true);
            try {
                const payload = {
                    sub_folder_domain: domainInput,
                    sub_directory: subFolder.trim(),
                    sub_folder_framework: selectedFramework,
                };
                const res = await apiSubFolderIntegration(payload);
                if (res.success) {
                    await queryClient.invalidateQueries({ queryKey: ['settings'] });
                    toast.success(res.message || 'Integration configured successfully');
                    setCurrentStep(currentStep + 1);
                    setIsApiConnected(true);
                } else {
                    toast.error(res.message || 'Failed to configure integration');
                }
            } catch (error: any) {
                toast.error(error?.message || 'Something went wrong');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleDisconnect = () => {
        setIsDisconnectModalVisible(true);
    };

    const confirmDisconnect = async () => {
        setIsLoading(true);
        try {
            const res = await apiDisconnectdomain('sub_folder');
            if (res.success) {
                await queryClient.invalidateQueries({ queryKey: ['settings'] });
                setIsApiConnected(false);
                setDomainInput('');
                setSelectedFramework(null);
                setCurrentStep(1);
                setIsDisconnectModalVisible(false);
                toast.success('Disconnected successfully');
            } else {
                toast.error('Failed to disconnect');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to disconnect');
        } finally {
            setIsLoading(false);
            setIsDisconnectModalVisible(false);
        }
    };

    const displayUrl = `https://${(settings.domain as any).sub_folder_domain || domainInput}/${settings.domain.sub_folder ? settings.domain.sub_folder.replace(/^\/+/, '') : subFolder}`;

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            {/* Background Decorative elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex flex-col gap-1 mb-8">
                    <h3 className="text-[24px] font-bold text-[#1A1A1A]">
                        {isApiConnected || currentStep === 2 ? 'Integration Instructions' : ''}
                    </h3>
                    <div className="flex flex-col">
                        <p className="text-[14px] text-gray-500 font-medium">
                            {isApiConnected || currentStep === 2
                                ? `Follow these steps to integrate ${selectedFramework === 'nextjs' ? 'Next.js' : 'WordPress'} with Hyperblog`
                                : 'Select your website framework to get started'}
                        </p>
                        {(isApiConnected || currentStep === 2) && (
                            <p className="text-[13px] text-orange-600 font-semibold mt-1">
                                Note: Please perform these steps in your source code.
                            </p>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        {isApiConnected ? (
                            <motion.div
                                key="connected"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex flex-col"
                            >
                                {/* Connected Status Banner */}
                                <div className="mb-10 p-5 bg-white border border-green-200 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                                    <div className="flex flex-col gap-1 ml-2">
                                        <span className="text-[13px] text-green-600 font-bold uppercase tracking-wider">Configuration Saved</span>
                                        <div className="flex items-center text-[#1A1A1A] mt-1">
                                            <span className="font-semibold text-[15px]">{displayUrl}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={handleDisconnect}
                                        className="h-[40px] px-6 rounded-xl border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-semibold transition-all shadow-sm"
                                    >
                                        Disconnect
                                    </Button>
                                </div>

                                <IntegrationStep framework={selectedFramework} subFolder={subFolder || 'blogs'} />
                            </motion.div>
                        ) : currentStep === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex flex-col items-center"
                            >
                                {/* URL and Sub-Directory Input Section */}
                                <div className="mb-12 w-full max-w-2xl mx-auto flex items-start gap-4">
                                    {/* Domain Input */}
                                    <div className="flex-[1.2] relative">
                                        <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                                            URL
                                        </label>
                                        <div className="flex items-center">
                                            <div className="bg-[#EBEBEB] text-gray-600 px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 font-medium whitespace-nowrap">
                                                https://
                                            </div>
                                            <input 
                                                type="text" 
                                                value={domainInput} 
                                                onChange={handleDomainChange}
                                                placeholder="example.com"
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-r-xl border bg-white text-gray-700 outline-none transition-all",
                                                    domainError 
                                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                                                        : "border-gray-200 focus:border-[#FF5200] focus:ring-1 focus:ring-[#FF5200]"
                                                )}
                                            />
                                        </div>
                                        {domainError && (
                                            <p className="absolute text-[12px] text-red-500 font-medium mt-1">
                                                {domainError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sub-Directory Input */}
                                    <div className="flex-1">
                                        <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                                            Sub-Directory Name
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-gray-400 font-semibold">/</span>
                                            <input 
                                                type="text" 
                                                value={subFolder} 
                                                onChange={(e) => setSubFolder(e.target.value.replace(/^\/+/, ''))} 
                                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF5200] focus:ring-1 focus:ring-[#FF5200] outline-none transition-all"
                                                placeholder="blogs"
                                            />
                                        </div>
                                        <p className="mt-2 text-[12px] text-gray-500 font-medium">
                                            Example: {domainInput || 'www.example.com'}/{subFolder || 'blogs'}
                                        </p>
                                    </div>
                                </div>

                                <FrameworkSelector 
                                    selected={selectedFramework} 
                                    onSelect={setSelectedFramework} 
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IntegrationStep framework={selectedFramework} subFolder={subFolder || 'blogs'} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Section: Progress & Navigation */}
                {!isApiConnected && (
                    <div className="mt-8 flex items-center justify-between">
                        {/* Step Indicator & Progress Bar */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[14px] font-semibold text-gray-700">
                                Step {currentStep} of 2: {currentStep === 1 ? 'Select Framework' : 'Integration Part'}
                            </span>
                            <div className="flex gap-2 w-64 h-1.5">
                                {[1, 2].map((step) => (
                                    <div 
                                        key={step}
                                        className={cn(
                                            "flex-1 rounded-full transition-all duration-500",
                                            step === currentStep 
                                                ? "bg-[#FF5200] w-full" 
                                                : step < currentStep 
                                                    ? "bg-[#FF5200] opacity-40" 
                                                    : "bg-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-3">
                            {currentStep > 1 && (
                                <Button 
                                    onClick={handleBack}
                                    className="h-[48px] px-8 rounded-xl font-semibold text-gray-600 hover:text-[#FF5200] flex items-center gap-2 border-gray-200 shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Back
                                </Button>
                            )}
                            {currentStep === 1 && (
                                <Tooltip 
                                    title={!hasDomain ? "Wait for domain to get connected" : ""} 
                                    placement="topRight"
                                    trigger={['hover']}
                                >
                                    <span> {/* Required for disabled buttons in some tooltip versions */}
                                        <Button 
                                            onClick={handleNext}
                                            disabled={!selectedFramework || !hasDomain || !isUrlValid || subFolder.trim().length === 0}
                                            loading={isLoading}
                                            className={cn(
                                                "h-[48px] px-8 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 border-none shadow-lg shadow-[#FF520033]",
                                                "bg-[#FF5200] text-white hover:!bg-[#E64A00] hover:!text-white disabled:bg-gray-200 disabled:text-gray-400"
                                            )}
                                        >
                                            Save & Next
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                title="Are you sure you want to disconnect?"
                open={isDisconnectModalVisible}
                onOk={confirmDisconnect}
                onCancel={() => setIsDisconnectModalVisible(false)}
                okText="Disconnect"
                okButtonProps={{ 
                    danger: true, 
                    loading: isLoading 
                }}
                cancelText="Cancel"
                cancelButtonProps={{ 
                    disabled: isLoading 
                }}
                closable={!isLoading}   
                maskClosable={!isLoading}
                centered
            >
                <p>This will remove your current integration settings. You will need to reconfigure them to connect again.</p>
            </Modal>
        </div>
    );
};

export default SubFolderIntegration;
