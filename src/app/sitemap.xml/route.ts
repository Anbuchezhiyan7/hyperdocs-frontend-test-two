import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const now = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${origin}/sitemap-pages.xml</loc>
        <lastmod>${now}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${origin}/sitemap-blogs.xml</loc>
        <lastmod>${now}</lastmod>
    </sitemap>
</sitemapindex>`;

    return new Response(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
