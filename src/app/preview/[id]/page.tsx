'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogTemplateLayout from '@/components/blog-templates/layouts';
import TEMPLATE_CONFIG from '@/config/template.config';
import { useTemplateStore } from '@/store/useTemplateStore';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { useAppStore } from '@/store/useAppStore';
import NewsletterBlock from '@/components/RenderServerElements/NewsletterBlock';

export default function PreviewPage() {
    const params = useParams();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [newsletterData, setNewsletterData] = useState<any>(null);
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

                    // Fetch newsletter data for preview
                    const userId = parsed.user_template?.user_id;
                    if (userId) {
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/details/${userId}`, {
                            headers: { 'Content-Type': 'application/json' },
                        })
                            .then(res => (res.ok ? res.json() : null))
                            .then(result => setNewsletterData(result?.newsletter ?? null))
                            .catch(() => {});
                    }

                    // Fetch lead magnet data for preview to detect sticky placements
                    const blogId = parsed.blog?.blog_id;
                    if (blogId) {
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/lead_magnets/all/${blogId}`, {
                            headers: { 'Content-Type': 'application/json' },
                        })
                            .then(res => (res.ok ? res.json() : null))
                            .then(result => {
                                if (result) {
                                    setTemplateData('leadMagnets', result);
                                }
                            })
                            .catch(() => {});
                    }
                } catch (e) {
                    console.error("Failed to parse preview data", e);
                    setError('Failed to load preview data.');
                }
            } else {
                // Try to wait a moment in case localStorage is slightly delayed (rare but possible across tabs)
                const timeout = setTimeout(() => {
                    const retryStored = localStorage.getItem(`preview_data_${id}`);
                    if (retryStored) {
                        try {
                            const parsed = JSON.parse(retryStored);
                            setData(parsed);
                            if (parsed.settings) {
                                setTemplateData('template', parsed.settings);
                                setSettings(parsed.settings);
                                if (parsed.settings?.general?.accent_color) {
                                    document.documentElement.style.setProperty('--primary', parsed.settings.general.accent_color);
                                }
                            }
                            if (parsed.user_template) {
                                setTemplateData('user_template', parsed.user_template);
                            }
                            // Fetch newsletter data for preview
                            const userId = parsed.user_template?.user_id;
                            if (userId) {
                                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/details/${userId}`, {
                                    headers: { 'Content-Type': 'application/json' },
                                })
                                    .then(res => (res.ok ? res.json() : null))
                                    .then(result => setNewsletterData(result?.newsletter ?? null))
                                    .catch(() => {});
                            }

                            // Fetch lead magnet data for preview
                            const blogId = parsed.blog?.blog_id;
                            if (blogId) {
                                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/lead_magnets/all/${blogId}`, {
                                    headers: { 'Content-Type': 'application/json' },
                                })
                                    .then(res => (res.ok ? res.json() : null))
                                    .then(result => {
                                        if (result) {
                                            setTemplateData('leadMagnets', result);
                                        }
                                    })
                                    .catch(() => {});
                            }
                        } catch (e) {
                            setError('Failed to load preview data.');
                        }
                    } else {
                        setError('No preview data found. Please open preview from the editor.');
                    }
                }, 500);
                return () => clearTimeout(timeout);
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
            {newsletterData?.is_newsletter_configured && newsletterData.template?.is_active && (
                <NewsletterBlock tpl={newsletterData.template} blogId={blog?.blog_id ?? ''} />
            )}
        </BlogTemplateLayout>
    );
}
