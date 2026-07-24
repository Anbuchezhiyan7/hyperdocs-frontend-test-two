'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';

interface Webhook {
    id: string;
    url: string;
    event: string;
    active: boolean;
}

const EVENT_OPTIONS = [
    'post.published',
    'post.updated',
    'comment.created',
    'subscriber.added',
    'lead.captured',
];

const INITIAL_WEBHOOKS: Webhook[] = [
    { id: 'wh_1', url: 'https://hooks.example.com/blog', event: 'post.published', active: true },
];

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
        type='button'
        role='switch'
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
            checked ? 'bg-[#333]' : 'bg-[#D4D4D4]'
        }`}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
            }`}
        />
    </button>
);

const WebhooksSettings: React.FC = () => {
    const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);
    const [url, setUrl] = useState('');
    const [event, setEvent] = useState(EVENT_OPTIONS[0]);

    const addWebhook = () => {
        const trimmed = url.trim();
        if (!trimmed) return;
        setWebhooks(prev => [
            { id: `wh_${Date.now()}`, url: trimmed, event, active: true },
            ...prev,
        ]);
        setUrl('');
    };

    const toggle = (id: string) => {
        setWebhooks(prev => prev.map(w => (w.id === id ? { ...w, active: !w.active } : w)));
    };

    const remove = (id: string) => {
        setWebhooks(prev => prev.filter(w => w.id !== id));
    };

    return (
        <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
            <SettingsHeader
                title='Webhooks'
                description='Send a POST request to your own endpoint whenever an event happens in your workspace.'
            />

            <div className='flex flex-col gap-3 border-b border-[#E0E0E0] pb-4'>
                <label className='text-sm font-semibold text-[#333]'>Add an endpoint</label>
                <div className='flex items-center gap-3'>
                    <input
                        type='url'
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder='https://your-server.com/webhook'
                        className='flex-1 rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    />
                    <select
                        value={event}
                        onChange={e => setEvent(e.target.value)}
                        className='rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    >
                        {EVENT_OPTIONS.map(ev => (
                            <option key={ev} value={ev}>
                                {ev}
                            </option>
                        ))}
                    </select>
                    <button
                        type='button'
                        onClick={addWebhook}
                        className='rounded-xl bg-[#333] px-5 py-2 text-sm font-semibold text-white hover:bg-black'
                    >
                        Add endpoint
                    </button>
                </div>
                <p className='text-xs font-medium text-[#8F8F8F]'>
                    Each event delivers a JSON payload; failed deliveries are retried up to three times.
                </p>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-sm font-semibold text-[#333]'>Registered endpoints</p>
                {webhooks.length === 0 ? (
                    <p className='text-xs font-medium text-[#8F8F8F]'>No webhooks registered yet.</p>
                ) : (
                    <div className='flex flex-col divide-y divide-[#E0E0E0]'>
                        {webhooks.map(w => (
                            <div key={w.id} className='flex items-center justify-between gap-4 py-3'>
                                <div className='flex flex-col gap-1 min-w-0'>
                                    <p className='text-sm font-semibold text-[#333] truncate'>{w.url}</p>
                                    <p className='text-xs font-medium text-[#8F8F8F]'>
                                        Triggers on <span className='font-semibold'>{w.event}</span>
                                    </p>
                                </div>
                                <div className='flex items-center gap-4 shrink-0'>
                                    <Toggle checked={w.active} onChange={() => toggle(w.id)} />
                                    <button
                                        type='button'
                                        onClick={() => remove(w.id)}
                                        className='text-xs font-semibold text-red-500 hover:underline'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebhooksSettings;
