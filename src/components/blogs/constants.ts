// Shared grid template so the table header row and data rows stay perfectly aligned.
// Columns: [checkbox] [title] [status] [results] [seo] [reading] [updated] [actions]
export const BLOG_GRID =
    'grid grid-cols-[40px_minmax(220px,1fr)_110px_80px_100px_120px_120px_120px] items-center';

export const BLOG_PAGE_SIZE_OPTIONS = [10, 25, 50];

export type BlogTabKey = 'all' | 'published' | 'draft' | 'scheduled';
