import { NextRequest } from 'next/server';
import { BASE_URL } from '@/constants/definitions';
import apiPath from '@/constants/api-path.constants';
import { cookies } from 'next/headers';

/** Returns true if the string is a real usable ID (not null/undefined/"undefined") */
function isValidId(id: any): id is string {
    return typeof id === 'string' && id.length > 0 && id !== 'undefined' && id !== 'null';
}

/**
 * Resolve the tenant user_id.
 *
 * Priority order:
 * 1. Standalone `user_id` cookie — set by middleware on custom domains, or saved on login
 * 2. Hostname lookup via API — for Google bots / crawlers on production (no cookies)
 * Localhost skips the hostname fallback since it never resolves to a real tenant.
 */
async function resolveUserId(req: NextRequest): Promise<string | null> {
    const cookieStore = await cookies();

    // 1. Standalone user_id cookie (set at login or by middleware on custom domains)
    const cookieUserId = cookieStore.get('user_id')?.value;
    if (isValidId(cookieUserId)) return cookieUserId;

    // 2. Skip hostname fallback for localhost
    const hostname = req.nextUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return null;
    }

    // 3. Hostname-based lookup for production crawlers (Google bots don't send cookies)
    try {
        const apiUrl = `${BASE_URL}/api/v1${apiPath.settings.getDomainUserId(hostname)}`;
        const res = await fetch(apiUrl, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        const resolvedId = data?.user_id;
        return isValidId(resolvedId) ? resolvedId : null;
    } catch {
        return null;
    }
}

/**
 * Fetch all published blogs for a tenant.
 * Endpoint: GET /api/v1/templates/all_blogs/{user_id}
 */
async function getAllPublishedBlogs(userId: string): Promise<any[]> {
    try {
        const apiUrl = `${BASE_URL}/api/v1${apiPath.templates.custom(userId, 'all_blogs')}`;
        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            console.error('[sitemap-blogs] Failed to fetch blogs:', res.status);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : (data?.blogs ?? data?.data ?? []);
    } catch (err) {
        console.error('[sitemap-blogs] Error fetching all blogs:', err);
        return [];
    }
}

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const userId = await resolveUserId(req);

    let urlEntries = '';

    if (userId) {
        const blogs = await getAllPublishedBlogs(userId);

        urlEntries = blogs
            .filter((blog: any) => {
                const slug = blog?.blog_info?.slug_url || blog?.slug_url || blog?.slug;
                return Boolean(slug);
            })
            .map((blog: any) => {
                const slug = blog?.blog_info?.slug_url || blog?.slug_url || blog?.slug;
                const lastmod =
                    blog?.blog_info?.updated_at ||
                    blog?.updated_at ||
                    new Date().toISOString();

                return `
    <url>
        <loc>${origin}/${slug}</loc>
        <lastmod>${new Date(lastmod).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
            })
            .join('');
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            // Cache for 1 hour — revalidates automatically on next crawl
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
