'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { useUserStore } from './useAuthStore';
import { useBlogStore } from './useBlogStore';
import { useSettingsStore } from './useSettingsStore';
import { UseAppStoreProps } from '@/interface/store';
import { useLeadStore } from './useLeadStore';
import { templateStoreCreator } from './useTemplateStore';

export const useAppStore = create<UseAppStoreProps>()(
    devtools(
        (set, get, api) => ({
            ...useUserStore(set, get, api),
            ...useBlogStore(set, get, api),
            ...useSettingsStore(set, get, api),
            ...useLeadStore(set, get, api),
            ...templateStoreCreator(set, get),
        }),
        { name: 'Store' }
    )
);
