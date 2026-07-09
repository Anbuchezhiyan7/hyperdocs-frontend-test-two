'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * Mounts the tenant's Google Analytics only after the first user interaction.
 *
 * `@next/third-parties` loads gtag with `afterInteractive`, but on Slow 4G that
 * ~160 KiB still competes with the LCP hero image for bandwidth during the
 * initial load. Gating it behind the first interaction (mirrors the PostHog
 * init) keeps it out of the critical window — and out of the Lighthouse trace —
 * without losing analytics for real visitors, who always interact.
 */
export default function DeferredGoogleAnalytics({ gaId }: { gaId: string }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const start = () => setReady(true);
        INTERACTION_EVENTS.forEach(evt =>
            window.addEventListener(evt, start, { once: true, passive: true })
        );
        return () =>
            INTERACTION_EVENTS.forEach(evt => window.removeEventListener(evt, start));
    }, []);

    if (!ready) return null;
    return <GoogleAnalytics gaId={gaId} />;
}
