import React, { useState } from 'react';
import { Input } from '@/components/common/Input';
import { SelectInput } from '@/components/common/Input/Select';

interface SubFolderInstructionsProps {
    config: string;
    selectedType: string;
    onTypeChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
}

const SubFolderInstructions: React.FC<SubFolderInstructionsProps> = ({
    config,
    selectedType,
    onTypeChange,
    options,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyConfig = async () => {
        try {
            await navigator.clipboard.writeText(config);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };
    return (
        <div className="flex flex-col gap-6 mt-6">
            {/* Type Selection Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-[16px] font-[600] text-[#333] mb-3">Configuration Type</h3>
                <div className="flex flex-col gap-2 w-[300px]">
                    <p className="text-[14px] font-[500] text-[#666] mb-2">
                        Select the technology used by your domain
                    </p>
                    <SelectInput
                        className="w-[250px]"
                        inputType="select"
                        placeholder="Select Type"
                        name="type"
                        onChange={value => {
                            console.log('Selected option value:', value);
                            onTypeChange(value as string);
                        }}
                        options={options}
                        //@ts-ignore
                        value={selectedType || undefined}
                    />
                </div>
            </div>

            {config && (
                <div className="bg-gray-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <div>
                            <h3 className="text-[16px] font-[600] text-[#ea580c] mb-2">
                                Subdirectory Configuration Instructions
                            </h3>
                            <p className="text-[14px] text-[#374151] leading-relaxed">
                                You connected a subdirectory to Hyperblog. This is a technical
                                process that requires adding rewrite rules to your server
                                configuration. If you're uncomfortable with this, you can click the
                                'Disconnect' button above and connect a subdomain instead.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-[14px] font-[600] text-[#333]">
                                Steps to Configure:
                            </span>
                        </div>

                        <ol className="list-decimal list-inside space-y-2 text-[14px] text-[#666] mb-4">
                            <li>Visit your hosting dashboard</li>
                            <li>Go to File Manager section</li>
                            <li>
                                Add the below rewrite rules to your{' '}
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                                    .htaccess
                                </code>{' '}
                                file
                            </li>
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-[14px] font-[600] text-[#333]">
                                        Configuration Code:
                                    </label>
                                    <button
                                        onClick={handleCopyConfig}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                                        disabled={!config}
                                    >
                                        {copied ? (
                                            <>
                                                <svg
                                                    className="w-3 h-3 text-green-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-green-600 font-medium">
                                                    Copied!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-3 h-3 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span className="text-gray-600">Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="bg-black text-white p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                    <pre className="whitespace-pre-wrap text-green-400">
                                        {config || 'Configuration will appear here...'}
                                    </pre>
                                </div>
                                <p className="text-[12px] text-[#666] mt-2">
                                    Copy this code and paste it into your{' '}
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                                        .htaccess
                                    </code>{' '}
                                    file
                                </p>
                            </div>
                            <li>Make sure these rules are given the highest priority</li>
                            <li>
                                Ensure that mod_rewrite and mod_proxy are enabled in your Apache
                                configuration
                            </li>
                        </ol>

                        {/* Configuration Code */}

                        {/* Apache Module Commands */}
                        <div className="mb-4">
                            <p className="text-[14px] font-[600] text-[#333] mb-2">
                                Enable required Apache modules:
                            </p>
                            <div className="bg-black text-white p-4 rounded-lg font-mono text-sm">
                                <div className="space-y-1">
                                    <div className="text-green-400">$</div>
                                    <div>a2enmod rewrite</div>
                                    <div>a2enmod proxy</div>
                                    <div>a2enmod proxy_http</div>
                                    <div>a2enmod ssl</div>
                                </div>
                            </div>
                            <p className="text-[12px] text-[#666] mt-2">
                                Run these commands in your server terminal
                            </p>
                        </div>

                        {/* Important Note */}
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div>
                                    <p className="text-[13px] font-[600] text-[#92400e] mb-1">
                                        Important Note:
                                    </p>
                                    <p className="text-[12px] text-[#a16207]">
                                        You need to click "Deploy" after making the configuration
                                        changes for them to take effect.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubFolderInstructions;
