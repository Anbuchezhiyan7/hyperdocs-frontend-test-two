/**
 * Generates the Next.js configuration code based on the domain and preferred language.
 */
export const generateNextConfig = (domain: string, lang: 'js' | 'ts', subFolder: string): string => {
    const origin = domain ? `https://${domain}` : 'https://your-domain.hyperblog.cloud';
    
    if (lang === 'ts') {
        return `import type { NextConfig } from 'next';

const HYPERBLOG_ORIGIN = "${origin}";
const HYPERBLOG_HOSTNAME = new URL(HYPERBLOG_ORIGIN).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: HYPERBLOG_HOSTNAME,
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/${subFolder}/_next/:path*",
          destination: \`\${HYPERBLOG_ORIGIN}/_next/:path*\`,
        },
        {
          source: "/${subFolder}/_vercel/:path*",
          destination: \`\${HYPERBLOG_ORIGIN}/_vercel/:path*\`,
        },
        {
          source: "/_next/:path*",
          has: [{ type: "header", key: "referer", value: "^.*/${subFolder}.*$" }],
          destination: \`\${HYPERBLOG_ORIGIN}/_next/:path*\`,
        },
        {
          source: "/_vercel/:path*",
          has: [{ type: "header", key: "referer", value: "^.*/${subFolder}.*$" }],
          destination: \`\${HYPERBLOG_ORIGIN}/_vercel/:path*\`,
        },
      ],

      afterFiles: [],

      fallback: [
        {
          source: "/images/:path*",
          destination: \`\${HYPERBLOG_ORIGIN}/images/:path*\`,
        },
      ],
    };
  },
};

export default nextConfig;`;
    }

    return `const HYPERBLOG_ORIGIN = "${origin}";
const HYPERBLOG_HOSTNAME = new URL(HYPERBLOG_ORIGIN).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: HYPERBLOG_HOSTNAME,
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/${subFolder}/_next/:path*",
          destination: \`\${HYPERBLOG_ORIGIN}/_next/:path*\`,
        },
        {
          source: "/${subFolder}/_vercel/:path*",
          destination: \`\${HYPERBLOG_ORIGIN}/_vercel/:path*\`,
        },
        {
          source: "/_next/:path*",
          has: [{ type: "header", key: "referer", value: "^.*/${subFolder}.*$" }],
          destination: \`\${HYPERBLOG_ORIGIN}/_next/:path*\`,
        },
        {
          source: "/_vercel/:path*",
          has: [{ type: "header", key: "referer", value: "^.*/${subFolder}.*$" }],
          destination: \`\${HYPERBLOG_ORIGIN}/_vercel/:path*\`,
        },
      ],

      afterFiles: [],

      fallback: [
        {
          source: "/images/:path*",
          destination: \`\${HYPERBLOG_ORIGIN}/images/:path*\`,
        },
      ],
    };
  },
};

module.exports = nextConfig;`;
};

/**
 * Generates the proxy.ts code
 */
export const generateProxyCode = (domain: string, userId: string | number, lang: 'js' | 'ts', subFolder: string): string => {
    const origin = domain ? `https://${domain}` : 'https://your-domain.hyperblog.cloud';
    const finalUserId = userId || 'your-user-id';
    
    if (lang === 'ts') {
        return `import { NextRequest, NextResponse } from 'next/server'

const HYPERBLOG_USER_ID = '${finalUserId}'
const HYPERBLOG_ORIGIN = '${origin}'
const BLOG_PREFIX = '${subFolder}'

/**
 * Streaming search-and-replace over a text stream.
 *
 * The upstream HTML contains absolute \`\${HYPERBLOG_ORIGIN}/\` URLs that must be
 * rewritten to \`\${origin}/\${BLOG_PREFIX}/\` so the sub-folder mount stays self
 * consistent (canonical, og:url, internal links, asset hrefs). We used to buffer
 * the WHOLE document (\`await res.text()\`) to do this, which defeated Next.js's
 * progressive HTML streaming and pushed FCP/LCP way out. This TransformStream
 * rewrites on the fly instead, so bytes flush to the browser as they arrive.
 *
 * Boundary-safe: a match can straddle two chunks, so after replacing every
 * COMPLETE occurrence we hold back only the longest trailing suffix that is a
 * prefix of the search string, and prepend it to the next chunk.
 */
function createRewriteStream(searchStr: string, replaceStr: string) {
  let tail = ''
  return new TransformStream<string, string>({
    transform(chunk, controller) {
      const data = (tail + chunk).replaceAll(searchStr, replaceStr)
      // Longest suffix of \`data\` that is a (proper) prefix of searchStr — this
      // could be the start of a match split across the chunk boundary.
      let hold = 0
      const maxCheck = Math.min(searchStr.length - 1, data.length)
      for (let i = maxCheck; i > 0; i--) {
        if (data.endsWith(searchStr.slice(0, i))) {
          hold = i
          break
        }
      }
      tail = hold ? data.slice(data.length - hold) : ''
      controller.enqueue(hold ? data.slice(0, data.length - hold) : data)
    },
    flush(controller) {
      if (tail) controller.enqueue(tail)
    },
  })
}

export async function proxyBlogPage(
  request: NextRequest,
  slug: string
): Promise<NextResponse> {
  const host = (request.headers.get('host') ?? '').replace(/:\d+$/, '').toLowerCase()
  const scheme = request.nextUrl.protocol.replace(':', '')
  
  // Use hardcoded user_id for upstream request
  const userId = HYPERBLOG_USER_ID
  
  const queryString = request.nextUrl.search
  const upstreamPath = slug ? \`/\${BLOG_PREFIX}/\${slug}\` : \`/\${BLOG_PREFIX}\`
  const upstreamUrl  = \`\${HYPERBLOG_ORIGIN}\${upstreamPath}\${queryString}\`

  let upstreamRes: Response
  try {
    upstreamRes = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HyperblogProxy/1.0)',
        'X-Forwarded-Host': host,
        'X-Forwarded-Proto': scheme,
        'X-Hyperblog-Origin': host,
        'Cookie': \`user_id=\${encodeURIComponent(userId)}\`,
      },
      redirect: 'manual',
    })
  } catch (err) {
    return new NextResponse('<h1>Blog temporarily unavailable.</h1>', {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const yourBlogsUrl = \`\${request.nextUrl.origin}/\${BLOG_PREFIX}/\`

  // Stream the upstream HTML through the rewriter instead of buffering it,
  // preserving Next.js's progressive flush. Decode → rewrite → re-encode so the
  // TransformStream works on text while the boundaries stay UTF-8 safe.
  const rewrittenBody = upstreamRes.body
    ? upstreamRes.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(createRewriteStream(\`\${HYPERBLOG_ORIGIN}/\`, yourBlogsUrl))
        .pipeThrough(new TextEncoderStream())
    : null

  const response = new NextResponse(rewrittenBody, {
    status: upstreamRes.status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Served-By': 'Hyperblog-Proxy',
    },
  })

  // Always set user_id cookie directly on the browser
  response.cookies.set('user_id', HYPERBLOG_USER_ID, {
    path: '/',
    maxAge: 86400, // 24 hours
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    httpOnly: false, 
  })

  return response
}`;
    }

    return `const { NextResponse } = require('next/server');

const HYPERBLOG_USER_ID = '${finalUserId}';
const HYPERBLOG_ORIGIN = '${origin}';
const BLOG_PREFIX = '${subFolder}';

/**
 * Streaming search-and-replace over a text stream.
 *
 * The upstream HTML contains absolute \`\${HYPERBLOG_ORIGIN}/\` URLs that must be
 * rewritten to \`\${origin}/\${BLOG_PREFIX}/\` so the sub-folder mount stays self
 * consistent (canonical, og:url, internal links, asset hrefs). We used to buffer
 * the WHOLE document (\`await res.text()\`) to do this, which defeated Next.js's
 * progressive HTML streaming and pushed FCP/LCP way out. This TransformStream
 * rewrites on the fly instead, so bytes flush to the browser as they arrive.
 *
 * Boundary-safe: a match can straddle two chunks, so after replacing every
 * COMPLETE occurrence we hold back only the longest trailing suffix that is a
 * prefix of the search string, and prepend it to the next chunk.
 */
function createRewriteStream(searchStr, replaceStr) {
  let tail = '';
  return new TransformStream({
    transform(chunk, controller) {
      const data = (tail + chunk).replaceAll(searchStr, replaceStr);
      // Longest suffix of \`data\` that is a (proper) prefix of searchStr — this
      // could be the start of a match split across the chunk boundary.
      let hold = 0;
      const maxCheck = Math.min(searchStr.length - 1, data.length);
      for (let i = maxCheck; i > 0; i--) {
        if (data.endsWith(searchStr.slice(0, i))) {
          hold = i;
          break;
        }
      }
      tail = hold ? data.slice(data.length - hold) : '';
      controller.enqueue(hold ? data.slice(0, data.length - hold) : data);
    },
    flush(controller) {
      if (tail) controller.enqueue(tail);
    },
  });
}

async function proxyBlogPage(request, slug) {
  const host = (request.headers.get('host') ?? '').replace(/:\d+$/, '').toLowerCase();
  const scheme = request.nextUrl.protocol.replace(':', '');

  // Use hardcoded user_id for upstream request
  const userId = HYPERBLOG_USER_ID;
  
  const queryString = request.nextUrl.search;
  const upstreamPath = slug ? \`/\${BLOG_PREFIX}/\${slug}\` : \`/\${BLOG_PREFIX}\`;
  const upstreamUrl = \`\${HYPERBLOG_ORIGIN}\${upstreamPath}\${queryString}\`;

  let upstreamRes;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HyperblogProxy/1.0)',
        'X-Forwarded-Host': host,
        'X-Forwarded-Proto': scheme,
        'X-Hyperblog-Origin': host,
        'Cookie': \`user_id=\${encodeURIComponent(userId)}\`,
      },
      redirect: 'manual',
    });
  } catch (err) {
    return new NextResponse('<h1>Blog temporarily unavailable.</h1>', {
      status: 502,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const yourBlogsUrl = \`\${request.nextUrl.origin}/\${BLOG_PREFIX}/\`;

  // Stream the upstream HTML through the rewriter instead of buffering it,
  // preserving Next.js's progressive flush. Decode → rewrite → re-encode so the
  // TransformStream works on text while the boundaries stay UTF-8 safe.
  const rewrittenBody = upstreamRes.body
    ? upstreamRes.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(createRewriteStream(\`\${HYPERBLOG_ORIGIN}/\`, yourBlogsUrl))
        .pipeThrough(new TextEncoderStream())
    : null;

  const response = new NextResponse(rewrittenBody, {
    status: upstreamRes.status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Served-By': 'Hyperblog-Proxy',
    },
  });

  // Always set user_id cookie directly on the browser
  response.cookies.set('user_id', HYPERBLOG_USER_ID, {
    path: '/',
    maxAge: 86400, // 24 hours
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    httpOnly: false, 
  });

  return response;
}

module.exports = { proxyBlogPage };`;
};

/**
 * Generates the route.ts code for /blogs
 */
export const generateRouteCode = (lang: 'js' | 'ts'): string => {
    if (lang === 'ts') {
        return `import { NextRequest } from 'next/server'
import { proxyBlogPage } from './proxy'

export async function GET(request: NextRequest) {
  return proxyBlogPage(request, '')
}`;
    }

    return `const { proxyBlogPage } = require('./proxy');

async function GET(request) {
  return proxyBlogPage(request, '');
}

module.exports = { GET };`;
};

/**
 * Generates the route.ts code for /blogs/[...slug]
 */
export const generateSlugRouteCode = (lang: 'js' | 'ts'): string => {
    if (lang === 'ts') {
        return `import { NextRequest } from 'next/server'
import { proxyBlogPage } from '../proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  return proxyBlogPage(request, slug.join('/'))
}`;
    }

    return `const { proxyBlogPage } = require('../proxy');

async function GET(request, { params }) {
  const { slug } = await params;
  return proxyBlogPage(request, slug.join('/'));
}

module.exports = { GET };`;
};

/**
 * Generates the WordPress plugin PHP code
 */
export const generateWordPressPluginCode = (domain: string, userId: string | number, subFolder: string): string => {
    const origin = domain ? `https://${domain}` : 'https://your-domain.hyperblog.cloud';
    const finalUserId = userId || 'your-user-id';
    
    return `<?php
/**
 * Plugin Name: Hyperblog
 * Description: Serves blog content from Hyperblog under /blogs and /blogs/* of your WordPress site.
 * Version: 1.0
 * Author: Hyperblog
 */

defined('ABSPATH') || exit;

// ================================================================
// ⚙️ CONFIGURATION — Edit these values per client
// ================================================================

// Your Hyperblog User ID
define('HYPERBLOG_USER_ID',     '${finalUserId}');

// Blog path on your WordPress site
define('HYPERBLOG_BLOG_PREFIX', '${subFolder}');

// Hyperblog frontend origin
define('HYPERBLOG_ORIGIN',      '${origin}');

// ================================================================


// ================================================================
// HTACCESS: Route /_next/* and /_vercel/* through WordPress/PHP
// ================================================================
register_activation_hook(__FILE__, 'hyperblog_update_htaccess');
register_deactivation_hook(__FILE__, 'hyperblog_remove_htaccess');

function hyperblog_update_htaccess() {
    $htaccess_file = ABSPATH . '.htaccess';
    if (!file_exists($htaccess_file)) return;

    $rules = "\\n# BEGIN HyperblogProxy\\n"
           . "<IfModule mod_rewrite.c>\\n"
           . "RewriteEngine On\\n"
           . "RewriteRule ^_next/(.*)$ /index.php [L,QSA]\\n"
           . "RewriteRule ^_vercel/(.*)$ /index.php [L,QSA]\\n"
           . "RewriteRule ^\\.well-known/vercel(.*)$ /index.php [L,QSA]\\n"
           . "</IfModule>\\n"
           . "# END HyperblogProxy\\n";

    $contents = file_get_contents($htaccess_file);
    $contents = preg_replace('/\\n?# BEGIN HyperblogProxy.*# END HyperblogProxy\\n?/s', '', $contents);
    $contents = str_replace('# BEGIN WordPress', $rules . '# BEGIN WordPress', $contents);
    file_put_contents($htaccess_file, $contents);
}

function hyperblog_remove_htaccess() {
    $htaccess_file = ABSPATH . '.htaccess';
    if (!file_exists($htaccess_file)) return;
    $contents = file_get_contents($htaccess_file);
    $contents = preg_replace('/\\n?# BEGIN HyperblogProxy.*# END HyperblogProxy\\n?/s', '', $contents);
    file_put_contents($htaccess_file, $contents);
}


// ================================================================
// MAIN LOGIC
// ================================================================
add_action('init', function () {

    $host         = strtolower(preg_replace('/:\\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
    $request_path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
    $query_string = $_SERVER['QUERY_STRING'] ?? '';
    $scheme       = is_ssl() ? 'https' : 'http';
    $user_id      = HYPERBLOG_USER_ID;

    // ------------------------------------------------------------------
    // Set user_id cookie on the browser
    // ------------------------------------------------------------------
    if (empty($_COOKIE['user_id']) || $_COOKIE['user_id'] !== $user_id) {
        setcookie('user_id', $user_id, [
            'expires'  => time() + 86400,
            'path'     => '/',
            'secure'   => is_ssl(),
            'httponly' => false,
            'samesite' => 'Lax',
        ]);
        $_COOKIE['user_id'] = $user_id;
    }

    // ------------------------------------------------------------------
    // CASE 1: Serve Next.js / Vercel static assets
    // /_next/*, /_vercel/*, /.well-known/vercel/*
    // ------------------------------------------------------------------
    $asset_prefixes = ['_next/', '_vercel/', '.well-known/vercel'];
    foreach ($asset_prefixes as $prefix) {
        if (strpos($request_path, $prefix) === 0) {
            $asset_url = rtrim(HYPERBLOG_ORIGIN, '/') . '/' . $request_path;
            if (!empty($query_string)) $asset_url .= '?' . $query_string;
            hyperblog_serve_asset($asset_url, $user_id);
            return;
        }
    }

    // ------------------------------------------------------------------
    // CASE 2: Serve /blogs/* pages from Hyperblog
    // ------------------------------------------------------------------
    $prefix = HYPERBLOG_BLOG_PREFIX;
    if ($request_path !== $prefix && strpos($request_path, $prefix . '/') !== 0) {
        return; // Not a /blogs/* path — WordPress handles normally
    }

    $slug          = ltrim(substr($request_path, strlen($prefix)), '/');
    $hyperblog_url = rtrim(HYPERBLOG_ORIGIN, '/') . '/' . $prefix . ($slug ? '/' . $slug : '');
    if (!empty($query_string)) $hyperblog_url .= '?' . $query_string;

    $response = wp_remote_get($hyperblog_url, [
        'timeout'   => 20,
        'sslverify' => false,
        'headers'   => [
            'User-Agent'        => 'Mozilla/5.0 (compatible; Hyperblog/1.0)',
            'X-Forwarded-Host'  => $host,
            'X-Forwarded-Proto' => $scheme,
            'X-Hyperblog-Origin' => $host,
            'Cookie'            => 'user_id=' . rawurlencode($user_id),
        ],
    ]);

    if (is_wp_error($response)) {
        error_log('[Hyperblog]  Failed to fetch blog page: ' . $hyperblog_url . ' — ' . $response->get_error_message());
        status_header(502);
        echo '<h1>Blog temporarily unavailable.</h1>';
        exit;
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body        = wp_remote_retrieve_body($response);

    if ($status_code !== 200) {
        error_log('[Hyperblog] Unexpected status ' . $status_code . ' for: ' . $hyperblog_url);
    }

    // Rewrite Hyperblog absolute URLs → your /blogs/ path
    $your_blogs_url = home_url('/' . $prefix . '/');
    $body = str_replace(rtrim(HYPERBLOG_ORIGIN, '/') . '/', $your_blogs_url, $body);

    status_header($status_code);
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Served-By: Hyperblog');
    echo $body;
    exit;

});


// ================================================================
// HELPER: Serve a static asset (JS, CSS, fonts, images)
// ================================================================
function hyperblog_serve_asset($url, $user_id) {
    $response = wp_remote_get($url, [
        'timeout'   => 15,
        'sslverify' => false,
        'headers'   => [
            'User-Agent' => 'Mozilla/5.0 (compatible; Hyperblog/1.0)',
            'Cookie'     => 'user_id=' . rawurlencode($user_id),
        ],
    ]);

    if (is_wp_error($response)) {
        error_log('[Hyperblog]  Failed to fetch asset: ' . $url . ' — ' . $response->get_error_message());
        status_header(502);
        exit;
    }

    $status_code  = wp_remote_retrieve_response_code($response);
    $body         = wp_remote_retrieve_body($response);
    $content_type = wp_remote_retrieve_header($response, 'content-type');

    if ($status_code !== 200) {
        error_log('[Hyperblog]  Asset returned status ' . $status_code . ' for: ' . $url);
    }

    if (empty($content_type)) {
        $ext = strtolower(pathinfo(strtok($url, '?'), PATHINFO_EXTENSION));
        $map = [
            'js'    => 'application/javascript',
            'css'   => 'text/css',
            'json'  => 'application/json',
            'woff'  => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf'   => 'font/ttf',
            'svg'   => 'image/svg+xml',
            'png'   => 'image/png',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'ico'   => 'image/x-icon',
        ];
        $content_type = $map[$ext] ?? 'application/octet-stream';
    }

    status_header($status_code);
    header('Content-Type: ' . $content_type);
    header('Cache-Control: public, max-age=31536000, immutable');
    header('X-Served-By: Hyperblog');
    echo $body;
    exit;
}
`;
};
