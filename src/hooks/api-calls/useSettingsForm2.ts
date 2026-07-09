import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { apiUpdateSetting } from '@/api/settings';
import { showToast } from '@/components/common/Toast';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AdvancedSettingsSchema,
    GeneralSettingsSchema,
    SeoSettingsSchema,
    SettingsFormData,
} from '@/schemas/settings';

// Create a type map for settings schemas
const settingsSchemas = {
    general: GeneralSettingsSchema,
    advanced: AdvancedSettingsSchema,
    seo: SeoSettingsSchema,
} as const;

type SettingsSchemaType = typeof settingsSchemas;

export const useSettingsForm2 = <T extends keyof SettingsSchemaType>(type: T) => {
    const queryClient = useQueryClient();
    const { settings } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);

    const schema = settingsSchemas[type];
    const form = useForm<SettingsFormData<T>>({
        resolver: (zodResolver(schema as any) as unknown) as Resolver<SettingsFormData<T>>,
        defaultValues: (settings?.[type] as unknown) as SettingsFormData<T>,
    });

    const isModified = JSON.stringify(form.getValues()) !== JSON.stringify(settings?.[type]);

    useEffect(() => {
        form.reset((settings?.[type] as unknown) as SettingsFormData<T>);
    }, [settings, type]);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const isValid = await form.trigger();
            if (!isValid) {
                showToast('Please fix the form errors before saving', 'error');
                return;
            }

            const formData = form.getValues();
            const res = await apiUpdateSetting(type, formData);

            if (res?.type === 'success') {
                queryClient.invalidateQueries({ queryKey: ['settings'] });
            }
            showToast(res.message, res.type);
        } catch (err) {
            showToast('Something went wrong', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscard = () => {
        form.reset((settings?.[type] as unknown) as SettingsFormData<T>);
    };

    return {
        form,
        handleSave,
        handleDiscard,
        isModified,
        isLoading,
    };
};
