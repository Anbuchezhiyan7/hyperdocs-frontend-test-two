import BlogsPageComponent from '@/components/blog-templates';
import BlogTemplateLayout from '@/components/blog-templates/layouts';
import { BASE_URL } from '@/constants/definitions';
import { Metadata, Viewport } from 'next';
import apiPath from '@/constants/api-path.constants';
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';

import DeferredGoogleAnalytics from './DeferredGoogleAnalytics';
import Link from 'next/link';
import { preload } from 'react-dom';
import { getCategorizedBlogs } from '@/services/server-api.service';
import { cloudinaryImageSrcSet, optimizeCloudinaryImage } from '@/utils/cloudinary';

// 📌 No cookies() here — this page is now fully static (no loading spinner on every visit).
// templateId and GA are fetched client-side inside BlogsPageComponent using js-cookie + React Query.
export const revalidate = 3600;

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

// Default metadata values
const DEFAULT_METADATA = {
    title: 'Blogs | Hyperblog',
    description: 'Discover insightful articles and stories on Hyperblog.',
    ogImage:
        'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    siteUrl: 'https://hyperblog.com',
};

// Cached so the home-page document isn't blocked by a live network round-trip on
// every request (this was the ~510ms "Document request latency"/TTFB cost). Tagged
// to match the admin revalidation (revalidatePublic('template'|'settings') already
// busts template-details-<userId> / user-template-<userId>), so edits still surface
// instantly. 1h safety-net revalidate mirrors the page's own `revalidate = 3600`.
async function getTemplateData (userId: string) {
    if (!userId) return null;

    return unstable_cache(
        async () => {
            try {
                const apiUrl = `${BASE_URL}/api/v1${apiPath.templates.custom(userId, 'details')}`;
                const response = await fetch(apiUrl, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store', // raw fetch not cached; unstable_cache handles persistence
                });

                if (!response.ok) {
                    console.error('API Error Response:', response.status);
                    return null;
                }

                return await response.json();
            } catch (error) {
                console.error('Error fetching template data:', error);
                return null;
            }
        },
        [`home-template-details-${userId}`],
        { revalidate: 3600, tags: ['template-details', `template-details-${userId}`] }
    )();
}

const getUserTemplate = async (userId: string) => {
    if (!userId) return null;

    return unstable_cache(
        async () => {
            try {
                const apiUrl = `${BASE_URL}/api/v1${apiPath.templates.custom(userId, 'user_template')}`;
                const response = await fetch(apiUrl, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store', // raw fetch not cached; unstable_cache handles persistence
                });

                if (!response.ok) {
                    console.error('API Error Response:', response.status);
                    return null;
                }

                return await response.json();
            } catch (error) {
                console.error('Error fetching user template:', error);
                return null;
            }
        },
        [`home-user-template-${userId}`],
        { revalidate: 3600, tags: ['user-template', `user-template-${userId}`] }
    )();
};

async function getAllBlogsServerSide(userId: string) {
    if (!userId) return [];
    try {
        const apiUrl = `${BASE_URL}/api/v1${apiPath.templates.custom(userId, 'all_blogs')}`;
        const response = await fetch(apiUrl, {
            headers: { 'Content-Type': 'application/json' },
            // Tagged 'blogs' so the admin's `clearCacheByTag('blogs')` on every
            // blog save busts this immediately — otherwise the SSR'd hero/SEO
            // block would sit stale until the 1h timer. 3600 is the safety net.
            next: { revalidate: 3600, tags: ['blogs'] },
        });
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export async function generateMetadata (): Promise<Metadata> {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;
        const templateData = userId ? await getTemplateData(userId) : null;

        // Create schema markup
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: templateData?.general?.organization_name || DEFAULT_METADATA.title,
            description: templateData?.general?.description || DEFAULT_METADATA.description,
            author: {
                '@type': 'Person',
                name: templateData?.general?.organization_name || 'Hyperblog',
            },
            datePublished: templateData?.advanced?.created_at || new Date().toISOString(),
            dateModified: templateData?.advanced?.updated_at || new Date().toISOString(),
            publisher: {
                '@type': 'Organization',
                name: templateData?.general?.organization_name || 'Hyperblog',
                logo: {
                    '@type': 'ImageObject',
                    url:
                        templateData?.general?.organization_logo?.url ||
                        `${DEFAULT_METADATA.siteUrl}/logo.png`,
                },
            },
        };

        const ogImage = templateData?.advanced?.graph_image?.url || DEFAULT_METADATA.ogImage;
        const metaTitle = templateData?.seo?.meta_title || DEFAULT_METADATA.title;
        const metaDescription = templateData?.seo?.meta_description || DEFAULT_METADATA.description;
        const canonicalUrl = templateData?.seo?.canonical_url || DEFAULT_METADATA.siteUrl;
        const favIcon =
            templateData?.advanced?.fav_icon?.url || '/favicon.ico';

        return {
            title: metaTitle,
            description: metaDescription,
            alternates: {
                canonical: canonicalUrl,
            },
            icons: {
                icon: favIcon,
            },
            openGraph: {
                title: metaTitle,
                description: metaDescription,
                url: canonicalUrl,
                siteName: metaTitle,
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: 'Blog Preview Image',
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: [ogImage],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);

        // Return default metadata in case of error
        return {
            title: DEFAULT_METADATA.title,
            description: DEFAULT_METADATA.description,
            alternates: {
                canonical: DEFAULT_METADATA.siteUrl,
            },
            openGraph: {
                title: DEFAULT_METADATA.title,
                description: DEFAULT_METADATA.description,
                url: DEFAULT_METADATA.siteUrl,
                siteName: DEFAULT_METADATA.title,
                images: [
                    {
                        url: DEFAULT_METADATA.ogImage,
                        width: 1200,
                        height: 630,
                        alt: 'Blog Preview Image',
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: DEFAULT_METADATA.title,
                description: DEFAULT_METADATA.description,
                images: [DEFAULT_METADATA.ogImage],
            },
        };
    }
}

export default async function BlogsPage () {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    const [templateResponse, userResponse, blogs] = await Promise.all([
        getTemplateData(userId as string),
        getUserTemplate(userId as string),
        getAllBlogsServerSide(userId as string),
    ]);

    const templateData = templateResponse || null;
    const userTemplate = userResponse || null;
    const googleAnalyticsId = templateData?.seo?.google_analytics_id || '';

    // Preload the LCP hero (first blog's featured image) with a RESPONSIVE
    // imageSrcSet/imageSizes that mirror FeaturedHeroCard's <Image fill sizes=...>
    // exactly (same widths + q_auto:eco + same `sizes`). This starts the download
    // at HTML-parse time — fixing the "LCP request discovery" finding — while the
    // browser still selects/reuses the identical variant the <img> requests, so
    // there's no double download.
    const heroImageUrl: string | undefined = blogs?.[0]?.blog_info?.featured_image?.url;
    if (heroImageUrl && heroImageUrl.startsWith('http')) {
        preload(optimizeCloudinaryImage(heroImageUrl, 1080, 'auto:eco'), {
            as: 'image',
            fetchPriority: 'high',
            imageSrcSet: cloudinaryImageSrcSet(heroImageUrl),
            imageSizes: '(max-width: 1024px) 100vw, 50vw',
        });
    }

    // Pre-fetch category blogs server-side to eliminate per-category client waterfalls.
    // templateData.advanced.categories holds the list with category_id values.
    const categoryIds: string[] = (templateData?.advanced?.categories || []).map(
        (c: any) => c?.category_id as string
    ).filter(Boolean);

    const categoryBlogsResults = categoryIds.length
        ? await Promise.allSettled(categoryIds.map(id => getCategorizedBlogs(id)))
        : [];

    const initialCategoryBlogsMap: Record<string, Blog[]> = {};
    categoryIds.forEach((id, i) => {
        const result = categoryBlogsResults[i];
        if (result?.status === 'fulfilled' && Array.isArray(result.value)) {
            initialCategoryBlogsMap[id] = result.value as Blog[];
        }
    });

    // Build Blog schema for JSON-LD
    const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: templateData?.general?.organization_name || 'Hyperblog',
        description: templateData?.seo?.meta_description || 'Discover insightful articles and stories.',
        url: templateData?.seo?.canonical_url || '',
        blogPost: blogs.slice(0, 10).map((blog: any) => ({
            '@type': 'BlogPosting',
            headline: blog.blog_title,
            url: blog.slug_url ? `/${blog.slug_url}` : undefined,
            datePublished: blog.created_at,
            author: {
                '@type': 'Person',
                name: blog.author || blog.author_details?.author_name,
            },
        })),
    };

    return (
        <BlogTemplateLayout>
            {/* JSON-LD Schema — real script tag for LLM/crawler visibility */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
                suppressHydrationWarning
            />
            {/* Server-rendered blog listing for LLM/SEO visibility */}
            {blogs.length > 0 && (
                <div
                    aria-hidden="false"
                    style={{
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: 0,
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0,0,0,0)',
                        whiteSpace: 'nowrap',
                        border: 0,
                    }}
                >
                    <h1>{templateData?.advanced?.header_title || templateData?.general?.organization_name || 'Blog'}</h1>
                    {templateData?.advanced?.header_caption && (
                        <p>{templateData.advanced.header_caption}</p>
                    )}
                    <nav aria-label="Blog posts">
                        <ul>
                            {blogs.slice(0, 20).map((blog: any) => (
                                <li key={blog.blog_id}>
                                    <Link href={`/${blog.slug_url || blog.blog_id}`}>
                                        <h2>{blog.blog_title}</h2>
                                    </Link>
                                    {blog.blog_info?.meta_description && (
                                        <p>{blog.blog_info.meta_description}</p>
                                    )}
                                    {blog.author_details?.author_name && (
                                        <span>By {blog.author_details.author_name}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
            <BlogsPageComponent
                initialCategoryBlogsMap={initialCategoryBlogsMap}
                initialTemplate={templateData}
                initialUserTemplate={userTemplate}
                initialBlogs={blogs}
            />
            {googleAnalyticsId && <DeferredGoogleAnalytics gaId={googleAnalyticsId} />}
        </BlogTemplateLayout>
    );
}
