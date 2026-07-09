import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { LOCALHOST_FALLBACK_USER_ID } from '@/constants/definitions';
import { getBlogDataBySlug, getFaqData } from '@/services/server-api.service';
import {
    generateBlogMetadata,
    extractScriptContent,
    generateArticleSchema,
    getCustomScriptFromMetadata,
    generateAuthorSchema,
    generateFAQSchema,
} from '@/utils/metadata';

type Props = {
    params: Promise<{ id: string }>;
};

// ISR: Revalidate layout (metadata) immediately — matches page.tsx
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsResponse = await params;
    return await generateBlogMetadata(paramsResponse?.id);
}

export default async function BlogsLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const paramsResponse = await params;
    const cookieStore = await cookies();
    const cookieUserId = cookieStore.get('user_id')?.value;
    const userId =
        !cookieUserId || cookieUserId === 'test:localhost'
            ? LOCALHOST_FALLBACK_USER_ID
            : cookieUserId;

    // visitor_id intentionally empty — per-visitor view tracking not used here.
    const blog = await getBlogDataBySlug(paramsResponse?.id, userId, '');
    const metadata = await generateBlogMetadata(paramsResponse?.id);
    const customScript = getCustomScriptFromMetadata(metadata);

    const faqPluginId = blog?.content?.find((item: any) => item.type === 'faq')?.plugin_data_id;
    const faqData = faqPluginId ? await getFaqData(faqPluginId) : null;
    const faqSchema = generateFAQSchema(faqData?.faq_data || []);

    const canonicalValue = metadata.alternates?.canonical;
    const canonicalUrl =
        typeof canonicalValue === 'string'
            ? canonicalValue
            : canonicalValue instanceof URL
              ? canonicalValue.toString()
              : undefined;

    const siteUrl = (() => {
        if (!canonicalUrl) {
            return undefined;
        }

        try {
            return new URL(canonicalUrl).origin;
        } catch {
            return undefined;
        }
    })();

    const articleSchema = generateArticleSchema(blog, {
        canonicalUrl,
        siteUrl,
    });

    const authorSchema = generateAuthorSchema(blog?.author_details, {
        siteUrl,
    });

    return (
        <>
            {articleSchema && (
                <script
                    id='auto-generated-article-schema'
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    suppressHydrationWarning
                />
            )}
            {authorSchema && (
                <script
                    id='auto-generated-author-schema'
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
                    suppressHydrationWarning
                />
            )}
            {faqSchema && (
                <script
                    id='auto-generated-faq-schema'
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                    suppressHydrationWarning
                />
            )}
            {customScript && (
                <script id='custom-script' dangerouslySetInnerHTML={{ __html: extractScriptContent(customScript) }} />
            )}
            {children}
        </>
    );
}
