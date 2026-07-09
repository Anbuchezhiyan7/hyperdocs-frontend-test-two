interface Blog {
    blog_id?: string;
    blog_title: string;
    created_at?: string;
    updated_at?: string;
    blog_status: string;
    author: string;
    category: any;
    tags: any[];
    content: any;
    blog_info: BlogInfo;
    total_views?: number;
    number_of_polls?: number;
    seo_score?: any;
    scheduled_blog?: any;
    slug_url?: string;
    author_details: Author;
    seo_focus_keyword?: string;
    author_id?: string;
    description?: string;
}

interface BlogCreatePayload {
    blog_title: string;
    content?: any;
    blog_info?: any;
}

interface BlogInfo {
    custom_meta_data: any;
    slug_url: string | null;
    custom_script: string | null;
    canonical_url: string | null;
    schema_markup: string | null;
    featured_image: any;
}
