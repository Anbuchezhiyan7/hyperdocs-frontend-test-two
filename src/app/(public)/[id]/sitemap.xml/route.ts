// app/sitemap.xml/route.ts

import apiPath from '@/constants/api-path.constants';
import { type NextRequest } from 'next/server';
import { BASE_URL } from '@/constants/definitions';

async function getBlogMetaData(slug: string): Promise<any | null> {
  if (!slug || slug === 'favicon.ico') {
      return null;
  }

  try {
      const apiUrl = `${BASE_URL}/api/v1/templates/meta_data/${slug}`;
      const response = await fetch(apiUrl, {
          headers: {
              'Content-Type': 'application/json',
          },
          cache: 'no-store',
      });

      if (!response.ok) {
          console.error('API Error Response:', response.status);
          return null;
      }
      const data = await response.json();
      
      return data;
  } catch (error) {
      console.error('Error fetching blog metadata:', error);
      return null;
  }
}

export async function GET(req: NextRequest) {
  const baseUrl = BASE_URL || 'https://example.com';
  const frontendUrl = `${req.nextUrl.origin}` || 'https://example.com';
  const slug = req.nextUrl.pathname.split('/')[1];
  const blogResponse = await getBlogMetaData(slug);
  console.log(blogResponse.user_id,'SITEMAP BLOG RESPONSE');




  // Fetch your dynamic blog slugs - replace with your actual logic
  console.log(`${BASE_URL}/api/v1${apiPath.blog.slug(slug)}`,'SITEMAP BLOG ENDPOINT');
  
  const response = await fetch(`${baseUrl}/api/v1${apiPath.blog.slug(slug)}`, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
       user_id: blogResponse?.user_id,
    }),
  }).then(res => res.json());

  const urls = `
      <url>
        <loc>${frontendUrl}/${response?.blog?.blog_info?.slug_url}</loc>
        <lastmod>${response?.blog?.updated_at || new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
      </url>
    `;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
