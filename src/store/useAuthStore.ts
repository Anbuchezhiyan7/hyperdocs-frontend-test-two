'use client';

import { StateCreator } from 'zustand';
import { UseUserStoreProps } from '@/interface/store';

export const useUserStore: StateCreator<UseUserStoreProps> = (set, get) => ({
    user: null,
    setUserData: (data: any) => {
        set({ user: data });
    },
});
