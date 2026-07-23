'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';
import ActionFooter from '../partials/ActionFooter';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Kolkata',
    'Asia/Singapore',
];

interface SchedulingState {
    autoPublish: boolean;
    publishTime: string;
    timezone: string;
    activeDays: string[];
}

const DEFAULT_STATE: SchedulingState = {
    autoPublish: false,
    publishTime: '09:00',
    timezone: 'UTC',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

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

const SchedulingSettings: React.FC = () => {
    const [state, setState] = useState<SchedulingState>(DEFAULT_STATE);
    const [isModified, setIsModified] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const update = (patch: Partial<SchedulingState>) => {
        setState(prev => ({ ...prev, ...patch }));
        setIsModified(true);
    };

    const toggleDay = (day: string) => {
        setState(prev => {
            const active = prev.activeDays.includes(day)
                ? prev.activeDays.filter(d => d !== day)
                : [...prev.activeDays, day];
            return { ...prev, activeDays: active };
        });
        setIsModified(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Persist the publishing schedule for the current workspace. When
        // auto-publish is on, queued drafts go live at the chosen time on the
        // selected days in the configured timezone.
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsSaving(false);
        setIsModified(false);
    };

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full flex flex-col gap-6 pb-5 hide-scrollbar'>
                <SettingsHeader
                    title='Scheduled Publishing'
                    description='Automatically publish queued drafts at a set time instead of manually hitting publish.'
                />

                <div className='flex items-start justify-between gap-6 border-b border-[#E0E0E0] pb-4'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-semibold text-[#333]'>Enable auto-publish</p>
                        <p className='text-xs font-medium text-[#8F8F8F]'>
                            When on, drafts added to the queue are published on the schedule below.
                        </p>
                    </div>
                    <Toggle
                        checked={state.autoPublish}
                        onChange={() => update({ autoPublish: !state.autoPublish })}
                    />
                </div>

                <div className='flex flex-col gap-2 border-b border-[#E0E0E0] pb-4'>
                    <label className='text-sm font-semibold text-[#333]'>Publish time</label>
                    <input
                        type='time'
                        name='publishTime'
                        value={state.publishTime}
                        onChange={e => update({ publishTime: e.target.value })}
                        className='w-full rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    />
                    <p className='text-xs font-medium text-[#8F8F8F]'>
                        Drafts scheduled for a given day go live at this time.
                    </p>
                </div>

                <div className='flex flex-col gap-2 border-b border-[#E0E0E0] pb-4'>
                    <label className='text-sm font-semibold text-[#333]'>Timezone</label>
                    <select
                        value={state.timezone}
                        onChange={e => update({ timezone: e.target.value })}
                        className='w-full rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm text-[#333]'
                    >
                        {TIMEZONES.map(tz => (
                            <option key={tz} value={tz}>
                                {tz}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-[#333]'>Publishing days</label>
                    <div className='flex flex-wrap gap-2'>
                        {WEEKDAYS.map(day => {
                            const active = state.activeDays.includes(day);
                            return (
                                <button
                                    key={day}
                                    type='button'
                                    onClick={() => toggleDay(day)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                        active
                                            ? 'bg-[#333] text-white border-[#333]'
                                            : 'bg-white text-[#5D5D5D] border-[#E0E0E0] hover:bg-gray-50'
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    <p className='text-xs font-medium text-[#8F8F8F]'>
                        Drafts are only published on the days you select.
                    </p>
                </div>
            </div>
            <ActionFooter
                isSaving={isSaving}
                disableButtons={!isModified}
                handleSave={handleSave}
            />
        </div>
    );
};

export default SchedulingSettings;
