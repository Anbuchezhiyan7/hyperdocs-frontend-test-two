'use client';

import { UseBlogStoreProps } from '@/interface/store';
import { StateCreator } from 'zustand';

export const useBlogStore: StateCreator<UseBlogStoreProps> = (set, get) => {
    return {
    blog: null,
    hasContentChanged: false,
    filters: {
        sort_by: null,
        blog_status: null,
        author: null,
        categories: null,
        tags: null,
    },
    setFilters: (filters: any) => {
        set({ filters });
    },
    resetFilters: () => {
        set({
            filters: {
                sort_by: null,
                blog_status: null,
                author: null,
                categories: null,
                tags: null,
            },
        });
    },
    handleBlogFieldChange: (field: keyof Blog, value: any) => {
        set((state: any) => ({
            blog: {
                ...state.blog,
                [field]: value,
            },
        }));
    },
    setBlog: (blog: Blog) => {
        set({ blog });
    },
    resetBlog: () => {
        set({ blog: null, hasContentChanged: false });
    },
    setHasContentChanged: (hasContentChanged: boolean) => {
        set({ hasContentChanged });
    },
    
};

};
