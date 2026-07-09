'use client';

import { UseTemplateStoreProps } from '@/interface/store';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

const templateStoreCreator = (set: any, get: any) => ({
    templateData: null,
    setTemplateData: (key: string, value: any) => {
        set({
            templateData: {
                ...get().templateData,
                [key]: value,
            },
        });
    },
    getTemplateData: (key: string) => {
        return get().templateData?.[key];
    },
});

export const useTemplateStore = create<UseTemplateStoreProps>()(
    devtools(
        persist(
            templateStoreCreator,
            { 
                name: 'templateData', 
                storage: createJSONStorage(() => {
                    if (typeof window !== 'undefined') {
                        return localStorage;
                    }
                    return {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {},
                    };
                })
            }
        )
    )
);

export { templateStoreCreator };
