import BlogDetailPagePublic1 from '@/components/blog-templates/template-1/BlogDetailPagePublic';
import BlogDetailsPagePublic2 from '@/components/blog-templates/template-2/BlogDetailsPagePublic';
import BlogDetailsPagePublic3 from '@/components/blog-templates/template-3/BlogDetailsPagePublic';

/**
 * Public blog-post (detail) component map.
 *
 * Used ONLY by the public `(public)/[id]` route. It maps each template tag to an
 * editor-free detail component, so the public route never imports the shared
 * TEMPLATE_CONFIG (which statically pulls every template's editor-capable
 * component and, transitively, @udecode/plate).
 */
const PUBLIC_BLOG_DETAIL_COMPONENTS: Record<string, React.ComponentType<any>> = {
    template_001: BlogDetailPagePublic1,
    template_002: BlogDetailsPagePublic2,
    template_003: BlogDetailsPagePublic3,
};

export default PUBLIC_BLOG_DETAIL_COMPONENTS;
