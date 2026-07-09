'use client';

import { useTemplateStore } from '@/store/useTemplateStore';
import { useQuery } from '@tanstack/react-query';
import templatesApi from '@/api/templates.api';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

// Only the ACTIVE template's listing component is downloaded, code-split per
// template. Previously this imported the whole TEMPLATE_CONFIG, which statically
// pulled EVERY template's listing + detail + author components (incl. the
// antd/Plate-heavy detail pages) into the public home bundle — ~150KB of JS
// that never executes on this route (the "unused JavaScript" finding).
// ssr:true keeps the server-rendered hero (LCP) intact; only the client
// hydration chunk for the chosen template is fetched.
const BLOGS_PAGE_COMPONENTS: Record<string, React.ComponentType<any>> = {
    template_001: dynamic(() => import('@/components/blog-templates/template-1').then(m => m.Template1)),
    template_002: dynamic(() => import('@/components/blog-templates/template-2/BlogsPage')),
    template_003: dynamic(() => import('@/components/blog-templates/template-3/BlogsPage')),
};

interface BlogsPageComponentProps {
    /**
     * Server-prefetched category blogs keyed by category_id.
     * Forwarded to the resolved template component so FeaturedBlogSlider
     * can render without a client-side API call on first load.
     */
    initialCategoryBlogsMap?: Record<string, Blog[]>;
    /** Server-fetched template details — seeds the first render (SSR-consistent). */
    initialTemplate?: any;
    /** Server-fetched user_template — resolves the correct template server-side. */
    initialUserTemplate?: any;
    /** Server-fetched blog list — seeds the featured hero (LCP) into initial HTML. */
    initialBlogs?: Blog[];
}

export default function BlogsPageComponent({
    initialCategoryBlogsMap,
    initialTemplate,
    initialUserTemplate,
    initialBlogs,
}: BlogsPageComponentProps) {
    const { getTemplateData, setTemplateData } = useTemplateStore();
    const user_id = Cookies.get('user_id');

    // ✅ Fetch user template (template_tag) client-side.
    // React Query + localStorage persister means this only hits the network
    // on the very first visit — subsequent visits serve from localStorage instantly.
    const { data: userTemplate } = useQuery({
        queryKey: ['user-template', user_id],
        queryFn: () =>
            templatesApi.handleGetTemplateByUser(user_id as string).then(res => {
                // Sync into Zustand store so other components can read it
                if (res) setTemplateData('user_template', res);
                return res;
            }),
        enabled: !!user_id,
        // Server-prefetched value seeds the very first render (server + hydration)
        // so the correct template — and its server-rendered hero image — is in the
        // initial HTML, instead of waiting on the client fetch. staleTime 0 below
        // still refetches on mount so template changes surface without a cache flush.
        initialData: initialUserTemplate ?? undefined,
        // Prefer Zustand-persisted value as placeholder while revalidating
        placeholderData: getTemplateData('user_template'),
        // Always refetch on mount — template changes must be visible without cache clearing.
        staleTime: 0,
        refetchOnMount: true,
        meta: { persist: true },
    });

    const templateId: string = userTemplate?.template_tag
        ?? initialUserTemplate?.template_tag
        ?? getTemplateData('template')?.template_tag
        ?? '';

    const Component = BLOGS_PAGE_COMPONENTS[templateId];

    if (!Component) return null; // quiet null while template_tag is loading (no flash of "Page Not Found")

    return (
        <Component
            initialCategoryBlogsMap={initialCategoryBlogsMap}
            initialTemplate={initialTemplate}
            initialUserTemplate={initialUserTemplate}
            initialBlogs={initialBlogs}
        />
    );
}
