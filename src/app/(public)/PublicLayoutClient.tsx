'use client';

/**
 * PublicLayoutClient
 *
 * Server-side counterpart (layout.tsx) pre-fetches template data so this
 * component receives it as `initialTemplateData` / `initialUserTemplate`.
 *
 * On first paint, we immediately hydrate the Zustand store from the server
 * data — the Navbar logo and nav links render with the FIRST byte of HTML,
 * with zero client-side API waterfall.
 *
 * React Query still fires a background refetch so template changes propagate
 * without requiring a cache flush.
 */

import { Suspense, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import templatesApi from '@/api/templates.api';
import { useAppStore } from '@/store/useAppStore';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
const CookieConsent = dynamic(() => import('@/components/common/CookieConsent'), { ssr: false });
import { useTemplateStore } from '@/store/useTemplateStore';
import DomainError from '@/components/common/DomainError';
import { LOCALHOST_FALLBACK_USER_ID } from '@/constants/definitions';
import { Toaster } from 'sonner';
import { Toaster as HotToaster } from 'react-hot-toast';
import PageViewTracker from '@/components/common/PageViewTracker';

interface PublicLayoutClientProps {
    children: React.ReactNode;
    /** Pre-fetched on the server — used as React Query initialData to avoid waterfall. */
    initialTemplateData: any | null;
    /** Pre-fetched on the server — used as React Query initialData to avoid waterfall. */
    initialUserTemplate: any | null;
}

export default function PublicLayoutClient({
    children,
    initialTemplateData,
    initialUserTemplate,
}: PublicLayoutClientProps) {
    const rawUserId = Cookies.get('user_id');
    const isLocalhost =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const user_id =
        isLocalhost && (!rawUserId || rawUserId === 'test:localhost')
            ? LOCALHOST_FALLBACK_USER_ID
            : rawUserId;

    const { setTemplateData, getTemplateData } = useTemplateStore();
    const { setSettings } = useAppStore();

    useEffect(() => {
        if (isLocalhost && rawUserId !== user_id && user_id) {
            Cookies.set('user_id', user_id, { path: '/' });
        }
    }, [isLocalhost, rawUserId, user_id]);

    // Immediately seed the Zustand store from server data so Navbar / Footer
    // render with the correct logo & links on the very first paint — no flash.
    useEffect(() => {
        if (initialTemplateData) {
            setSettings(initialTemplateData);
            setTemplateData('template', initialTemplateData);
        }
        if (initialUserTemplate) {
            setTemplateData('user_template', initialUserTemplate);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally run once on mount

    const {
        0: { data: template, isError: isTemplateError },
        1: { isError: isUserTemplateError },
    } = useQueries({
        queries: [
            {
                queryKey: ['template', user_id],
                enabled: !!user_id,
                queryFn: () =>
                    templatesApi.handleGetTemplateDetails(user_id as string).then(res => {
                        setSettings(res);
                        return res;
                    }),
                // Server data is the instant placeholder — no loading spinner.
                initialData: initialTemplateData ?? undefined,
                // Trust the server-prefetched data on first paint; don't fire a
                // redundant client refetch on every page load. Template changes
                // still propagate on the next navigation after the data goes
                // stale (5 min).
                staleTime: 5 * 60 * 1000,
                refetchOnMount: false,
                // NOT persisted: the server re-fetches fresh template data on every
                // load (dynamic layout), so persisting to localStorage would only
                // override that fresh data with a stale copy on reload. Header /
                // footer / cta / favicon edits must reflect immediately.
            },
            {
                queryKey: ['user_template', user_id],
                enabled: !!user_id,
                queryFn: () => templatesApi.handleGetTemplateByUser(user_id as string),
                initialData: initialUserTemplate ?? undefined,
                staleTime: 5 * 60 * 1000,
                refetchOnMount: false,
                // NOT persisted — same reason as ['template'] above.
            },
        ],
    });

    // Sync template details → Zustand whenever background refetch lands.
    useEffect(() => {
        if (template) {
            setSettings(template);
            setTemplateData('template', template);
        }
    }, [template]);

    const isError = isTemplateError || isUserTemplateError;

    const updateTheme = () => {
        document.documentElement.style.setProperty('--primary', template?.general?.accent_color);
    };

    useEffect(() => {
        if (!isError && template) {
            updateTheme();
        }
    }, [template]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const cleanUpInjectedElements = () => {
            const injected = document.querySelectorAll('*[data-injected-by="hyperblog"]');
            injected.forEach((el) => el.remove());
        };

        cleanUpInjectedElements();

        const injectScripts = (htmlString: string | null | undefined, target: 'head' | 'body') => {
            if (!htmlString) return;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;
            const targetElement = target === 'head' ? document.head : document.body;

            const children = Array.from(tempDiv.children);
            children.forEach((child) => {
                const el = child as HTMLElement;
                if (el.tagName.toLowerCase() === 'script') {
                    const newScript = document.createElement('script');
                    newScript.setAttribute('data-injected-by', 'hyperblog');
                    Array.from(el.attributes).forEach((attr) => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.textContent = el.textContent;
                    targetElement.appendChild(newScript);
                } else {
                    el.setAttribute('data-injected-by', 'hyperblog');
                    targetElement.appendChild(el);
                }
            });
        };

        injectScripts(template?.seo?.head_scripts, 'head');
        injectScripts(template?.seo?.miscellaneous_scripts, 'body');

        return () => {
            cleanUpInjectedElements();
        };
    }, [template?.seo?.head_scripts, template?.seo?.miscellaneous_scripts]);

    if (isError) {
        return <DomainError />;
    }

    return (
        <>
            {template?.seo?.custom_css && (
                <style dangerouslySetInnerHTML={{ __html: template.seo.custom_css }} />
            )}
            <HotToaster />
            <Toaster
                toastOptions={{
                    style: {
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                    },
                }}
            />
            {children}
            <PageViewTracker userId={user_id as string} />
            {template?.seo?.default_cookie_popup && <CookieConsent />}
        </>
    );
}
