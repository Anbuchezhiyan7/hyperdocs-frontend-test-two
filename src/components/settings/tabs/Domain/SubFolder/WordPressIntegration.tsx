'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Code2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Buttons';
import { useAppStore } from '@/store/useAppStore';
import { generateWordPressPluginCode } from './configGenerator';
import JSZip from 'jszip';

const WordPressIntegration = ({ subFolder }: { subFolder: string }) => {
    const { settings, user } = useAppStore();
    const [isDownloading, setIsDownloading] = useState(false);
    const domain = settings?.domain?.default || 
                   settings?.domain?.sub_domain || 
                   settings?.domain?.sub_folder || 
                   settings?.domain?.main_domain || '';

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            zip.file('hyperblog-integration.php', generateWordPressPluginCode(domain, user?.user_id || '', subFolder));
            
            const content = await zip.generateAsync({ type: 'blob' });
            
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'hyperblog_plugin.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const steps = [
        {
            icon: <Download className="w-6 h-6 text-orange-500" />,
            text: (
                <div className="flex items-center justify-between w-full text-left">
                    <span>
                        <span className="font-bold">Download</span> the Hyperblog WordPress plugin zip file.
                    </span>
                    <Button 
                        type="primary"
                        onClick={handleDownload}
                        loading={isDownloading}
                        icon={<Download className="w-4 h-4" />}
                        className="bg-[#FF5200] hover:bg-[#E64A00] border-none rounded-lg h-[40px] px-6 ml-4 hidden sm:flex items-center gap-2 font-semibold shadow-md shadow-[#FF520033]"
                    >
                        Download
                    </Button>
                </div>
            ),
        },
        {
            icon: <Code2 className="w-6 h-6 text-orange-500" />,
            text: (
                <div className="text-left w-full">
                    Go to your <span className="font-bold">WordPress Admin</span> dashboard, navigate to <span className="font-bold">Plugins</span>, and click <span className="font-bold">Add New</span>.
                </div>
            ),
        },
        {
            icon: <Check className="w-6 h-6 text-orange-500" />,
            text: (
                <div className="text-left w-full">
                    Click <span className="font-bold">Upload Plugin</span>, select the downloaded zip file, and click <span className="font-bold">Install Plugin</span>.
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    className={cn(
                        "flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300",
                        index === 0 && "hover:border-orange-100"
                    )}
                >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-orange-50 rounded-xl">
                        {step.icon}
                    </div>
                    <div className="flex-grow text-[16px] text-gray-700 leading-relaxed">
                        {step.text}
                    </div>
                </motion.div>
            ))}
            
            {/* Mobile Download Button */}
            <div className="sm:hidden px-2">
                 <Button 
                    type="primary"
                    onClick={handleDownload}
                    loading={isDownloading}
                    icon={<Download className="w-4 h-4" />}
                    className="w-full bg-[#FF5200] hover:bg-[#E64A00] border-none rounded-xl h-[48px] font-bold shadow-lg shadow-[#FF520033]"
                >
                    Download Plugin Zip
                </Button>
            </div>
        </div>
    );
};

export default WordPressIntegration;
