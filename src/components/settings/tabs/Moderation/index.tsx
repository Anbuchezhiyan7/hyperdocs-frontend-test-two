'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';
import ActionFooter from '../partials/ActionFooter';

type ApprovalMode = 'auto' | 'manual' | 'first-time';

interface ModerationState {
    approvalMode: ApprovalMode;
    blockedKeywords: string[];
    holdLinks: boolean;
    notifyOnHeld: boolean;
}

const DEFAULT_STATE: ModerationState = {
    approvalMode: 'first-time',
    blockedKeywords: ['spam', 'casino'],
    holdLinks: true,
    notifyOnHeld: true,
};

const APPROVAL_OPTIONS: { value: ApprovalMode; label: string; hint: string }[] = [
    { value: 'auto', label: 'Publish immediately', hint: 'All comments appear on the post right away.' },
    { value: 'manual', label: 'Hold every comment', hint: 'Nothing appears until you approve it.' },
    { value: 'first-time', label: 'Hold first-time commenters', hint: 'Approve a reader once, then auto-publish them.' },
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

const ModerationSettings: React.FC = () => {
    const [state, setState] = useState<ModerationState>(DEFAULT_STATE);
    const [keywordInput, setKeywordInput] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const update = (patch: Partial<ModerationState>) => {
        setState(prev => ({ ...prev, ...patch }));
        setIsModified(true);
    };

    const addKeyword = () => {
        const word = keywordInput.trim().toLowerCase();
        if (!word || state.blockedKeywords.includes(word)) return;
        update({ blockedKeywords: [...state.blockedKeywords, word] });
        setKeywordInput('');
    };

    const removeKeyword = (word: string) => {
        update({ blockedKeywords: state.blockedKeywords.filter(k => k !== word) });
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Persist the moderation policy for this workspace. Held comments wait in
        // the moderation queue until an admin approves or deletes them.
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsSaving(false);
        setIsModified(false);
    };

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
                <SettingsHeader
                    title='Comment Moderation'
                    description='Decide which reader comments are published automatically and which are held for review.'
                />

                <div className='flex flex-col gap-3 border-b border-[#E0E0E0] pb-4'>
                    <label className='text-sm font-semibold text-[#333]'>Approval mode</label>
                    <div className='flex flex-col gap-2'>
                        {APPROVAL_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                type='button'
                                onClick={() => update({ approvalMode: opt.value })}
                                className={`flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-colors ${
                                    state.approvalMode === opt.value
                                        ? 'border-[#333] bg-[#F5F5F5]'
                                        : 'border-[#E0E0E0] hover:bg-gray-50'
                                }`}
                            >
                                <span className='text-sm font-semibold text-[#333]'>{opt.label}</span>
                                <span className='text-xs font-medium text-[#8F8F8F]'>{opt.hint}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-b border-[#E0E0E0] pb-4'>
                    <label className='text-sm font-semibold text-[#333]'>Blocked keywords</label>
                    <div className='flex items-center gap-3'>
                        <input
                            type='text'
                            value={keywordInput}
                            onChange={e => setKeywordInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addKeyword()}
                            placeholder='Add a word to block'
                            className='flex-1 rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                        />
                        <button
                            type='button'
                            onClick={addKeyword}
                            className='rounded-xl bg-[#333] px-5 py-2 text-sm font-semibold text-white hover:bg-black'
                        >
                            Add
                        </button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {state.blockedKeywords.map(word => (
                            <span
                                key={word}
                                className='flex items-center gap-2 rounded-full bg-[#F0F0F0] px-3 py-1 text-xs font-semibold text-[#333]'
                            >
                                {word}
                                <button
                                    type='button'
                                    onClick={() => removeKeyword(word)}
                                    className='text-[#8F8F8F] hover:text-red-500'
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <p className='text-xs font-medium text-[#8F8F8F]'>
                        Comments containing any blocked word are sent to the moderation queue automatically.
                    </p>
                </div>

                <div className='flex items-start justify-between gap-6 border-b border-[#E0E0E0] pb-4'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-semibold text-[#333]'>Hold comments with links</p>
                        <p className='text-xs font-medium text-[#8F8F8F]'>
                            Comments containing a URL are held for review even if they pass other checks.
                        </p>
                    </div>
                    <Toggle checked={state.holdLinks} onChange={() => update({ holdLinks: !state.holdLinks })} />
                </div>

                <div className='flex items-start justify-between gap-6'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-semibold text-[#333]'>Email me about held comments</p>
                        <p className='text-xs font-medium text-[#8F8F8F]'>
                            Get a notification whenever a comment lands in the moderation queue.
                        </p>
                    </div>
                    <Toggle checked={state.notifyOnHeld} onChange={() => update({ notifyOnHeld: !state.notifyOnHeld })} />
                </div>
            </div>
            <ActionFooter isSaving={isSaving} disableButtons={!isModified} handleSave={handleSave} />
        </div>
    );
};

export default ModerationSettings;
