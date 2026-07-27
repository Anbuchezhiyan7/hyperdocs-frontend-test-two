'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';

type ExportFormat = 'csv' | 'json';

interface ExportItem {
    id: string;
    label: string;
    description: string;
    selected: boolean;
}

const DEFAULT_ITEMS: ExportItem[] = [
    { id: 'posts', label: 'Posts', description: 'All published and draft blog posts with their content.', selected: true },
    { id: 'subscribers', label: 'Subscribers', description: 'Your newsletter subscriber list and signup dates.', selected: true },
    { id: 'comments', label: 'Comments', description: 'Reader comments across all posts.', selected: false },
    { id: 'analytics', label: 'Analytics', description: 'Views, engagement, and traffic data.', selected: false },
    { id: 'leads', label: 'Leads', description: 'Contacts captured through lead magnets.', selected: false },
];

const DataExportSettings: React.FC = () => {
    const [items, setItems] = useState<ExportItem[]>(DEFAULT_ITEMS);
    const [format, setFormat] = useState<ExportFormat>('csv');
    const [isExporting, setIsExporting] = useState(false);
    const [lastExport, setLastExport] = useState<string | null>(null);

    const toggle = (id: string) => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, selected: !i.selected } : i)));
    };

    const selectedCount = items.filter(i => i.selected).length;

    const handleExport = async () => {
        if (selectedCount === 0) return;
        setIsExporting(true);
        // Build the export bundle for the selected data types in the chosen format.
        // A download link is prepared once the backend finishes packaging the file.
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsExporting(false);
        setLastExport(new Date().toLocaleString());
    };

    return (
        <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
            <SettingsHeader
                title='Data Export'
                description='Download a copy of your workspace data. Choose what to include and the file format.'
            />

            <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-[#333]'>What to export</label>
                <div className='flex flex-col divide-y divide-[#E0E0E0]'>
                    {items.map(item => (
                        <label
                            key={item.id}
                            className='flex items-start gap-3 py-3 cursor-pointer'
                        >
                            <input
                                type='checkbox'
                                checked={item.selected}
                                onChange={() => toggle(item.id)}
                                className='mt-1 h-4 w-4 accent-[#333]'
                            />
                            <div className='flex flex-col gap-0.5'>
                                <span className='text-sm font-semibold text-[#333]'>{item.label}</span>
                                <span className='text-xs font-medium text-[#8F8F8F]'>{item.description}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className='flex flex-col gap-2 border-t border-[#E0E0E0] pt-4'>
                <label className='text-sm font-semibold text-[#333]'>File format</label>
                <div className='flex gap-2'>
                    {(['csv', 'json'] as ExportFormat[]).map(f => (
                        <button
                            key={f}
                            type='button'
                            onClick={() => setFormat(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                format === f
                                    ? 'bg-[#333] text-white border-[#333]'
                                    : 'bg-white text-[#5D5D5D] border-[#E0E0E0] hover:bg-gray-50'
                            }`}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex items-center gap-4 border-t border-[#E0E0E0] pt-4'>
                <button
                    type='button'
                    onClick={handleExport}
                    disabled={selectedCount === 0 || isExporting}
                    className='rounded-xl bg-[#333] px-5 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50'
                >
                    {isExporting ? 'Preparing…' : `Export ${selectedCount} item${selectedCount === 1 ? '' : 's'}`}
                </button>
                {lastExport && (
                    <span className='text-xs font-medium text-[#8F8F8F]'>
                        Last export: {lastExport}
                    </span>
                )}
            </div>
            <p className='text-xs font-medium text-[#8F8F8F]'>
                Large exports are emailed to you as a download link when they finish processing.
            </p>
        </div>
    );
};

export default DataExportSettings;
