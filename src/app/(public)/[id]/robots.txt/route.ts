import { BASE_URL } from '@/constants/definitions';
import { NextRequest } from 'next/server';

 

export async function GET(req: NextRequest) {
    const slug = req.nextUrl.pathname.split('/')[1];

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

    const blogResponse = await getBlogMetaData(slug);


    
    // Example: Fetch dynamic settings from your API
    const settings = await fetch(
        `${BASE_URL}/api/v1/templates/details/${blogResponse?.user_id} `,
        { cache: 'no-store' }
    ).then(res => res.json());

    const customRobotsTxt = settings?.seo?.custom_robots_txt || '';
    
    const robotsText = `
    User-agent: *
    Allow: /
    
    ${customRobotsTxt}
    Sitemap: ${req.nextUrl.origin}/${slug}/sitemap.xml
    `.trim();
    
    return new Response(robotsText, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
