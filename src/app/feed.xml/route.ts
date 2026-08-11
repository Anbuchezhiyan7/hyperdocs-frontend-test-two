import { NextRequest } from 'next/server';
import { BASE_URL } from '@/constants/definitions';
import apiPath from '@/constants/api-path.constants';
import { cookies } from 'next/headers';

/**
 * RSS 2.0 feed for a site's published posts.
 *
 * Readers who follow a blog through a feed reader never visit the site to check
 * for updates, so without a feed those subscribers simply never see new posts.
 * The tenant is resolved exactly the way sitemap-blogs.xml does it, so a feed
 * request from a feed reader (which sends no cookies) still finds the right site
 * by hostname.
 */

/** Returns true if the string is a real usable ID (not null/undefined/"undefined") */
function isValidId(id: any): id is string {
    return typeof id === 'string' && id.length > 0 && id !== 'undefined' && id !== 'null';
}

async function resolveUserId(req: NextRequest): Promise<string | null> {
    const cookieStore = await cookies();

    const cookieUserId = cookieStore.get('user_id')?.value;
    if (isValidId(cookieUserId)) return cookieUserId;

    const hostname = req.nextUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return null;
    }

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

async function getAllPublishedBlogs(userId: string): Promise<any[]> {
    try {
        const apiUrl = `${BASE_URL}/api/v1${apiPath.templates.custom(userId, 'all_blogs')}`;
        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            console.error('[feed] Failed to fetch blogs:', res.status);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : (data?.blogs ?? data?.data ?? []);
    } catch (err) {
        console.error('[feed] Error fetching all blogs:', err);
        return [];
    }
}

/**
 * Escape text for XML.
 *
 * A single unescaped ampersand in a post title makes the whole feed unparseable,
 * and most readers show nothing at all rather than a partial list.
 */
function escapeXml(value: string): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** RSS requires RFC-822 dates, not ISO-8601. */
function toRfc822(value: any): string {
    const date = value ? new Date(value) : new Date();
    const safe = Number.isNaN(date.getTime()) ? new Date() : date;
    return safe.toUTCString();
}

/** Pull the first usable field from a blog record's varying shapes. */
function pick(blog: any, ...keys: string[]): string | undefined {
    for (const key of keys) {
        const direct = blog?.[key];
        if (typeof direct === 'string' && direct) return direct;
        const nested = blog?.blog_info?.[key];
        if (typeof nested === 'string' && nested) return nested;
    }
    return undefined;
}

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const userId = await resolveUserId(req);

    let items = '';
    let latest: string | undefined;

    if (userId) {
        const blogs = await getAllPublishedBlogs(userId);

        items = blogs
            .filter((blog: any) => Boolean(pick(blog, 'slug_url', 'slug')))
            .map((blog: any) => {
                const slug = pick(blog, 'slug_url', 'slug')!;
                const title = pick(blog, 'title', 'blog_title') ?? 'Untitled';
                const description =
                    pick(blog, 'meta_description', 'description', 'excerpt', 'summary') ?? '';
                const published = pick(blog, 'published_at', 'created_at', 'updated_at');
                const author = pick(blog, 'author_name', 'author');
                const link = `${origin}/${slug}`;

                if (!latest || (published && new Date(published) > new Date(latest))) {
                    latest = published;
                }

                return `
        <item>
            <title>${escapeXml(title)}</title>
            <link>${escapeXml(link)}</link>
            <guid isPermaLink="true">${escapeXml(link)}</guid>
            <pubDate>${toRfc822(published)}</pubDate>${
                author ? `\n            <dc:creator>${escapeXml(author)}</dc:creator>` : ''
            }
            <description>${escapeXml(description)}</description>
        </item>`;
            })
            .join('');
    }

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>${escapeXml(req.nextUrl.hostname)}</title>
        <link>${escapeXml(origin)}</link>
        <description>Latest posts from ${escapeXml(req.nextUrl.hostname)}</description>
        <language>en</language>
        <lastBuildDate>${toRfc822(latest)}</lastBuildDate>
        <atom:link href="${escapeXml(`${origin}/feed.xml`)}" rel="self" type="application/rss+xml" />${items}
    </channel>
</rss>`;

    return new Response(feed, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            // Matches the sitemap's cache window — feed readers poll frequently.
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
