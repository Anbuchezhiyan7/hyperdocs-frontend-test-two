import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const now = new Date().toISOString();

    const staticPages = [
        { loc: `${origin}/`, changefreq: 'daily', priority: '1.0', lastmod: now },
        { loc: `${origin}/author`, changefreq: 'weekly', priority: '0.5', lastmod: now },
    ];

    const urlEntries = staticPages
        .map(
            page => `
    <url>
        <loc>${page.loc}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`
        )
        .join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
