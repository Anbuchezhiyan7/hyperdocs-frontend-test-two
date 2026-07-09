import { cookies } from 'next/headers';
import { Suspense } from 'react';
import BlogTemplateLayout from '@/components/blog-templates/layouts';
import PUBLIC_BLOG_DETAIL_COMPONENTS from '@/config/public-template.config';
import {
    getBannerData,
    getBlogDataBySlug,
    getFaqData,
    getInfographData,
    getLeadMagnetData,
    getNewsletterTemplateData,
    getPollData,
    getUserPlan,
    getUserTemplateData,
} from '@/services/server-api.service';
import NoBlogFound from './NoBlogFound';
import { LOCALHOST_FALLBACK_USER_ID } from '@/constants/definitions';
import RenderServerElement from '@/components/RenderServerElements';
import SeoServerElements from '@/components/SeoServerElements';

// ISR: Cache the page after first render, revalidate in background every 1 hour.
// This is multitenant-safe: Next.js ISR caches per unique URL, so each tenant's
// slug gets its own isolated cache entry — no data leaks between tenants.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Main blog content component that loads immediately
async function MainBlogContent({
    blog,
    Component,
    visualContent,
    isFreePlan,
}: {
    blog: any;
    Component: React.ComponentType<any>;
    visualContent?: React.ReactNode;
    isFreePlan?: boolean;
}) {
    return (
        <BlogTemplateLayout isFreePlan={isFreePlan}>
            <Component blog={blog} visualContent={visualContent} />
        </BlogTemplateLayout>
    );
}

// Plugin data loader that runs in parallel with main content
async function PluginDataLoader({
    blog,
    faqData,
    newsletterData,
    pollPluginId,
    bannerPluginId,
    infographPluginIds,
    visualMode = false,
    omitFeaturedBanner = false,
}: {
    blog: any;
    faqData?: any;
    newsletterData?: any;
    pollPluginId?: string;
    bannerPluginId?: string;
    infographPluginIds?: string[];
    visualMode?: boolean;
    omitFeaturedBanner?: boolean;
}) {
    // Prioritize essential plugin data first
    const priorityData = await Promise.allSettled([
        // High priority: Lead magnet (user engagement)
        getLeadMagnetData(blog?.blog_id || ''),
        // Medium priority: Polls (content enhancement)
        pollPluginId ? getPollData(pollPluginId) : Promise.resolve(null),
    ]); 
    console.log("🚀 ~ PluginDataLoader ~ priorityData:", priorityData)
    // Load multiple infographs if present
    const infographDataPromises = infographPluginIds?.map(id => getInfographData(id)) || [];

    // Load lower priority data in parallel
    const secondaryData = await Promise.allSettled([
        bannerPluginId ? getBannerData(bannerPluginId) : Promise.resolve(null),
        ...infographDataPromises,
    ]);

    // Map infograph data by ID for easy lookup
    const infographMap: Record<string, any> = {};
    if (infographPluginIds) {
        infographPluginIds.forEach((id, index) => {
            const result = secondaryData[index + 1]; // +1 because banner is at index 0
            if (result.status === 'fulfilled') {
                infographMap[id] = result.value;
            }
        });
    }

    const rawPollData = priorityData[1].status === 'fulfilled' ? priorityData[1].value : null;
    const pollError = rawPollData?.__apiDebugError ? rawPollData : null;
    const actualPollData = rawPollData?.__apiDebugError ? null : rawPollData;

    const resolvedData = {
        leadMagnetData: priorityData[0].status === 'fulfilled' ? priorityData[0].value : null,
        faqData,
        pollData: actualPollData,
        bannerData: secondaryData[0].status === 'fulfilled' ? secondaryData[0].value : null,
        infographMap: infographMap,
    };

    return (
        <>
            <RenderServerElement
                blog={blog}
                leadMagnetData={resolvedData.leadMagnetData}
                faqData={resolvedData.faqData}
                pollData={resolvedData.pollData}
                bannerData={resolvedData.bannerData}
                infographData={resolvedData.infographMap}
                newsletterData={newsletterData}
                visualMode={visualMode}
                omitFeaturedBanner={omitFeaturedBanner}
            />
            {/* {pollError && (
                <div hidden id="poll-api-error-logs">
                    {JSON.stringify(pollError)}
                </div>
            )} */}
        </>
    );
}

// Progressive loading component for better UX
function ProgressiveLoader() {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="animate-pulse text-sm text-gray-500">Loading additional content...</div>
        </div>
    );
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const paramsResponse = await params;
    const cookieUserId = cookieStore.get('user_id')?.value;
    const userId =
        !cookieUserId || cookieUserId === 'test:localhost'
            ? LOCALHOST_FALLBACK_USER_ID
            : cookieUserId;

    const startTime = performance.now();
    const [templateDataServer, newsletterData, blog, planId] = await Promise.all([
        getUserTemplateData(userId || ''),
        getNewsletterTemplateData(userId || ''),
        // visitor_id intentionally empty — per-visitor view tracking not used here.
        getBlogDataBySlug(paramsResponse.id, userId || '', ''),
        getUserPlan(userId || ''),
    ]);
    const isFreePlan = planId === 'free_plan';
    console.log("🚀 ~ BlogDetailPage ~ blog:", blog)
    const endTime = performance.now();
    console.warn(
        `\n\x1b[36m[API Timer]\x1b[0m Parallel fetch for "${paramsResponse.id}" took \x1b[33m${(endTime - startTime).toFixed(2)}ms\x1b[0m\n`
    );
    if (!blog) {
        return <NoBlogFound />;
    }

    // --- UI Calculations (Server-side) ---
    const calcStartTime = performance.now();

    const contentArray = Array.isArray(blog?.content) ? blog.content : [];

    // Extract all plugin IDs for background processing
    const faqPluginId = contentArray.find((item: any) => item?.type === 'faq')?.plugin_data_id;
    const pollPluginId = contentArray.find((item: any) => item?.type === 'poll')?.plugin_data_id;

    // Collect ALL unique infograph IDs
    const infographPluginIds = Array.from(
        new Set(
            contentArray
                ?.filter((item: any) => item?.type === 'infograph' && item?.plugin_data_id)
                ?.map((item: any) => item.plugin_data_id)
        )
    ) as string[];

    const bannerPluginId = contentArray.find((item: any) => item?.type === 'banner')
        ?.plugin_data_id;


    // Fetch FAQ data centrally if it exists
    const faqData = faqPluginId ? await getFaqData(faqPluginId) : null;

    // Get template data
    const userTemplate = { template_tag: templateDataServer?.template_tag };
    const Component =
        PUBLIC_BLOG_DETAIL_COMPONENTS[userTemplate?.template_tag as string] ??
        PUBLIC_BLOG_DETAIL_COMPONENTS.template_001;

    const calcEndTime = performance.now();
    // console.log(
    //     `\x1b[34m[UI Calculation]\x1b[0m Server-side logic for template & plugins took \x1b[33m${(calcEndTime - calcStartTime).toFixed(2)}ms\x1b[0m`
    // );

    if (!Component) return <div>Page Not Found</div>;

    // All templates now render the featured image natively as a hero, so the
    // content-stream banner block is always suppressed to avoid a double banner.
    const omitFeaturedBanner = true;

    const visualContentNode = (
        <PluginDataLoader
            blog={blog}
            faqData={faqData}
            newsletterData={newsletterData}
            pollPluginId={pollPluginId}
            bannerPluginId={bannerPluginId}
            infographPluginIds={infographPluginIds}
            visualMode={true}
            omitFeaturedBanner={omitFeaturedBanner}
        />
    );

    return (
        <>
            {/* SEO hidden layer — server-rendered in initial HTML for LLM/crawler visibility */}
            <SeoServerElements blog={blog} />
            {/* Main blog content loads immediately - highest priority */}
            <Suspense fallback={<div></div>}>
                <MainBlogContent
                    blog={blog}
                    Component={Component}
                    visualContent={visualContentNode}
                    isFreePlan={isFreePlan}
                />
            </Suspense>
        </>
    );
}
