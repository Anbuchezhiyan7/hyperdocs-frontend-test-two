'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';

type RedirectType = '301' | '302';

interface Redirect {
    id: string;
    from: string;
    to: string;
    type: RedirectType;
}

const INITIAL_REDIRECTS: Redirect[] = [
    { id: 'r1', from: '/old-pricing', to: '/pricing', type: '301' },
    { id: 'r2', from: '/blog/launch', to: '/blog/were-live', type: '302' },
];

const RedirectsSettings: React.FC = () => {
    const [redirects, setRedirects] = useState<Redirect[]>(INITIAL_REDIRECTS);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [type, setType] = useState<RedirectType>('301');
    const [error, setError] = useState<string | null>(null);

    const addRedirect = () => {
        const f = from.trim();
        const t = to.trim();
        if (!f || !t) {
            setError('Both the old and new path are required.');
            return;
        }
        if (!f.startsWith('/') || !t.startsWith('/')) {
            setError('Paths must start with a slash (e.g. /old-page).');
            return;
        }
        if (redirects.some(r => r.from === f)) {
            setError('A redirect for that path already exists.');
            return;
        }
        setRedirects(prev => [{ id: `r_${Date.now()}`, from: f, to: t, type }, ...prev]);
        setFrom('');
        setTo('');
        setError(null);
    };

    const remove = (id: string) => {
        setRedirects(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
            <SettingsHeader
                title='Redirects'
                description='Send visitors from an old URL to a new one. Useful after renaming or removing a page.'
            />

            <div className='flex flex-col gap-3 border-b border-[#E0E0E0] pb-4'>
                <label className='text-sm font-semibold text-[#333]'>Add a redirect</label>
                <div className='flex flex-wrap items-center gap-2'>
                    <input
                        type='text'
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        placeholder='/old-path'
                        className='flex-1 min-w-[160px] rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    />
                    <span className='text-[#8F8F8F]'>→</span>
                    <input
                        type='text'
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        placeholder='/new-path'
                        className='flex-1 min-w-[160px] rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    />
                    <select
                        value={type}
                        onChange={e => setType(e.target.value as RedirectType)}
                        className='rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    >
                        <option value='301'>301 Permanent</option>
                        <option value='302'>302 Temporary</option>
                    </select>
                    <button
                        type='button'
                        onClick={addRedirect}
                        className='rounded-xl bg-[#333] px-5 py-2 text-sm font-semibold text-white hover:bg-black'
                    >
                        Add
                    </button>
                </div>
                {error && <p className='text-xs font-medium text-red-500'>{error}</p>}
                <p className='text-xs font-medium text-[#8F8F8F]'>
                    Use a <span className='font-semibold'>301</span> when a page has moved for good, or a{' '}
                    <span className='font-semibold'>302</span> for a temporary move.
                </p>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-sm font-semibold text-[#333]'>Active redirects</p>
                {redirects.length === 0 ? (
                    <p className='text-xs font-medium text-[#8F8F8F]'>No redirects yet.</p>
                ) : (
                    <div className='flex flex-col divide-y divide-[#E0E0E0]'>
                        {redirects.map(r => (
                            <div key={r.id} className='flex items-center justify-between gap-4 py-3'>
                                <div className='flex items-center gap-2 min-w-0 text-sm text-[#333]'>
                                    <span className='font-semibold truncate'>{r.from}</span>
                                    <span className='text-[#8F8F8F]'>→</span>
                                    <span className='truncate'>{r.to}</span>
                                    <span className='shrink-0 rounded-full bg-[#F0F0F0] px-2 py-0.5 text-xs font-semibold text-[#5D5D5D]'>
                                        {r.type}
                                    </span>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => remove(r.id)}
                                    className='shrink-0 text-xs font-semibold text-red-500 hover:underline'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RedirectsSettings;
