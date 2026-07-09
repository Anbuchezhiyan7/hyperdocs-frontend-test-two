import { NextRequest } from 'next/server';
import { getTemplateDetails } from '@/services/server-api.service';
import { LOCALHOST_FALLBACK_USER_ID } from '@/constants/definitions';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function resolveUserId(req: NextRequest): Promise<string> {
    const cookieUserId = req.cookies.get('user_id')?.value;
    const host = req.headers.get('host') || '';

    // Local dev override
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return cookieUserId || LOCALHOST_FALLBACK_USER_ID;
    }

    if (cookieUserId && cookieUserId !== 'test:localhost') {
        return cookieUserId;
    }

    try {
        const response = await fetch(`${API_URL}/api/v1/settings/domain/user_id/${host}`, {
            cache: 'no-store',
        });
        if (response.ok) {
            const data = await response.json();
            const userId = data?.user_id || data;
            if (userId && userId !== 'test:localhost') {
                return userId;
            }
        }
    } catch (error) {
        console.error('resolveUserId error in robots.txt:', error);
    }

    return LOCALHOST_FALLBACK_USER_ID;
}

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;
    const userId = await resolveUserId(req);
    const template = await getTemplateDetails(userId);
    const customRobotsTxt = template?.seo?.custom_robots_txt;
    console.log("🚀 ~ GET ~ customRobotsTxt:", customRobotsTxt)

    const defaultRobotsText = `
User-agent: *
Allow: /

# Sitemap Index
Sitemap: ${origin}/sitemap.xml
`.trim();

    const robotsText = customRobotsTxt ? customRobotsTxt.trim() : defaultRobotsText;

    return new Response(robotsText, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
