type CUSTOM_PATH =
    | 'all_blogs'
    | 'blog'
    | 'tags'
    | 'categories'
    | 'details'
    | 'user_template'
    | 'category'
    | 'author_details'
    | 'author_id_by_blog'
    | 'all_categories';

type PADDLE_PATH = 'get_all_plans' | 'get_active_plan' | 'get_all_credits' | 'subscription';

const apiPath = {
    auth: {
        user: 'user/auth/user_details',
        google: 'user/auth/signup',
        login: 'user/auth/signup/email',
        verifyOtp: 'user/auth/verify_otp',
        resendOtp: 'user/auth/signup/email',
        site: 'user/auth/site_details',
        productTour: 'user/auth/product-tour',
    },
    blog: {
        base: '/blogs',
        id: (id: string) => `/blogs/${id}`,
        enhance: (blogId: string) => `/blogs/enhance_blog/${blogId}`,
        seo: (blogId?: string, key?: string) =>
            blogId ? `/blogs/seo/${blogId}/${key}` : `/blogs/seo`,
        seo_reject: (blogId: string, key: string, id: string) =>
            `/blogs/seo/${blogId}/${key}/${id}`,
        keywords: (title: string) => `/blogs/enhance_blog_title/${title}`,
        slug: (slug: string) => `/blogs/published/${slug}`,
        validate_slug: `/blogs/slug_url_validation`,
        info: (blogId: string) => `/blogs/blog_info/${blogId}`,
        update_seo_score: (blogId: string, seo_score: number) =>
            `/blogs/seo_score/${blogId}/${seo_score}`,
        canonical: (blogId: string) => `/blogs/canonical_url/${blogId}`,
        accept_all_seo: `/ai_suggestions/accept_all`,
        accept_all_seo_suggestion: `/ai_suggestions/accept_list`,
        onboarding_demo: `/blogs/onboarding/demo`,
    },
    schedule: {
        base: '/blogs/schedule',
        id: (id: string) => `/blogs/schedule/${id}`,
    },
    polls: {
        base: '/blogs/polls',
        id: (id: string) => `/blogs/polls/${id}`,
        options: (pollId: string, optionId: string) => `/blogs/polls/${pollId}/${optionId}`,
        vote: (pollId: string, optionId: string) => `/blogs/polls/vote/${pollId}/${optionId}`,
    },
    banners: {
        base: '/blogs/banners',
        id: (id: string) => `/blogs/banners/${id}`,
    },
    infographs: {
        base: '/blogs/infographs',
        id: (id: string) => `/blogs/infographs/${id}`,
        generate: 'https://app.infography.in/api/generate',
    },
    common: {
        uploadFile: (type: UploadFileType) => `/common/media_uploader/${type}`,
        deleteFile: (type: UploadFileType, id: string) => `/common/media_uploader/${type}/${id}`,
    },
    leadMagnets: {
        base: '/blogs/lead_magnets',
        id: (id: string) => `/blogs/lead_magnets/${id}`,
        leads: '/blog_leads',
    },
    settings: {
        get: '/settings',
        update: (type: string) => `/settings/${type}`,
        createMenu: (type: string) => `/settings/${type}`,
        updateMenu: (type: string, id: string) => `/settings/${type}/${id}`,
        deleteMenu: (type: string, id: string) => `/settings/${type}/${id}`,
        connectdomain: '/settings/domain',
        getDomainUserId: (domain: string) => `/settings/domain/user_id/${domain}`,
        disconnectDomain: (type: string) => `/settings/domain/disconnect/${type}`,
        subFolderTypes: (type: string) => `/settings/sub_directory/config/${type}`,
        subFolderSelectedTypes: `/settings/sub_directory/config/type`,
        header_cta: '/settings/header_cta',
        header_cta_id: (id: string) => `/settings/header_cta/${id}`,

        nested_menu: '/settings/nested_menu',
        nested_menu_id: (id: string) => `/settings/nested_menu/${id}`,
        subFolderIntegration: `/settings/sub_directory_integration`,
    },
    members: {
        invite: '/members/invite',
        accept: '/members/accept',
        list: '/members/',
        id: (id: string) => `/members/${id}`,
    },
    tags: {
        base: '/tags',
        id: (id: string) => `/tags/${id}`,
    },
    categories: {
        base: '/categories',
        id: (id: string) => `/categories/${id}`,
    },
    templates: {
        base: '/templates',
        id: (id: string) => `/templates/${id}`,
        custom: (user_id: string, type: CUSTOM_PATH) => `/templates/${type}/${user_id}`,
        visitor: '/visitor',
    },
    faqs: {
        base: '/faqs',
        id: (id: string) => `/faqs/${id}`,
        create_schema_markup: (blogId: string) => `/faqs/schema_markup/${blogId}`,
        remove_schema_markup: (blogId: string) => `/faqs/remove_schema_markup/${blogId}`,
    },
    authors: {
        base: '/authors',
        id: (id: string) => `/authors/${id}`,
    },
    paddle: {
        base: (type: PADDLE_PATH) => `/paddle/${type}`,
    },
    subscription: {
        base: '/subscription',
        custom: (type: string) => `/subscription/${type}`,
    },
    newsletter: {
        templates: '/newsletter/templates',
        configStatus: '/newsletter/config-status',
    },
    leadMagnetLibrary: {
        base: '/lead_magnet_library',
        id: (id: string) => `/lead_magnet_library/${id}`,
    },
    ai_suggestion: {
        custom: (type: string) => `/ai_suggestions/${type}`,
    },
    analytics: {
        pageview: '/analytics/pageview',
        overview: (range: string) => `/analytics/overview?range=${range}`,
        pages: (params?: { search?: string; page?: number; limit?: number }) => {
            const q = new URLSearchParams();
            if (params?.search) q.set('search', params.search);
            if (params?.page) q.set('page', String(params.page));
            if (params?.limit) q.set('limit', String(params.limit));
            const qs = q.toString();
            return qs ? `/analytics/pages?${qs}` : '/analytics/pages';
        },
    },
};

export default apiPath;
