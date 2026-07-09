import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * On-demand cache revalidation endpoint (mirrors Hyperdocs' /api/revalidate).
 *
 * The admin panel POSTs here after a mutation so the public reader's
 * server-side `unstable_cache` entries are busted immediately instead of
 * waiting for their time-based `revalidate`. Because this is a real HTTP
 * request it is visible in the Network tab, unlike a server action.
 *
 * Body: { tag: 'settings' | 'template' | 'blogs' | string, userId?: string }
 * When `userId` is present we bust only that tenant's per-user tags so a single
 * tenant's settings save does not nuke every other tenant's cache.
 */
export async function POST(req: Request) {
    const { tag, userId } = await req.json().catch(() => ({} as { tag?: string; userId?: string }));

    switch (tag) {
        case 'settings':
        case 'template': {
            // Public navbar / footer / cta / favicon / seo all hydrate from these
            // two caches (getTemplateDetails + getUserTemplateData).
            if (userId) {
                revalidateTag(`template-details-${userId}`);
                revalidateTag(`user-template-${userId}`);
            } else {
                revalidateTag('template-details');
                revalidateTag('user-template');
            }
            break;
        }
        case 'blogs': {
            revalidateTag('blogs');
            break;
        }
        default: {
            if (tag) revalidateTag(tag);
        }
    }

    return NextResponse.json({ revalidated: true, tag: tag ?? null, ts: Date.now() });
}
