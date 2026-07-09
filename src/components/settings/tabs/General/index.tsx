import React from 'react';

import { useAppStore } from '@/store/useAppStore';
import { Input } from '@/components/common/Input';

import Profile from './partials/Profile';
import AccentColor from './partials/AccentColor';
import Settings from './partials/Settings';

import SettingsHeader from '../partials/SettingsHeader';
import ActionFooter from '../partials/ActionFooter';
import { useSettingsForm2 } from '@/hooks/api-calls/useSettingsForm2';

const GeneralSettings: React.FC = () => {
    const { user } = useAppStore();

    const { form, handleSave, isModified, isLoading } = useSettingsForm2('general');
    const formData = form.watch() as any;

    console.log('FORM DATA', formData);

    const handleChange = (name: string, value: any) => {
        console.log('DO NOT REMOVE THIS', formData, form.clearErrors());
        form.setValue(name as any, value);
    };

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full flex flex-col gap-4 pb-5 hide-scrollbar'>
                <SettingsHeader
                    title='General Settings'
                    description='Manage your brand details, timezone, and blog page caption.'
                />
                <Profile
                    name={formData?.organization_name || ''}
                    email={user?.email}
                    errors={form?.formState?.errors}
                    onChange={(name, value) => handleChange(name, value)}
                    logo={formData?.organization_logo || ''}
                />
                <AccentColor
                    color={formData?.accent_color || '#000000'}
                    setColor={value => handleChange('accent_color', value)}
                    error={(form?.formState?.errors as any)?.accent_color?.message}
                    required
                />
                <div className='flex flex-col gap-[8px] border-b border-[#E0E0E0] pb-4'>
                    <Input
                        name='description'
                        inputType='textarea'
                        value={formData?.description || ''}
                        onChange={val => handleChange('description', val)}
                        label='Description'
                        className='!mb-0'
                        error={(form?.formState?.errors as any)?.description?.message}
                        required
                    />
                    <p className='text-xs font-medium text-[#8F8F8F]'>
                        This will be shown below every blog post.
                    </p>
                </div>
                <Settings
                    data={formData}
                    handleChange={handleChange}
                    errors={form?.formState?.errors as any}
                />
            </div>
            <ActionFooter
                isSaving={isLoading}
                disableButtons={!isModified}
                handleSave={handleSave}
            />
        </div>
    );
};

export default GeneralSettings;
