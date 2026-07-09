'use client';

/**
 * PageViewTracker
 *
 * Lightweight, fire-and-forget page view beacon for the NEW analytics module.
 * It runs only on the public-facing site and is completely independent of the
 * existing blog view-counting flow (blog_metrics / visitor_id sent on the
 * published-blog fetch). It never blocks rendering and shares no state with
 * the other APIs.
 *
 * A stable visitor id is resolved per browser so unique-visitor counts work:
 * it reuses the existing `visitor_id` cookie if present, otherwise generates a
 * UUID and persists it (1 year). Only the daily total view count and uniques
 * are recorded — fully independent of the existing blog view-counting flow.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import analyticsApi from '@/api/analytics.api';

interface PageViewTrackerProps {
    /** Tenant (blog owner) id, already resolved by the public layout. */
    userId?: string;
}

/** Get-or-create a stable per-browser visitor id, reusing the existing cookie. */
const getVisitorId = (): string => {
    let visitorId = Cookies.get('visitor_id');
    if (!visitorId) {
        visitorId =
            typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        Cookies.set('visitor_id', visitorId, { expires: 365, path: '/' });
    }
    return visitorId;
};

const PageViewTracker = ({ userId }: PageViewTrackerProps) => {
    const pathname = usePathname();
    const lastTracked = useRef<string | null>(null);

    useEffect(() => {
        if (!userId || !pathname) return;
        // De-dupe: don't re-fire for the same path within this mount.
        if (lastTracked.current === pathname) return;
        lastTracked.current = pathname;

        analyticsApi.handleTrackPageView({
            user_id: userId,
            path: pathname,
            title: typeof document !== 'undefined' ? document.title : '',
            visitor_id: getVisitorId(),
        });
    }, [pathname, userId]);

    return null;
};

export default PageViewTracker;
