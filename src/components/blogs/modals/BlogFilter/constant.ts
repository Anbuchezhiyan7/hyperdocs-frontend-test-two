export const filterFields = [
    {
        label: 'Sort By',
        name: 'sort_by',
        inputType: 'select',
        options: [
            { value: 'recently_updated', label: 'Recently Updated' },
            { value: 'total_views', label: 'Total Views' },
            { value: 'seo_score', label: 'SEO Score' },
        ],
    },
    {
        label: 'Blog Status',
        name: 'blog_status',
        inputType: 'checkbox',
        variant: 'multi',
        options: [
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
        ],
    },
    // {
    //     label: "Author",
    //     name: 'author',
    //     inputType: 'text',
    // },
    {
        label: 'Categories',
        name: 'categories',
        inputType: 'select',
    },
    {
        label: 'Tags',
        name: 'tags',
        inputType: 'select',
        variant: 'multi',
    },
];
