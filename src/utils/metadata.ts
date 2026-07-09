import { BASE_URL, DOMAIN_URL, LOCALHOST_FALLBACK_USER_ID } from '@/constants/definitions';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { getBlogDataBySlug, getTemplateDetails } from '@/services/server-api.service';

// Default metadata values
export const DEFAULT_METADATA = {
    title: 'Blogs | Hyperblog',
    description: 'Discover insightful articles and stories on Hyperblog.',
    ogImage:
        'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    siteUrl: 'https://hyperblog.com',
    author: 'Hyperblog',
};

export interface FAQSchemaItem {
    question: string;
    answer: string;
}

export interface AuthorSchemaInput {
    author_id?: string;
    author_name?: string;
    designation?: string;
    short_bio?: string;
    author_image?: {
        url?: string;
    };
    social_links?: Record<string, string | undefined>;
}

export interface ArticleSchemaInput {
    blog_title?: string;
    created_at?: string;
    updated_at?: string;
    category?: {
        category_name?: string;
    };
    tags?: Array<{
        tag_name?: string;
    }>;
    blog_info?: {
        custom_meta_data?: {
            description?: string;
        };
        featured_image?: {
            url?: string;
        };
    };
    author_details?: AuthorSchemaInput | null;
}

// Types for blog metadata
export interface BlogMetaData {
    blog_info?: {
        custom_meta_data?: {
            title?: string;
            description?: string;
        };
        author_details?: {
            author_name?: string;
        };
        featured_image?: {
            url?: string;
        };
        schema_markup?: string;
        custom_script?: string;
        canonical_url?: string;
        created_at?: string;
        updated_at?: string;
        slug_url?: string;
    };
    user_id?: string;
}

/**
 * Fetch blog metadata from API
 */
export async function getBlogMetaData(slug: string): Promise<BlogMetaData | null> {
    const cookieStore = await cookies();
    const cookieUserId = cookieStore.get('user_id')?.value;
    const userId =
        !cookieUserId || cookieUserId === 'test:localhost'
            ? LOCALHOST_FALLBACK_USER_ID
            : cookieUserId;

    if (!slug || slug === 'favicon.ico') {
        return null;
    }

    // Wrapped in unstable_cache so the blocking <head> metadata fetch doesn't hit
    // the network on every request (was the main "Document request latency"/TTFB
    // cost). Same tags as getBlogDataBySlug → blog publish/update already busts it
    // via clearCacheByTag('blogs'). cookies()/userId resolved above, outside the
    // cache closure, since reading request state isn't allowed inside it.
    return unstable_cache(
        async () => {
            try {
                const apiUrl = `${BASE_URL}/api/v1/templates/meta_data/${slug}?user_id=${userId}`;
                const response = await fetch(apiUrl, {
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store', // raw fetch not cached; unstable_cache handles persistence
                    method: 'GET',
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
        },
        [`blog-meta-${userId}-${slug}`],
        { revalidate: false, tags: ['blogs', `blog-${slug}`] }
    )();
}

/**
 * Generate schema markup for the blog
 */
export function generateSchemaMarkup(blog: BlogMetaData['blog_info']): any[] {
    if (blog?.schema_markup) {
        try {
            // Extract JSON from script tags if present
            let jsonContent = blog.schema_markup;
            
            // Check if the content is wrapped in script tags
            if (jsonContent.includes('<script') && jsonContent.includes('</script>')) {
                // Extract content between script tags
                const scriptMatch = jsonContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
                if (scriptMatch && scriptMatch[1]) {
                    jsonContent = scriptMatch[1].trim();
                }
            }
            
            return JSON.parse(jsonContent);
        } catch (error) {
            console.error('Error parsing schema markup:', error);
        }
    }

    // Default schema markup
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: blog?.custom_meta_data?.title || DEFAULT_METADATA.title,
            description: blog?.custom_meta_data?.description || DEFAULT_METADATA.description,
            author: {
                '@type': 'Person',
                name: blog?.author_details?.author_name || DEFAULT_METADATA.author,
            },
            datePublished: blog?.created_at || new Date().toISOString(),
            dateModified: blog?.updated_at || new Date().toISOString(),
            publisher: {
                '@type': 'Organization',
                name: blog?.custom_meta_data?.title || DEFAULT_METADATA.title,
                logo: {
                    '@type': 'ImageObject',
                    url: blog?.featured_image?.url || `${DEFAULT_METADATA.siteUrl}/logo.png`,
                },
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'What is Hyperblog?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Hyperblog is a platform for creating and sharing blogs.',
                    },
                },
            ],
        },
    ];
}

/**
 * Generate complete metadata for a blog
 * This function now handles both metadata generation and user ID cookie setting
 */
export async function generateBlogMetadata(slug: string): Promise<Metadata> {
    try {
        const cookieStore = await cookies();
        const cookieUserId = cookieStore.get('user_id')?.value;
        const userId =
            !cookieUserId || cookieUserId === 'test:localhost'
                ? LOCALHOST_FALLBACK_USER_ID
                : cookieUserId;

        // Fetch all three: blog meta, full blog, and the tenant's template
        // (template provides graph_image / fav_icon for the site-wide branding).
        // visitor_id intentionally empty — per-visitor view tracking not used here.
        const [metaResponse, fullBlog, templateData] = await Promise.all([
            getBlogMetaData(slug),
            getBlogDataBySlug(slug, userId, ''),
            getTemplateDetails(userId),
        ]);

        const blog = metaResponse?.blog_info || fullBlog?.blog_info;
        const authorDetails = fullBlog?.author_details || (fullBlog as any)?.author_details;

        if (!blog && !fullBlog) {
            return generateDefaultMetadata();
        }

        // Set user ID cookie if needed (server-side)
        if (metaResponse?.user_id) {
            await setUserIdCookieServerSide(metaResponse.user_id);
        }

        const graphImage = templateData?.advanced?.graph_image?.url;
        const favIcon = templateData?.advanced?.fav_icon?.url || '/favicon.ico';

        const schema = generateSchemaMarkup(blog);
        const ogImage = ensureWhatsAppCompatibleImage(
            blog?.featured_image?.url || graphImage || DEFAULT_METADATA.ogImage,
        );
        const metaTitle = blog?.custom_meta_data?.title || (fullBlog as any)?.blog_title || DEFAULT_METADATA.title;
        const metaDescription = blog?.custom_meta_data?.description || DEFAULT_METADATA.description;
        const canonicalUrl = blog?.canonical_url || `${DEFAULT_METADATA.siteUrl}/blogs`;
        console.log('blog in GENERATE BLOG METADATA CANONICAL URL', canonicalUrl);

        // Debug logging for WhatsApp compatibility
        console.log('WhatsApp OG Debug:', {
            originalImage: blog?.featured_image?.url,
            processedImage: ogImage,
            title: metaTitle,
            description: metaDescription,
            url: canonicalUrl
        });

        const authorName =
            authorDetails?.author_name ||
            (fullBlog as any)?.author_name ||
            DEFAULT_METADATA.author;

        // Prepare metadata object
        const metadata: Metadata = {
            title: metaTitle,
            description: metaDescription,
            authors: [{ name: authorName }],
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
                        type: 'image/jpeg',
                    },
                ],
                locale: 'en_US',
                type: 'article',
                authors: [authorName],
                publishedTime: blog?.created_at || (metaResponse as any)?.created_at,
                modifiedTime: blog?.updated_at || (metaResponse as any)?.updated_at,
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: [ogImage],
            },
            other: {
                'application/ld+json': JSON.stringify(schema),
                // WhatsApp specific meta tags
                'og:image:width': '1200',
                'og:image:height': '630',
                'og:image:type': 'image/jpeg',
                'og:image:alt': 'Blog Preview Image',
                // Additional WhatsApp optimizations
                'og:image:secure_url': ogImage,
                'og:locale': 'en_US',
                'og:type': 'website',
                'og:site_name': metaTitle,
            },
        };

        // Add custom script to metadata if present
        if (blog?.custom_script) {
            (metadata.other as any)['custom-script'] = blog.custom_script;
        }

        return metadata;
    } catch (error) {
        console.error('Error generating metadata:', error);
        return generateDefaultMetadata();
    }
}

/**
 * Build site-wide branding metadata (title, description, favicon, OG image)
 * from the tenant's template details. Used by listing-style pages (author,
 * category, tag) that have no per-blog metadata of their own, so they pick up
 * the template's fav_icon / graph_image instead of the static defaults.
 */
export async function generateTemplateMetadata(): Promise<Metadata> {
    try {
        const cookieStore = await cookies();
        const cookieUserId = cookieStore.get('user_id')?.value;
        const userId =
            !cookieUserId || cookieUserId === 'test:localhost'
                ? LOCALHOST_FALLBACK_USER_ID
                : cookieUserId;

        const templateData = await getTemplateDetails(userId);
        if (!templateData) {
            return generateDefaultMetadata();
        }

        const favIcon = templateData?.advanced?.fav_icon?.url || '/favicon.ico';
        const ogImage = ensureWhatsAppCompatibleImage(
            templateData?.advanced?.graph_image?.url || DEFAULT_METADATA.ogImage,
        );
        const metaTitle = templateData?.seo?.meta_title || DEFAULT_METADATA.title;
        const metaDescription = templateData?.seo?.meta_description || DEFAULT_METADATA.description;
        const canonicalUrl = templateData?.seo?.canonical_url || `${DEFAULT_METADATA.siteUrl}/blogs`;

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
        console.error('Error generating template metadata:', error);
        return generateDefaultMetadata();
    }
}

/**
 * Generate default metadata for fallback cases
 */
export function generateDefaultMetadata(): Metadata {
    return {
        title: DEFAULT_METADATA.title,
        description: DEFAULT_METADATA.description,
        alternates: {
            canonical: `${DEFAULT_METADATA.siteUrl}/blogs`,
        },
        openGraph: {
            title: DEFAULT_METADATA.title,
            description: DEFAULT_METADATA.description,
            url: `${DEFAULT_METADATA.siteUrl}/blogs`,
            siteName: DEFAULT_METADATA.title,
            images: [
                {
                    url: ensureWhatsAppCompatibleImage(DEFAULT_METADATA.ogImage),
                    width: 1200,
                    height: 630,
                    alt: 'Blog Preview Image',
                    type: 'image/jpeg',
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

/**
 * Extract script content from script tags if present
 */
export function extractScriptContent(scriptContent: string): string {
    // Check if the content is wrapped in script tags
    if (scriptContent.includes('<script') && scriptContent.includes('</script>')) {
        // Extract content between script tags
        const scriptMatch = scriptContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        if (scriptMatch && scriptMatch[1]) {
            return scriptMatch[1].trim();
        }
    }
    
    // Return as-is if not wrapped in script tags
    return scriptContent;
}

/**
 * Convert Cloudinary image URL to JPEG format for better WhatsApp compatibility
 */
function convertImageToJpeg(imageUrl: string): string {
    try {
        // Only handle Cloudinary URLs
        if (!imageUrl.includes('cloudinary.com')) {
            return imageUrl;
        }
        
        const url = new URL(imageUrl);
        const pathname = url.pathname.toLowerCase();
        
        // Check if it's already a JPEG
        if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
            return imageUrl;
        }
        
        // Convert PNG and WebP to JPEG using Cloudinary parameters
        if (pathname.endsWith('.png') || pathname.endsWith('.webp')) {
            const separator = imageUrl.includes('?') ? '&' : '?';
            const convertedUrl = `${imageUrl}${separator}f_jpg,q_85,w_1200,h_630,c_fill`;
            
            console.log('Cloudinary WhatsApp conversion:', {
                original: imageUrl,
                converted: convertedUrl
            });
            
            return convertedUrl;
        }
        
        // For other formats, just ensure JPEG format
        const separator = imageUrl.includes('?') ? '&' : '?';
        return `${imageUrl}${separator}f_jpg,q_85`;
        
    } catch (error) {
        console.error('Error converting Cloudinary image to JPEG:', error);
        return imageUrl;
    }
}

/**
 * Check if Cloudinary image URL is already in a WhatsApp-compatible format
 */
function isWhatsAppCompatibleFormat(imageUrl: string): boolean {
    try {
        // Only check Cloudinary URLs
        if (!imageUrl.includes('cloudinary.com')) {
            return true; // Assume other URLs are compatible
        }
        
        const url = new URL(imageUrl);
        const pathname = url.pathname.toLowerCase();
        
        // Check if it's already JPEG (WhatsApp's preferred format)
        if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
            return true;
        }
        
        // Check if it already has Cloudinary JPEG parameters
        if (imageUrl.includes('f_jpg') || imageUrl.includes('f_jpeg')) {
            return true;
        }
        
        return false;
    } catch (error) {
        return false;
    }
}

/**
 * Ensure image URL is WhatsApp compatible
 * WhatsApp requires images to be publicly accessible and in supported formats
 */
export function ensureWhatsAppCompatibleImage(imageUrl: string): string {
    if (!imageUrl) return imageUrl;
    
    let processedUrl = imageUrl;
    
    // Ensure URL is absolute
    if (processedUrl.startsWith('//')) {
        processedUrl = `https:${processedUrl}`;
    } else if (processedUrl.startsWith('/')) {
        processedUrl = `${DEFAULT_METADATA.siteUrl}${processedUrl}`;
    }
    
    // Convert Cloudinary PNG and WebP to JPEG for better WhatsApp compatibility
    if (processedUrl.includes('cloudinary.com')) {
        const url = new URL(processedUrl);
        const pathname = url.pathname.toLowerCase();
        
        if (pathname.endsWith('.png') || pathname.endsWith('.webp')) {
            const convertedUrl = convertImageToJpeg(processedUrl);
            
            if (convertedUrl !== processedUrl) {
                console.log('WhatsApp compatibility: Converted Cloudinary image format:', {
                    original: processedUrl,
                    converted: convertedUrl
                });
                return convertedUrl;
            }
        } else if (!isWhatsAppCompatibleFormat(processedUrl)) {
            // For other formats, ensure JPEG
            const convertedUrl = convertImageToJpeg(processedUrl);
            if (convertedUrl !== processedUrl) {
                console.log('WhatsApp compatibility: Ensured JPEG format for Cloudinary image:', {
                    original: processedUrl,
                    converted: convertedUrl
                });
                return convertedUrl;
            }
        }
    }
    
    return processedUrl;
}

/**
 * Set user ID cookie server-side (more efficient than client-side)
 */
async function setUserIdCookieServerSide(userId: string): Promise<void> {
    try {
        // This will be handled by the middleware or can be set directly in cookies
        // The middleware already handles user_id cookie setting, so this is just a backup
        console.log('User ID available for cookie setting:', userId);
    } catch (error) {
        console.error('Error setting user ID cookie server-side:', error);
    }
}

/**
 * Extract custom script from metadata
 */
export function getCustomScriptFromMetadata(metadata: Metadata): string | null {
    return (metadata.other as any)?.['custom-script'] || null;
}

/**
 * Legacy function - kept for backward compatibility but deprecated
 * @deprecated Use the server-side approach instead
 */
export async function setUserIdCookie(slug: string): Promise<void> {
    try {
        console.log(slug, 'setUserIdCookie - DEPRECATED');
    } catch (error) {
        console.error('Error in deprecated setUserIdCookie:', error);
    }
}

// --- NEW SCHEMA GENERATION FUNCTIONS ---

export function generateFAQSchema(faqItems: FAQSchemaItem[] = []) {
    const mainEntity = faqItems
        .filter(item => item?.question?.trim() && item?.answer?.trim())
        .map(item => ({
            '@type': 'Question',
            name: item.question.trim(),
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer.trim(),
            },
        }));

    if (!mainEntity.length) {
        return null;
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity,
    };
}

function getPublicSiteUrl(preferredSiteUrl?: string): string {
    if (preferredSiteUrl?.trim()) {
        return preferredSiteUrl.trim().replace(/\/+$/, '');
    }

    if (DOMAIN_URL?.trim()) {
        const normalizedDomain = DOMAIN_URL.trim().replace(/\/+$/, '');
        return /^https?:\/\//i.test(normalizedDomain) ? normalizedDomain : `https://${normalizedDomain}`;
    }

    return DEFAULT_METADATA.siteUrl;
}

function normalizeAuthorSegment(value?: string): string {
    return (value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

function toAbsoluteUrl(url?: string, siteUrl?: string): string | undefined {
    if (!url?.trim()) {
        return undefined;
    }

    const trimmedUrl = url.trim();

    if (/^https?:\/\//i.test(trimmedUrl)) {
        return trimmedUrl;
    }

    if (trimmedUrl.startsWith('//')) {
        return `https:${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith('/')) {
        return `${getPublicSiteUrl(siteUrl)}${trimmedUrl}`;
    }

    return trimmedUrl;
}

export function generateAuthorSchema(
    authorDetails?: AuthorSchemaInput | null,
    options?: { siteUrl?: string }
) {
    if (!authorDetails?.author_name?.trim()) {
        return null;
    }

    const authorSlug = normalizeAuthorSegment(authorDetails.author_name);
    const designationSlug = normalizeAuthorSegment(authorDetails.designation) || 'no_designation';
    const authorPageUrl =
        authorSlug && designationSlug
            ? `${getPublicSiteUrl(options?.siteUrl)}/blogs/author/${authorSlug}/${designationSlug}`
            : undefined;

    const sameAs = Object.values(authorDetails.social_links || {}).filter(
        (link): link is string => !!link?.trim()
    );

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: authorDetails.author_name.trim(),
        ...(authorDetails.designation?.trim() && { jobTitle: authorDetails.designation.trim() }),
        ...(authorDetails.short_bio?.trim() && { description: authorDetails.short_bio.trim() }),
        ...(authorPageUrl && { url: authorPageUrl }),
        ...(authorDetails.author_id && { identifier: authorDetails.author_id }),
        ...(toAbsoluteUrl(authorDetails.author_image?.url, options?.siteUrl) && {
            image: toAbsoluteUrl(authorDetails.author_image?.url, options?.siteUrl),
        }),
        ...(sameAs.length > 0 && { sameAs }),
    };
}

export function generateArticleSchema(
    blog?: ArticleSchemaInput | null,
    options?: { canonicalUrl?: string; siteUrl?: string }
) {
    if (!blog?.blog_title?.trim()) {
        return null;
    }

    const canonicalUrl = options?.canonicalUrl?.trim();
    const description = blog.blog_info?.custom_meta_data?.description?.trim();
    const image = toAbsoluteUrl(blog.blog_info?.featured_image?.url, options?.siteUrl);
    const authorName = blog.author_details?.author_name?.trim();
    const authorUrl = authorName
        ? `${getPublicSiteUrl(options?.siteUrl)}/blogs/author/${normalizeAuthorSegment(authorName)}/${normalizeAuthorSegment(blog.author_details?.designation) || 'no_designation'}`
        : undefined;
    const keywords =
        blog.tags
            ?.map(tag => tag?.tag_name?.trim())
            .filter((tag): tag is string => !!tag) || [];

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.blog_title.trim(),
        ...(description && { description }),
        ...(canonicalUrl && { url: canonicalUrl }),
        ...(canonicalUrl && {
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': canonicalUrl,
            },
        }),
        ...(image && { image: [image] }),
        ...(blog.created_at && { datePublished: blog.created_at }),
        ...(blog.updated_at && { dateModified: blog.updated_at }),
        ...(blog.category?.category_name?.trim() && { articleSection: blog.category.category_name.trim() }),
        ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
        ...(authorName && {
            author: {
                '@type': 'Person',
                name: authorName,
                ...(authorUrl && { url: authorUrl }),
            },
        }),
    };
} 