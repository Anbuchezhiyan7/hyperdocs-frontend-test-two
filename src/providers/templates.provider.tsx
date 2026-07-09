'use client';
import Loader from '@/components/common/Loader';
import { useAppStore } from '@/store/useAppStore';
import { ReactNode, useEffect, useState } from 'react';

interface TemplatesProviderProps {
    children: ReactNode;
    initialData: {
        template: any;
        blogs: any;
        tags: any;
        user_template: any;
    };
}

export function TemplatesProvider ({ children, initialData }: TemplatesProviderProps) {
    const { setSettings, setTemplateData } = useAppStore();
    const [isInitialized, setIsInitialized] = useState(false);

    console.log('initialData', initialData);

    useEffect(() => {
        try {
            if (initialData.template) {
                setSettings(initialData.template);
                setTemplateData('template', initialData.template);
            }
            if (initialData.blogs) {
                setTemplateData('blogs', initialData.blogs);
            }
            if (initialData.tags) {
                setTemplateData('tags', initialData.tags);
            }
            if (initialData.user_template) {
                setTemplateData('user_template', initialData.user_template);
            }
            setIsInitialized(true);
        } catch (error) {
            console.error('Error initializing template data:', error);
        }
    }, []);

    if (!isInitialized) {
        return <Loader />;
    }

    return <>{children}</>;
}
