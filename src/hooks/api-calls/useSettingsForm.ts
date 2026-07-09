import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { SettingsType } from '@/interface/settings';
import { apiUpdateSetting } from '@/api/settings';
import { showToast } from '@/components/common/Toast';

export const useSettingsForm = <T extends SettingsType>(type: T) => {
    const queryClient = useQueryClient();
    const { settings } = useAppStore();

    const [formData, setFormData] = useState(settings?.[type]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData(settings?.[type]);
    }, [settings]);

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleDiscard = () => {
        setFormData(settings?.[type]);
    };

    const handleSave = () => {
        setIsSaving(true);
        apiUpdateSetting(type, formData)
            .then(res => {
                if (res?.type === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['settings'] });
                }
                showToast(res.message, res.type);
            })
            .catch(err => {
                showToast('Something went wrong', 'error');
            })
            .finally(() => setIsSaving(false));
    };

    const isModified = JSON.stringify(formData) !== JSON.stringify(settings?.[type]);

    return {
        formData,
        handleChange,
        handleSave,
        handleDiscard,
        isSaving,
        isModified,
    };
};
