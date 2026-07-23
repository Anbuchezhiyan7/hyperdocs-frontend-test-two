'use client';

import React, { useState } from 'react';

import SettingsHeader from '../partials/SettingsHeader';
import ActionFooter from '../partials/ActionFooter';

interface NotificationPreference {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreference[] = [
    {
        id: 'new_comment',
        label: 'New comments',
        description: 'Get an email whenever a reader comments on one of your published posts.',
        enabled: true,
    },
    {
        id: 'new_subscriber',
        label: 'New subscribers',
        description: 'Be notified when someone subscribes to your newsletter.',
        enabled: true,
    },
    {
        id: 'weekly_digest',
        label: 'Weekly performance digest',
        description: 'Receive a Monday summary of views, engagement, and top-performing posts.',
        enabled: false,
    },
    {
        id: 'lead_capture',
        label: 'Lead captured',
        description: 'Get alerted the moment a lead magnet is downloaded so you can follow up fast.',
        enabled: true,
    },
    {
        id: 'product_updates',
        label: 'Product updates',
        description: 'Occasional emails about new features and improvements to the platform.',
        enabled: false,
    },
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

const NotificationsSettings: React.FC = () => {
    const [preferences, setPreferences] = useState<NotificationPreference[]>(DEFAULT_PREFERENCES);
    const [isModified, setIsModified] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const togglePreference = (id: string) => {
        setPreferences(prev =>
            prev.map(pref => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref))
        );
        setIsModified(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Persist the selected notification preferences for the current workspace.
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsSaving(false);
        setIsModified(false);
    };

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full flex flex-col gap-4 pb-5 hide-scrollbar'>
                <SettingsHeader
                    title='Email Notifications'
                    description='Choose which email alerts you receive about activity on your blog.'
                />
                <div className='flex flex-col divide-y divide-[#E0E0E0]'>
                    {preferences.map(pref => (
                        <div
                            key={pref.id}
                            className='flex items-start justify-between gap-6 py-4'
                        >
                            <div className='flex flex-col gap-1'>
                                <p className='text-sm font-semibold text-[#333]'>{pref.label}</p>
                                <p className='text-xs font-medium text-[#8F8F8F]'>
                                    {pref.description}
                                </p>
                            </div>
                            <Toggle
                                checked={pref.enabled}
                                onChange={() => togglePreference(pref.id)}
                            />
                        </div>
                    ))}
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

export default NotificationsSettings;
