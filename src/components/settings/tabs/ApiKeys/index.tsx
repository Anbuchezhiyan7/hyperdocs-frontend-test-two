'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';

interface ApiKey {
    id: string;
    label: string;
    prefix: string;
    createdAt: string;
    lastUsed: string | null;
}

const INITIAL_KEYS: ApiKey[] = [
    {
        id: 'key_live_1',
        label: 'Production',
        prefix: 'hb_live_9f2a',
        createdAt: 'Jul 10, 2026',
        lastUsed: 'Jul 22, 2026',
    },
    {
        id: 'key_test_1',
        label: 'Local development',
        prefix: 'hb_test_4c7d',
        createdAt: 'Jul 18, 2026',
        lastUsed: null,
    },
];

const ApiKeysSettings: React.FC = () => {
    const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
    const [newLabel, setNewLabel] = useState('');
    const [revealedKey, setRevealedKey] = useState<string | null>(null);

    const createKey = () => {
        const label = newLabel.trim() || 'Untitled key';
        const suffix = Math.random().toString(36).slice(2, 6);
        const fullKey = `hb_live_${Math.random().toString(36).slice(2, 34)}`;
        const created: ApiKey = {
            id: `key_${suffix}`,
            label,
            prefix: fullKey.slice(0, 12),
            createdAt: 'Just now',
            lastUsed: null,
        };
        setKeys(prev => [created, ...prev]);
        setNewLabel('');
        // The full secret is shown only once, right after creation.
        setRevealedKey(fullKey);
    };

    const revokeKey = (id: string) => {
        setKeys(prev => prev.filter(k => k.id !== id));
    };

    return (
        <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
            <SettingsHeader
                title='API Keys'
                description='Create and manage secret keys that let external integrations access your workspace API.'
            />

            {revealedKey && (
                <div className='flex flex-col gap-2 rounded-lg border border-[#F26522] bg-[#FFF7F3] p-4'>
                    <p className='text-sm font-semibold text-[#333]'>Copy your new key now</p>
                    <p className='text-xs font-medium text-[#8F8F8F]'>
                        For security, this is the only time the full key is shown.
                    </p>
                    <code className='block rounded-md bg-white border border-[#E0E0E0] px-3 py-2 text-xs text-[#333] break-all'>
                        {revealedKey}
                    </code>
                    <button
                        type='button'
                        onClick={() => setRevealedKey(null)}
                        className='self-start text-xs font-semibold text-[#F26522] hover:underline'
                    >
                        I&apos;ve copied it
                    </button>
                </div>
            )}

            <div className='flex items-end gap-3 border-b border-[#E0E0E0] pb-4'>
                <div className='flex flex-col gap-2 flex-1'>
                    <label className='text-sm font-semibold text-[#333]'>Create a new key</label>
                    <input
                        type='text'
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        placeholder='e.g. CI pipeline'
                        className='w-full rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    />
                </div>
                <button
                    type='button'
                    onClick={createKey}
                    className='rounded-xl bg-[#333] px-5 py-2 text-sm font-semibold text-white hover:bg-black'
                >
                    Generate key
                </button>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-sm font-semibold text-[#333]'>Active keys</p>
                {keys.length === 0 ? (
                    <p className='text-xs font-medium text-[#8F8F8F]'>No API keys yet.</p>
                ) : (
                    <div className='flex flex-col divide-y divide-[#E0E0E0]'>
                        {keys.map(key => (
                            <div
                                key={key.id}
                                className='flex items-center justify-between gap-4 py-3'
                            >
                                <div className='flex flex-col gap-1'>
                                    <p className='text-sm font-semibold text-[#333]'>{key.label}</p>
                                    <p className='text-xs font-medium text-[#8F8F8F]'>
                                        {key.prefix}••••••••  ·  Created {key.createdAt}
                                        {key.lastUsed ? `  ·  Last used ${key.lastUsed}` : '  ·  Never used'}
                                    </p>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => revokeKey(key.id)}
                                    className='text-xs font-semibold text-red-500 hover:underline'
                                >
                                    Revoke
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeysSettings;
