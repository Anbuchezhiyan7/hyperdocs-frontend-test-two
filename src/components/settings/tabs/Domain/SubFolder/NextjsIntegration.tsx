'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Code2, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Buttons';
import { useAppStore } from '@/store/useAppStore';
import { 
    generateNextConfig, 
    generateProxyCode, 
    generateRouteCode, 
    generateSlugRouteCode 
} from './configGenerator';
import JSZip from 'jszip';

const NextjsIntegration = ({ subFolder }: { subFolder: string }) => {
    const { settings, user } = useAppStore();
    const [copied, setCopied] = useState(false);
    const [lang, setLang] = useState<'js' | 'ts'>('ts');
    const [isDownloading, setIsDownloading] = useState(false);

 const domain = settings?.domain?.default || 
                   settings?.domain?.sub_domain || 
                   settings?.domain?.sub_folder || 
                   settings?.domain?.main_domain || '';
    const configCode = generateNextConfig(domain, lang, subFolder);

    const handleCopy = () => {
        navigator.clipboard.writeText(configCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const ext = lang;
            
            // Add root files
            zip.file(`proxy.${ext}`, generateProxyCode(domain, user?.user_id || '', lang, subFolder));
            zip.file(`route.${ext}`, generateRouteCode(lang));
            
            // Add nested slug route
            const slugFolder = zip.folder('[...slug]');
            if (slugFolder) {
                slugFolder.file(`route.${ext}`, generateSlugRouteCode(lang));
            }
            
            const content = await zip.generateAsync({ type: 'blob' });
            
            // Trigger download
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${subFolder}.zip`;
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
                        <span className="font-bold">Download</span> /{subFolder} zip file & extract it & place it under <span className="font-bold">/app</span> in your Next.js project.
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
                    Copy the configuration below and <span className="font-bold">merge</span> it into your existing <span className="font-bold">next.config.{lang}</span> file.
                </div>
            ),
        },
    ];

    return (
        <>
            {/* Global Language Switcher */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h4 className="text-[16px] font-bold text-gray-800">Select Language</h4>
                    <p className="text-[13px] text-gray-500 font-medium">Choose between JS or TS for instructions & config</p>
                </div>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setLang('ts')}
                        className={cn(
                            "px-6 py-2 text-[13px] font-bold rounded-lg transition-all duration-300",
                            lang === 'ts' ? "bg-white text-[#FF5200] shadow-md" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        TypeScript
                    </button>
                    <button
                        onClick={() => setLang('js')}
                        className={cn(
                            "px-6 py-2 text-[13px] font-bold rounded-lg transition-all duration-300",
                            lang === 'js' ? "bg-white text-[#FF5200] shadow-md" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        JavaScript
                    </button>
                </div>
            </div>

            {/* Instructions List */}
            <div className="space-y-6 mt-6">
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
                        Download Plugin Zip ({lang.toUpperCase()})
                    </Button>
                </div>
            </div>

            {/* Code Block Container */}
            <motion.div
                className="rounded-3xl overflow-hidden bg-[#1D1D1D] border border-gray-800 shadow-2xl "
            >
                {/* Header */}
                <div className="mt-8 px-6 py-4 bg-[#2D2D2D] border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Code2 className="w-4 h-4 text-gray-400" />
                        <span className="text-[14px] font-semibold text-gray-300">next.config.{lang}</span>
                    </div>

                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200",
                            "text-[13px] font-bold",
                            copied 
                                ? "bg-green-500/10 text-green-400" 
                                : "bg-white/5 hover:bg-white/10 text-gray-300"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy to Clipboard</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Code */}
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto bg-[#1D1D1D]">
                    <pre className="text-gray-300 whitespace-pre">
                        {configCode.split('\n').map((line, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="w-8 text-gray-600 text-right select-none opacity-50">{i + 1}</span>
                                <span>{line}</span>
                            </div>
                        ))}
                    </pre>
                </div>
            </motion.div>
        </>
    );
};

export default NextjsIntegration;
