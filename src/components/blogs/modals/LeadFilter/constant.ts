
export const filterFields = [
    {
        label: 'Sort By',
        name: 'sort_by',
        inputType: 'select',
        placeholder: 'Select Sort By',
        options: [
            { value: 'recently_updated', label: 'Recently Updated' },
            { value: 'total_views', label: 'Total Views' },
            { value: 'seo_score', label: 'SEO Score' },
        ]
    },
    {
        label: 'Source Type',
        name: 'source_type',
        inputType: 'select',
        placeholder: 'Select Source Type',
        options: [
            { value: 'uploaded_pdf', label: 'Uploaded PDF' },
            { value: 'ai_generated', label: 'AI Generated' },
            { value: 'from_library', label: 'From Library' },
            { value: 'news_letter', label: 'News Letter' },
        ]
    },
    {
        label: 'Date Range',
        name: 'date_range',
        inputType: 'daterange',
        variant: 'before'
    }
]