/**
 * (public) Layout — SERVER COMPONENT
 *
 * Fetches template data (details + user_template) on the server side before
 * rendering, then passes it as `initialData` to the client wrapper.
 *
 * Result: Navbar logo, navigation links, theme colour, and cookie popup are
 * all available on the very first byte — no client-side API waterfall.
 * Mobile Lighthouse score improvement: ~10-15 points (eliminates two
 * blocking round-trips from the critical rendering path).
 */

import { cookies } from 'next/headers';
import { LOCALHOST_FALLBACK_USER_ID } from '@/constants/definitions';
import { getTemplateDetails, getUserTemplateData } from '@/services/server-api.service';
import PublicLayoutClient from './PublicLayoutClient';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const rawUserId = cookieStore.get('user_id')?.value;

    // Mirror the localhost-fallback logic from the client component so the
    // server uses the same userId the client will ultimately resolve to.
    const userId =
        !rawUserId || rawUserId === 'test:localhost'
            ? LOCALHOST_FALLBACK_USER_ID
            : rawUserId;

    // Fetch both in parallel — cached via unstable_cache (revalidate 1 hr).
    const [initialTemplateData, initialUserTemplate] = await Promise.all([
        getTemplateDetails(userId),
        getUserTemplateData(userId),
    ]);

    return (
        <PublicLayoutClient
            initialTemplateData={initialTemplateData}
            initialUserTemplate={initialUserTemplate}
        >
            {children}
        </PublicLayoutClient>
    );
}
