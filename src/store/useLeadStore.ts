'use client';

import { UseLeadStoreProps } from '@/interface/store';
import { StateCreator } from 'zustand';

export const useLeadStore: StateCreator<UseLeadStoreProps> = (set, get) => ({
    leadFilters: {
        sort_by: null,
        blog_status: null,
        author: null,
    },
    setLeadFilters: (filters: any) => {
        set({ leadFilters: filters });
    },
    resetLeadFilters: () => {
        set({
            leadFilters: {
                sort_by: null,
                blog_status: null,
                author: null,
            },
        });
    },
});
