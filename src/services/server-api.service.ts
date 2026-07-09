/**
 * Server-side API calls for Next.js server components
 * These functions are designed to be used in server components and API routes
 */

import { unstable_cache } from 'next/cache';

export interface BlogData {
  blog_id?: string;
  blog_title: string;
  created_at?: string;
  updated_at?: string;
  blog_status: string;
  author: string;
  category: any;
  tags: any[];
  content: any;
  blog_info: any;
  total_views?: number;
  number_of_polls?: number;
  seo_score?: any;
  scheduled_blog?: any;
  slug_url?: string;
  author_details: any;
  seo_focus_keyword?: string;
  author_id?: string;
  [key: string]: any;
}

export interface GetBlogDataParams {
  slug: string;
  userId: string;
  visitorId: string;
}

/**
 * Fetch blog data by slug from the backend API
 * @param slug - The blog slug
 * @param userId - The user ID
 * @param visitorId - The visitor ID
 * @returns Promise<BlogData | null>
 */
export const getBlogDataBySlug = (
  slug: string,
  userId: string,
  visitorId: string
): Promise<BlogData | null> =>
  unstable_cache(
    async () => {
      try {
        const startFetch = performance.now();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/published/${slug}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              visitor_id: visitorId,
            }),
            cache: 'no-store', // raw fetch not cached; unstable_cache handles persistence
          }
        );
        const endFetch = performance.now();
        console.log(`\x1b[35m[Network Fetch]\x1b[0m getBlogDataBySlug API call for "${slug}" took \x1b[33m${(endFetch - startFetch).toFixed(2)}ms\x1b[0m`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[API Error] getBlogDataBySlug failed with status ${response.status}: ${errorText}`);
          return null;
        }

        const data = await response.json();
        return data?.blog ?? null;
      } catch (error) {
        console.error("[Service Error] getBlogDataBySlug caught error:", error);
        return null;
      }
    },
    // ✅ Unique cache key per tenant (userId) + slug — prevents data leaks between tenants
    [`blog-${userId}-${slug}`],
    { revalidate: false, tags: ['blogs', `blog-${slug}`] }
  )();

export const getLeadMagnetData = async (blogId: string): Promise<any | null> => {
  if (!blogId) {
    console.warn("[Service Warning] getLeadMagnetData called with empty blogId");
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error("[Service Error] NEXT_PUBLIC_API_URL is not defined on the server");
    return null;
  }

  const url = `${apiUrl}/api/v1/blogs/lead_magnets/all/${blogId}`;
  
  try {
    const startFetch = performance.now();
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: 'no-store', // Always fetch fresh to avoid intermittent missing magnets
    });
    const endFetch = performance.now();

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Error] getLeadMagnetData failed for blog ${blogId}. Status: ${response.status}, Response: ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`[Network Fetch] getLeadMagnetData for blog ${blogId} took ${(endFetch - startFetch).toFixed(2)}ms. Found ${Array.isArray(data) ? data.length : 0} magnets.`);
    
    return data ?? [];
  } catch (error) {
    console.error(`[Service Error] getLeadMagnetData caught error for blog ${blogId}:`, error);
    return null;
  }
};

export const getFaqData = (faqId: string): Promise<any | null> =>
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/faqs/${faqId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return null;
        }

        const data = await response.json();
        return data ?? null;
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
        return null;
      }
    },
    // ✅ Cache key scoped per FAQ ID
    [`faq-${faqId}`],
    { revalidate: 3600, tags: ['faqs', `faq-${faqId}`] }
  )();

export const getPollData = (pollId: string): Promise<any | null> =>
  unstable_cache(
    async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/polls/${pollId}`;
      const method = "GET";
      const headers = { "Content-Type": "application/json" };
      try {
        const response = await fetch(url, {
          method,
          headers,
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          let responseText = '';
          try { responseText = await response.text(); } catch (e) {}
          return { __apiDebugError: true, url, method, payload: null, status: response.status, response: responseText };
        }

        const data = await response.json();
        return data ?? null;
      } catch (error: any) {
        console.error("Error fetching poll data:", error);
        return { __apiDebugError: true, url, method, payload: null, error: error || 'Unknown error' };
      }
    },
    // ✅ Cache key scoped per poll ID
    [`poll-${pollId}`],
    { revalidate: 3600, tags: ['polls', `poll-${pollId}`] }
  )();

export const getBannerData = (bannerId: string): Promise<any | null> =>
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/banners/${bannerId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return null;
        }

        const data = await response.json();
        return data ?? null;
      } catch (error) {
        console.error("Error fetching banner data:", error);
        return null;
      }
    },
    // ✅ Cache key scoped per banner ID
    [`banner-${bannerId}`],
    { revalidate: 3600, tags: ['banners', `banner-${bannerId}`] }
  )();

export const getUserTemplateData = (userId: string): Promise<any | null> =>
  // Cached so the layout + page both reading user_template for the same tenant
  // share a single network call (raw fetch uses no-store → no request memoization).
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/user_template/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return null;
        }

        const data = await response.json();
        return data ?? null;
      } catch (error) {
        console.error("Error fetching user template data:", error);
        return null;
      }
    },
    [`user-template-${userId}`],
    { revalidate: 3600, tags: ['user-template', `user-template-${userId}`] }
  )();

/**
 * Fetch the tenant's current plan id server-side.
 * Used to decide whether to render the "Made with HyperBlog" free-plan footer
 * badge without a client-side fetch waterfall (which also caused a late layout
 * shift as the badge popped in after hydration).
 */
export const getUserPlan = (userId: string): Promise<string | null> =>
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/plan/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          console.error(`[getUserPlan] HTTP error: ${response.status}`);
          return null;
        }

        const data = await response.json();
        // API returns the plan id under one of these shapes: { current_plan_id }
        return (
          data?.data?.current_plan_id ||
          data?.success?.data?.current_plan_id ||
          data?.current_plan_id ||
          null
        );
      } catch (error) {
        console.error("[getUserPlan] Error:", error);
        return null;
      }
    },
    [`user-plan-${userId}`],
    { revalidate: 3600, tags: ['user-plan', `user-plan-${userId}`] }
  )();

export const getInfographData = (infographId: string): Promise<any | null> =>
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/infographs/${infographId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return null;
        }

        const data = await response.json();
        return data ?? null;
      } catch (error) {
        console.error("Error fetching infograph data:", error);
        return null;
      }
    },
    // ✅ Cache key scoped per infograph ID
    [`infograph-${infographId}`],
    { revalidate: 3600, tags: ['infographs', `infograph-${infographId}`] }
  )();

/**
 * Generic server-side API call function
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Promise<any>
 */
export async function serverApiCall(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error in server API call:", error);
    return null;
  }
}

export const getNewsletterTemplateData = async (userId: string): Promise<any | null> => {
  // Newsletter config is just one field of the full template-details payload.
  // Reuse getTemplateDetails (cached under `template-details-${userId}`) so the
  // page's newsletter read and the layout's full-details read share ONE cache
  // entry / network call instead of hitting /templates/details twice.
  const details = await getTemplateDetails(userId);
  // Returns the newsletter field: { is_newsletter_configured, template: { template_name, title, ... } }
  return details?.newsletter ?? null;
};

/**
 * Fetch full template details (seo, general, advanced, navigation, etc.) server-side.
 * Used by the public layout server component to hydrate the client store
 * without requiring a client-side API call on every page visit.
 */
export const getTemplateDetails = (userId: string): Promise<any | null> =>
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/details/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );
        if (!response.ok) {
          console.error(`[getTemplateDetails] HTTP error: ${response.status}`);
          return null;
        }
        return await response.json();
      } catch (error) {
        console.error("[getTemplateDetails] Error:", error);
        return null;
      }
    },
    [`template-details-${userId}`],
    { revalidate: 3600, tags: ['template-details', `template-details-${userId}`] }
  )();

/**
 * Fetch categorized blogs by category ID server-side.
 * Pre-fetching this eliminates the client-side waterfall in FeaturedBlogSlider.
 */
export const getCategorizedBlogs = (categoryId: string): Promise<any[] | null> =>
  unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/templates/category/${categoryId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store',
          }
        );
        if (!response.ok) {
          console.error(`[getCategorizedBlogs] HTTP error: ${response.status}`);
          return null;
        }
        const data = await response.json();
        return Array.isArray(data) ? data : null;
      } catch (error) {
        console.error("[getCategorizedBlogs] Error:", error);
        return null;
      }
    },
    [`categorized-blogs-${categoryId}`],
    // 'blogs' tag added so a blog save (admin fires clearCacheByTag('blogs'))
    // also busts the prefetched category rows on the home page — otherwise an
    // edited blog could stay stale in its category strip until the 1h timer.
    { revalidate: 3600, tags: ['blogs', 'categorized-blogs', `categorized-blogs-${categoryId}`] }
  )();
