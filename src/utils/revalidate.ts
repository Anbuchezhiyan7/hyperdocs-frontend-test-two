import Cookies from 'js-cookie';

/**
 * Tell the public reader to drop its server-side cache for the current tenant.
 *
 * Fires the /api/revalidate route (Hyperdocs pattern) from the admin browser.
 * Scoped to the logged-in tenant via the user_id cookie so we never bust other
 * tenants' caches. Failures are swallowed — the unstable_cache time-based
 * `revalidate` is the safety net if this call ever doesn't land.
 */
export async function revalidatePublic(tag: 'settings' | 'template' | 'blogs'): Promise<void> {
    try {
        const userId = Cookies.get('user_id') || '';
        await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag, userId }),
            keepalive: true,
        });
    } catch {
        // Non-fatal: the public cache will still self-heal on its time-based revalidate.
    }
}
