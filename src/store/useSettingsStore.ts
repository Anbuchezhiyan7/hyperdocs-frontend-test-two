'use client';

import { StateCreator } from 'zustand';
import { UseSettingsStoreProps } from '@/interface/store';
import { SettingsState } from '@/constants/forms/settings/state';
import { AllSettings } from '@/interface/settings';

export const useSettingsStore: StateCreator<UseSettingsStoreProps> = (set, get) => ({
    settings: SettingsState,
    isDomainNull: false,
    setIsDomainNull: (isDomainNull: boolean) => {
        set({ isDomainNull });
    },
    setSettings: (settings: Partial<AllSettings>) => {
        const validSettings: AllSettings = {
            general: settings.general ?? SettingsState.general,
            domain: settings.domain ?? SettingsState.domain,
            advanced: settings.advanced ?? SettingsState.advanced,
            seo: settings.seo ?? SettingsState.seo,
            navigation_footer: settings.navigation_footer ?? SettingsState.navigation_footer,
        };
        set({ settings: validSettings });
    },
});
