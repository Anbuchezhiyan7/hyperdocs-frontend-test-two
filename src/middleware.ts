/**
 * HyperBlog Middleware
 * 
 * Responsibilities (ONLY):
 * 1. Identify user by host / subdomain / custom domain
 * 2. Redirect default domain (*.hyperblog.cloud) → connected custom domain
 * 3. Handle author routes
 * 4. Protect dashboard routes
 *
 * IMPORTANT:
 * - This app assumes it runs at ROOT (/)
 * - It MUST NOT know about /blogs
 * - Reverse proxy (Vercel rewrites) handles /blogs externally
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { DASHBOARD_URLS, LOCALHOST_FALLBACK_USER_ID } from './constants/definitions';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

/** Paths allowed without auth on dashboard domains */
const ALLOWED_PATHS = ['/admin', '/login', '/site-details', '/preview'];

/**
 * Lookup a host against the backend domain registry.
 *
 * The endpoint returns the owning user + their active connected domain
 * (if any) in a single call, avoiding a second round-trip.
 *
 * Expected API response shape:
 *   { user_id: "abc-123", connected_domain: "blog.manoj.com" }
 *   connected_domain is null / omitted when no custom domain is configured.
 */
async function getUserIdByHost(
    host: string
): Promise<{ userId: string | null; connectedDomain: string | null; rawData: any }> {
    try {
        const { data } = await axios.get(
            `${API_URL}/api/v1/settings/domain/user_id/${host}`
        );
        const rawDomain = data?.connected_domain;
        const isValidDomain =
            typeof rawDomain === 'string' &&
            rawDomain.includes('.') &&
            rawDomain !== 'string';

        return {
            userId: data?.user_id || data || null,
            connectedDomain: isValidDomain ? rawDomain : null,
            rawData: data,
        };
    } catch (error) {
        console.error('getUserIdByHost error:', error);
        return { userId: null, connectedDomain: null, rawData: null };
    }
}

/** The default/demo domain suffix assigned to users on signup */
const DEFAULT_DOMAIN_SUFFIX = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN_SUFFIX || 'hyperblog.cloud';

type HostResolution = Awaited<ReturnType<typeof getUserIdByHost>>;

/**
 * Per-host resolution cache.
 *
 * getUserIdByHost() is a network round-trip to the backend domain registry.
 * The mapping host → user / connected domain changes rarely, so we resolve it
 * once per host and reuse it for a short TTL instead of calling on every
 * navigation. This is an in-memory (server-side) cache — it never reaches the
 * client, so the security-sensitive domain restriction below cannot be forged.
 */
const HOST_CACHE_TTL = 60 * 1000; // 60s
const hostCache = new Map<string, { value: HostResolution; expires: number }>();

async function resolveHost(host: string): Promise<HostResolution> {
    const cached = hostCache.get(host);
    if (cached && cached.expires > Date.now()) {
        return cached.value;
    }

    const value = await getUserIdByHost(host);

    // Guard against unbounded growth across many custom domains.
    if (hostCache.size > 1000) hostCache.clear();
    hostCache.set(host, { value, expires: Date.now() + HOST_CACHE_TTL });

    return value;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const host = req.headers.get('host') || '';

    // Default mock user ID for local development on public routes
    const DEFAULT_DEV_USER_ID = LOCALHOST_FALLBACK_USER_ID;

    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    /**
     * Resolve user + connected domain.
     *
     * - Localhost: never hit the backend — the result is always overridden to
     *   the mock dev user below, so the call was pure overhead on every request.
     * - Otherwise: resolve once per host (cached for HOST_CACHE_TTL), not on
     *   every navigation.
     */
    let userId: string | null;
    let connectedDomain: string | null;
    let rawData: any;

    if (isLocalhost) {
        userId = DEFAULT_DEV_USER_ID;
        connectedDomain = null; // no redirect on localhost
        rawData = null;
    } else {
        ({ userId, connectedDomain, rawData } = await resolveHost(host));

        // Preserve the original override for the test sentinel user.
        if (userId === 'test:localhost') {
            userId = DEFAULT_DEV_USER_ID;
            connectedDomain = null;
        }
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set(
        'x-middleware-debug',
        JSON.stringify({
            url: `${API_URL}/api/v1/settings/domain/user_id/${host}`,
            payload: rawData,
            host,
        })
    );

    /**
     * Hyperdocs pattern — expose the freshly-resolved user_id to the CURRENT
     * request, not just the response cookie.
     *
     * Without this, the FIRST visit on a custom domain (browser has no user_id
     * cookie yet) makes server components read an empty cookie and render the
     * wrong fallback tenant until a manual reload finally sets it. By rewriting
     * the request's `cookie` header here, page.tsx / layout.tsx see the correct
     * tenant on the very first byte. We strip any stale `user_id=` first so our
     * resolved value always wins (cookies().get() returns the first match).
     */
    if (userId) {
        const cookieSegments = (requestHeaders.get('cookie') || '')
            .split(';')
            .map(c => c.trim())
            .filter(c => c && !c.startsWith('user_id='));
        cookieSegments.push(`user_id=${userId}`);
        requestHeaders.set('cookie', cookieSegments.join('; '));
    }

    /**
     * 🔀 DEFAULT DOMAIN → CUSTOM DOMAIN REDIRECT
     *
     * If the incoming request arrives at a default/demo domain
     * (e.g. manoj123.hyperblog.cloud) AND the backend already returned
     * a connected custom domain, redirect permanently (308) to it,
     * preserving the full path and query string.
     *
     * Skipped when:
     *  - Running on localhost / 127.0.0.1
     *  - Host is a dashboard URL
     *  - Host is NOT a *.hyperblog.cloud default domain
     */
    const isDefaultDomain =
        !host.includes('localhost') &&
        !host.includes('127.0.0.1') &&
        host.endsWith(`.${DEFAULT_DOMAIN_SUFFIX}`) &&
        !DASHBOARD_URLS.includes(host);

    if (isDefaultDomain && connectedDomain) {
        const connectedPath = rawData?.connected_path;

        /**
         * Sub-folder proxy detection:
         * When the external site (e.g. www.hyperblog.io) proxies /blogs to our
         * default domain (hyperblog.hyperblog.cloud/blogs), the pathname already
         * matches the connected_path. In this case we must serve the content directly
         * instead of redirecting — otherwise we'd create an infinite redirect loop:
         *   www.hyperblog.io/blogs → proxy → hyperblog.cloud/blogs → 301 → www.hyperblog.io/blogs → ...
         */
        if (connectedPath && pathname.startsWith(connectedPath)) {
            /**
             * Domain authorization check:
             * The proxy (WordPress/Next.js) sends X-Hyperblog-Origin with the domain
             * of the site that installed the plugin. We use a custom header (not
             * X-Forwarded-Host) because Vercel overrides X-Forwarded-Host on
             * Vercel-to-Vercel requests, making it unreliable for this check.
             */
            const hyperblogOrigin = req.headers.get('x-hyperblog-origin') || '';
            const normalizeH = (h: string) => h.replace(/^www\./, '').toLowerCase();

            if (hyperblogOrigin && normalizeH(hyperblogOrigin) !== normalizeH(connectedDomain)) {
                console.log(`[Middleware] Unauthorized proxy attempt from ${hyperblogOrigin} — expected ${connectedDomain}`);
                return NextResponse.redirect(new URL('/403', req.url));
            }

            /**
             * Strip the sub-folder prefix so our app's real routes are served.
             * e.g. /blogs       → /
             *      /blogs/      → /
             *      /blogs/post  → /post
             */
            const stripped = pathname.slice(connectedPath.length) || '/';
            const rewriteUrl = new URL(req.url);
            rewriteUrl.pathname = stripped.startsWith('/') ? stripped : `/${stripped}`;

            console.log(`[Middleware] Sub-folder proxy: rewriting ${pathname} → ${rewriteUrl.pathname}`);
            return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
        }

        const targetUrl = new URL(req.url);
        targetUrl.host = connectedDomain;
        targetUrl.port = '';
        targetUrl.protocol = 'https:';

        if (connectedPath) {
            const basePath = connectedPath.endsWith('/') ? connectedPath.slice(0, -1) : connectedPath;
            const currentPath = targetUrl.pathname;
            targetUrl.pathname = currentPath === '/' ? basePath : `${basePath}${currentPath}`;
        }

        console.log(`[Middleware] Redirecting ${host} → ${targetUrl.toString()}`);

        return NextResponse.redirect(targetUrl.toString(), {
            status: 301,
        });
    }

    /**
     * 🚫 ABSOLUTE RULE:
     * Never touch static assets, APIs, or files
     */
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/apple-icon') ||
        pathname.startsWith('/manifest') ||
        pathname.includes('.') || // js, css, images, fonts, etc
        pathname.startsWith('/ingest')
    ) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    /**
     * DOMAIN + PATH RESTRICTION
     * If a sub-folder path (e.g. /blogs) is restricted to a specific domain,
     * ensure the request is coming from the correct host.
     * This check runs EARLY — before allowed paths and cookie logic —
     * so unauthorized domains are hard-stopped immediately.
     */
    const normalizeHost = (h: string) => h.replace(/^www\./, '').toLowerCase();
    const allowedDomain = rawData?.connected_domain;
    const allowedPath = rawData?.connected_path;
    console.log('[Middleware] host:', host, '| pathname:', pathname, '| allowedDomain:', allowedDomain, '| allowedPath:', allowedPath, "log-check");
    if (allowedDomain && allowedPath && pathname.startsWith(allowedPath)) {
        const normalizedHost = normalizeHost(host);
        const normalizedAllowed = normalizeHost(allowedDomain);

        if (normalizedHost !== normalizedAllowed) {
            // ❌ Wrong domain trying to access a restricted path — hard stop
            console.log(`[Middleware] Domain mismatch: ${host} tried to access ${allowedPath} (allowed only for ${allowedDomain})`);
            return NextResponse.redirect(new URL('/403', req.url));
        }

        // ✅ Correct domain — pass through immediately without falling through to cookie logic
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    /**
     * 🔐 ALREADY LOGGED IN → SKIP LOGIN PAGE
     *
     * If an authenticated user (token cookie present) hits /login, redirect them
     * straight to the dashboard server-side, so the login page never renders.
     * The OTP step (/login?mode=verify-otp) is unaffected — `token` is only set
     * after a successful login, not during OTP verification.
     */
    if (
        req.cookies.get('token')?.value &&
        (pathname === '/login' || pathname.startsWith('/login/'))
    ) {
        return NextResponse.redirect(new URL('/admin/blogs', req.url));
    }

    /**
     * Allow dashboard public paths
     */
    if (ALLOWED_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    /**
     * Handle AUTHOR routes
     * OLD: /author/[slug]/[designation]  → 308 redirect to /blogs/author/[slug]/[designation]
     * NEW: /blogs/author/[slug]/[designation] → served directly by Next.js route
     */
    if (pathname.startsWith('/author/')) {
        const newUrl = new URL(req.url);
        newUrl.pathname = `/blogs${pathname}`;
        console.log(`[Middleware] Redirecting legacy author route: ${pathname} → ${newUrl.pathname}`);
        return NextResponse.redirect(newUrl, { status: 308 });
    }

    /**
     * Protect dashboard domains
     */
    if (
        DASHBOARD_URLS.includes(host) &&
        !userId &&
        !ALLOWED_PATHS.some(path => pathname.startsWith(path))
    ) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    /**
     * Attach user_id cookie if found
     */
    if (userId) {
        const response = NextResponse.next({
            request: { headers: requestHeaders },
        });

        response.cookies.set({
            name: 'user_id',
            value: userId,
            path: '/',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            domain: host.split(':')[0],
        });

        // Phase 8: Per-tenant CDN cache key isolation.
        // Vary: Host ensures the CDN treats each subdomain as a separate cache entry,
        // preventing tenant A's cached page from being served to tenant B.
        response.headers.set('Vary', 'Host');
        response.headers.set('X-Cache-Tenant', host.split(':')[0]);

        return response;
    }

    const fallbackResponse = NextResponse.next({ request: { headers: requestHeaders } });

    // Apply tenant cache headers on all responses (not just authenticated ones)
    fallbackResponse.headers.set('Vary', 'Host');
    fallbackResponse.headers.set('X-Cache-Tenant', host.split(':')[0]);

    return fallbackResponse;
}

/**
 * Middleware matcher
 * 
 * ✅ Excludes _next, api, static files automatically
 * ✅ Does NOT include /blogs
 */
export const config = {
    matcher: [
        '/',
        '/author/:path*',
        '/blogs/author/:path*',
        '/((?!_next|api|favicon.ico|apple-icon.ico|manifest|.*\\.).*)',
    ],
};