'use client';

import React, { useEffect, useState } from 'react';
import BlogTemplateLayout from '@/components/blog-templates/layouts';
import TEMPLATE_CONFIG from '@/config/template.config';
import { useTemplateStore } from '@/store/useTemplateStore';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { useAppStore } from '@/store/useAppStore';

export default function PreviewView({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const { setTemplateData } = useTemplateStore();
    const { setSettings } = useAppStore();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (id) {
            // Retrieve data passed from EditorNavbar
            const stored = localStorage.getItem(`preview_data_${id}`);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setData(parsed);

                    // Initialize stores with preview data
                    if (parsed.settings) {
                        setTemplateData('template', parsed.settings);
                        setSettings(parsed.settings);

                        // Apply theme colors immediately
                        if (parsed.settings?.general?.accent_color) {
                            document.documentElement.style.setProperty('--primary', parsed.settings.general.accent_color);
                        }
                    }
                    if (parsed.user_template) {
                        setTemplateData('user_template', parsed.user_template);
                    }
                } catch (e) {
                    console.error("Failed to parse preview data", e);
                    setError('Failed to load preview data.');
                }
            } else {
                // If no data found in local storage (e.g. direct access without clicking preview)
                setError('No preview data found. Please open preview from the editor.');
            }
        }
    }, [id, setTemplateData, setSettings]);

    if (error) {
        return (
            <div className="flex h-screen w-full flex-col gap-4 items-center justify-center">
                <div className="text-red-500 font-bold">{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <SpinnerLoader />
            </div>
        );
    }

    const { blog, template_tag } = data;

    // Find the correct component for the 'Detail' view
    const templateConfig = TEMPLATE_CONFIG[template_tag as keyof typeof TEMPLATE_CONFIG];
    const Component = templateConfig?.routes.find((r) => r.path === '/blogs/:id')?.component;

    if (!Component) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-red-500 font-bold">
                Template Component Not Found for {template_tag}
            </div>
        );
    }

    return (
        <BlogTemplateLayout>
            <Component blog={blog} />
        </BlogTemplateLayout>
    );
}
